# btb.pub — 数据雷达

加密货币与美股市场数据雷达,部署在 Cloudflare Pages 上。

## 项目结构

```
btb/
├── index.html
├── functions/
│   └── api/
│       ├── stocks.js        # Yahoo Finance 七姐妹股票
│       ├── btc-ticker.js    # Binance BTCUSDT 24h 行情
│       ├── btc-klines.js    # Binance BTCUSDT 1000 日 K 线
│       ├── cg-global.js     # CoinGecko 全球加密市场数据
│       └── cg-history.js    # CoinGecko BTC 730 天历史价格
├── .gitignore
└── README.md
```

## 为什么需要这些 Function 代理

Binance、Yahoo Finance、CoinGecko 这些 API 对部分地区(如美国)的浏览器有 CORS 或地区限制,
浏览器直接调用会被拒绝。Cloudflare Pages Functions 部署在全球边缘节点,
由服务端代为请求,既绕过限制又有边缘缓存,速度更快。

各 Function 的缓存策略:

| Function | 缓存时长 | 说明 |
|---|---|---|
| `/api/stocks` | 5 分钟 | 美股盘中变化频率 |
| `/api/btc-ticker` | 30 秒 | 实时行情,缓存极短 |
| `/api/btc-klines` | 10 分钟 | 历史 K 线,变化慢 |
| `/api/cg-global` | 5 分钟 | 全球总市值 |
| `/api/cg-history` | 30 分钟 | 730 天历史,几乎不变 |

## 部署到 Cloudflare Pages

### 首次部署

1. 把仓库推到 GitHub
2. Cloudflare 控制台 → **Workers 和 Pages** → **创建** → **Pages** → **连接到 Git**
3. 选择本仓库,构建设置:
   - 框架预设:**无**
   - 构建命令:**留空**
   - 构建输出目录:**留空**
4. 「保存并部署」
5. 在「自定义域」中绑定 `btb.pub`

### 后续更新

```bash
git add .
git commit -m "更新内容"
git push
```

Cloudflare 监听到 `main` 分支变化后会自动重新部署,约 30 秒到 2 分钟生效。

## 调试 / 验证

部署完成后访问以下地址,都应该返回 JSON 数据:

- https://btb-pub.pages.dev/api/stocks
- https://btb-pub.pages.dev/api/btc-ticker
- https://btb-pub.pages.dev/api/btc-klines
- https://btb-pub.pages.dev/api/cg-global
- https://btb-pub.pages.dev/api/cg-history

如果某个返回完整网页而不是 JSON,说明对应的 Function 没生效,检查文件路径。
