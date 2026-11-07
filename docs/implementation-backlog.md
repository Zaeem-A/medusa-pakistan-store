# Implementation backlog

What to build in our Medusa store, in order, based on the research in [shopify-research](./shopify-research/README.md). Nothing here is built yet.

Written 2026-11-07 against Medusa 2.22.2.

## How to read this

- **Size** comes from the research reports: S is under 2 days, M is up to 2 weeks, L is more.
- **Needs** lists what must happen first:
  - D1 to D12 are the owner decisions in the research README, under "Decisions only you can make".
  - Item numbers such as 1.2 point to other items in this file.
- **Report** is the research report the item comes from, for example 01 is `shopify-research/01-cod-confirmation-and-fraud.md`.
- Within a phase, items are in a sensible build order.

## Phase 0: Fix what is wrong today

Every item here is S, and only 0.3, 0.7 and 0.9 need anything from the owner first.

| # | Item | How | Size | Needs | Report |
| --- | --- | --- | --- | --- | --- |
| 0.1 | Lock down export files | Order CSV exports land in the public `static` folder. Serve them through an authenticated admin route and deny `/static/private-*`, or move to private S3-compatible storage | S | None | 16 |
| 0.2 | Restrict the store returns route | Middleware on `POST /store/returns`, following the docs' secure return creation guide | S | None | 12 |
| 0.3 | Brand cleanup | Read the store name and contacts from config. Remove "Medusa Store", the starter hero, Medusa links and starter images | S | Store name | 13 |
| 0.4 | COD wording | Rename "Manual Payment" to Cash on Delivery. Remove "Another step will appear" and "paid at". Show "to pay on delivery: Rs X" | S | None | 03, 04 |
| 0.5 | Stop false promises | Remove the order email promise on the thank-you page until emails exist. Replace refund promises with neutral text until the return policy is set | S | None | 10, 12 |
| 0.6 | SEO fixes | Real page titles, no doubled titles, fix the category canonical, add collection canonicals and descriptions | S | 0.3 | 14 |
| 0.7 | Remove the Europe demo data | Delete the Europe region, warehouse, tax regions and extra currencies, then fix hreflang and the sitemap. This deletes data, so it runs only with your go-ahead | S | Your OK, D11 | 15 |
| 0.8 | Fix the related products row | Same category first, then collection. No sold-out items, no random fallback | S | None | 09 |
| 0.9 | Search typo tolerance | Turn on typo tolerance when an exact search finds nothing, with a guard against weak matches | S | None | 06 |
| 0.10 | Test capture after an order edit | Check whether capture takes the original amount after an edit lowers the total. A test, not a feature | S | None | 16 |

## Phase 1: Before the first real order

These are needed to take and deliver COD orders safely.

| # | Item | How | Size | Needs | Report |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Required phone and consent | Required Pakistani mobile number, stored as +923XXXXXXXXX, checked again in the cart `validate` hook. Opt-in checkbox for messages, saved in metadata | S | D1 | 01, 10 |
| 1.2 | COD verification module | `cod-verification` module linked to orders: status, attempts, notes. A subscriber on `order.placed` opens a record. Admin call queue page and order widget | M | D2 | 01 |
| 1.3 | Fulfillment guard | Middleware refuses fulfillment for unconfirmed orders. Shared step so courier booking uses it later | S | 1.2 | 01 |
| 1.4 | Auto-cancel job | Scheduled job cancels orders unconfirmed after N hours, which frees their stock | S | 1.2, D2 | 01 |
| 1.5 | Phone blocklist | Staff-maintained list of numbers refused at checkout | S | 1.1 | 01 |
| 1.6 | Order notes and tags | `order-ops` module with notes and tags linked to orders, shown in the same order widget as 1.2. Checkout order note saved to cart metadata | S to M | None | 16, 04 |
| 1.7 | Phone orders | Staff enter phone and DM orders as draft orders, which are built in. Apply the 1.1 phone rule on draft conversion. Add an Instagram/WhatsApp sales channel so these orders report separately | S | 1.1 | 16, 17, 18 |
| 1.8 | Order emails | One email provider. Order confirmation, shipped and cancelled emails through subscribers | S | D1, a provider account | 10 |
| 1.9 | Password resets | Customer forgot-password pages and staff reset, through the same provider | S | 1.8 | 11, 16 |
| 1.10 | Delivery fee | Flat rate plus a free-delivery threshold, with a cart progress bar. Sale-item exclusion needs a small hook | S | D3 | 04, 18 |
| 1.11 | Tracking for customers | Staff type the courier number (CN) into the shipment form. A track-order page by order number plus phone. Show tracking on the order page. The store API does not seem to return tracking numbers today (read in code, not run) | S | Courier account | 02 |
| 1.12 | Capture at delivery and refused parcels | Staff record the cash when delivered. An admin button receives a refused parcel back into stock | S | None | 12 |
| 1.13 | Returns setup | Return shipping option, apparel return reasons, and policy copy on the product tab, returns page and terms | S | D5 | 12 |
| 1.14 | Packing slip and courier export | Printable slip per order or batch with items, sizes, COD amount, address and phone. CSV in the courier's bulk-booking format | S | D3 | 16 |
| 1.15 | Stock load script | `medusa exec` script for the first stock load by SKU and location | S | Product data | 16 |
| 1.16 | Staff deny-list | Admin middleware that keeps staff logins away from users, API keys, settings and exports | S | D10 | 16 |

