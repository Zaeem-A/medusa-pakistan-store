# Returns and exchanges

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers how a customer asks for a return or size exchange, the reasons they give, reverse pickup, store credit instead of cash, and how a Cash on Delivery (COD) buyer who paid cash gets money back. Medusa 2.22.2 has full return, exchange, claim and order-edit flows in the admin, plus an open `POST /store/returns` route. The starter storefront has no return UI and its copy promises refunds. For a COD store, capture and refund only record what happened: no money moves through Medusa. At launch, publish an exchange-first policy, lock down the open return route, create a return shipping option and reasons, and capture cash at delivery. Soon after, build a request page and a refund-payout record.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Admin returns, exchanges, refunds, return labels | Native | All plans. Shopify return labels only for US and Canada | [1][2] |
| Self-serve return requests from the order status page, staff approve or decline | Native | Needs new customer accounts, not legacy ones. Shoppers who checked out with only a phone must add an email. Per-market settings need Advanced or Plus | [3][4] |
| Exchanges requested by the customer | App | Self-serve cannot request exchanges (native). Return Prime offers variant exchanges on its free plan [8]. Loop offers instant exchanges [9] | [4][8][9] |
| Return rules: window (14, 30, 90 days or custom), final-sale lists, return shipping fee, restocking fee | Native | Fees are not deducted automatically | [5] |
| Return reasons by product category (for example, too big or too small) | Native | Changelog 2026-01-16 | [2][6] |
| Store credit and refund to store credit | Native | Customer must sign in to new customer accounts. Expiry is set per credit | [7] |
| Refund of a cash or manual payment | Native, record only | Refund is recorded as paid outside Shopify (search result, page not opened) | [10] |
| Return portal app | App | Return Prime: 4.8 stars from 779 reviews. Free for 5 requests, then $0.49 each. Grow plan $19.99/month for 60 requests, with store-credit refunds (seen 2026-11-06). Loop: 4.6 stars from 449 reviews. Free for 5k+ annual orders. Returns plan from $340/month. Free labels only in US and Canada (seen 2026-11-06) | [8][9] |
| Pakistani courier apps with returns | App | Courierify lists return receiving with a barcode scanner. OneShip lists return and refund handling (vendor says, unverified) | [11] |

## What real shops do
Pakistan. On 2026-11-05 I read each shop's own policy page. All the main ones returned 200 that day:
- Most shops do not give cash refunds. Limelight, Gul Ahmed, Beechtree, Breakout, Nishat Linen, Bonanza and Sapphire all say so; the money comes back as an exchange, store credit or a voucher.
  - Beechtree gives online store credit, less shipping.
  - Sapphire gives an online credit voucher if the item is out of stock.
  - Nishat gives a coupon, only in exceptional cases, that is valid for 7 days.
  - Bonanza gives a website voucher for wallet-paid orders.
  - None of these shops says how a COD buyer gets cash back.
- Return windows are short and come in two layers.
  - Exchange windows: 7 days at Breakout and Beechtree, 14 days at Nishat, Bonanza and Outfitters, 30 days at Gul Ahmed and Sapphire.
  - Gul Ahmed and Outfitters also require notice within 3 days of delivery.
  - Nishat allows one exchange per order.
- Sale items are excluded by Sapphire, Beechtree, Nishat and Bonanza. Breakout allows a size swap only. Fragrance, jewellery, accessories and undergarments are commonly excluded.
- Condition: unworn, unwashed, tags attached, with the invoice or order email.
- Return shipping and reverse pickup:
  - Gul Ahmed offers free pickup for online exchanges, taking 7 to 10 working days.
  - Beechtree picks up only when it sent the wrong item.
  - Sapphire offers free drop-off at Leopards, with a courier number (CN) emailed to the customer.
  - Breakout, Nishat and Bonanza make the customer pay the courier to their warehouse.
