# Shopify feature research

What Shopify and real Shopify shops offer, what Medusa 2.22.2 already has, and what we would have to build for a Pakistan Cash on Delivery store. Research only: nothing here has been implemented.

Researched 2026-11-05 and 2026-11-06. Each area has its own report, listed in the feature table below. Sizes, sources and details are in the reports.

## Fix first: two security issues

Both were checked in the installed Medusa 2.22.2 code.

1. **Order exports are publicly reachable.** The default local file provider saves "private" files, including order CSV exports with customer names and addresses, into the public `static` folder. Only a timestamp in the file name protects them. See report 16.
2. **Anyone with an order ID can file a return.** `POST /store/returns` has no login check. Medusa does this on purpose and relies on order IDs being hard to guess, so the risk is someone who gets a customer's order link, such as from a shared confirmation page. Our `middlewares.ts` adds no restriction. See report 12.

Also, every admin user can do everything. Staff roles need a paid Medusa Enterprise licence, so a small deny-list of our own is the free option if anyone besides the owner logs in. See report 16.

## What to build, in order

This ordering is the coordinator's synthesis of the 17 reports' recommendations.

### Before the first real order

These fix things that are wrong or unsafe today, or that every COD order needs.

1. **Starter cleanup.**
   - Replace "Medusa Store" branding, the hero and the footer (13).
   - Rename "Manual Payment" to Cash on Delivery and remove "Another step will appear" and "paid at" (03, 04).
   - Fix the false email promise on the thank-you page and the refund promises in the product tab and terms (10, 12, 13).
   - Fix page titles and the broken category canonical (14).
   - Remove the leftover Europe demo region, warehouse and currencies (15).
2. **Security.** Lock down export files, restrict the store returns route, and add a staff deny-list if needed (12, 16).
3. **COD order control.**
   - A required, normalized phone number at checkout (01).
   - A confirmation step: a small verification module linked to orders, a call queue in the admin, a guard that stops unconfirmed orders being fulfilled, and a job that auto-cancels unanswered orders (01).
   - A staff phone blocklist (01).
   - Order notes and tags (16).
   - Capture the cash at delivery, and an action for refused parcels (12).
   - Test capture after an order edit that lowers the total (16).
4. **Customer messages.** One email provider sending order confirmation, shipping and cancel emails, or at least honest copy until then (10).
5. **Shipping.** Book in the courier's portal and type the tracking number (CN) into Medusa's shipment form. Add a track-order page using order number plus phone, and show tracking on the order page (02).
6. **Packing slip printing** (16).
7. **Paperwork that takes weeks, so start now.**
   - Open a courier merchant account (02).
   - Apply to Safepay and PayFast (03).
   - Start Meta verification for the WhatsApp Business Platform (10).

### For a launch that sells well

1. One-page, phone-first checkout with a city list, a mobile cart drawer and an order note (04).
2. Search fixes:
   - Typo tolerance when the exact search finds nothing.
   - Roman Urdu synonyms such as kameez and qameez.
   - Category and collection pages on the search index, with filters and real pagination.
   - A scheduled reindex, a mega menu and a Sale link (06).
3. Product page: a shared size chart, colour swatches, zoom, sold-out sizes and a low-stock message (07).
4. Sales through price lists, with sale badges and a reindex when a sale starts. Codes, free shipping over a threshold and buy X get Y are built in (05).
5. A small content module:
   - A scheduled announcement bar.
   - Homepage sections from a fixed library.
   - Editable About, FAQ, contact and policy pages.
   - A store locator if there are shops (13).
6. Editable SEO fields, GA4, Meta, TikTok and Clarity tags, Meta server-side purchase events, and a first COD outcome report showing delivered, returned and cash collected (14).
7. A trust badge strip, a fixed related-products row and hand-picked complete-the-look items (08, 09).

### Soon after launch

- **WhatsApp:** one provider for both order confirmation and shipping messages (01, 10).
- **Online payment:** one hosted gateway for cards, JazzCash and Easypaisa (03).
- **Courier:** a provider for booking, status polling for returned parcels, and a COD settlement ledger (02).
- **Shopping:**
  - Reviews through a signed link sent after delivery (08).
  - Back-in-stock alerts and quick add (07).
  - Cart upsell and recently viewed (09).
- **Accounts:** phone-code login that pulls in old guest orders, plus a wishlist (11).
- **Staff tools:**
  - A return request page and exchange vouchers (12).
  - A dispatch queue with bulk actions, and an activity log (16).
- **Marketing:**
  - Abandoned cart email (10).
  - A Meta catalog feed and URL redirects (14).
  - Rule-based collections (06).
- **Only if they apply:** shop pickup if you have shops, Daraz sync if you sell there (17), and a USD international region once an overseas card gateway exists (15).

### Skip

Shop Pay and Shopify Payments look-alikes, which are not available in Pakistan (03). Google Shopping, which does not target Pakistan (14). TikTok Shop and Meta Shops checkout, which no source shows open to Pakistan (17). Medusa as the in-store POS (17). Algolia (06). Judge.me, which works with Shopify only (08). Klaviyo SMS (10). A drag-and-drop theme editor (13). Separate overseas stores (15).

