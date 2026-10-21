# لقمه — LOGHMEH

سایت فروش غذای خونگی (RTL، فارسی). React + Vite در فرانت‌اند و یک API کوچک Node/Express برای منو و سفارش‌ها.

## Run (docker compose)

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web (Vite dev server, live reload): http://localhost:3000
- API (internal, proxied through Vite at `/api`): service `api:4000`
- Logs: `docker compose -f docker-compose.base44.yml logs -f web api`

## Structure

```
backend/            Express API
  server.js         endpoints: /api/products, /api/orders, /api/contact, /api/health
  data/products.json   catalog + categories + deliveryFee (edit products here)
  data/orders.json     runtime — created on first order (git-ignored)
frontend/           React SPA (RTL, Vazirmatn font self-hosted)
  public/images/    food photography (Unsplash + Wikimedia Commons, free licenses)
  src/data — none; catalog is served by the API so products stay editable in one place
```

## Notes

- **Sample data**: meal names/descriptions follow the brand brief; prices, delivery fee (35,000 تومان) and the phone number (`۰۲۱-۹۱۰۰ ۹۱۰۰`) are editable placeholders — replace with real values before launch.
- **Orders**: validated and computed server-side (availability, qty 1–20, Persian-digit phone), stored in `backend/data/orders.json`. Payment is cash-on-delivery; no payment gateway is connected (nothing is faked).
- **Sandbox-only override**: `frontend/vite.config.js` extends `allowedHosts` with `.$BASE44_SANDBOX_HOST_DOMAIN` only when `BASE44_PREVIEW_MODE === '1'`; with the flag unset the stock config behavior is unchanged.
- Cart and favorites persist in `localStorage`; unavailable meals can't be added and are re-validated at checkout.