- How a return starts: email or phone everywhere. Gul Ahmed uses a complaint form. I saw no self-serve portal and no return-app marker on any of the 12 Pakistani homepages.
- Unreliable or missing:
  - Junaid Jamshed's and Zellbury's /policies/refund-policy pages look like Shopify's template text: Junaid Jamshed's still has a return-address placeholder and gives both 3 and 30 days. Their own pages (/pages/returns-exchanges, /pages/return-exchange) were found but not read before a usage limit stopped me.
  - Ethnc's policy URL returned 404, and search found nothing.
  - Maria B's policy page was 9.5 MB of app code with no policy text I could extract.
  - Sapphire's page ends in .html on pk.sapphireonline.pk, which fits the warning that it may have left Shopify. I count it as a Pakistani policy, not as Shopify evidence.
- Outside the list: OrderNation (Lahore) lets a COD customer pick a bank (IBAN), JazzCash or Easypaisa refund within 5 working days, or store credit [12]. Daraz refunds COD orders only to its own wallet [13].

Global (homepages and policies seen 2026-11-05):
- Portals: Gymshark links to a Loop portal (us-gymshark.loopreturns.com) and carries PostCo markers. Fashion Nova's /pages/returns redirects to its own portal at returns.fashionnova.com, with a Narvar marker.
- Allbirds carries Redo and Loop markers and a returns-insurance script. Its policy: 30 days, unworn, refund to the original payment method, and a free label only if return coverage was bought at checkout.
- Not confirmed: Brooklinen links /pages/returns, but its policy text did not load. Gymshark /pages/returns returned 404. Kylie and MVMT were not checked.

Markers. The README count of Returns 7/3 reflects policy links, not features. The Pakistani hits come from footer text such as "exchange policy". Shops without a hit (Sapphire, Limelight, Outfitters, Zellbury) have policies too, and no Pakistani shop has a portal. The global count is too low: Fashion Nova runs a portal without a marker hit.

## What Medusa already has
| Capability | Built in, Partial or Missing | Where |
| --- | --- | --- |
| Admin returns: create, receive, mark damaged, cancel | Built in, admin UI | `@medusajs/order/AGENTS.md`; dashboard `order-create-return`, `order-receive-return`; docs user-guide/orders/returns |
| Admin exchanges (inbound and outbound items, `difference_due`, stock reserved on confirm) | Built in, admin only | core-flows `order/workflows/exchange/`; dashboard `order-create-exchange` |
| Claims (refund or replace for damaged or wrong items) | Built in, admin only | `OrderClaim` type refund/replace; dashboard `order-create-claim` |
| Order edits (add items, change quantity) | Built in, admin only | `/admin/order-edits`; dashboard `order-create-edit` |
| Customer return API | Partial. Backend only, open by default | `POST /store/returns` runs `createAndCompleteReturnOrderWorkflow` (since 2.8.0). No login needed; the order ID is the only key. It takes `receive_now`, `location_id` and a return-shipping `price` from the caller. Validation checks only the cancelled state, the items, the reasons and the fulfilled quantity, with no window. Our `apps/backend/src/api/middlewares.ts` only sets up search |
| Storefront return page | Missing | Not in `apps/storefront`. The official guide `nextjs-starter/guides/storefront-returns` adds one for logged-in customers (needs 2.21+ for `allowFields`; hard-codes USD). js-sdk has no store return method, so calls go through `sdk.client.fetch` |
| Store exchange or claim API | Missing | The store routes are `returns` and `return-reasons` only |
| Return reasons (nested; a parent reason cannot be picked) | Built in, admin settings | `GET /store/return-reasons`; core-flows `utils/validate-return-reason.js` |
| Return shipping option | Built in, not set up | Needs a shipping option with the `is_return` rule, and the store route requires one. `scripts/setup-pakistan.ts` creates only the outbound option (`is_return: false`) |
| Return window, final-sale and eligibility rules | Missing | Region metadata `return_window_days` (default 30) and `free_returns` only feed the /returns page text (`src/lib/region-store-policies.ts`) |
| Refund, refund reasons, store-credit settlement | Built in; store credit through the loyalty plugin | dashboard `order-create-refund`. The credit option appears only with `@medusajs/loyalty-plugin` and only for registered customers (`has_account`). See report 05 |
| COD refund payout details (IBAN or wallet, transfer reference) | Missing | A refund keeps only a note and a reason |
| Reverse pickup through a courier | Partial | Provider extension `createReturnFulfillment` (`@medusajs/fulfillment/AGENTS.md`); only `manual_manual` is installed. See report 02 |
| Return messages to the customer | Partial | Events `order.return_requested`, `order.return_received`, `order.exchange_created` and `order.claim_created` exist. Nothing sends them (report 10) |

