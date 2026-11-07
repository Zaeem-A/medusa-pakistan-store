# Discounts and gift cards

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers discount codes, automatic deals (buy X get Y, minimum spend, tiers, free shipping), scheduled sales with strike-through prices, badges and countdowns, and gift cards. Medusa 2.22.2 already does most of it: the Promotion Module handles codes and automatic deals, price lists handle scheduled collection sales, the starter shows sale prices, and gift cards come from the official, free, MIT-licensed `@medusajs/loyalty-plugin`. Launch with codes and price-list sales, then fix the gaps: no percent-off-a-collection tool, a stale search index when a sale starts, no sale badge on cards, no countdown, no admin UI for tiered or minimum-spend deals, and no Cash on Delivery safeguards on gift cards. Gift cards should wait until later.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Amount off products, collections or order (percent or fixed), by code or automatic | Native | Up to 25 active automatic discounts per store | help.shopify.com discount-types, discount-combinations |
| Minimum spend or quantity, customer or segment eligibility, total and once-per-customer limits, start and end dates | Native | Dates follow the store's time zone | help.shopify.com percentage-fixed-amount |
| Buy X get Y | Native | Code or automatic | help.shopify.com discount-types |
| Free shipping discount | Native | One shipping code per order | help.shopify.com discount-combinations |
| Combining discounts | Native, by class (product, order, shipping) | Up to 5 product or order codes plus 1 shipping code per order. Stacking on the same line needs Plus | help.shopify.com discount-combinations |
| Tiered spend deals (bigger cart, bigger cut) | App | Vendor says, 2026-11-06: Discount Max (free for 2 campaigns and 2 tiers, Pro $5.99/month), Discounter Pro (from $7.99/month), Tierly (free) | help.shopify.com discount-types, apps.shopify.com |
| Custom discount logic | Functions app | Only Plus can build its own custom discount app | help.shopify.com/en/manual/discounts |
| Sale price with compare-at price, badge and strike-through | Native field; the theme draws the badge | No native schedule for price changes. A product shows no sale on collection pages if its variants' compare-at prices differ | help.shopify.com sale-pricing |
| Scheduled sales, price changes and theme swaps | Launchpad app | Plus only (vendor says) | shopify.com/launchpad |
| Countdown timer bar | App | Vendor says, 2026-11-05: Hextom (free, paid $9.99/month), Essential Countdown Timer Bar (free to 1,000 views, from $6.99/month) | apps.shopify.com |
| Gift cards: products, admin-issued cards, emailed codes, recipients, expiry | Native | All plans. A bought card is issued when its order is fulfilled. Caps: $10,000 for products, $2,000 for admin-issued cards. Stores created from 12 May 2025 pay third-party fees on amounts paid by gift card (vendor says) | help.shopify.com gift-card-products/overview |

## What real shops do
Seen on 2026-11-05 from homepage copies saved by our scan, plus one sale-collection JSON per shop (`/collections/<handle>/products.json`). The saved copies are gone now. The JSON requests got HTTP 429 at Beechtree, Bonanza, Gul Ahmed, Junaid Jamshed, Limelight, Maria B, Zellbury, Ethnc, Allbirds and Kylie, and I did not retry. Sapphire's PK store runs on Salesforce Commerce Cloud (report 03), so I left it out.

