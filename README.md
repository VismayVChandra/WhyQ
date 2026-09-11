# WhyQ — Q-Commerce Price Comparison

Compare grocery prices across India's quick-commerce platforms (Blinkit, Zepto,
Swiggy Instamart, BigBasket) in one search.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · lucide-react.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. **The app works out of the box on mock data** —
no API keys required to try search, comparison, filtering, cart comparison,
or price alerts UI.

## Environment variables

See `.env.example`. All are optional for local development with mock data:

| Variable | Required for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Persisting searches, price history, alerts | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side writes (recommended) | Same page, "service_role" key — **server-side only, never expose to the client** |
| `QUICKCOMMERCE_API_KEY` | Real platform data instead of mock data | See `lib/providers/README.md` — no real integration is wired in yet; a documented, verified API is required before one is added |

Without Supabase configured, search/comparison/filtering/cart still work
fully; only persistence (history, alerts) is skipped.

## Database

Run `supabase/schema.sql` in your Supabase project's SQL editor to create the
`searches`, `products`, `product_results`, `price_history`, and
`price_alerts` tables. It enables Row Level Security on every table and adds
policies for it: `products`/`product_results`/`price_history` are public
catalog/price data (readable and writable by anon/authenticated), while
`searches` and `price_alerts` allow inserts only — nobody can read back
other people's search queries or alert emails except via the service role
key. If the Supabase SQL editor warns about RLS when you run it, that's
expected — choose "run and enable RLS" (the policies are already in the
script).

## Architecture

- `lib/providers/` — the `ShoppingProvider` interface plus `MockProvider`
  (self-contained mock catalog) and a `QuickCommerceProvider` stub. Add a
  real platform by implementing the interface and registering it in
  `registry.ts` — nothing else in the app changes.
- `lib/product/` — normalization (parses quantity text, strips marketing
  noise words, builds a match key) and matching (groups same products from
  different platforms without merging different sizes/variants).
- `lib/pricing/` — the comparison engine (cheapest/fastest/savings), an
  in-memory TTL cache so repeat searches don't re-hit every platform, and
  cart-total computation.
- `app/api/` — server-side routes; all external calls happen here, never in
  client code.

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Deployment

Vercel-compatible out of the box — import the repo, set the environment
variables above, deploy. No custom build configuration needed.

## Current limitations (MVP)

- Real platform integration is not implemented (see
  `lib/providers/QuickCommerceProvider.ts`) — no verified API documentation
  was available. The provider abstraction is ready for it.
- Price alerts persist to the database but no notification worker
  (email/push) is wired up yet — see spec section 14 / `app/api/alerts`.
- The in-memory cache is per-server-instance; on serverless deploys it's
  best-effort rather than a global cache.
