# Search and collections

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers how shoppers find products: predictive search, filters and sorting, typo and synonym handling for Roman Urdu terms, collections built by rules or by hand, and menus. Medusa 2.22 and our starter already have a working Postgres search index with a type-ahead drawer and a filtered store page. Gaps: typo tolerance is switched off in practice, there are no synonyms, category and collection pages skip the index and stop at 100 products, and there are no rule-based collections, manual ordering or mega menu. Keep the built-in Postgres provider, close those gaps with Medusa modules and the existing index, and leave Meilisearch as a later option.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Predictive search (products, collections, queries, pages) | Native, all plans | Up to 10 results per type; typo tolerant; searches title, tags, type, vendor, SKU, variant title | shopify.dev predictive search API |
| Typo tolerance, semantic matching | Native | No settings exposed | help.shopify.com storefront search |
| Synonym groups | Search & Discovery app (free, by Shopify) | 20 per group and 1,000 per store (third-party guides, unverified) | apps.shopify.com/search-and-discovery |
| Product boosts for search terms | Search & Discovery | Up to 10 terms per product; sold-out items go last by default | help.shopify.com modify search |
| Storefront filters (availability, price, type, tag, vendor, options, metafields) | Search & Discovery | 25 filters per store, 100 values shown per filter, no filters on collections over 5,000 products | help.shopify.com filters |
| Sort: relevance, best selling, A-Z, price, date, manual | Native | Price sort uses base prices | help.shopify.com collection layout |
| Automated (rule) collections, match all or any | Native | 60 conditions per collection, 5,000 rule collections per store; title, type, vendor, category, tag, price, compare-at price, stock, weight, metafields | help.shopify.com automated collections |
| Manual product order (drag) | Native | Per collection | help.shopify.com collection layout |
| Nested menus | Native | 3 levels, 10,000 items per menu, 1,000 menus; mega-menu look depends on the theme | help.shopify.com drop-down menus |
| Third-party search apps | App | Searchanise: free under 25 products, $19/mo up to 1,500, $39/mo up to 7,500 (seen 2026-11-06). Boost: entry about $29/mo (unverified), and its listing said it was not available on 2026-11-06. Algolia: see the comparison below | App Store listings |

## What real shops do
Pakistani shops (2026-11-05 and 06, 3 to 5 requests each, no blocks met):
- Predictive search: Shopify's public suggest endpoint answered on Limelight, Beechtree, Zellbury, Gul Ahmed, Bonanza Satrangi, Maria B and Outfitters (seen). Sapphire returned 404, which fits the brief's warning that it may have left Shopify.
- Roman Urdu (seen): Limelight returned Kurti products for both "kurti" and the typo "kurtii", and Shalwar items for "shalwaar". Beechtree and Zellbury answered "kurti" with kurtas and suggested "kurta". Gul Ahmed mapped "dopatta" to dupattas. "qameez" gave generic suits everywhere, and Maria B's "dopatta" results drifted to jewellery. Outfitters (Searchanise) returned unrelated items rather than "no results". This looks like fuzzy matching. No shop showed a curated Roman Urdu synonym list (unverified, since synonyms are admin-only).
- Filters and sorting (seen in collection HTML): Gul Ahmed has native availability and tag filters plus the full native sort list (manual, best selling, most relevant, price, date, title). Bonanza has availability and colour filters. Outfitters has colour, size, tag, fit metafield, type, season and vendor filters. Limelight has a heavy mega menu. Maria B carries Boost app markers.
- Marker counts: predictive 11/12 held up (7 of 7 live shops answered). Filters held up where checked. Search apps 1/12 was too low: Maria B (Boost) joins Outfitters (Searchanise), making 2/12.

Global shops (one page each, seen): Gymshark is a headless Next.js front on Shopify with Algolia. Fashion Nova runs Hydrogen with Algolia and Nosto. Kylie Cosmetics uses a theme with Algolia, Nosto and a mega menu. Allbirds and Brooklinen use native filters built on metafields, plus a price range on Allbirds. Search apps 3/6 held up. Predictive 2/6 is an undercount, because headless fronts cannot carry the theme marker.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Search engine | Built in | `@medusajs/search` with the default `@medusajs/search-postgres` (tsvector, pg_trgm, unaccent, English stemming); node_modules AGENTS.md and README |
| Product index | Built in | `apps/backend/src/search/product.ts`: title, description, category names, tags (as `labels`), option values, PKR/EUR/USD min and max price, on_sale, created_at. No collection, type, SKU, stock or sales count |
| Store search API | Built in | `POST /store/search`, opened in `apps/backend/src/api/middlewares.ts`, limited to published products in the key's sales channel |
| Predictive search drawer | Built in | `apps/storefront/src/modules/layout/components/search` (InstantSearch adapter, prefix match on the last word, 250 ms debounce) |
| Store page filters and sort | Built in | `modules/store`: option, price range, on-sale, category and tag facets; sort by relevance, newest, price, title |
| Typo tolerance | Partial, off in practice | The index enables it, but the provider applies it only when a query sends `search_options.typo_tolerance: true`, and `lib/search-client.ts` does not send it (seen in `search-postgres/dist/services/postgres-search.js`) |
| Synonyms, boosts, search analytics | Missing | Index settings have no synonym option; Postgres synonym dictionaries need files on the DB server (postgresql.org) |
| No-JS `/search` page | Partial | `app/[countryCode]/(main)/search/page.tsx` uses `/store/products?q=`, a different engine from the drawer |
| Categories (nested, many per product) | Built in | Product Module. Admin: create, edit, Organize (tree order), add products. Storefront: `/categories/...` and footer |
| Collections | Built in, limited | A product has at most one `collection_id`. Admin: add or remove products. Storefront: `/collections/[handle]` and footer (6 shown) |
| Category and collection listing | Partial | Sort only, no filters (`hideOptionsPicker`). `listProductsWithSort` fetches 100 products and sorts them in memory, so products past 100 never show |
| Rule-based collections | Missing | Nothing in Product Module or admin |
| Manual product order within a category or collection | Missing | Category `rank` orders sibling categories only; `product_category_product` has no rank |
| Mega menu | Missing | Nav has only a side menu (Home, Store, Account, Cart). The category tree can feed one |
| Index admin | Partial | Admin Settings > Search lists indexes and runs a reindex (zero-downtime swap). No synonym or ranking settings |

