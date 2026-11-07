# Cart and checkout

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers how a shopper gets from "add to cart" to a placed order: cart drawer or page, free delivery nudges, notes and gift options, the address form, the checkout layout and the thank-you page. Medusa's cart and checkout API already does everything a Cash on Delivery order needs, but the starter storefront is a desktop-style, four-step checkout with leftover card-payment wording ("Manual Payment", "Another step will appear", "paid at") and no cart drawer on phones. Replace it with a one-page, phone-first COD form with a city list, fix the wording and add a mobile cart drawer, then build the free delivery bar, order notes and post-purchase offers on features Medusa already has.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Cart as drawer, page or popup | Native theme setting | All plans; Dawn-family "Cart type" setting (search summary of help page) | help.shopify.com theme-settings |
| Cart note (order note) | Native theme setting | All plans, on the cart page. A note field inside checkout needs a checkout UI extension, so Plus only (community answers, unverified) | Dawn page-types help; community thread; shopify.dev checkout-ui-extensions |
| Cart attributes (gift wrap yes/no and similar) | Native API, app UI | Any plan; attributes carry over to the order (search summary of Ajax Cart API docs) | shopify.dev ajax cart |
| Gift wrap and gift message | App | Super Gift Wrap, Wraply, Giftify (seen in App Store results, prices not checked) | apps.shopify.com |
| Free shipping over an amount | Native | Order-amount shipping rates or "free over a minimum"; free-shipping discounts with a minimum | help.shopify.com setting-up-shipping-rates |
| Free shipping progress bar | App or paid theme | Hextom Free Shipping Bar: free plan, Premium $9.99/month (seen in listing snippet 2026-11-05) | apps.shopify.com/free-shipping-bar |
| One-page or three-page checkout | Native | One-page is the default, three-page is optional, all plans (seen) | help.shopify.com checkout-style |
| Phone-first contact | Native | Contact method can be "phone or email" or email only; shipping phone can be hidden, optional or required (seen) | help.shopify.com checkout-form-options |
| City dropdown (Pakistan) | App | UrbanPick City Selector PK: $5/month on the cart page, $10/month in checkout (vendor says, 2026-11-06). Checkout CitySelect, Checkout Catalyst ($49/month) also exist | apps.shopify.com/urbanpick-the-city-selector |
| COD order form that skips Shopify checkout | App | EasySell COD Form: free to 60 orders/month, then $9.95 to $59.95/month, 4.9 from about 990 reviews (listing snippet 2026-11-06). Releasit is similar | apps.shopify.com/easy-order-form |
| Express wallet buttons | Native | Need Shopify Payments, which Pakistan lacks (see report 03) | report 03 |
| Guest checkout | Native | Accounts are optional; sign-in by email code, Shop or social; own identity provider is Plus only (seen) | help.shopify.com customer-accounts |
| Changing the information, shipping and payment steps | Checkout UI extensions | Plus only (seen) | shopify.dev checkout-ui-extensions, technologies |
| Thank-you and order status page blocks and apps | Native and apps | All plans except Starter (seen) | shopify.dev technologies; help.shopify.com customization-options |
| Post-purchase upsell page | App (post-purchase extension) | All plans except Starter, still beta, live stores must request access (seen). COD and other manual payments do not trigger it (vendor says: Avada, Aftersell) | shopify.dev technologies; docs.avada.io |

## What real shops do
Pakistan:
- Zellbury (seen 2026-11-06, phone-size cart page reached by a plain add-to-cart link for one in-stock item): estimated total, a Baadmay instalment badge, one Checkout button and no wallet buttons. No order note, no gift option and no progress bar. A "You may also like" row follows. The trust strip says COD is available and that 4 items earn free delivery.
- Report 01 saw the free delivery rules: Limelight is free from Rs 4,999, Nishat Linen is free only on prepaid orders (otherwise Rs 150), Gul Ahmed is a flat PKR 249, and Bonanza charges PKR 249 for COD versus 199 prepaid. Thresholds exist, but they are based on order value, item count or payment method.
- Report 01 found no COD form app scripts (EasySell, Releasit) on the big brands' pages. They use Shopify's own checkout and confirm orders by phone afterwards.
- Not seen: any Pakistani checkout screen, field list or cart drawer. On 2026-11-05 a first run reached the cart pages of Zellbury, Beechtree, Limelight and Nishat Linen, but a script bug lost the readings. After the scratchpad wipe, the headless browser was withdrawn, so I stopped my run after Zellbury's cart. A one-time curl of five homepages was refused by this session's permission check, and I did not retry.
- Sapphire runs on Salesforce Commerce Cloud, not Shopify (report 03), so its scan hits do not count.