Pakistan:
- Outfitters: the menu offers flat 50% and 30% special-price sections and a 60%-plus section. Cards show the regular price struck through, the sale price and a -50% badge (PKR 7,490 to 3,690). In the sale-collection JSON, all 8 products had a compare-at price. The real cuts were 50.1 to 51.2%, and every price was a whole rupee ending in 0. So "flat 50%" is a set of rounded prices typed in per product, not a computed percentage.
- Breakout: the same pattern, PKR 3,599 to 1,799 with a -50% badge.
- Gul Ahmed: cards carry -30%, -40% and -50% badges (65 at -40%). 22 cards showed a -0% badge, so the badge template does not hide a zero discount. Each category has its own sale collection (unstitched, bed sheets, fragrances).
- Beechtree: a menu that groups sale items by discount (50% off, 40% off, flat price) and a separate sale collection per line, including a flat-price collection.
- Bonanza Satrangi: a season sale collection and a PKR 2,990 limited-offer collection, where everything sells at one fixed price. Embedded product data showed an exact 20% cut (PKR 5,290 to 4,232). Countdown code is present but no timer was visible.
- Junaid Jamshed: a visible bar counting down the days, hours, minutes and seconds until the sale ends, plus -50% badges.
- Zellbury: no sale. Merchandising badges (Going Fast, Best Seller) and free delivery when you buy 4 items. Nishat Linen: PKR 150 shipping and free shipping on prepaid orders.
- Gift cards: I found no Pakistani shop that sells its own gift card online. Beechtree, Ethnc and Gul Ahmed only carry Shopify's built-in theme code for a gift-card recipient form. Searches found no gift card page for Outfitters, Limelight or Gul Ahmed. Gul Ahmed runs a loyalty scheme keyed to the phone number instead. Multi-brand e-gift platforms such as GiftKarte exist (12-month validity, vendor says).
- Sale terms: many Pakistani shops exclude sale items from exchange or refund (Hushpuppies, Elan, Lulusar and others in search results). That decision belongs to report 12.

Global:
- Fashion Nova: a 75% off sale banner, countdown timer markup, and links to a gift card product and a balance-check page.
- Gymshark: 15% off for email sign-up, an extra 12% for students, $10 for a referral, and free shipping over a threshold. Its cart says gift card codes go in at checkout.
- Brooklinen: free shipping on orders of $100 or more, E-Gift Card and balance links, and a store-credit gift card product. MVMT: free shipping over $75. Allbirds: a cart bar that counts up to free shipping.
- Kylie: a gift card balance link and countdown markup, with no timer visible.

