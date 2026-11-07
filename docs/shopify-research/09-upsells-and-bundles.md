# Upsells and bundles

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers related and "complete the look" products, frequently bought together, cart and post-purchase offers, fixed bundles and multipacks, volume deals, and recently viewed. Medusa 2.22.2 has fixed bundles with shared stock (inventory kits, with admin UI), buy X get Y and quantity price tiers, and the starter has a basic related-products row, but it has no manual recommendations, cart upsell or recently viewed, and pick-your-own bundles exist only as an official recipe. Everything worth doing at launch can be built from catalog data and the shopper's own browser, with no personal data and no machine learning: fix the related row, add manual picks, use kits for sets and packs, and leave order-based and post-purchase offers until there are orders.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Related products (substitutes) | Native, Search & Discovery app plus a theme section | Automatic from purchase history, descriptions (English only) or collections. Up to 10 manual picks per product. Hides sold-out, unpublished and in-cart items | help.shopify.com product-recommendations (seen) |
| Complementary ("pairs well with", complete the look) | Native, manual only | Up to 10 per product, one block per product page, set in the app or in bulk via metafields | same (seen) |
| Fixed bundles and multipacks | Native, free Shopify Bundles app, all plans | Up to 30 components (150 for dynamic bundles), 3 options and 100 variants per bundle. Stock is tracked overall, not per location. Bundle price does not follow component price changes. Orders list the component SKUs | help.shopify.com shopify-bundles (seen) |
| Customized or mix-and-match bundles | Native for developers (Cart Transform function) or apps | Needs a developer or an app | same (seen) |
| Frequently bought together with a bundle discount | App | Frequently Bought Together (Code Black Belt): free plan with 3 manual bundles, then $9.99, $24.99 or $39.99 a month, 4.9 stars from 1,213 reviews (vendor says, 2026-11-06). Mixes manual picks and automatic ones | apps.shopify.com/frequently-bought-together |
| Volume deals, buy X get Y | Native discounts. Tiered deals need apps | Covered in report 05 | [05](./05-discounts-and-gift-cards.md) |
| Cart drawer upsell | Theme or app | Kaching CartDrawer, Essent Cart Drawer, Essential Upsell and Cross Sell, all with free plans (vendor says, 2026-11-06). Rebuy's listing says it is not currently on the App Store (seen) | apps.shopify.com/rebuy |
| Post-purchase offer page | App, post-purchase extension | Beta. COD and other manual payments do not trigger it (vendor says). Thank-you page blocks are the COD route | [04](./04-cart-and-checkout.md) |
| Recently viewed | Theme section, not a platform feature | The theme family used by Zellbury and Gul Ahmed ships `recently-viewed-products.js` (seen) | shop homepages |

## What real shops do
How I checked: on 2026-11-05 I saved every homepage and ran Shopify's public catalog search (`/search/suggest.json`) for "bundle" and "combo" on 11 Pakistani shops. On 2026-11-06 I fetched three product pages (Bonanza, Zellbury, Gul Ahmed): all three returned 429, and no headless browser is allowed, so recommendation sections on product pages could not be seen. I added nothing to any cart, so cart upsells are not verified on any shop.

Pakistan:
- The bundles count (11 of 12) does not hold. 10 of the 11 matches come from `bundle_target`, a field in Shopify's own web-pixels loader script, which every Shopify page carries. Sapphire's match comes from `swiper-bundle.min.css`, a slider library (Beechtree and Maria B load it too). No Pakistani homepage shows the word "bundle" in its visible text.
- Sapphire's homepage references `demandware.static` 134 times and cdn.shopify.com 98 times (seen 2026-11-05). Its storefront runs on Salesforce Commerce Cloud, so it is not a Shopify sample. It shows a "Combo Picks" menu entry.
- Real bundles found by catalog search (seen):
  - Bonanza Satrangi has "Bundle Deals", "Bundles", "Fragrance - Bundle" and "Combo Sets" collections. Examples: "Wedding Glow-Up Bundle" at PKR 9,990 against a compare-at price of PKR 11,188, and "Two of a Kind Deal" at PKR 8,990 against PKR 10,180.
  - Junaid Jamshed sells fragrance gift sets and discovery sets.
  - Outfitters sells "Pack of 3" socks and briefs.
  - Gul Ahmed sells pillow packs and 6-piece sets.
  - Maria B has an "RTW Jewelry Combos" collection.
  - So real bundles appear at about 5 of 11 shops. They are fixed sets and multipacks, mostly fragrance, home textiles, basics and jewellery.
- Clothing "sets" (2-piece and 3-piece suits, co-ord sets) are single products with one price at every shop checked, not bundles.
- Ethnc's search returned no results. Breakout's search endpoint returned 404.
- Recommendations (scan 4 of 12) and recently viewed (2 of 12): no recommendation app (Rebuy, Nosto, LimeSpot, Frequently Bought Together and so on) appeared in any Pakistani homepage. Outfitters loads Searchanise, a search app. Zellbury and Gul Ahmed load their theme's recently-viewed scripts, and Zellbury has a "complementary" button on product cards (seen). So recently viewed holds at 2. Whether shops use recommendation sections on product pages is unverified.

