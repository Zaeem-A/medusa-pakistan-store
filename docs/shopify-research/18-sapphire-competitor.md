# Sapphire as a competitor

Researched 2026-11-07 against Medusa 2.22.2. Sapphire runs on Salesforce Commerce Cloud, not Shopify.

## Summary
Sapphire does three things well: a deep, well-tagged catalog with filters by fabric, piece count, cut and season; a size chart for each cut; and plain delivery, COD and exchange rules in its FAQ. Worth copying: one product per colour, attribute filters, per-cut size charts, metres per piece on unstitched suits, a free-delivery threshold, and phone orders entered by staff. Skip the Salesforce extras (personal recommendations, Salesforce web chat, a login-only wishlist), and do better than Sapphire by showing delivery and COD notes on the product page.

## How the site is built
All seen on 2026-11-07 unless marked otherwise.
- Platform, seen. Salesforce Commerce Cloud (SFCC) cookies `dwsid`, `dwanonymous_*` and `dwac_*` (carrying PKR and Asia/Karachi), header `x-dw-request-base-id`, `.isml` template comments, and controllers under `/on/demandware.store/Sites-Sapphire-Site/default/` (Cart-AddProduct, Product-Variation, Search-UpdateGrid, Wishlist-AddProduct). Cloudflare sits in front. www.sapphireonline.pk is nginx answering 301 to the pk host.
- The Shopify traces that fooled the first scan: 98 homepage references to cdn.shopify.com are banner images in an old Shopify Files bucket. Icon classes named `t4s-` look like leftovers from a Shopify theme (inference).
- Product URLs copy Shopify's shape: `/collections/<category>/products/<SKU>.html`. The sitemap has 614 URLs (categories, pages, blog posts) and no products, which is why earlier scans found no product pages.
- SFCC built-ins, each seen in page code. Calling them built-in is my inference from Salesforce naming.
  - Einstein (CQuotient) tracks product, category and search views. A product-page recommendation slot loads by script (`CQRecomm-Start`) and can also call Salesforce Data Cloud.
  - Page Designer components (`experience-component`) build the homepage rails, tiles and carousels.
  - Also: sorting rules (`srule=top-sellers`), search suggestions, the image resize service (`/dw/image/v2/...?sw=1000`), the store locator and tracking consent.
  - Salesforce Embedded Messaging (Service Cloud web chat) is injected from a template. Whether shoppers see a chat button is unverified.
- Third-party tools:
  - Google Tag Manager and Microsoft Clarity: seen, confirming report 14. A script that stops duplicate GA4 purchase events: seen.
  - A Meta pixel ID and a `Capi-Send` route: seen. That the route sends Meta Conversions API events is inferred from its name.
  - D·engage: the newsletter posts to a `Dengage-Subscriber` route (seen), and D·engage documents an SFCC cartridge (vendor says).
  - Baadmay: modal, stylesheet and fee endpoint seen. Baadmay lists SFCC as an integration (vendor says, report 03).
  - PhotoSwipe lightbox for zoom: seen. Bank Alfalah card gateway and Safepay: named on Sapphire's payment pages (Sapphire says).
  - No review app, WhatsApp widget, push or SMS tool seen.

## What Sapphire offers shoppers

### Navigation and search
- Mega menu (homepage, seen): New In, Ready to Wear, Unstitched, WEST, Modest Wear, Accessories, Special Offers, The Edit, Catalogue, and a separate Fragrances tree. Ready to Wear splits by collection, type (casual to formal) and product. Unstitched splits by concept (Sukoon, Andaaz, Raunak) and by piece (1, 2 or 3 piece).
- The sitemap lists about 520 category pages: price bands (under Rs 2,000, 3,000, 5,000), colour and fabric pages, occasions (mehndi, barat, walima, dholki), flat-percent sale pages and gifting guides.
- Category page (/collections/ready-to-wear, seen): 12 products, a load-more button and a total (1,665). Sorts: recommended, best sellers, price both ways, newest, oldest. Filters with counts: price in Rs 2,000 bands, availability (1,573 in stock, 92 out), colour, about 30 fabrics, piece, type (embroidered, printed, solid), shirt cut, bottom cut, size, season. Popular-search quick links sit at the top, and SEO text and an FAQ sit under the grid.
- Tiles show a new-in or percent-off badge, a hover image, sizes on hover, quick view, a mobile quick-add button and a wishlist heart. Live stock comes from a separate call.
- Search is a GET form to /search?q= in a modal. It takes keywords or item numbers and suggests as you type. robots.txt disallows /search, so I did not open results.
- Removed products answer 302 to their category. Two WEST products linked from the homepage did this.

