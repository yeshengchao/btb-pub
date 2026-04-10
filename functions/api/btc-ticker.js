// Binance BTCUSDT 24h 行情代理 - Cloudflare Pages Function
// 访问路径: /api/btc-ticker
// 用途：绕开 Binance 对部分地区(如美国)的浏览器 CORS 限制

export async function onRequest(context) {
  const url = 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      cf: { cacheTtl: 30, cacheEverything: true }, // 行情数据缓存 30 秒
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
      'Cache-Control': 'public, max-age=30',
    },
  });
}