## Phase 2: A launch that sells well

| # | Item | How | Size | Needs | Report |
| --- | --- | --- | --- | --- | --- |
| 2.1 | One-page mobile checkout | Phone-first single page for COD, with a city list from the courier | M | 1.1, D3 | 04 |
| 2.2 | Mobile cart drawer | Slide-over cart with quantities, the delivery bar from 1.10 and the order note | S to M | 1.10 | 04 |
| 2.3 | Size charts | `size-chart` module linked to products, many products to one chart, inches and cm. Admin page and product widget. Modal on the product page | M | Size data | 07, 18 |
| 2.4 | Colour model | Swatches from option metadata, or colour siblings across products if each colour is its own product | S, or M with siblings | D6 | 07, 18 |
| 2.5 | Product page details | Sold-out sizes crossed out, a low-stock band, zoom, and a piece list with metres for unstitched suits | S | None | 07, 18 |
| 2.6 | Delivery and COD strip | Delivery days, fee, COD and exchange rules on the product page and in the cart | S | D3, D5 | 08, 18 |
| 2.7 | Category pages with filters | Put category and collection pages on the search index with filters (fabric, piece, size, colour, price, stock) and real pagination past 100 | M | Catalog attributes | 06, 18 |
| 2.8 | Search extras | Roman Urdu synonyms, a nightly and sale-time reindex | S | 0.9 | 06 |
| 2.9 | Mega menu and Sale link | Built from the category tree, with images in category metadata | S | D7 | 06, 13 |
| 2.10 | Sales | Price-list sales, sale badges and a reindex when a sale starts. Codes, buy X get Y and free shipping are built in | S | 2.8 | 05 |
| 2.11 | Complete the look | Hand-picked pairs per product, with an add-all button. Sets and packs as inventory kits | S | None | 09, 18 |
| 2.12 | Content module | Admin-editable announcement bar, homepage sections from a fixed library, About, FAQ, contact and policy pages, WhatsApp contact link | M | 0.3 | 13 |
| 2.13 | Store locator | Shops by city with Maps links, in the content module | S | D9, 2.12 | 13 |
| 2.14 | Editable SEO and JSON-LD | SEO title, description and noindex per product, category and collection through admin widgets. Breadcrumbs and brand in JSON-LD | S | 0.6 | 14 |
| 2.15 | Tracking tags | GA4, Meta, TikTok and Clarity with standard shop events | S to M | D12 | 14 |
| 2.16 | Server-side purchase events | Meta Conversions API, TikTok Events API and GA4 from order subscribers, with delivered and returned outcomes | M | 2.15 | 14 |
| 2.17 | COD outcome report | One row per order tracking placed, confirmed, delivered, returned and cash collected, with an admin page | M to L | 1.2, 1.12 | 14 |
| 2.18 | URL redirects | Only needed at launch if an old site exists | S to M | D12 | 14 |

## Phase 3: Soon after launch