The storefront contradicts the policies above. The product "Shipping & Returns" tab promises easy refunds (`product-tabs/index.tsx`), /returns says items are returned by mail, and the order page's Returns & Exchanges link goes to /contact.

What capture and refund mean for a cash order. I read the source but did not run it.
- At checkout the system provider `pp_system_default` sets the payment to authorized, and nothing is captured.
- Capture only records that the cash came in, and the provider returns empty data. Refund also only records: the provider moves nothing, and staff must send the money outside Medusa.
- A refund cannot exceed the captured amount, so an uncaptured COD order cannot be refunded in Medusa.
- Receiving a return does not refund by itself. `confirm-receive-return-request` has no refund step, despite the user guide's wording. After the return, the admin shows a Refund action when the balance is negative.
- Gotcha: confirming a return, exchange, claim or order edit runs `createOrUpdateOrderPaymentCollectionWorkflow`. If the COD payment is still uncaptured and a balance remains, the workflow cancels it and creates a new unpaid collection. The admin then offers "Mark as paid" instead of Capture. No money is lost, but the courier COD amount must follow the new balance. The store return route skips this step.
- Exchanges: a dearer item leaves a positive balance for the rider to collect, then staff mark it as paid. A cheaper one leaves a negative balance, settled by refund or credit.
- A refused parcel (return to origin) is a return once the shipment is marked. `cancelFulfillment` refuses after `shipped_at`, and the order cannot be cancelled while a fulfillment is live. Receiving everything back leaves the delivery charge as an unpaid balance. `POST /admin/orders/:id/credit-lines` can offset it, but I found that hook in the dashboard only inside the plugin's refund form.

## What we would build
1. Policy and storefront copy (S). Set the region metadata (window, free returns), rewrite the product tab, /returns and the order help link to match the owner's policy, and add an exchange page. Risk: none.
2. Return setup (S). Extend `setup-pakistan.ts` to create a return shipping option in the Pakistan zone (`is_return: true`, linked to the stock location), plus apparel return reasons (too small, too large, defective, wrong item, changed mind).
3. Lock down `POST /store/returns` (S). Add middleware in `middlewares.ts`, following docs `secure-return-creation`:
   - `authenticate("customer", ..., { allowUnauthenticated: true })`;
   - an ownership check: customer ID, or the order's phone or email for guests;
   - reject `receive_now`;
   - set `location_id` and the shipping price on the server;
   - check the window from the fulfillment's `delivered_at`, and a final-sale tag.

   Risk: until this ships, anyone with an order ID can file a return.