## What we would build
1. **Typo tolerance with a guard (S).** Send `typo_tolerance: true` from the storefront search client. The provider counts a match when pg_trgm word similarity is above a fixed 0.3. A local re-implementation of that formula (not run on Postgres) gives: kurti/kurta 0.67, qameez/kameez 0.57, dopatta/dupatta 0.50, shalwaar/shalwar 0.70. It also lets loose matches through: lawn/lace 0.40, shalwar/shawl 0.38. Exact hits rank higher, but loose ones still swell counts and facets. To guard against this, use typo matching only when the exact search finds nothing, through a custom adapter `requester`. Risk: the function call probably cannot use the trigram index, so every typo search scans the table. That is fine at a few thousand products (inference, not benchmarked).
2. **Roman Urdu synonyms (S in code, M with admin UI).** Add a `search_terms` keyword array to the index, `searchable` with weight 2. Fill it in `toDocument` by expanding words from the title, category and tags through a dictionary, for example kurti/kurta/kurtee, shalwar/salwar, kameez/qameez/kamiz/shirt, dupatta/dopatta, khaddar/khadar, unstitched/unstiched, pret/ready to wear, jora/suit. Version 1 keeps the dictionary in code. Version 2 moves it to a custom `search-synonym` module with an admin route, and a workflow that calls the Search Module's `reindex` after edits. Risk: over-expansion such as shirt matching kameez, so curate the list.
3. **Category and collection pages on the index (M).** Add `category_ids`, `category_handles`, `collection_handle`, `type`, `in_stock` and `sku` fields. Render those pages with InstantSearch and a fixed filter, so they get facets and real pagination past 100. Move `/search` to `query.search`. Risk: an in-stock field needs inventory reads in `transform`. `inventory-level.updated` exists, but which events fire on reservations is unverified.
4. **Scheduled reindex job (S).** Add a job in `src/jobs/` that reindexes nightly, or around sale start times. It covers the gaps listed as TODOs in `product.ts`: price lists emit no events, and batch category links emit nothing. The docs also say date-driven price-list changes need a reindex.
5. **Automatic rule-based collections (M): yes, buildable.** Add a custom `smart-collection` module holding title, handle, rules (field, operator, value), match all or any, and default sort. Add an admin route to edit it and a store route to read it. The storefront turns the rules into Search Module filters (`$and`, `$or`, `$in`, ranges, array membership) on the product index, so membership stays as fresh as the index. Rules can use category, tag, option value, PKR price, on-sale, created date, plus type, collection and stock once item 3 adds them. Title rules depend on `$like` support for text fields (unverified). If staff must see members in the admin, there is a materialised option: a subscriber or job links matches into a category with `batchLinkProductsToCategoryWorkflow`. The risk there is the event gaps from item 4.
6. **Manual order and pinning (M).** Store a `rank` per product and category, either with a module link using `database.extraColumns` (seen in `define-link.d.ts`) or in a small custom module. Add an admin widget on the category page with drag ordering. The storefront shows pinned products first, then the index sort. A single index field cannot sort by a different rank per category, so full manual order works only for collections of moderate size.
7. **Best-selling and sold-out-last sorts (S).** Add a `sold_count` field, updated when `order.placed` is added to the index events and mapped to product ids. Add `in_stock` to the sort ahead of the chosen order. Risk: COD cancellations inflate counts unless they are subtracted.
8. **Mega menu (S, or M with a menu module).** Build it server-side from the category tree (nesting, rank, is_active, is_internal), with images and promo links in category `metadata`, and an accordion on mobile. A separate menu module is only needed for custom links such as Sale or New In, or smart collections.
9. **Search engine choice (only if Postgres falls short).**

