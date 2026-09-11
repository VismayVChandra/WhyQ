-- WhyQ schema. Run this in the Supabase SQL editor (or via `supabase db push`)
-- against a fresh project. Safe to re-run: every statement is idempotent.

create extension if not exists "pgcrypto";

-- One row per user search. No account/user info is stored — just enough to
-- power basic analytics and, later, "recent searches".
create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  location_label text not null,
  created_at timestamptz not null default now()
);

create index if not exists searches_created_at_idx on searches (created_at desc);

-- Canonical, matched product (one row per distinct brand+name+quantity).
create table if not exists products (
  id text primary key, -- matches the normalize.ts matchKey
  canonical_name text not null,
  brand text,
  quantity_value numeric not null,
  quantity_unit text not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- Latest known result for a product on a platform. Upserted on every search.
create table if not exists product_results (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products (id) on delete cascade,
  platform text not null check (platform in ('blinkit', 'zepto', 'instamart', 'bigbasket')),
  platform_product_id text not null,
  price numeric not null,
  mrp numeric,
  discount_percent numeric,
  availability boolean not null default true,
  delivery_eta_minutes integer,
  product_url text,
  fetched_at timestamptz not null default now(),
  unique (product_id, platform)
);

create index if not exists product_results_product_id_idx on product_results (product_id);
create index if not exists product_results_platform_idx on product_results (platform);

-- Append-only price history, one row per observed price point. Powers the
-- price history chart (spec section 13) and price alerts (section 14).
create table if not exists price_history (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products (id) on delete cascade,
  platform text not null check (platform in ('blinkit', 'zepto', 'instamart', 'bigbasket')),
  price numeric not null,
  recorded_at timestamptz not null default now()
);

create index if not exists price_history_product_platform_idx on price_history (product_id, platform, recorded_at desc);

-- Price alerts (spec section 14). No auth system in the MVP, so alerts are
-- keyed by email rather than a user id; a notification worker (cron / edge
-- function) can later poll this table and email/push when target_price is
-- crossed, then set triggered_at.
create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products (id) on delete cascade,
  platform text check (platform in ('blinkit', 'zepto', 'instamart', 'bigbasket')),
  target_price numeric not null,
  email text,
  created_at timestamptz not null default now(),
  triggered_at timestamptz
);

create index if not exists price_alerts_product_id_idx on price_alerts (product_id);
create index if not exists price_alerts_untriggered_idx on price_alerts (product_id) where triggered_at is null;

-- Row Level Security. The app's API routes prefer SUPABASE_SERVICE_ROLE_KEY
-- (see lib/supabase/client.ts), which bypasses RLS entirely — these policies
-- exist as a safety net for the fallback path (NEXT_PUBLIC_SUPABASE_ANON_KEY
-- only) and for direct API/browser access to this project.
--
-- products / product_results / price_history are non-sensitive catalog and
-- price data, so anon/authenticated get full read/write (the app upserts
-- these from search results). searches and price_alerts can contain
-- information about what a specific person searched for or wants to be
-- emailed about, so anon/authenticated can INSERT (submit a search log or
-- create an alert) but never SELECT — reading those back is left to the
-- service role only.

alter table searches enable row level security;
alter table products enable row level security;
alter table product_results enable row level security;
alter table price_history enable row level security;
alter table price_alerts enable row level security;

drop policy if exists "searches: anyone can insert" on searches;
create policy "searches: anyone can insert" on searches
  for insert to anon, authenticated with check (true);

drop policy if exists "products: public read" on products;
create policy "products: public read" on products
  for select to anon, authenticated using (true);
drop policy if exists "products: public write" on products;
create policy "products: public write" on products
  for insert to anon, authenticated with check (true);
drop policy if exists "products: public update" on products;
create policy "products: public update" on products
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "product_results: public read" on product_results;
create policy "product_results: public read" on product_results
  for select to anon, authenticated using (true);
drop policy if exists "product_results: public write" on product_results;
create policy "product_results: public write" on product_results
  for insert to anon, authenticated with check (true);
drop policy if exists "product_results: public update" on product_results;
create policy "product_results: public update" on product_results
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "price_history: public read" on price_history;
create policy "price_history: public read" on price_history
  for select to anon, authenticated using (true);
drop policy if exists "price_history: public write" on price_history;
create policy "price_history: public write" on price_history
  for insert to anon, authenticated with check (true);

drop policy if exists "price_alerts: anyone can insert" on price_alerts;
create policy "price_alerts: anyone can insert" on price_alerts
  for insert to anon, authenticated with check (true);
