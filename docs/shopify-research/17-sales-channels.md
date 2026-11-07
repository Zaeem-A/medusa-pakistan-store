# Sales channels

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers selling beyond the website: point of sale (POS) and in-store pickup, stock held in physical shops, marketplaces (Daraz), Meta, TikTok and Google shopping surfaces, and branded mobile apps. Medusa 2.22.2 has the building blocks: sales channels, publishable keys, stock locations and per-location pickup options with a working "Pick up your order" step in our starter checkout. It has no POS, Daraz, social-shop or mobile-app integration. Launch web-only on the default channel and take social orders as draft orders. Add shop pickup only if the brand has shops with reliable stock counts. Build a Daraz stock and order sync only if the brand already sells there, and skip TikTok Shop, Google Shopping and Meta Shops checkout, none of which a source shows open to Pakistan.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| POS app (in-store checkout, staff, receipts) | Native | Included with paid plans; POS Pro add-on $89 per location per month (US pricing, seen 2026-11-05) | [S1] |
| POS Pro extras: omnichannel selling from POS, inventory tools, staff roles, exchanges at any location | Native add-on | $89/location/month; included in Plus (from $2,300/month, 3-year term, seen 2026-11-05) | [S1] |
| Local pickup at checkout | Native | Turned on per location with processing time and instructions. Offered only if the whole order is in stock there, unless store transfers fill it. Themes can show pickup availability on product pages. Custom pickup apps are Plus-only | [S2] |
| Stock across shops and warehouses | Native | Per-location inventory; plan location limits not checked | [S1] |
| Marketplace sync (Amazon, eBay, Walmart, Target Plus) | Shopify app "Marketplace Connect" | Free to install, 50 synced orders a month free, then 1% capped at $99/month (seen 2026-11-06). No Daraz | [S4] |
| Daraz sync | Third-party app "Daraz Link" by Osco (Singapore) | $9 to $49/month by product count (50 to 15,000). Rated 2.1 from 3 reviews; newest is 1-star, 2026-10-31 (seen 2026-11-06) | [S5] |
| Facebook and Instagram | App by Meta | Free; pixel and catalog sync (report 14) | report 14 |
| Google and YouTube | App by Google | Free; Merchant Center has no Pakistan target (report 14, [P8]) | report 14 |
| TikTok | App by TikTok | Seen at Pakistani shops for the pixel (report 14) | report 14 |
| Branded mobile app | App (Tapcart, website wrappers) | Tapcart from about $200/month on its App Store listing, aggregators say $250 to $600 (search snippets, unverified, 2026) | [S6] |

Availability in Pakistan (each item dated):
- **Shopify POS:** Shopify's availability page lists no countries [S3]. POS use in Pakistan is unverified. Report 03 covers Shopify Payments being unavailable there.
- **Daraz seller API:** it exists. open.daraz.com loads as the "Daraz Open Platform" (seen 2026-11-05), but its API docs page did not load for me.
  - Connector vendors describe the flow (vendor says): register as a developer, get an App Key and Secret, have the seller authorize through OAuth, then sign each call with HMAC-SHA256. They say it is built on Lazada's API, with a host per country such as api.daraz.pk [P2] [P3].
  - Third-party connectors exist for Shopify, Odoo, ERPNext and Asaan Retail, so outside apps can get access. Approval terms and cost are unverified.
- **Meta Shops (Facebook and Instagram):** Meta's commerce eligibility page requires the seller to be in a supported country, but the country list did not load (seen 2026-11-05) [P4].
  - The newest dated source says Pakistan is not supported, but it is a Shopify staff reply from 2022-09-05 [P5]. Status in 2026 is unverified.
  - Catalog ads are separate from Shops and are covered in report 14.
- **TikTok Shop:** not open to sellers registered in Pakistan, per a Markaz article dated 2026-08-14 that names no official source [P6]. I found no TikTok announcement either way, so this is unverified. TikTok self-serve ads did launch in Pakistan, per Dawn in December 2025 (search result, not opened) [P7].
- **Google Shopping:** Pakistan is missing from Merchant Center's supported-country table (seen 2026-11-05; the page is undated but marked 2026) [P8]. The 14 markets added on 2026-07-14 are all in Europe [P9]. This agrees with report 14.
- **Shop POS rule in Pakistan:** FBR requires Tier-1 retailers (chains, mall outlets, large electricity users) to connect their POS to FBR. News reports put about 36,000 outlets connected by April 2026 [P10] (search results, not opened). Any chain with shops already runs an FBR-linked POS, and a Medusa POS would need that link too.

