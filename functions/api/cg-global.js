// CoinGecko 全球加密市场数据代理 - Cloudflare Pages Function
// 访问路径: /api/cg-global
// 用途：返回总市值、BTC 主导率等全球数据

export async function onRequest(context) {
  const url = 'https://api.coingecko.com/api/v3/global';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      cf: { cacheTtl: 300, cacheEverything: true }, // 全球数据缓存 5 分钟
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
      'Cache-Control': 'public, max-age=300',
    },
  });
}