### Product page
Seen on a ready-to-wear shirt (3PCCRSV9138S_999) and an unstitched 3-piece suit (U3PESG26V928).
- One product per colour. Size (XS to XL) is the only variant. Colour and fabric are plain attributes, and colour is a filter. The plus link on a tile goes to the same product, not to other colours.
- An inline size chart for the cut (straight shirt) with an inches and cm switch, plus a fit line, the model's height and size, and a colour disclaimer.
- Unstitched: no size option. The description lists each piece with fabric, colour and length (shirt front 1.15m, sleeves 0.66m, dupatta 2.5m, trouser 2.5m). Stitched and unstitched are separate menus and product structures.
- Stock: the markup has a stock label per size that script fills in. I saw no sold-out size, so its look is unverified. Out-of-stock items offer an email alert.
- Images: 4 photos with PhotoSwipe zoom and full screen. No video.
- Sale tiles show a percent badge and the old price struck through. Prices are exact percentages, not rounded: Rs 12,990 at 35% off shows Rs 8,444 (/collections/sale, 972 products).
- Complete the look: the matching shalwar and dupatta, each with a size picker, a running total, one button that adds the whole look, and a share link.
- Also an Einstein recommendation slot, a Baadmay instalment line, and a hidden pre-sale block with a countdown that locks add to bag until it ends.
- Missing: reviews, a delivery estimate, and any COD or exchange note (tiles carry an empty, hidden delivery field). There is no Product JSON-LD, which our starter already has (report 14).

### Cart, checkout and payment
From the FAQ, payments and Safepay pages. I did not add anything to the cart.
- Guest checkout is allowed: contact and shipping, then payment, then an email confirmation.
- Payment: COD nationwide. Visa and Mastercard by redirect to Bank Alfalah's 3-D Secure gateway. Safepay payment from a bank account with a bank OTP (local orders, 15 banks listed). Baadmay pay-in-3, promoted site-wide with a popup that reads "Pay for your purchase, thora abhi, baqi?" No JazzCash or Easypaisa is named.
- COD needs no billing address and takes cash only. One field takes both codes and gift cards. Codes are tied to the issuing email, and any remainder is paid by COD or card.
- The cart does not hold stock. Shoppers can also order by phone on the UAN line with the SKU and size.

### Delivery and COD
From the FAQ, seen 2026-11-07.
- Free delivery from Rs 8,000, else Rs 249. Sale items never get free delivery.
- 5 to 7 working days, or up to 15 in a sale. Processed within 24 hours, sometimes in several parcels.
- Couriers: FastEx, Call Courier and QWQER at home, DHL abroad, and Leopards for return drop-off (report 12). Two delivery attempts, then the parcel goes back.
- Large COD orders may get a verification call before dispatch. Changes are by phone only, within 24 hours and before dispatch.
- A rider warning: pay only the invoice amount and refuse opened parcels. Tracking is by CN on the track page (report 02), with the ID sent by email.

### Returns and exchanges
Report 12 still holds. The FAQ adds in-store exchange of online orders, 7 to 10 days for online exchanges, and no charge. A cheaper replacement leaves an online-only voucher, and a dearer one is paid in cash on delivery. Cancelling within 24 hours gets a voucher. Cash refunds come only when items are unavailable (up to 15 working days).

### Accounts, loyalty and gift cards
- Email accounts with saved addresses, order history and exchange requests (FAQ). Login is at /login (robots-disallowed), so report 11's 404 on /account/login was just the wrong path.
- A two-factor code by email or phone is on for registration and off for login (hidden homepage settings, seen).
- Wishlist hearts send guests to login (seen). No loyalty or points programme on the site or in search.
- Gift cards: the PK checkout field accepts them, but search found terms only for the UK and global sites. No PK gift card product seen (unverified).