Global:
- Allbirds: the cart page loaded on 2026-11-05, but the readings were lost to the same bug. Report 03 saw Shop Pay and PayPal scripts on Allbirds, Kylie Cosmetics, MVMT and Brooklinen, so express buttons are normal abroad.

Marker counts:
- Cart drawer (10/12 PK, 5/6 global) is unverified. The pattern also matches class names that themes ship but may not use.
- Free shipping (1/12 PK, 6/6 global) does not measure a progress bar, because it matches any "free shipping" text. The PK count is too low: Zellbury and Limelight say "free delivery", which the pattern misses. Nishat's hit is its prepaid banner.
- Shop Pay 10/12 is false (report 03).

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Cart API: create, items, addresses, shipping method, promo codes, complete | Built in | `@medusajs/medusa/dist/api/store/carts/[id]/` (line-items, shipping-methods, promotions, taxes, customer, complete); `/store/shipping-options?cart_id=`; `/store/payment-collections/:id/payment-sessions` |
| Custom data on cart, line item and address | Built in | `metadata` accepted on cart create/update, line items and addresses (`store/carts/validators.js`, `utils/common-validators/common.js`). Cart metadata is copied to the order (`core-flows/dist/cart/workflows/complete-cart.js`). The admin can view and edit order metadata (dashboard `order-metadata` route) |
| Free shipping over an amount | Built in (backend and admin) | Conditional shipping option prices on `item_total` ("Minimum cart total" in admin), flat-rate options only (user guide locations; pricing price-rules docs) |
| Free shipping progress bar | Missing | Storefront has nothing |
| Cart page | Built in | `apps/storefront/src/modules/cart/templates/` |
| Cart drawer on phones | Missing | The starter's hover popover is `hidden small:block` (`modules/layout/components/cart-dropdown/index.tsx:130`), so on a phone the cart icon just opens `/cart` |
| Order note | Partial | Store it in `cart.metadata`; no UI anywhere |
| Gift message or wrap | Missing (official tutorial) | Gift message in line-item metadata, with storefront inputs and an admin widget (docs tutorial gift-message) |
| Phone-first entry | Partial | API: address `phone` and cart `email` are both optional (`common.js`, `validators.js`). Starter: email required, phone optional, no `type="tel"`, 2-column grid (`modules/checkout/components/shipping-address/index.tsx:115,196`). Guest customers are created only from an email (`find-or-create-customer.js`), so a phone-only order has no customer record |
| City selection and city rates | Partial | City is free text. Fulfillment geo zones support a `city` type (`@medusajs/types` geo-zone), the admin API accepts it, and shipping option lookup filters by `shipping_address.city` (`list-shipping-options-for-cart.js`). The admin UI service-zone forms build country zones only (seen in the dashboard bundle) |
| Checkout layout | Built in (multi-step) | `modules/checkout/templates/checkout-form/index.tsx`: address, delivery, payment, review |
| One-page checkout | Missing in the starter | Medusa's "Express Checkout" guide builds a single-page storefront. It means one page, not wallet buttons |
| Guest checkout | Built in | No login needed. `GET /store/orders/:id` is public by order ID (docs secure-order-retrieval) |
| Thank-you page | Built in, wrong for COD | `app/[countryCode]/(main)/order/[id]/confirmed/page.tsx`. It says confirmation was emailed (`order-details/index.tsx:19`) and shows the COD amount as paid at a time (`payment-details/index.tsx:48`) |
| Post-purchase add-to-order | Partial | Order edit workflows `beginOrderEditOrderWorkflow`, `orderEditAddNewItemWorkflow`, `requestOrderEditRequestWorkflow`, `confirmOrderEditRequestWorkflow` (core-flows). Routes are admin only (`/admin/order-edits`) |
| Plan-based limits | Not applicable | Everything is our code |