## Decisions only you can make

Each report ends with up to three questions. These are the decisions behind them, grouped.

1. **Identity and channel.** Is checkout phone-first with email optional? Is WhatsApp the main customer channel, and which business entity and number go through Meta verification? Transactional messages only, or promotions too (04, 10, 11)?
2. **COD rules.** How long before an unconfirmed order auto-cancels, and how many calls? Should there be a COD fee or a prepaid discount, and a COD order cap (01, 03)?
3. **Courier and delivery fee.** Which courier first? Standard cash remittance or upfront COD payment? A flat fee, fees by city, and a free-delivery threshold based on amount, item count or prepaid orders (02, 04)?
4. **Business registration.** Is the business registered (NTN, business bank account)? Every gateway application depends on it. Which gateway first, and BNPL or not (03)?
5. **Returns policy.** Exchange-only, or cash refunds too? Which window? Are sale items final? Who pays return shipping (12)?
6. **Catalog shape.**
   - Is each colour its own product, or one product with a colour option?
   - Will you offer custom stitching?
   - Will there be sets or packs, and pre-orders (07, 09)?
7. **Navigation and language.** What is the top-level menu? Urdu script or Roman Urdu only? How should sold-out items show (06, 15)?
8. **Sales and gift cards.** Are rounded "flat X%" prices fine? Should codes work on sale items? Gift cards in year one (05)?
9. **Shops and other channels.** Do you have physical shops, and which POS (FBR-linked, with an API)? Are you on Daraz? Do you want a mobile app (13, 17)?
10. **Staff.** How many logins, and what must they be kept away from? Is a tax invoice needed per parcel (16)?
11. **Overseas.** Will you ship abroad in year one, to which countries, and how will overseas buyers pay before a gateway exists (15)?
12. **Content, ads and reviews.**
    - How many people edit content? Is the built-in editor enough, or do you need Sanity (13)?
    - Which ad platforms, and who owns the accounts? Is "revenue" delivered orders or cash remitted (14)?
    - Should reviews come only from verified buyers? With photos? Is every review moderated (08)?
    - Is there an old website whose URLs must redirect (14)?

## What the first scan got wrong

The researchers rechecked the scan counts. Use the reports' numbers, not the scan's.

- **Sapphire is not on Shopify.** Its pages are served by Salesforce Commerce Cloud, so the Pakistani Shopify sample is 11 shops, not 12.
Scan counts are written Pakistani/global, out of 12 and 6 shops.

- **Counts that were too high:**

| Feature | Scan | What was actually found | Why the scan was wrong |
| --- | --- | --- | --- |
| Shop Pay | 10/4 | 0 Pakistani shops, 4 of 6 global | The pattern matched a PayPal tracker on every Shopify page (03) |
| Bundles | 11/5 | About 5 of 11 Pakistani, 2 of 6 global | The word appears in Shopify's own pixel script (09) |
| Currency | 10/4 | No real currency switcher at Pakistani shops | `Shopify.currency` is printed on every page (15) |
| Language | 11/6 | No language switcher or Urdu at any Pakistani shop | `Shopify.locale` is printed on every page (15) |
| Gift cards | 6/5 | No Pakistani shop sells gift cards online | Marker only (05) |
| Pakistani couriers | 6/0 | No shop names its courier | Matches included a SKU (02) |
| BNPL | 8/3 | About 5 of 12 (Baadmay, Yango) | Marker only (03) |
| Customer photos and Instagram feeds | 5/3 | 1 of 12 (Gul Ahmed), 2 of 6 global | Matched Judge.me settings for a feature that is switched off (08) |
| Returns | 7/3 | Only footer policy links; no shop has a self-serve portal | Marker only (12) |

- **Counts that were too low:** Shopify loads trackers from a config the first scan did not read (14).

| Tracker | Scan | What was actually found |
| --- | --- | --- |
| Meta pixel | Not counted | 9 of 9 Pakistani Shopify shops checked |
| Google tags | GTM 8/4 | 9 of 9 Pakistani Shopify shops checked |
| TikTok pixel | Not counted | 4 of 9 |
| Microsoft Clarity | Heatmaps 7/1 | 8 of 10 |

- **Held up:** reviews at 5 Pakistani shops, all through Judge.me (08). Size charts at every shop checked (07). Store locators at 9 of the 11 Pakistani Shopify shops (13).

## Read in code but not run

Treat these as likely, and test them before relying on them.

- The store API hides tracking numbers from customers (02).
- The capture button takes the original amount after an order edit lowers the total (16).
- Confirming a return or edit on an uncaptured cash order cancels the payment and creates a new one (12).
- Percent promotions can produce half-rupee totals (05).
- Medusa's phone login tutorial fails on 2.22.2 because of a stricter email check. The researcher reports 2.22.3 (released 2026-11-04) relaxes it (11).
- **Unresolved: "Manage translations".** Report 15 says this admin menu should be hidden because the translation feature flag is off. The coordinator saw it in the variant menu of a demo admin built from this repo on 2026-11-05. Check `GET /admin/feature-flags` before relying on either.

