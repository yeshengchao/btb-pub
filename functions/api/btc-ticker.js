// BTC 实时价格 - 使用 CoinGecko API
export async function onRequest(context) {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      cf: { cacheTtl: 30, cacheEverything: true },
    });

    if (!response.ok) {
      return jsonResponse({ error: `upstream ${response.status}` }, 502);
    }

    const data = await response.json();
    const btc = data.bitcoin;

    return jsonResponse({
      lastPrice: btc.usd.toString(),
      priceChangePercent: btc.usd_24h_change.toFixed(2),
      volume: btc.usd_24h_vol?.toString() || '0',
    });
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