## What real shops do
On 2026-11-05 I fetched all 18 homepages once (all returned 200) and the first product page linked from each Pakistani homepage. On 2026-11-06 a repeat Outfitters product request got 429, so I stopped there. Report 13 covers store locators.

Pakistan (12; Sapphire may no longer be on Shopify, per the brief):
- **Mobile app:** only Gul Ahmed links one (seen), so the scan count of 1/12 held.
  - The iOS app "GulAhmed (Ideas)" is published by Ideas (Pvt) Ltd and updated often: six versions between 4 Sept and 29 Oct. It lists a store locator, order tracking, a barcode scanner and installments. It has too few ratings to show a score (seen).
  - The Android package id starts with `co.median.android`, which points to the Median.co website-to-app builder. That is my inference and unverified: the Play page returned no content.
- **In-store pickup:** of the 8 product pages I tried, only Outfitters and Breakout loaded. Limelight, Gul Ahmed, Junaid Jamshed, Bonanza Satrangi, Maria B and Zellbury returned 429. Sapphire, Ethnc, Beechtree and Nishat had no product link on the homepage.
  - Outfitters' page includes Shopify's pickup-availability block (seen). I could not check whether any shop has pickup turned on.
  - Breakout's page had no pickup markup. No homepage mentioned pickup or click and collect.
- **Physical shops:** store locators appear on 10 of 12 homepages (report 13). Combined with the FBR rule, this means most of these brands run shop POS systems outside Shopify. Which POS they use is unverified.
- **Daraz:** none of the 12 homepages links to Daraz. A search result shows a Sapphire official store on Daraz, from a 2022 page [P11]. A blog claims Gul Ahmed has a Daraz flagship. Both are unverified for 2026.
- **Social:** Instagram profile links appear on 11 of 12 homepages and TikTok links on 5 (Sapphire, Limelight, Beechtree, Ethnc, Breakout). I saw no "shop on Instagram" links. Report 14 found the Meta pixel at 9 of 9 shops it could read and TikTok at 4 of 9.

Global (6):
- Fashion Nova links a Tapcart-built app: its Play package id starts with `co.tapcart.app` (seen). The mobile app count of 1/6 held.
- Fashion Nova, Gymshark and Brooklinen link store pages, so they have physical retail. No homepage showed pickup markup.
- The other homepages showed Instagram, Facebook, TikTok and Pinterest links only.

## What Medusa already has
| Capability | Built in, Partial or Missing | Where (package, docs page or file path) |
| --- | --- | --- |
| Sales channels (product availability per channel; orders and carts carry the channel) | Built in | `@medusajs/sales-channel` AGENTS.md. Admin: Settings > Sales Channels; the order list filters by channel (`dashboard/src/hooks/table/filters/use-order-table-filters.tsx`) |
| Publishable keys scoping store API calls to channels | Built in | `@medusajs/api-key` AGENTS.md. Admin: Publishable API Keys. Starter uses one key (`apps/storefront/src/lib/config.ts`); `apps/backend/src/scripts/setup-pakistan.ts` links it to the default channel |
| Several stock locations, stock per location, channel-to-location links | Built in | `@medusajs/stock-location`, `@medusajs/inventory`. Admin: Locations, Inventory, Reservations. We have one location, "Pakistan Warehouse" (`setup-pakistan.ts`) |
| Pickup options per location | Built in, not set up | Fulfillment set type `pickup` (`dashboard/src/routes/locations/common/constants.ts`); admin can enable Pickup per location and add pickup options [M10]. Orders show "Awaiting pickup" and hide "mark as delivered" (`order-fulfillment-section.tsx`). Our setup script creates only a `shipping` set |
| Pickup in the storefront | Built in | Store shipping options return the fulfillment set type and the location address. They also flag `insufficient_inventory` against stock at that option's location (`core-flows/dist/cart/workflows/list-shipping-options-for-cart.js`). The starter shows "Pick up your order" and disables options without stock (`apps/storefront/src/modules/checkout/components/shipping/index.tsx`) |
| Reserving stock at the chosen pickup shop | Partial | When the cart completes, stock is reserved at the first location of the channel that has enough, not at the pickup shop (`prepare-confirm-inventory-input.js`, `reserve-inventory.js`). It moves to the option's location only when the fulfillment is created (`order/workflows/create-fulfillment.js`) |
| Orders taken by staff (Instagram DMs, WhatsApp, phone) | Built in | `@medusajs/draft-order` plugin: admin Drafts page with a sales-channel section (draft-order AGENTS.md) |
| POS | Missing; recipe and starters exist | POS recipe: draft orders, the variant `barcode` field, a custom barcode route, a payment provider [M5]. The Agilo POS starter (MIT; React Native and Expo; runs on the Admin API; barcode scanning; setup by channel and location) is dated 2025-10-09. Payment terminals, offline mode and hardware are listed as planned (vendor says) [M6]. Its GitHub page returned 504 and then 403, so I did not see it. Community `medusa-pos-plugin` 0.0.52 (2026-11-03) targets Medusa 2.12.4 and Razorpay, an Indian provider (seen on npm) [M9]. No FBR support anywhere |
| Marketplace sync (Daraz) | Missing; general guide | Guide [M4]: one sales channel per marketplace, a module wrapping the marketplace API, workflows for listings, stock, order import and fulfillment, plus subscribers, a 15-minute scheduled job and a webhook route. Imports use `createOrderWorkflow`, with the marketplace order id in metadata to block duplicates. No Daraz package on npm (search, 2026-11-06) |
| Meta and Google product feed | Missing; official tutorial | [M8]; planned in report 14, item 7 |
| Mobile app | Missing; official guide | Expo guide: JS SDK with tokens stored in AsyncStorage and a publishable key from `EXPO_PUBLIC_` variables. Push notifications are not covered in the part I read [M7] |