### Messaging and support
- A support email, two Lahore numbers including a UAN, and a contact form (footer, /contact-us). The Salesforce web chat code is present. No WhatsApp link or number on any page I read or in search.
- Email carries confirmations, shipping, vouchers, promotions and back-in-stock alerts (FAQ). The newsletter goes to D·engage. Social links go to Facebook, Instagram, TikTok and YouTube.

### International
Report 15 still holds. Seen: the country menu (USD, AED, GBP) and a geo pop-up offering the global site. The FAQ allows worldwide shipping except fragrances, with no shipping to India, Iran, Israel, Syria or Cuba.

### Stores and other channels
- /stores lists 48 stores by city with Google Maps links, though some postcodes show as null or 0 (seen). There is no store pickup yet (FAQ).
- Daraz: daraz.pk/shop/sapphire-official still appears in search with 2022 content, so its 2026 status is unverified. No app link on the homepage. An old iOS listing, Sapphire AR, by Sapphire Retail shows in search (unverified).

## What we would copy
| Feature | What Sapphire does | Where it sits in our plan (report number, size) | New work not covered by any report (if any) |
| --- | --- | --- | --- |
| One product per colour | Size is the only variant; colour is an attribute and a filter | Decision in 07 question 1; swatches 07 item 2 (S); siblings 07 item 8 (M) | None |
| Size chart per cut | Inline chart per shirt cut, inches and cm | 07 item 1 (M) | Inches and cm switch, inside the M |
| Unstitched piece list | Fabric, colour and metres per piece | 07: stitched and unstitched as type and tags (no code) | Piece list and model size in product metadata, shown as a table (S, my estimate) |
| Attribute filters, load more, count | Fabric, piece, type, cut, season, size, colour, price, stock | 06 item 3 (M) | Agree the attribute list and tag every product (data work) |
| Best-seller sort; menu by piece and type | SFCC sorting rule; 1, 2 and 3 piece menus | 06 item 7 (S); 06 item 8 (S) | None |
| Price-band and occasion pages | Under Rs 2,000; mehndi, barat | 06 item 5 (M), or plain categories (no code) | None |
| Category SEO text and FAQ | Copy and an FAQ under the grid | 14 item 2 (S); 13 item 2 (M) | None |
| Sale badge and struck price | Percent badge, old price struck | 05 item 3 (S) | None |
| Complete the look, add all | A size picker per item, a total, one button | 09 item 2 (S) and item 4 (S to M) | None |
| Zoom, sold-out sizes, alerts | PhotoSwipe; stock label per size; email alert | 07 item 4 (S), item 3 (S), item 7 (M) | None |
| Quick view and quick add | On every tile | 07 item 6 (S to M) | None |
| Free-delivery threshold | Rs 8,000, else Rs 249; never for sale items | 04 item 4 (S) | Excluding sale items needs the `setShippingOptionsContext` hook report 04 names (S, my estimate) |
| Delivery, COD and exchange rules | Days, fees, attempts, rider warning | 13 item 2 (M); 08 item 9 trust strip (S) | None |
| Phone orders | Call with SKU and size | Draft orders built in (16); phone rule 16 item 10 (S) | None |
| Verify large COD orders | A call only above some value | 01 item 1 (M); COD cap 01 item 8 (S) | None |
| Vouchers, not cash | For cancellations and cheaper exchanges | 12 item 7 (S to M) | None |
| Card, bank-account, pay in 3 | Bank Alfalah, Safepay, Baadmay | 03 item 1 (M); 03 item 3 (M) | None |
| Track page; store locator | CN lookup; 48 stores by city | 02 item 1 (S); 13 item 3 (S) | None |
| Creator looks carousel | Hand-picked creator posts linking to products | 08 item 8, curated (S) | None |
| Pre-sale lock | Countdown; add to bag blocked until it ends | 05 item 6 countdown (S) | Refuse add to cart before a start time in product metadata via `addToCartWorkflow.hooks.validate` (seen in installed core-flows 2.22.2; no report uses that hook yet) (S, my estimate) |
| Server-side Meta events | `Capi-Send` route | 14 item 6 (M) | None |

