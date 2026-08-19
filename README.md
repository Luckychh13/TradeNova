
# TradeNova

TradeNova is a cryptocurrency screener and trading dashboard built with Next.js. It combines market data, coin search, coin details, historical OHLC charts, pool information, recent trades, and live market updates in one interface.

**Live Project:** [Open TradeNova on Vercel](https://trade-nova-two.vercel.app/)

## Features

- Home dashboard with coin overview, categories, and trending coins.
- Coin list with pagination.
- Coin detail pages with market information and historical candlestick charts.
- Search modal with debounced CoinGecko coin search.
- Coin conversion and price information.
- Live pool price, recent trades, and OHLC updates from GeckoTerminal.
- Responsive dark dashboard interface.
- Server-side API access for CoinGecko credentials.

## Technology Stack

- Next.js 16 with the App Router and Turbopack.
- React 19 and TypeScript.
- Tailwind CSS 4 with PostCSS.
- `lightweight-charts` for candlestick charts.
- `swr` for client-side data fetching and revalidation.
- `react-use` for debouncing and keyboard shortcuts.
- `cmdk` and Radix UI primitives for the search command dialog.
- `lucide-react` for icons.
- `query-string` for API query construction.
- `vitest` and Testing Library packages for tests.

## APIs

### CoinGecko API

TradeNova uses the CoinGecko API v3 for general market data:

- Coin details and market data.
- Historical OHLC data.
- Trending coins.
- Categories.
- Coin search.
- On-chain pool lookup.

Most server-side requests are handled by `lib/coingecko.action.ts`. The CoinGecko API key is sent through the `x-cg-demo-api-key` header and must remain server-only.

### GeckoTerminal API

Live pool data is provided by the free GeckoTerminal API v2:

- Pool price and market statistics.
- Recent trades.
- OHLC candles.

The browser calls the local route `/api/geckoterminal/...`. The Next.js route proxies supported requests to `https://api.geckoterminal.com/api/v2` so the browser does not call GeckoTerminal directly.

Despite the historical hook name `useCoinGeckoWebSocket`, the current implementation uses REST polling, not a WebSocket connection. `useGeckoTerminalPool` requests live data immediately and then polls every 30 seconds by default. A `429` response stops polling for 60 seconds to avoid repeatedly hitting the free API rate limit.

## Project Structure

```text
app/
	api/geckoterminal/[...path].js  GeckoTerminal proxy route
	coins/                         Coin list and detail pages
	globals.css                    Global styles
	layout.tsx                     Root layout and header
components/
	Header.tsx                     Main navigation
	SearchModal.tsx                Coin search command dialog
	CandleStickChart.tsx           Historical and live chart
	LiveDataWrapper.tsx            Live price and trade dashboard
	Home/                          Home dashboard sections
	ui/                            Reusable UI primitives
hooks/
	useCoinGeckoWebSocket.ts       GeckoTerminal polling hook
lib/
	coingecko.action.ts            Server-side CoinGecko functions
	utils.ts                       Formatting and UI utilities
constants.ts                     Chart and period configuration
type.d.ts                         Shared TypeScript declarations
```

## Requirements

- Node.js 20 or newer is recommended.
- npm 10 or newer is recommended.
- A CoinGecko API key. The free Demo API plan is sufficient for development, subject to its limits.
- Network access to CoinGecko and GeckoTerminal.

## Installation

Clone or copy the project into a folder, then install dependencies:

```bash
git clone <repository-url>
cd trade-nova
npm install
```

If you received the project as a folder, run `npm install` from the folder containing `package.json`.

## Environment Variables

Create a local `.env` file in the project root. Do not commit it or expose the API key with a `NEXT_PUBLIC_` prefix.

```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_coingecko_api_key
```

The existing GeckoTerminal proxy uses its server-side URL directly and does not require a public environment variable. If you change the proxy to use an environment variable, keep that variable server-only, for example:

```env
GECKO_TERMINAL_BASE_URL=https://api.geckoterminal.com/api/v2
```

Restart the development server after changing `.env`.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To access the development server from another device on the same network, use the machine's LAN address. The trusted development origin is configured in `next.config.ts`.

## Available Scripts

```bash
npm run dev          # Start the development server
npm run build        # Create an optimized production build
npm run start        # Start the production server
npm run lint         # Run ESLint
npm test             # Run Vitest in watch mode
npm run test:watch   # Run Vitest in watch mode
npm run test:coverage # Run tests with coverage
```

Before deploying, run:

```bash
npm run lint
npm run build
```

## API Request Flow

General market data follows this path:

```text
Next.js server component or server action
	-> lib/coingecko.action.ts
	-> CoinGecko API v3
```

Live pool data follows this path:

```text
Browser client hook
	-> /api/geckoterminal/networks/{network}/pools/{pool}/...
	-> Next.js GeckoTerminal proxy
	-> GeckoTerminal API v2
```

Only supported GeckoTerminal pool and token paths are accepted by the proxy. The proxy is intentionally same-origin and does not expose wildcard CORS headers.

## Deployment

TradeNova can be deployed to Vercel or another Node-compatible hosting platform.

1. Push the project to a Git repository.
2. Import the repository into the hosting provider.
3. Configure `COINGECKO_BASE_URL` and `COINGECKO_API_KEY` as server environment variables.
4. Use `npm run build` as the build command.
5. Use `npm run start` for a traditional Node deployment, if required by the provider.
6. Confirm that the deployment can reach both CoinGecko and GeckoTerminal.

Never commit `.env`, API keys, or other secrets. If a key has been exposed, revoke it in CoinGecko and create a replacement before deployment.

## Rate Limits and Failure Handling

Both providers have rate limits, especially on free plans. The application handles failed requests with fallback UI in several server components. The live GeckoTerminal hook stops its polling interval after a `429` response and waits before trying again.

For production use, consider adding request caching, a server-side rate limiter, clearer user-facing error messages, and monitoring for upstream API failures.