| # | Item | How | Size | Needs | Report |
| --- | --- | --- | --- | --- | --- |
| 3.1 | WhatsApp messages | WhatsApp notification provider for order confirmation buttons and shipping updates, feeding 1.2 | M | Meta verification, D1 | 01, 10, 02 |
| 3.2 | Online payment | One hosted-checkout provider (Safepay or PayFast) for cards and wallets | M | D4, gateway approval | 03 |
| 3.3 | Courier integration | Fulfillment provider for booking, status polling for returns, airway bill printing and a COD settlement ledger | M each | Courier API access | 02 |
| 3.4 | Phone history | Delivered and returned counts per phone, shown on the verification queue | M | 1.2 | 01 |
| 3.5 | Reviews | Review module from the official tutorial, a signed review link sent after delivery, admin moderation, stars on the page | M | D12 | 08 |
| 3.6 | Back-in-stock and quick add | Restock alerts by WhatsApp or email. Quick add drawer on product cards | M | 3.1 or 1.8 | 07 |
| 3.7 | Cart upsell and recently viewed | Add-to-order row from 2.11 picks. Recently viewed kept in the browser | S | 2.11 | 09 |
| 3.8 | Phone login and wishlist | Phone-code login that pulls in past guest orders. Wishlist that works for guests and merges at login | M | 3.1, D1 | 11 |
| 3.9 | Customer returns | Return and exchange request page, exchange vouchers, return messages | M | 1.13, D5 | 12 |
| 3.10 | Staff tools | Dispatch queue with bulk actions, activity log, morning digests in the admin bell | M | 1.6 | 16 |
| 3.11 | Marketing basics | Abandoned cart email, newsletter signup, admin message log | S to M | 1.8 | 10 |
| 3.12 | Catalog growth | Meta catalog feed, rule-based collections, best-seller and sold-out-last sorts, category SEO text | S to M each | 2.7 | 14, 06, 18 |
| 3.13 | Sale tool with rounding | Admin form that builds a price list from a percent with a rounding rule | M | 2.10, D8 | 05 |
| 3.14 | COD fee or prepaid discount | Two shipping options or a promotion, plus an optional COD cap | S | D2, 3.2 | 01 |

## Phase 4: Later, or only if it applies

| Item | Size | When | Report |
| --- | --- | --- | --- |
| Store pickup at our shops | S | If there are shops (D9) | 17 |
| Stock sync with the shop POS | M | If the POS has an API (D9) | 17 |
| Daraz sync | M to L | If selling on Daraz (D9) | 17 |
| USD region, weight-based overseas shipping, duties notice | M | If selling abroad (D11) | 15 |
| Urdu | L | If wanted (D7) | 15 |
| Gift cards and store credit | M | If wanted in year one (D8) | 05, 11 |
| COD refund payout record | M | If cash refunds are allowed (D5) | 12 |
| BNPL (Baadmay) and saved cards | M to L | After 3.2 | 03 |
| Loyalty points and referrals | M to L | Once there is order history | 11 |
| Photo reviews, Q&A, Instagram feed | M | After 3.5 | 08 |
| Custom stitching, pre-orders, pre-sale lock | S to L | If offered (D6) | 07, 18 |
| Product video | S to M | When video exists | 07 |
| Pick-your-own bundles, bought together, add to order after purchase | M to L | Once there is order history | 09, 04 |
| Gift message and wrap | S to M | If wanted | 04 |
| Blog and lookbook | S to M | After 2.12 | 13 |
| Stock transfers and purchase orders | M to L | With more than one location | 16 |
| SMS fallback and campaign sync to an outside tool | S to M | After 3.1 | 10 |
| Reverse pickup through the courier | M to L | Once a courier API supports it | 12 |
| OTP at checkout | M | If fake orders stay high after 1.2 | 01 |
| Consent banner | S | If there is EEA or UK traffic | 14 |
| Mobile app | M to L | If wanted (D9) | 17 |

## Not building

- **Not possible or not open in Pakistan:** Shop Pay, Google Shopping, and TikTok Shop or Meta Shops checkout.
- **Not worth it at our size:** Algolia, Medusa as the in-store POS, a drag-and-drop theme editor, separate overseas stores, and personal recommendations, which need data we will not have at launch.
- **Tools that do not fit:**
  - Judge.me works with Shopify only.
  - Klaviyo SMS does not cover Pakistan.
  - Salesforce web chat; we use a WhatsApp link instead.
- **Practices to avoid:**
  - A wishlist that only works after login.
  - Hundreds of colour and fabric landing pages, which filters cover.

## Not code: start these now

- Open a courier merchant account. 1.11, 1.14 and 3.3 need it.
- Apply to Safepay and PayFast. 3.2 needs it, and approval takes weeks.
- Start Meta verification for the WhatsApp Business Platform. 3.1 needs it.
- Agree the catalog attributes (fabric, piece count, cut, season, colour) and tag products as they are loaded. 2.7 needs it.
- Write the return, delivery and COD policies. 1.13 and 2.6 need them.
- Gather size chart data per cut, and product photos. 2.3 needs them.
