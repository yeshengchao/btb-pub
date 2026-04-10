// Yahoo Finance 股票代理 - Cloudflare Pages Function
// 访问路径: /api/stocks
// 替代原 stocks.php，逻辑完全一致

export async function onRequest(context) {
  const symbols = 'NVDA,MSFT,AAPL,META,GOOGL,AMZN,TSLA';
  const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols}&range=2d&interval=1d`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible)',
      },
      // Cloudflare 边缘缓存 5 分钟，与原 PHP 的 max-age=300 一致
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    if (!response.ok) {
      return jsonResponse(
        { error: `upstream ${response.status}` },
        502
      );
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
      return jsonResponse({ error: 'invalid response' }, 502);
    }

    const result = {};
    for (const [sym, info] of Object.entries(data)) {
      if (info?.close && info.close.length > 0) {
        const price = info.close[info.close.length - 1];
        const prev = info.chartPreviousClose ?? info.close[0] ?? price;
        result[sym] = {
          price,
          change24h: prev ? ((price - prev) / prev) * 100 : 0,
        };
      }
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse(
      { error: 'fetch failed', detail: err.message },
      502
    );
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