The "Another step will appear" text on the review step comes from the collapsed Payment summary. It is fixed text at `modules/checkout/components/payment/index.tsx:234` and shows once the payment step is done, which means on Review. In Medusa's upstream starter, the same spot shows the card brand for Stripe and falls back to this sentence for any other provider. The sentence is meant for gateways that need another action, such as card entry or a redirect. With COD nothing follows, so the text is false. Our copy also dropped the card-brand branch. The label "Manual Payment" comes from `lib/constants.tsx:29`.

How the starter feels on a phone: Cart, then "Go to checkout". The address form has 10 inputs in two narrow columns, 7 of them required, including postal code, country and email. Then "Continue to delivery", a tap on the only shipping option, "Continue to payment", a tap on "Manual Payment", "Continue to review" and "Place order". That is 4 sections, 4 buttons and 2 radio taps, with a server round trip and a re-render at almost every step. The order total sits below the whole form. Separately, `setAddresses` does not await `getCartId()` (`lib/data/cart.ts:342`), so its "no cart" check can never fire.

## What we would build
1. COD wording fixes, size S, storefront only. Use "Cash on Delivery" with a short "pay when your parcel arrives" line instead of "Another step will appear". On the thank-you page, show "to pay on delivery: Rs X" instead of "paid at", and drop the email claim until messages exist (report 10). Replace the "Medusa Store" text in the checkout header and review step. Overlaps report 01 item 4.
2. One-page mobile COD checkout, size M, storefront only.
   - One form with phone (required, `type="tel"`, `inputmode="numeric"`, 03XXXXXXXXX), full name, city, address, optional email and an optional note. Drop company, postal code, province and country.
   - One server action makes the existing SDK calls in order: `sdk.store.cart.update` (addresses, email, metadata), `addShippingMethod` (chosen automatically when only one option exists), `sdk.store.payment.initiatePaymentSession` with `pp_system_default`, then `sdk.store.cart.complete`. The phone makes one request, and the Next server talks to Medusa on the same VPS.
   - Set `shipping_address.country_code = "pk"` when `getOrSetCart` creates the cart, so the delivery price shows from the start.
   - Single column, order summary collapsed at the top, sticky bottom bar with the total and Place order.
   - Enforce phone format again in `completeCartWorkflow.hooks.validate` (report 01).
   - Risks: create the payment session after the shipping method, because totals change it; keep a path for a card option later (report 03); decide email (report 10, question 2).
3. Mobile cart drawer, size S to M. A slide-over dialog that opens on `CART_UPDATED_EVENT`, with items, quantity, the free delivery bar, an optional note and Checkout. It replaces the desktop-only popover.
4. Free delivery threshold and bar, size S.
   - Set the conditional "Minimum cart total" price on the Standard Delivery option in the admin.
   - The storefront reads the threshold from region metadata, next to the existing `shipping_rate` key (`apps/backend/src/lib/region-store-policies.ts`), and measures progress with `cart.item_total`, the same field the price rule uses.
   - Risks: the admin rule and the metadata value can drift, and `item_total` is after discounts and tax. The rule cannot express item-count deals (Zellbury) or prepaid-only deals (Nishat) without a `setShippingOptionsContext` hook or a promotion.
5. Order note, size S. Save it to `cart.metadata.order_note` with `sdk.store.cart.update`, and it is copied to `order.metadata`. Add a small admin widget on the order page so staff and couriers see it. Unverified: whether a metadata update replaces or merges keys, so send all keys together.
6. City list, size M.
   - A searchable select of Pakistani cities. It stores the name in `shipping_address.city` and a courier city code in `shipping_address.metadata`.
   - The list should come from the chosen courier. PostEx and Leopards city endpoints are reported only by third parties (unverified, see report 02).
   - City-based rates later: create `city` geo zones through the admin API or a script, since the dashboard cannot.
   - Risk: keeping the list in step with courier coverage.
7. Gift message and wrap, size S to M. Follow the official gift-message tutorial (line-item metadata plus admin widget). For paid wrapping, add a hidden "Gift wrap" product as a line item, so price and stock stay correct.
8. Post-purchase "add to your order", size M to L.
   - On the thank-you page, offer one item for a few minutes before the confirmation call.
   - A custom store route checks a short-lived token saved in order metadata at placement, then runs the four order edit workflows. With COD there is no extra payment, only a higher amount to collect.
   - Risks: a public route that changes orders, stock reservation, a shipping method for new items, and staff seeing the new total. How the system provider handles the outstanding amount is unverified.