| | Postgres provider (current) | Meilisearch, self-hosted | Algolia |
| --- | --- | --- | --- |
| Medusa fit | First-party, default | Community `@rokmohar/medusa-plugin-meilisearch`, ~2.4.0 listed for Medusa 2.22.x, needs Meilisearch 1.20+ | No current provider. Medusa's Algolia and Meilisearch guides are deprecated since 2.21.1, so we would write a provider (M) |
| Synonyms, ranking | None (item 2) | Synonyms, stop words and ranking rules per index | Synonyms and rules (10 rules per index on free) |
| Ops on one Hetzner VPS | Nothing new, but search load shares the database with checkout | One more container, its RAM and backups. No official RAM figure found | None, but data leaves the VPS and latency from Pakistan is unverified |
| Cost (2026-11-06) | 0 | 0 (MIT); Cloud from $20/mo | Free tier 10K searches and 50K records a month, then $0.50 per 1,000 searches |
| Main risk | Coarse typo control | Plugin tied to Medusa minor versions, one maintainer | Monthly bill grows with traffic |

## Recommendation
- **Launch:** typo tolerance with the zero-result guard, because shoppers type kurti, kurtee and shalwaar. A code-level Roman Urdu synonym list, so kameez and qameez meet. Category and collection pages on the index with filters, real pagination and the extra fields, because the 100-product cap hides stock. A scheduled reindex, so sale prices are not stale. A mega menu from categories, because every Pakistani shop checked leads with deep menus. Link Sale to the existing on-sale facet, so there is a sale page without new code.
- **Soon after launch:** rule-based collections (New In, Under PKR 3,000, Eid edit), because merchandisers want them once the catalog grows. Pinning and manual order, for campaign landing pages. Best-selling and sold-out-last sorts, which need order history first.
- **Later:** admin UI for synonyms, search analytics (top and zero-result queries), product boosts, and Meilisearch through the community provider if relevance or database load becomes a problem.
- **Skip:** Algolia and paid Shopify-style search apps, because of cost, no maintained Medusa provider, and data off the VPS. Vector or semantic search, because the native Postgres engine rejects it and it only runs on Medusa Cloud.

## Questions for the owner
1. What is the top-level menu (for example Women, Men, Kids, Unstitched, Pret, Sale), and should it carry images?
2. Should sold-out products be hidden, shown last, or shown normally in listings and search?
3. Will product names or searches use Urdu script, or only English and Roman Urdu? This decides whether the English text search setup is enough.

## Sources
- node_modules/@medusajs/search/AGENTS.md, search-postgres/AGENTS.md and README.md, instantsearch-adapter/AGENTS.md and README.md, product/AGENTS.md (2.22.2)
- node_modules/@medusajs/search-postgres/dist/services/postgres-search.js, dist/utils/plan.js; node_modules/@medusajs/types/dist/search/query.d.ts, index-definition.d.ts; node_modules/@medusajs/utils/dist/modules-sdk/define-link.d.ts
- apps/backend/src/search/*, apps/backend/src/api/middlewares.ts, apps/storefront/src/lib/search-client.ts, lib/data/products.ts, modules/store, modules/layout, modules/categories, modules/collections
- https://docs.medusajs.com/resources/infrastructure-modules/search.md
- https://docs.medusajs.com/resources/infrastructure-modules/search/providers/postgres.md
- https://docs.medusajs.com/resources/infrastructure-modules/search/product-index-examples.md
- https://docs.medusajs.com/resources/infrastructure-modules/search/reindexing.md
- https://docs.medusajs.com/resources/references/search/provider.md
- https://docs.medusajs.com/cloud/search/comparison.md
- https://docs.medusajs.com/resources/integrations/guides/meilisearch.md
- https://docs.medusajs.com/resources/integrations/guides/algolia.md
- https://github.com/rokmohar/medusa-plugin-meilisearch
- https://shopify.dev/docs/api/ajax/reference/predictive-search
- https://help.shopify.com/en/manual/online-store/storefront-search
- https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-modify-search
- https://help.shopify.com/en/manual/online-store/search-and-discovery/filters
- https://help.shopify.com/en/manual/products/collections/automated-collections
- https://help.shopify.com/en/manual/products/collections/automated-collections/auto-select
- https://help.shopify.com/en/manual/products/collections/collection-layout
- https://help.shopify.com/en/manual/online-store/menus-and-links/drop-down-menus
- https://apps.shopify.com/search-and-discovery
- https://apps.shopify.com/searchanise
- https://apps.shopify.com/product-filter-search
- https://support.boostcommerce.net/en/articles/9334587-pricing-plan-overview
- https://www.algolia.com/pricing
- https://www.meilisearch.com/pricing
- https://www.postgresql.org/docs/current/textsearch-dictionaries.html
- Shop pages and `/search/suggest.json` on limelight.pk, beechtree.pk, zellbury.com, gulahmedshop.com, bonanzasatrangi.com, mariab.pk, outfitters.com.pk, sapphireonline.pk, gymshark.com, fashionnova.com, kyliecosmetics.com, allbirds.com, brooklinen.com (2026-11-05 and 06)
