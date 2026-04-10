// Binance BTCUSDT 日 K 线代理 - Cloudflare Pages Function
// 访问路径: /api/btc-klines
// 用途：返回最近 1000 天的日 K 线数据，供 AHR999、200 周均线等指标计算

export async function onRequest(context) {
  const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      cf: { cacheTtl: 600, cacheEverything: true }, // 历史数据缓存 10 分钟
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
      'Cache-Control': 'public, max-age=600',
    },
  });
}