## Recommendation
- **Launch:**
  - One product per colour. It is the simplest model and answers report 07's question.
  - Size chart per cut (07). Wrong sizes cause COD refusals.
  - Attribute tags and filters, starting with fabric, piece count and size (06). Shoppers browse by fabric, and tags are cheap to add at loading but costly later.
  - Piece list on unstitched products. Tailors need the metres, and it is only metadata.
  - Free-delivery threshold and a flat fee (04). This is admin setup, stated plainly as Sapphire does.
  - Delivery days, COD and exchange notes on the product page (08 trust strip). Sapphire buries them in the FAQ, and a new store needs them in view.
  - Phone orders as draft orders, which are built in. Complete the look (09), sale badges (05), zoom and sold-out sizes (07) and the track page (02) are already in the README's launch lists.
- **Soon after launch:**
  - Back-in-stock alerts by WhatsApp, not email only (07, 10). Buyers read WhatsApp.
  - Quick add and the best-seller sort (07, 06). Best sellers needs order history.
  - A card gateway, plus Safepay's bank-account option if Safepay approves us (03). Sapphire offers both.
  - Category SEO text (14), once categories are stable. Exchange and cancellation vouchers (12), which match local practice.
- **Later:**
  - Pre-sale lock, which matters only for hyped drops.
  - Baadmay (03), because of the customer fee and harder refunds.
  - Rule-based price-band and occasion pages (06). Plain categories cover the first few.
  - The creator carousel and lookbooks (08, 13), which need steady content work. Gift cards (05), since even Sapphire shows no PK gift card product.
- **Skip:**
  - Personal recommendations. There is no data at launch, and report 09 skips them.
  - Salesforce web chat. Use a WhatsApp link instead (13).
  - A login-only wishlist, because report 11's guest wishlist is better. An email code at registration, because phone code login (11) fits better.
  - Hundreds of colour and fabric landing pages, which filters cover. 302s for removed products: use permanent redirects instead (14 item 4).

Changes Sapphire suggests for the README's launch order:
1. Add agreeing the catalog attributes (fabric, piece count, cut, season, colour) to Before the first real order, and tag products as they load. The launch filters depend on it.
2. Sapphire calls only on large COD orders, while the README calls on every order before launch. Keep calling every order for a new store, but add a value threshold the owner can set later.
3. Sapphire's exact-percent sale prices (Rs 8,444) show rounding is not essential. That supports keeping report 05's rounding sale tool soon after launch.
4. Correction to the scan table: Sapphire, which is not on Shopify, does name its couriers (FastEx, Call Courier, QWQER) in its FAQ.

## Questions for the owner
1. Confirm every COD order by phone, or only orders above a value, as Sapphire does?
2. Which attributes will every product carry for filters: fabric, piece count, shirt cut, bottom cut, season?
3. Does free delivery apply to sale items? Sapphire excludes them.

## Sources
Fetched 2026-11-07 with a generic browser User-Agent and at least 6 seconds between requests. There were 18 Sapphire requests and no 403, 429 or challenge.
- pk.sapphireonline.pk: /robots.txt, /sitemap_1.xml and / (all 200). https://www.sapphireonline.pk/ (301 to the pk host).
- Category pages: /collections/ready-to-wear and /collections/sale (200). /collections/stitched-for-you-24 (301 to ready-to-wear). /collections/bundles (301 to the homepage).
- Product pages: /collections/ready-to-wear/products/3PCCRSV9138S_999.html and /collections/unstitched/products/U3PESG26V928.html (200). /collections/sale/products/PRW2SCSTV839_999.html (302 to /search, not followed). /collections/western-wear/products/WTOP26V60030_999.html and WTOPV0826043_999.html (302 to the category).
- Info pages: /pages/faqs.html, /pages/payments.html, /pages/safepay-guide.html, /contact-us and /stores (all 200).
- Search results only, not fetched: https://sapphire-online.com/pages/sapphire-gift-card-terms-and-conditions.html , https://uk.sapphire-online.com/pages/sapphire-gift-card-terms-and-conditions , https://www.daraz.pk/shop/sapphire-official , https://dev.dengage.com/docs/salesforce , https://apps.apple.com/ar/app/sapphire-ar/id1351496447
- Medusa: node_modules/@medusajs/core-flows/dist/cart/workflows/add-to-cart.d.ts (2.22.2) and node_modules/@medusajs/core-flows/AGENTS.md (one handler per hook).