9. Guest order status, size S. Link the order page from the thank-you page. Tracking and lookup by phone plus order number are in report 02.

## Recommendation
- Launch: COD wording fixes (they mislead every buyer today); one-page phone-first checkout (most PK shoppers buy on phones and pay cash); city select (couriers need clean city names); mobile cart drawer (the starter gives phone users no feedback after add to cart); order note (cheap and helps with delivery directions); guest checkout (already works, keep it).
- Soon after launch: free delivery bar (once the threshold is decided, since PK shops do use thresholds); city-based delivery rates (needs courier pricing); order status link (with report 02).
- Later: post-purchase add-to-order (needs order volume and a safe route); gift message and wrap (seasonal, for Eid gifting).
- Skip: wallet express buttons (not available in Pakistan, report 03); the multi-step layout (replaced by the one-page form); worrying about plan-based checkout limits (Medusa has none).

## Questions for the owner
1. Will you offer free delivery, and on what basis: an order amount (Limelight Rs 4,999), an item count (Zellbury 4 items) or prepaid orders only (Nishat)? The bar and the shipping rule depend on it.
2. Should the city field accept only cities from the courier's list, which gives cleaner deliveries but may turn away small towns, or allow free text with suggestions?
3. Do you want shoppers to be able to add items after placing a COD order, before the confirmation call?

## Sources
- https://help.shopify.com/en/manual/checkout-settings/checkout-style
- https://help.shopify.com/en/manual/checkout-settings/checkout-form-options
- https://help.shopify.com/en/manual/checkout-settings/customer-accounts
- https://shopify.dev/docs/apps/build/checkout/technologies
- https://shopify.dev/docs/api/checkout-ui-extensions
- https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/upgrade-thank-you-order-status/customization-options
- https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/theme-settings and https://help.shopify.com/en/manual/online-store/themes/os20/themes-by-shopify/dawn/page-types (search summaries)
- https://shopify.dev/docs/api/ajax/reference/cart (search summary)
- https://community.shopify.com/t/how-do-i-show-order-notes-on-checkout-page/276982
- https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/setting-up-shipping-rates (search summary)
- https://apps.shopify.com/free-shipping-bar, https://apps.shopify.com/super-gift-wraps, https://apps.shopify.com/gift-wrapping, https://apps.shopify.com/easy-order-form, https://apps.shopify.com/releasit-cod-order-form, https://apps.shopify.com/urbanpick-the-city-selector, https://apps.shopify.com/checkout-city-dropdown (listing snippets)
- https://docs.avada.io/aov-post-purchase-upsell/reference/shopify-limitations-and-considerations-for-post-purchase-checkout-extensions, https://intercom.help/aftersell/en/articles/8593588-payment-methods
- https://www.zellbury.com/cart (viewed 2026-11-06)
- https://raw.githubusercontent.com/medusajs/nextjs-starter-medusa/main/src/modules/checkout/components/payment/index.tsx
- https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option.md, https://docs.medusajs.com/user-guide/settings/locations-and-shipping/locations.md, https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules.md
- https://docs.medusajs.com/resources/how-to-tutorials/tutorials/gift-message.md, https://docs.medusajs.com/resources/storefront-development/guides/express-checkout.md
- https://docs.medusajs.com/resources/commerce-modules/order/edit.md, https://docs.medusajs.com/resources/commerce-modules/order/secure-order-retrieval.md
- https://docs.medusajs.com/resources/commerce-modules/payment/payment-checkout-flow.md, https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart.md, https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider.md, https://docs.medusajs.com/resources/commerce-modules/cart/extend.md
- Local: node_modules/@medusajs/{cart,core-flows}/AGENTS.md; @medusajs/medusa/dist/api/store/carts/validators.js and api/utils/common-validators/common.js; @medusajs/core-flows/dist/cart/workflows/{complete-cart,list-shipping-options-for-cart}.js and cart/steps/find-or-create-customer.js; @medusajs/types fulfillment geo-zone; @medusajs/dashboard/dist; apps/storefront/src/modules/{checkout,cart,order,layout}; apps/storefront/src/lib/{data/cart.ts,constants.tsx}; apps/backend/src/scripts/setup-pakistan.ts
- Reports 01, 03 and 10 in this folder