Global:
- Brooklinen runs a real bundle programme: a "Bundle & Save" homepage block and a `/pages/all-bundles` page of named sheet and duvet bundles, with up to 40% off select bundles applied at checkout. That page also has "you may also like", "shop the look" and upsell markup (seen 2026-11-06).
- Kylie Cosmetics has bundle product markup on its homepage (an "In this bundle" list and composition logic) and loads Nosto (seen).
- Fashion Nova loads Nosto, has recently-viewed markup and a product-bundles feature flag (seen).
- Allbirds and Gymshark have recently-viewed markup. Allbirds' "bundle" matches were a JavaScript file name (`vue.esm-bundler.js`), and MVMT's came only from `bundle_target`.
- Real bundles are at 2 of 6 global shops, not 5. Recently viewed (3 of 6) held.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Related-products row on the product page | Partial | `apps/storefront/src/modules/products/components/related-products/index.tsx`, mounted in `products/templates/index.tsx`. It filters by the same collection AND any shared tag, takes the first 12, has no stock filter and no ranking. If a product has no collection and no tags, the filters drop out (`isPresent([])` is false, `@medusajs/utils` is-present) and it shows any 12 products |
| Manual related or complementary picks | Missing | No model. Product `metadata` is returned to the starter (`+metadata` in `apps/storefront/src/lib/data/products.ts`), and the store API filters by `id`, `handle`, `category_id`, `collection_id` and `tag_id` (`medusa/dist/api/utils/common-validators/products`). The product builder tutorial shows the pattern: a complementary-product model tied to Product with `defineLink` and an admin widget |
| Fixed sets and multipacks with shared stock (inventory kit) | Built in, admin and storefront | `product_variant_inventory_item.required_quantity` (`@medusajs/inventory` AGENTS.md). Availability is the lowest of each part's stock divided by the quantity it needs (`utils/dist/product/get-variant-availability.js`). Reservations and return restocks multiply by it (`core-flows` prepare-confirm-inventory-input, confirm-receive-return-request). The admin has a "Has inventory kit" toggle when creating variants (user guide, `inventory_kit` in the dashboard product-create code). Docs say kits support neither separate bundle pricing logic nor separate fulfilment of the parts |
| Bundle where the shopper picks each item's variant | Missing, official recipe | docs recipe bundled-products/examples/standard: custom module plus links, an add-bundle-to-cart workflow, each item becomes its own line item tagged with `bundle_id`, default prices unless code sets `unit_price`, and an admin page. Needs 2.21 or later for `allowFields`, so 2.22.2 qualifies |
| Volume deals | Built in, storefront does not show them | Promotion `buyget` with minimum and apply-to quantities (`@medusajs/promotion` AGENTS.md, admin template). Variant price tiers with `min_quantity` and `max_quantity` (`@medusajs/pricing` AGENTS.md); the cart passes each line's quantity into pricing (`core-flows` get-variants-and-items-with-prices). Admin price-list forms carry min and max quantity fields (seen in dashboard code, not clicked through). The tier applies per line, so two sizes do not add up (from the code) |
| Cart upsell | Missing | `apps/storefront/src/modules/cart/templates/`. The cart fetch already includes `*items.product` |
| Post-purchase add to order | Partial, admin only | Order edit workflows. Routes exist only under `/admin/order-edits`, and there is no store order edit route. Confirming an edit reserves stock and creates or updates a payment collection for the difference (`confirm-order-edit-request.js`). See report 04 |
| Recently viewed | Missing | Nothing in the starter |
| Frequently bought together from orders | Missing | Community `@rsc-labs/medusa-products-bought-together-v2` 0.0.3, published 2025-03-22, peers `@medusajs/framework` ^2.6.1. `@devx-commerce/bundle` 0.0.3 has peers pinned to 2.4.0 (seen on npm). Both are early and untested on 2.22 |

## What we would build
1. Fix the related row, S. Prefer the same category, then the same collection; drop sold-out items and the current product; show 4 to 8; and never fall back to "any 12". Storefront only, with no risk.
2. Manual "complete the look" and "pairs well with" picks. Three ways, from least to most work:
   - Tag per look, S. Give every product in a look a shared tag such as `look-eid-01` and query by `tag_id`. The admin tag UI already exists, so there is no backend code.
   - Metadata, S. Store a list of handles in a product `metadata` key using the admin metadata editor, then fetch them with `handle`. There is no validation, so a renamed product silently drops out.
   - Custom module, M. A `recommendation` module (product, recommended product, type, rank) tied to Product with `defineLink` and `deleteCascade`, an admin widget in `product.details.side.after` with a product picker, and a store route or `allowFields` on `/store/products`. This is worth it once the catalog has hundreds of products.