## What we would build
1. **Pickup at the brand's own shops (S).** Mostly admin setup, plus one subscriber.
   - Setup: one stock location per shop with its address, Pickup turned on, a service zone and a free pickup option, linked to the default channel, with stock entered per shop. The starter checkout already handles pickup.
   - Code: a subscriber on `order.placed` that moves reservations to the pickup shop with `updateReservationsWorkflow` when the shipping method is a pickup option. This stops two shoppers claiming the same unit in a shop.
   - COD is paid at the counter: staff capture the Manual payment and mark the order picked up.
   - Depends on: a "ready for pickup" message (report 10).
   - Risk: Medusa's shop stock is only right if the shop POS keeps it in sync (item 2).
   - Fallback with no shop stock: a flat-rate "Collect from shop" option on the warehouse shipping set. Staff send the parcel to the shop. No code needed.
2. **Shop stock sync from the existing shop POS (M).** A module that wraps the POS vendor's API, plus a scheduled job that writes stock levels with `batchInventoryItemLevelsWorkflow` or `updateInventoryLevelsWorkflow`. Sales of shop stock go back to the POS through a subscriber.
   - Depends on: which POS the shops use and whether it has an API (unknown).
3. **Medusa as the shop POS (L).** Start from the Agilo starter. Add FBR invoice reporting and a QR code on each receipt, receipt printing, a cash drawer flow and offline mode.
   - Risk: none of those exist today, and getting FBR compliance wrong carries penalties [P10].
4. **Daraz sync (M for stock and orders, L with listing creation).** Follow guide [M4]:
   - A "Daraz" sales channel and a dedicated "Daraz allocation" stock location, so the two channels cannot oversell each other.
   - A `daraz` module: App Key and Secret as options, HMAC signing, and OAuth token refresh stored in a model.
   - Stock and price pushed by a 15-minute scheduled job plus a subscriber.
   - Orders imported by a polling job through `createOrderWorkflow`, with `daraz_order_id` in metadata, and order status pushed back.
   - Listing creation needs Daraz category and attribute mapping, which is the large part. Listing by hand in Daraz Seller Center and syncing only stock and orders keeps this at M.
   - Risks: Daraz delivers and collects COD itself, so its orders must be kept out of courier booking (report 02) and the COD report (report 14, item 8). API access terms are unverified.
5. **Instagram, Facebook and WhatsApp orders (S, configuration).** Create an "Instagram/WhatsApp" sales channel and enter DM orders as draft orders on it, so they get reported separately. The catalog feed for Meta ads is report 14, item 7. Instagram product tags and Shops depend on Meta eligibility for Pakistan, which is unverified for 2026.
6. **Mobile app (M as a wrapper, L as a native app).** A native app would follow the Expo guide, on its own "Mobile app" channel and publishable key so app orders can be reported. Push notifications would need a notification provider (report 10). A wrapper around the mobile site is cheaper, and Gul Ahmed's Android package id suggests it uses one (unverified).

## Recommendation
- **Launch:**
  - The web store on the default sales channel with its publishable key. This is already done and needs no work.
  - An "Instagram/WhatsApp" channel for draft orders (item 5), since Pakistani brands sell heavily through DMs and it only needs configuration.
- **Soon after launch:**
  - Shop pickup with the reservation fix (item 1), if the brand has shops. Ten of 12 Pakistani shops list physical stores, and pickup costs no courier fee.
  - Daraz stock and order sync (item 4, M scope), if the brand already sells on Daraz. Running two separate stock counts by hand leads to overselling.