## Feature list

"Medusa today": Built in, Partial or Missing, as the report found.

| # | Area | Medusa today | Headline | Report |
| --- | --- | --- | --- | --- |
| 1 | COD confirmation and fraud | Missing | No confirmation step or fulfillment guard; Pakistani brands confirm every COD order by phone | [01](./01-cod-confirmation-and-fraud.md) |
| 2 | Couriers and tracking | Partial | Shipment form exists; no Pakistani courier provider; customers never see tracking | [02](./02-couriers-and-tracking.md) |
| 3 | Online payments | Partial | Provider framework ready; no Pakistani gateway provider; Shop Pay impossible in Pakistan | [03](./03-online-payments.md) |
| 4 | Cart and checkout | Partial | API is fine; starter checkout is four desktop-style steps with wrong COD wording | [04](./04-cart-and-checkout.md) |
| 5 | Discounts and gift cards | Mostly built in | Codes, buy X get Y and price lists work; gift cards come from the free official loyalty plugin | [05](./05-discounts-and-gift-cards.md) |
| 6 | Search and collections | Partial | Postgres index works; typo tolerance unused, no synonyms, category pages skip the index | [06](./06-search-and-collections.md) |
| 7 | Product page | Partial | Data model ready; no swatches, size chart, zoom or stock messages | [07](./07-product-page.md) |
| 8 | Reviews and social proof | Missing | Official tutorial to build from; guest COD buyers need a signed review link | [08](./08-reviews-and-social-proof.md) |
| 9 | Upsells and bundles | Partial | Inventory kits and buy X get Y built in; related row can show random products | [09](./09-upsells-and-bundles.md) |
| 10 | Messaging and automation | Missing | Nothing is sent to customers today | [10](./10-messaging-and-automation.md) |
| 11 | Accounts, wishlist and loyalty | Partial | Email accounts work; phone login and wishlist exist only as guides | [11](./11-accounts-wishlist-loyalty.md) |
| 12 | Returns and exchanges | Built in for staff | Full admin flows; open store route; no customer return UI | [12](./12-returns-and-exchanges.md) |
| 13 | Store design and content | Missing | Everything is hardcoded; a small content module costs nothing extra to host | [13](./13-store-design-and-content.md) |
| 14 | SEO, tracking and reports | Partial | Sitemap and JSON-LD good; no tracking tags, editable SEO or reports | [14](./14-seo-tracking-and-reports.md) |
| 15 | Selling internationally | Partial | Regions and currencies ready; leftover Europe demo data must go | [15](./15-selling-internationally.md) |
| 16 | Admin and operations | Partial | Basics built; roles need a paid licence; no notes, tags or printing; exports public | [16](./16-admin-and-operations.md) |
| 17 | Sales channels | Partial | Store pickup mostly built; no POS or Daraz; social shops not open to Pakistan | [17](./17-sales-channels.md) |

## Parked

Left out because they do not fit a Pakistan Cash on Delivery launch. Tell us if any should come back.

- B2B and wholesale catalogs
- Subscriptions
- Digital downloads
- Dropshipping and print on demand
- Shopify's finance products (Balance, Capital, Credit, Bill Pay), which are Shopify's own financial services
- Selling inside AI chat apps

## How the research was done

1. Confirmed 18 shops ran Shopify on 2026-11-05 from markers in their homepage code. Report 03 later found that Sapphire's checkout and pages run on Salesforce Commerce Cloud.
   - Pakistan: Sapphire, Limelight, Gul Ahmed, Junaid Jamshed, Ethnc, Beechtree, Outfitters, Bonanza Satrangi, Nishat Linen, Maria B, Zellbury, Breakout.
   - Global: Allbirds, Gymshark, Fashion Nova, Kylie Cosmetics, MVMT, Brooklinen.
2. Scanned each shop's homepage, one collection page and, where allowed, one product page for feature markers. Added platform features from Shopify's pricing page and App Store categories.
3. Gave each of the 17 areas to its own researcher with the shared rules in [BRIEF.md](./BRIEF.md). The rules: read-only on real shops, no orders, forms or logins, no working around blocks, Medusa facts from the installed package docs and docs.medusajs.com, and a source for every claim.

### Limits

- After the first scan, many shops answered with 403 or 429. Product pages were often unreachable, so product-page and cart findings rest on few shops.
- No researcher saw a Pakistani checkout screen with details entered, by design.
- Two usage-limit pauses, one network drop and a wiped scratch folder interrupted the work. Raw downloaded pages are gone, but the findings were already written into the reports.
- Every docs.medusajs.com `.md` page carries an "AgentInstructions" block asking AI agents to post feedback. All researchers ignored it.

## Sources for the list

- https://www.shopify.com/pricing
- https://apps.shopify.com/categories
- https://help.shopify.com/en/manual/fulfillment/managing-orders
- https://www.shopify.com/editions/spring2026