3. Sets and multipacks as inventory kits, S, no code. Create the bundle product, set its price by hand, and use a sale price list (report 05) to show the saving. Risks:
   - A set in mixed sizes needs one variant per combination.
   - Packers see one line, so list the contents in the title or description.
   - A partial return of one piece is not possible, because the kit is one line item (inferred).
4. "Buy both" pair offer, S to M. On the product page, a button adds the main item and its pick through the existing add-to-cart, and an automatic `buyget` promotion (buy A, get B at X% off) gives the discount. There is no new model. The risk is that each pair needs its own promotion, set up by hand.
5. Pick-your-own bundles, M. Follow the official recipe if the owner wants "choose any 3" or per-item sizes. Risks: line items have to be grouped in the cart, order and admin views; removing the bundle must remove all its items; and bundle pricing needs code.
6. Volume deal display, S. Show tiers on the product page and a "buy 2 get 1" notice. The store product query config lists `variants.prices` (seen), but returning tier rows has not been tested. Coordinate with report 05.
7. Cart upsell, S. An "Add to your order" row in the cart and the cart dropdown, built from the picks of items already in the cart, leaving out in-cart and sold-out items and putting low-priced items first. Pair it with the free-delivery nudge in report 04. Depends on item 2.
8. Recently viewed, S. A client component keeps the last 10 to 12 product handles in `localStorage` (wrapped in try/catch) and renders them on product and cart pages with `listProducts`. Nothing leaves the browser except an ordinary product list request.
9. Bought together from orders, M. A weekly scheduled job counts product pairs in orders that were not canceled, reading product IDs only and no customer fields, and stores the top pairs in the item 2 module. Show a pair only above a minimum count, with manual picks as the fallback. This is counting, not ML. Risks: it needs hundreds of orders, and refused COD parcels skew the counts unless they are left out, which needs courier status (report 02).
10. Post-purchase add to order, M to L. A guarded store route that wraps the order edit workflows, for a short window before the confirmation call or courier booking. COD helps here, because there is no second payment to take. See report 04, item 8.

## Recommendation
- Launch:
  - Fix the related row (item 1): today it can show random products.
  - Manual complete-the-look picks by tag or metadata (item 2): it is the main cross-sell for suits, dupattas, shoes and jewellery, and it needs no data.
  - Inventory-kit sets and packs (item 3), if the catalog has gift sets or packs: built in and free.
- Soon after launch:
  - Cart upsell (item 7): cheap, and it raises COD order value.
  - Recently viewed (item 8): cheap, needs no personal data, and the two largest Pakistani themes checked already have it.
  - "Buy both" pair offer and volume deal display (items 4 and 6): they use built-in promotions.
- Later:
  - The recommendation module (item 2, third option): once the catalog grows.
  - Bought together from orders (item 9): needs order volume.
  - Post-purchase add to order (item 10): needs a safe route and order flow.
  - Pick-your-own bundles (item 5): only if bundle sales prove out.
- Skip:
  - AI or per-shopper personalisation apps and plugins: no data at launch, privacy cost, and the Medusa plugins are early.

## Questions for the owner
1. Will the launch catalog include fixed sets or packs (gift sets, packs of 3, suit with dupatta or jewellery), and should they show a "you save Rs X" price?
2. In a set, must shoppers be able to choose a different size for each piece? Yes means the recipe build (M) instead of kits (S).
3. Who will choose the complete-the-look items for each product, and is a shared tag per look acceptable at launch instead of a picker in the admin?

## Sources
- https://help.shopify.com/en/manual/online-store/search-and-discovery/product-recommendations
- https://help.shopify.com/en/manual/products/bundles , https://help.shopify.com/en/manual/products/bundles/shopify-bundles
- https://apps.shopify.com/frequently-bought-together , https://apps.shopify.com/rebuy (apps.shopify.com/kaching-bundles and /fast-bundle returned 404)
- https://docs.medusajs.com/resources/commerce-modules/inventory/inventory-kit.md
- https://docs.medusajs.com/user-guide/products/create/bundle.md
- https://docs.medusajs.com/resources/recipes/bundled-products.md , https://docs.medusajs.com/resources/recipes/bundled-products/examples/standard.md
- https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-builder.md
- https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules.md
- https://registry.npmjs.org/@rsc-labs/medusa-products-bought-together-v2 , https://registry.npmjs.org/@devx-commerce/bundle
- Shop pages (2026-11-05 and 06): homepages of all 18 shops; `/search/suggest.json?q=bundle` and `?q=combo` on 11 Pakistani shops; https://www.brooklinen.com/pages/all-bundles ; product pages on bonanzasatrangi.com, zellbury.com and gulahmedshop.com (all 429)
- Installed packages: `@medusajs/inventory`, `product`, `pricing`, `promotion`, `core-flows`, `medusa`, `utils`, `dashboard`, `admin-shared` (dist and AGENTS.md)
- Related reports: [04](./04-cart-and-checkout.md), [05](./05-discounts-and-gift-cards.md), [02](./02-couriers-and-tracking.md)
