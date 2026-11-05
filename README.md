# My Medusa Store

A Pakistan-focused store built on [Medusa](https://docs.medusajs.com) v2 with the Next.js starter storefront. Currency is PKR and Cash on Delivery is the main payment method.

This repository is the foundation only. The COD placeholder is Medusa's built-in manual payment provider. Custom payment, courier and WhatsApp modules come later.

| App | Path | URL |
| --- | --- | --- |
| Backend API | `apps/backend` | http://localhost:9000 |
| Admin dashboard | `apps/backend` | http://localhost:9000/app |
| Storefront | `apps/storefront` | http://localhost:8000 |

## Prerequisites

- Node.js 24 LTS. The exact version is in `.nvmrc`, so `nvm use` selects it. Medusa needs 22.23.4 or later, and the storefront does not support Node 25 or later.
- npm 11, which comes with that Node version
- Docker with Compose v2
- Free local ports: 9000, 8000, 5432 and 6380

## Setup from a clean clone

Run these from the repository root.

```bash
nvm use

# 1. Create local env files. The defaults work as they are.
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/storefront/.env.example apps/storefront/.env.local

# 2. Start Postgres and Redis, and wait until both are healthy
docker compose up -d --wait

# 3. Install exact dependency versions from the lockfile
npm ci

# 4. Create the schema and the demo data
(cd apps/backend && npx medusa db:migrate)

# 5. Apply the Pakistan config. This also fills in the storefront's publishable key.
npm run setup:pakistan

# 6. Create a local admin user
(cd apps/backend && npx medusa user -e admin@example.com -p supersecret)
```

## Start commands

Run each in its own terminal, after `docker compose up -d --wait`:

```bash
cd apps/backend && npm run dev
cd apps/storefront && npm run dev
```

The first page load in dev mode is slow because Next.js compiles each route on demand.

To stop the databases, run `docker compose down`. Your data stays in the named volumes. `docker compose down -v` deletes it.

## Admin users

```bash
cd apps/backend
npx medusa user -e <email> -p <password>
```

The credentials in the setup steps are for local development only. Use a strong, unique password anywhere else.

## Pakistan config script

```bash
npm run setup:pakistan
```

The script is `apps/backend/src/scripts/setup-pakistan.ts`. It sets up:

- PKR as the store's default currency
- The "Pakistan" region (PKR, country PK) with `pp_system_default` as the COD placeholder
- The "Pakistan Warehouse" stock location, linked to the default sales channel
- A "Standard Delivery" flat-rate manual shipping option at PKR 250
- PKR 2,500 prices and stock for the four demo products
- A publishable API key on the default sales channel, written to `apps/storefront/.env.local`

It is safe to re-run. Everything is looked up first and only created when missing, so edits made in the admin are kept. To change a value such as the shipping price after the first run, change it in the admin.

The placeholder prices apply only to the four seeded demo products, so a re-run cannot touch real products.

Medusa stores prices in major units, so `2500` means PKR 2,500 and not paisa. PKR has no decimal places in Medusa.

## Environment variables

Each `.env.example` file is the template and is committed. The real `.env` files are gitignored, so never commit them.

### Root `.env` (Docker Compose)

| Variable | Default | Purpose |
| --- | --- | --- |
| `COMPOSE_FILE` | `docker-compose.dev.yml` | Lets plain `docker compose` commands find the dev file |
| `POSTGRES_USER` | `medusa` | Database user |
| `POSTGRES_PASSWORD` | `medusa` | Database password, for development only |
| `POSTGRES_DB` | `my_medusa_store` | Database name |
| `POSTGRES_PORT` | `5432` | Host port, bound to 127.0.0.1 |
| `REDIS_PORT` | `6380` | Host port, bound to 127.0.0.1 |

If you change any of these, update `DATABASE_URL` or `REDIS_URL` in `apps/backend/.env` to match.

### `apps/backend/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection URL |
| `REDIS_URL` | Production | Registers the Redis caching, event bus, workflow engine and locking modules. Empty falls back to in-memory modules |
| `CACHE_REDIS_URL` | No | Separate Redis for caching. Defaults to `REDIS_URL` |
| `LOCKING_REDIS_URL` | No | Separate Redis for locking. Defaults to `REDIS_URL` |
| `STORE_CORS` | Yes | Allowed storefront origins, comma-separated |
| `ADMIN_CORS` | Yes | Allowed admin origins, comma-separated |
| `AUTH_CORS` | Yes | Allowed auth origins, comma-separated |
| `JWT_SECRET` | Production | Generate with `openssl rand -hex 32` |
| `COOKIE_SECRET` | Production | Generate with `openssl rand -hex 32` |
| `AUTH_MFA_ENCRYPTION_KEY` | For admin MFA | Generate with `openssl rand -hex 32` |
| `MEDUSA_WORKER_MODE` | No | `shared` (default), `server` or `worker` |
| `DISABLE_MEDUSA_ADMIN` | No | `true` turns off the admin. Use it on the worker instance |
| `MEDUSA_BACKEND_URL` | Production | Public backend URL, used by the admin dashboard |
| `S3_*` | Placeholder | File storage. See the commented block in `medusa-config.ts` |
| `SENDGRID_*` | Placeholder | Built-in email provider. See the commented block in `medusa-config.ts` |
| `RESEND_*` | Placeholder | Needs the [custom Resend provider](https://docs.medusajs.com/resources/integrations/guides/resend) to be built first |

### `apps/storefront/.env.local`

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Yes | Filled in by `npm run setup:pakistan`. Each database has its own key |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Yes | Backend URL |
| `NEXT_PUBLIC_DEFAULT_REGION` | Yes | `pk` |
| `NEXT_PUBLIC_BASE_URL` | No | Public storefront URL for canonical links and the sitemap |

The remaining variables in `apps/storefront/.env.example` are optional and only apply to Stripe, Adyen or Medusa Cloud.

## Good to know

- **Redis uses port 6380 on the host.** This avoids a clash with any Redis already running on 6379. Inside the container it is still 6379.
- **New regions need a storefront cache reset.** The storefront keeps `/store/regions` in a cache that survives restarts. If a page under a new region's URL returns 404, stop the storefront, delete `apps/storefront/.next` and start it again.
- **Product edits take about a minute to reach product pages.** The storefront caches product data for 60 seconds, so a new price or stock level can show late on a product page. Store listings read the search index and update within seconds. In dev, Ctrl+Shift+R skips the cache.
- **Categories and collections use a cache with no time limit.** New ones can need the same cache reset as new regions.
- **A new currency needs a search index change.** Store listings read prices from the search index, which only holds the currencies listed in `PRICE_CURRENCIES` (`apps/backend/src/search/helpers/pricing.ts`) and `SEARCH_PRICE_CURRENCIES` (`apps/storefront/src/lib/search-client.ts`). Keep the two in sync, then run `npx medusa db:migrate` from `apps/backend`.
- **The Europe region is demo data.** It comes from the initial seed. It can be browsed at `/dk`, but the setup script takes its warehouse off the sales channel so that Pakistan orders reserve Pakistan stock, which means it has no shipping options at checkout. Remove it and the demo products when the real catalog goes in.
- **COD has placeholder wording.** Checkout shows the provider as "Manual Payment" with a "for testing purposes" badge until the COD work replaces it.

## Further reading

`AGENTS.md` covers the code layout, commands and conventions for this repository. Medusa's [deployment guide](https://docs.medusajs.com/learn/deployment/general) explains the server and worker setup that `medusa-config.ts` is prepared for.
