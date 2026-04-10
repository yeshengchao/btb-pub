// CoinGecko BTC 730 天历史价格代理 - Cloudflare Pages Function
// 访问路径: /api/cg-history
// 用途：返回 BTC 最近 730 天的历史价格点，供长期均线指标使用

export async function onRequest(context) {
  const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=730';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      cf: { cacheTtl: 1800, cacheEverything: true }, // 历史数据缓存 30 分钟
    });

    if (!response.ok) {
      return jsonResponse({ error: `upstream ${response.status}` }, 502);
    }

    const data = await response.json();
    return jsonResponse(data);
  } catch (err) {
    return jsonResponse({ error: 'fetch failed', detail: err.message }, 502);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=1800',
    },
  });
}