4. Capture at delivery (S). A subscriber on `delivery.created`, or report 02's remittance match, runs `capturePaymentWorkflow`. Until then, staff capture by hand. This keeps refunds possible and avoids the collection-recreation gotcha. Depends on report 02.
5. Return and exchange request page (M).
   - A `return_request` module linked to the order: items, reason, photo, wanted size, payout preference, and a status (requested, approved, rejected).
   - A store route behind the item 3 checks, plus a storefront page under account orders, with a guest lookup by order number and phone (report 02's track route).
   - An admin widget on the order page. On approval, staff create the Medusa return or exchange in the existing dashboard.

   Exchanges have no store API, so they need this route. Risk: photo storage, and abuse by people guessing order numbers (rate-limit).
6. COD refund payout record (M). A `refund_payout` module linked to the order holds the method (IBAN, JazzCash, Easypaisa), a masked account, the amount, the status and the transfer reference. A subscriber on `payment.refunded` opens a pending payout, and an admin widget marks it sent. Risks: storing bank details (encrypt, delete after payout) and typos in account numbers.
7. Exchange voucher for guests (S to M). An admin action issues a single-use, fixed-amount promotion code that expires (as Nishat does), sent by WhatsApp or SMS (report 10). The usage-limit details are unverified; check them against the Promotion Module. Registered customers could use the plugin's store credit instead (report 05).
8. Refused-parcel action (S). An admin widget button receives all items back through the return workflows, clears or keeps the delivery-charge balance, and feeds report 01's phone history.
9. Reverse pickup (M to L). Add `createReturnFulfillment` to report 02's courier provider once a courier's reverse-pickup API is confirmed. Leopards says it handles returns (vendor says), but I found no public API. Until then, book in the courier portal and type in the CN.
10. Return messages (S, after report 10). Subscribers on the return and exchange events.

## Recommendation
- Launch:
  - Item 1, policy and copy: the starter promises refunds the shop may not give.
  - Item 2, return option and reasons: staff cannot create a return in the admin without them.
  - Item 3, route lockdown: the open route is live from day one.
  - Item 4, capture at delivery: every refund and later order change depends on it.
  - Item 8, refused-parcel action: refused COD parcels are daily work (report 01 cites about 19% returned).
  - Use the built-in admin returns, exchanges and claims; requests arrive by WhatsApp or email, as at every Pakistani brand.
- Soon after launch:
  - Item 5, request page: it cuts manual intake, and no Pakistani rival has one yet.
  - Item 6, payout record: only if the owner offers cash refunds.
  - Item 7, exchange voucher: it matches local practice and works for guests.
  - Item 10, messages.
- Later: item 9, reverse pickup (needs a courier API I could not confirm); plugin store credit (needs registered accounts); return-reason reporting.
- Skip:
  - Loop or Return Prime style portals and generated return labels: they are US- and Canada-centred.
  - Instant exchanges that ship before the return arrives: COD fraud risk.
  - Return insurance.

## Questions for the owner
1. Exchange-only with store credit or a voucher (like most Pakistani brands), or cash refunds too? If refunds are allowed, by bank transfer, JazzCash or Easypaisa?
2. Which window (7, 14 or 30 days), and are sale items final?
3. Who pays the return courier: free pickup like Gul Ahmed, or customer-paid like Breakout and Nishat?

## Sources
1. https://help.shopify.com/en/manual/fulfillment/managing-orders/returns
2. https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/creating-returns
3. https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/self-serve-returns
4. https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/self-serve-returns/setup
5. https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/return-rules
6. https://changelog.shopify.com/posts/enhanced-return-reasons
7. https://help.shopify.com/en/manual/customers/store-credit
8. https://apps.shopify.com/return-prime
9. https://apps.shopify.com/loop-returns
10. https://help.shopify.com/en/manual/fulfillment/managing-orders/refunding-orders (search result only)
11. https://pickyourapp.com/products/courierify ; https://pk.leopardscourier.com/business/ecommerce-economy (search results only)
12. https://www.ordernation.com/policies/refund-policy
13. https://www.daraz.pk/wow/i/pk/help/refund-policy
- Pakistani shop policies (seen 2026-11-05): https://pk.sapphireonline.pk/pages/exchanges-return.html , https://www.limelight.pk/policies/refund-policy , https://www.gulahmedshop.com/policies/refund-policy , https://www.junaidjamshed.com/policies/refund-policy , https://www.beechtree.pk/policies/refund-policy , https://www.beechtree.pk/pages/exchange-policy , https://outfitters.com.pk/policies/refund-policy , https://www.zellbury.com/policies/refund-policy , https://www.breakout.com.pk/policies/refund-policy , https://www.nishatlinen.com/policies/refund-policy , https://www.bonanzasatrangi.com/pages/return-exchange ; 404: ethnc.com and bonanzasatrangi.com /policies/refund-policy
- Global: https://www.allbirds.com/pages/returns-exchanges ; homepages of allbirds, gymshark, fashionnova, brooklinen (2026-11-05); https://www.fashionnova.com/pages/returns (redirect)
- Medusa docs: https://docs.medusajs.com/resources/commerce-modules/order/return.md , /order/exchange.md , /order/edit.md , /order/secure-return-creation.md , /nextjs-starter/guides/storefront-returns.md , /commerce-modules/store-credit.md ; https://docs.medusajs.com/user-guide/orders/returns.md , /exchanges.md , /payments.md ; https://registry.npmjs.org/@medusajs/loyalty-plugin/latest (2.22.3, MIT, seen 2026-11-05)
- Medusa source: `node_modules/@medusajs/{order,payment,core-flows,medusa,dashboard,fulfillment}`, `apps/backend/src`, `apps/storefront/src`
