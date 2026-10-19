# AGENTS.md — Loghmeh (لقمه)

Persian (Farsi), fully RTL homemade-food e-commerce site. React + Vite frontend, Express API backend.

## Stack & layout

- `client/` — Vite + React 18 (JavaScript, no TS). Single global stylesheet `client/src/styles.css` (design tokens in `:root`). Routing via react-router-dom v6.
- `server/` — Express (ESM). Products/categories are demo seed data in `server/src/data/products.js`; orders and contact messages persist as JSON files under `server/data/` (gitignored).
- All user-facing copy is Persian; code identifiers stay English.

## Running (Base44 sandbox)

`docker compose -f docker-compose.base44.yml up -d`

- `web` service: Vite dev server on port 5173, published on host port **3000** (the preview entry). Proxies `/api` → `http://api:4000` via `VITE_API_PROXY`.
- `api` service: Express with `node --watch` on port 4000.
- Preview host allowlist: `client/vite.config.js` adds `.${BASE44_SANDBOX_HOST_DOMAIN}` to `allowedHosts` only when `BASE44_PREVIEW_MODE === '1'`.
- No external secrets required. Image assets are hotlinked from `images.unsplash.com` (verified URLs).

## Important invariants

- **Prices are numbers (Toman), never formatted strings.** Formatting to Persian digits happens only in `client/src/format.js` (`formatPrice` via `Intl.NumberFormat('fa-IR')`).
- Delivery constants exist in two places that must stay in sync: `server/src/data/products.js` and `client/src/config.js` (`DELIVERY_FEE` = 35000, `FREE_DELIVERY_THRESHOLD` = 800000).
- Server recomputes order totals from its own seed data at checkout; the client total is display-only.
- Cart & favorites persist in localStorage (`loghmeh_cart_v1`, `loghmeh_favs_v1`).
- Unavailable products cannot be added to the cart (enforced in UI and at the API).
- The site is explicitly a demo: order-success and checkout pages state that orders are stored but not sent to a kitchen and payment is not enabled. Do not fake payment or pretend orders reach a business.
- Do not invent contact details, social links, reviews, ratings, or nutrition data. Product prices/serving info are editable demo values.

## Verification

- API health: `curl http://localhost:4000/api/health` (from the sandbox host: `docker compose -f docker-compose.base44.yml exec api node -e "fetch('http://localhost:4000/api/health')..."`).
- Endpoints: `GET /api/categories`, `GET /api/products?q=&category=&sort=&daily=1&featured=1&available=1`, `GET /api/products/:slug`, `POST /api/orders`, `GET /api/orders/:code`, `POST /api/messages`.
- Test orders/messages are written to `server/data/{orders,messages}/*.json`; clean up test files by exact filename after verification runs.