Which marker counts held up (README: sale badge 9/5, gift cards 6/5, countdown 2/5):
- Sale badge: held up for Pakistan (Outfitters, Gul Ahmed, Breakout, Junaid Jamshed, and Beechtree's menu).
- Countdown: one visible Pakistani timer (Junaid Jamshed). Elsewhere the markers were code only.
- Gift cards: failed for Pakistan, with 0 confirmed. Held up for 4 global shops; Allbirds was a false hit (legal text only).

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Codes and automatic promotions: percent or fixed, on order, items or shipping. Allocation each, across or once. `limit` on total uses | Built in | `@medusajs/promotion/AGENTS.md`. Admin: Promotions, with templates for amount or percent off products or order, buy-get and free shipping (`dashboard/src/routes/promotions/.../templates.ts`) |
| Rules: customer group, region, country, sales channel, currency. Target rules: product, category, collection, type, tag (in, eq, ne) | Built in | `medusa/dist/api/admin/promotions/utils/rule-attributes-map.js` |
| Buy X get Y | Built in | `type: buyget`, admin template |
| Minimum spend (`item_subtotal`, `subtotal`, `item_total`, `total` with gte, gt, lt, lte) | Partial | API or workflow only; the admin has no field for it (docs: promotion/concepts) |
| Tiered spend | Missing | No tier model. It can be faked with several automatic promotions bounded by gte and lt (unverified) |
| Combining and exclusions | Partial | All valid codes and all automatic promotions stack, with buy-get applied first. No combination settings. A product's `discountable` flag and tag target rules can exclude items. The `setPromotionContext` hook adds custom context (`core-flows/.../update-cart-promotions.js`) |
| Scheduled promotions with budgets (spend, usage, per customer) | Built in | Campaigns with `starts_at`/`ends_at` and budgets. Admin: Campaigns. Guest carts get a customer by email (`create-carts.js`), so per-customer limits key on email |
| Sale and override price lists, dated, with customer-group rules | Built in | `@medusajs/pricing/AGENTS.md`. A sale price is used only if it is lower. Admin: Price Lists lets you pick products and type a price per variant; I saw no percent-off tool. The price-list workflows have no hooks |
| Sale price on the product page | Built in | `products/components/product-price` shows the sale price, the original struck through and -X%, but only for `sale` lists |
| Sale price on cards (home, collection, category pages) | Partial | `product-preview/price.tsx` shows a strike-through, with no % badge |
| Sale price on the /store search page | Partial | `store-hits/price.tsx` shows a strike-through only for single-price products, plus an on-sale filter. The index does not update when a price list changes, starts or ends (TODOs in `apps/backend/src/search/product.ts`). Product pages cache for 60 s |
| Automatic promotion shown before the cart | Missing | Promotions show only in the cart (`line-item-price`, Discount row). There is no store route that lists promotions |
| Code entry in cart and checkout, several codes | Built in | `checkout/components/discount-code` |
| Free shipping over a threshold | Built in | Free-shipping promotion template, or a shipping-option price rule on `item_total`. A free-shipping nudge is in the main layout (report 04) |
| Countdown timer | Missing | Not in the storefront |
| Whole-rupee totals | Risk | PKR has 0 decimal digits in Medusa's currency defaults, but the percent-promotion maths does no rounding (`utils/dist/totals/promotion`). 30% off PKR 2,995 gives a total with half a rupee (seen in code, not run) |
| Gift cards and store credit | Built in via plugin, not installed | `@medusajs/loyalty-plugin` (MIT, official). Cloud-only until it was open-sourced for v2.14 (blog 2026-04-28). Version 2.22.2 was published 2026-10-30 with exact 2.22.2 peer dependencies. No Cloud or paid plan needed. It adds admin pages (Gift Cards, Gift Card Products, Store Credits) and store routes `/store/carts/:id/gift-cards` and `/store/gift-cards/:code`. Core has only `is_giftcard` and `gift_card_total` |
| Gift card UI in the starter | Missing | `applyGiftCard` in `lib/data/cart.ts` is commented-out v1 code. The payment step checks a `gift_cards` field that v2 carts lack. The order summary labels `gift_card_total` as "Discount" |

What I found reading the 2.22.2 plugin code (not run):
- Its `order.placed` subscriber creates a live code for each gift card unit, with no payment check. With COD, the card can be spent before the cash is collected. Shopify waits for fulfilment.
- Nothing sends the code to anyone.
- No handler restores a balance when an order is cancelled.
- Refunds to store credit fail for guests.
- It takes the only handler slot on `completeCartWorkflow` `orderCreated` and `beforePaymentAuthorization`, and on two more hooks. Report 01 needs `validate`, which is still free.
- A cart whose total is fully covered by credit completes without a payment session (`validate-cart-payments.js`).

## What we would build
1. Percent-off sale tool (M). An admin route and form: pick a collection, category or tag, a percent, a rounding rule (for example, end in 0 or 90) and dates. It computes whole-rupee prices per variant and creates a `sale` price list (`createPriceListsWorkflow`, `batchPriceListPricesWorkflow`). It also tags the products "sale". Risk: large collections, and edits that overlap other lists.
2. Search index freshness (S to M). Reindex affected products after price-list changes, through the sale tool or a middleware on `/admin/price-lists`, plus a scheduled job every few minutes that reindexes lists crossing their start or end time. Depends on report 06's search setup.
3. Sale badges (S). Add -X% to cards and search hits, show a "from" price for variant ranges, hide 0%, and treat `override` lists consistently.
4. Minimum-spend and tiered deals (S as a script, M with an admin form). Automatic promotions on `item_subtotal` with bounded bands, created through the Admin API or a small admin route. Add a cart nudge ("spend PKR X more"). Test that two rules on one attribute work.
5. Combination rules (S). Use a tag target rule (ne "sale") so codes skip sale items. Add a `validate`-hook check if the owner wants a one-code limit.
6. Countdown and sale bar (S). A store API route returns the active sale's `ends_at` (read with Query from the price list or campaign). A client timer runs in the announcement bar (report 13).
7. Whole-rupee rounding (S to M). Prefer price lists over percent promotions for big sales. For percent codes, round adjustments in a custom step or check totals before completion. Unverified whether core rounds later.
8. Gift cards (M). Install the loyalty plugin at exactly 2.22.2. Build a product page with denominations, code entry at checkout, and a balance page. Safeguards:
   - sell cards only with online payment (report 03) via the `validate` hook, or issue them by hand after delivery;
   - a subscriber on `order.canceled` that credits the balance back;
   - deliver codes by WhatsApp or SMS (report 10).

   Risks: hook slots, the plugin's update bug (its AGENTS.md), and fraud.

## Recommendation
- Launch:
  - discount codes, free shipping over a threshold, and buy X get Y: built in, with admin UI and storefront;
  - sales through price lists: matches the rounded "flat X%" prices Pakistani shops use;
  - sale badges, item 3: shoppers judge a sale by its badge;
  - search reindex, item 2: otherwise /store shows stale prices for the whole sale.
- Soon after launch:
  - percent-off sale tool, item 1: typing prices per variant is slow at Eid and season end;
  - countdown, item 6: one Pakistani leader uses it;
  - minimum-spend and tiered deals, item 4: a cheap way to raise COD order value;
  - sale-item exclusion, item 5;
  - rounding guard, item 7: COD riders collect whole rupees.
- Later:
  - gift cards and store credit, item 8: no Pakistani shop sells them online, the COD fraud risk is real, and no channel exists to deliver the code.
- Skip:
  - showing automatic promotions on product pages: price lists already cover it;
  - Launchpad-style theme swaps: not needed at this size.

## Questions for the owner
1. For "flat X%" sales, may prices be rounded to a set ending (for example, PKR 3,690), even if the cut ends up near X% rather than exact?
2. Should discount codes work on items that are already on sale?
3. Do you want gift cards in year one? If yes, should they be sold only with online payment, or under COD with the code sent after delivery?

## Sources
- node_modules/@medusajs/{promotion,pricing,cart,core-flows,dashboard,medusa,utils}/ (AGENTS.md and dist); apps/storefront/src; apps/backend/src/search/product.ts
- https://registry.npmjs.org/@medusajs/loyalty-plugin (2.22.2 tarball read)
- https://docs.medusajs.com/resources/commerce-modules/loyalty.md , /loyalty/gift-cards.md , /loyalty/module-options.md
- https://docs.medusajs.com/user-guide/loyalty/gift-card-products.md
- https://docs.medusajs.com/resources/commerce-modules/promotion/concepts.md , /pricing/price-calculation.md
- https://medusajs.com/blog/announcing-the-loyalty-plugin-for-medusa
- https://help.shopify.com/en/manual/discounts , /discounts/discount-types , /discounts/discount-combinations , /discounts/discount-methods/automatic-discounts , /discounts/discount-types/percentage-fixed-amount
- https://help.shopify.com/en/manual/products/details/product-pricing/sale-pricing , /products/gift-card-products/overview
- https://www.shopify.com/launchpad
- https://apps.shopify.com/event-promotion-bar , /essential-countdown-timer , /discounts-app-2 , /super-discounter , /tiered-discount
- https://outfitters.com.pk/collections/men-sweatshirt-sale/products.json ; saved homepages of the 18 shops (2026-11-05)
- https://gulahmedshop.com/ideas-rewards-faqs ; https://giftkarte.com/faq
- https://www.hushpuppies.com.pk/pages/returns-exchanges ; https://elan.pk/pages/exchange-refund-and-cancellation ; https://www.lulusar.com/pages/delivery-returns