- **Later:**
  - Shop stock sync from the shop POS (item 2). It needs the vendor's API, and pickup can start with the warehouse fallback.
  - Mobile app (item 6). Only Gul Ahmed has one, and the mobile site covers COD buyers.
  - Daraz listing creation (item 4, L scope). Listing by hand works for a small catalog.
- **Skip:**
  - Medusa as the shop POS (item 3). The FBR-linked POS the shops already use does the job, and replacing it is L work with compliance risk.
  - TikTok Shop: not open to Pakistani sellers per the only dated source.
  - Google Shopping: Pakistan is not a Merchant Center target.
  - Meta Shops checkout: not shown to be available in Pakistan. The ads feed stays in report 14.

## Questions for the owner
1. Does the brand have physical shops, and which POS do they run (is it FBR-linked, and does it have an API)? This decides items 1 to 3.
2. Does the brand sell on Daraz now, or plan to, and roughly how many products? This decides whether item 4 is worth building.
3. Is a branded mobile app wanted in the first year, or is the mobile website enough?

## Sources
- [S1] https://www.shopify.com/pos/pricing (seen 2026-11-05)
- [S2] https://help.shopify.com/en/manual/fulfillment/setup/delivery-methods/pickup-in-store (seen 2026-11-05)
- [S3] https://help.shopify.com/en/manual/sell-in-person/shopify-pos/pos-availability (seen 2026-11-06, no country list)
- [S4] https://apps.shopify.com/marketplace-connect (seen 2026-11-06)
- [S5] https://apps.shopify.com/daraz-by-osco (seen 2026-11-06)
- [S6] https://apps.shopify.com/shopify-mobile-apps?page=6 ; https://pricingsaas.com/companies/tapcart/diffs/2026W28 (search snippets, unverified)
- [P2] https://docs.ecosire.com/odoo-modules/daraz (vendor, search snippet) ; https://open.daraz.com/ (seen, title only)
- [P3] https://asaanretail.freshdesk.com/support/solutions/articles/150000004261-connect-integrate-your-daraz-store (search snippet; 404 on 2026-11-06)
- [P4] https://www.facebook.com/business/help/2347002662267537 (seen 2026-11-05)
- [P5] https://community.shopify.com/t/how-can-i-connect-my-clothing-store-to-instagram-shop-from-pakistan/148709 (seen, dated 2022-09-05)
- [P6] https://www.markaz.app/blog-post/tiktok-shop-for-resellers-in-pakistan-how-to-start (seen, dated 2026-08-14)
- [P7] https://www.dawn.com/news/1961838 (search result)
- [P8] https://support.google.com/merchants/answer/160637 (seen 2026-11-05)
- [P9] https://ppc.land/google-gains-14-shopping-ad-markets-but-bans-medicine-ads-across-all-14/ (seen, dated 2026-07-20)
- [P10] https://profit.pakistantoday.com.pk/2026/04/26/fbr-expands-pos-network-nearly-36000-retail-and-restaurant-outlets-now-linked ; https://customstoday.media/fbr-to-impose-heavy-fines-on-large-retailers-for-issuing-non-certified-receipts/ (search results)
- [P11] https://www.daraz.pk/shop/sapphire-official (search result, 2022 page)
- Gul Ahmed app: https://apps.apple.com/tn/app/gulahmed-ideas/id6803043683 (seen) ; https://play.google.com/store/apps/details?id=co.median.android.zelrkb (no content returned)
- [M4] https://docs.medusajs.com/resources/recipes/omnichannel/marketplaces.md ; https://docs.medusajs.com/resources/recipes/omnichannel.md
- [M5] https://docs.medusajs.com/resources/recipes/pos.md
- [M6] https://medusajs.com/blog/agilo-starter-pos/ ; https://github.com/Agilo/medusa-pos-starter (not reachable)
- [M7] https://docs.medusajs.com/resources/storefront-development/guides/react-native-expo.md
- [M8] https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-feed.md
- [M9] https://registry.npmjs.org/medusa-pos-plugin (seen 2026-11-06)
- [M10] https://docs.medusajs.com/user-guide/settings/locations-and-shipping/locations (search result) ; https://docs.medusajs.com/resources/commerce-modules/sales-channel.md
- Package docs: node_modules/@medusajs/{sales-channel,api-key,stock-location,inventory,fulfillment,draft-order}/AGENTS.md
- Shop homepages (2026-11-05): the 18 shops in the brief; product pages: outfitters.com.pk, www.breakout.com.pk (200), six others 429
