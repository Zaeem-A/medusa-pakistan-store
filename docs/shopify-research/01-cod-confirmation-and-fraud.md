# COD confirmation and fraud

Researched 2026-11-05 against Medusa 2.22.2.

## Summary
On Shopify, protecting COD orders comes from apps and staff routine, not the platform: someone calls, texts or sends a WhatsApp message after the order, unanswered orders are cancelled, COD costs a little more than prepaid, and phones that refused parcels before get blocked. Medusa 2.22.2 accepts COD through the system payment provider, which authorizes at once and is captured by hand. It has no confirmation state, nothing that stops fulfillment, no phone history and no SMS or WhatsApp sender, and the starter storefront does not even require a phone number. For launch, build a small verification module linked to orders, a call queue for staff in the admin, a guard that blocks fulfillment and an auto-cancel job; add WhatsApp confirmation and a phone risk score soon after.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| COD as a payment method | Native (manual payment method) | All plans. Order shows unpaid until staff mark it paid; no third-party transaction fee (seen) | [1] |
| Hide or limit COD by cart total, product or customer | Native mechanism (Shopify Functions payment customization, built as an app) or app | Shopify's own example hides COD above a cart total; max 25 functions per store (seen). Releasit adds rules by country, product, collection, customer group, order value (vendor says) | [2], [5] |
| India-only "Advanced COD" app (price-range eligibility) | Was native | Support ended around 31 Aug 2024; the listing now shows the app as unavailable (unverified: community post and vendor blog, no Shopify notice seen) | [3], [4] |
| COD fee | App | Releasit COD Fee: 4.9 stars, 613 reviews, free up to 60 COD orders/month, Premium $9.99/month (seen 2026-11-05). CODBot Premium $5/month | [5], [8] |
| WhatsApp order confirmation (confirm / cancel buttons, order tags) | App | OrderPilot (Lahore, launched May 2026, 2 reviews): free 10, then $4.99/month + $0.02 per message (seen 2026-11-05) | [6] |
| OTP at checkout by SMS or WhatsApp | App | Releasit (WhatsApp OTP, free tier); COD-Verify $4.99/month for 100 messages, auto-cancels after 30 min; CODBot SMS/WhatsApp OTP with voice-call fallback (vendor says) | [5], [7], [8] |
| Automated or AI confirmation calls | App | Courifire (Sargodha): WhatsApp first, AI call to non-responders, books TCS/Leopards/PostEx/Trax/M&P, flags repeat returners; free 50 WhatsApp + 20 calls, $5-$19/month (vendor says, 0 reviews) | [9] |
| Repeat refuser and shared blocklist | App | Munshi Trust Network (Faisalabad): hashed-phone network shared across stores, tags Trusted/Neutral/Risky; free up to 50 COD orders, store blocklist from $9.99 (vendor says, 0 reviews) | [10] |
| Per-order return-to-origin (RTO) risk score, pincode blocking, part payment up front | App | Byteinfy (India): risk score on Pro $7.33/month (vendor says) | [11] |
| Fraud analysis | Native | Card signals (AVS, CVV, cards tried, location). Indicators on Basic and up, recommendations on Grow and up or with Shopify Payments. COD coverage not stated (seen) | [12] |
| Fulfillment hold | Native | Hold by hand or with a Flow action; a Flow template holds high-risk orders. Which plans include Flow: unverified | [13] |

## What real shops do
Pakistan. I fetched one shipping-policy page per shop and some FAQ pages on 2026-11-05.
- Gul Ahmed: COD orders ship only after a phone verification, though the shop may skip it for verified customers or during sales. Flat PKR 249 delivery (seen).
- Limelight: a verification call or SMS after every order. Unverified COD orders are cancelled automatically after 3 days, and verified ones go out the same day. Free delivery from Rs 4,999 (seen).
- Outfitters: at most 2 confirmation calls, and the order is cancelled if nobody answers. The courier makes two more attempts, then returns the parcel. Card orders get a fraud check (seen).
- Bonanza Satrangi: delivery costs PKR 199 prepaid and PKR 249 for COD, so COD buyers pay PKR 50 more (seen, FAQ).
- Nishat Linen: a banner offers free nationwide shipping on paid (prepaid) orders. Otherwise delivery is Rs 150 (seen).
- Zellbury: an SMS confirms the order is placed. Payment by COD, cards or wallets. No phone orders (seen).
- Breakout (PKR 99 + PKR 1 FBR fee, COD, cards, BaadMay) and Beechtree (PKR 199 + PKR 1 FBR): no confirmation rule on the policy page (seen).
- Maria B, Junaid Jamshed, Ethnc: no COD confirmation text on the pages I fetched. Ethnc's policy and FAQ pages and Maria B's FAQ returned 404.
- Sapphire: the PK policy and FAQ URLs redirect to a Salesforce Commerce Cloud (demandware) path, so its PK store may no longer run on Shopify (I saw the redirect; the rest is unverified).

Global. None of the six offers COD in its main store as far as I saw. MVMT returned an empty page and Gymshark's shipping URL returned 404, so MVMT's COD marker is unverified and probably a false match.

Marker counts.
- COD (3 of 12): held for Gul Ahmed, Bonanza and Zellbury, but it undercounts. Limelight, Outfitters and Breakout clearly offer COD on their policy pages.
- WhatsApp (8 of 12): held as a presence signal, but every case I saw was a support chat or contact link (wa.me, api.whatsapp.com/send), not order confirmation.
- No COD app scripts (Releasit, EasySell and similar) appeared in the saved pages. That is expected, because those apps run in checkout and the admin. The big PK brands describe confirmation done by staff phone calls.

Pakistan failed-delivery figures. Only one source states its method: OrderNation's 2026 study [14]. It covers one retailer, mostly phone accessories, about 170,000 orders from June 2025 to May 2026:
- COD was 94.5% of orders.
- COD orders were cancelled 37.3% of the time, against 2.8% for prepaid.
- About 19.4% of shipped parcels came back to the seller (return to origin).
- Only about 49 to 57 of every 100 COD orders ended with cash collected.
- A failed delivery took a median 21.7 days to show up in the seller's records.

The study itself says it is not a national benchmark. Other figures (Simpaisa 25-30%, TrackMyOrder 20-35%, WeProms 10-25%) come from vendor blogs that give no method [15]. I found no figure from couriers, Daraz or a regulator. Indian vendor GoKwik claims large drops in returned parcels from blocking about 3% of the riskiest COD orders (vendor says) [16].

## What Medusa already has
| Capability | Built in, Partial or Missing | Where |
| --- | --- | --- |
| COD payment | Built in (placeholder) | System provider `pp_system_default` in `node_modules/@medusajs/payment/dist/providers/system.js`: authorize always succeeds, no outside calls. Enabled on the PK region by `apps/backend/src/scripts/setup-pakistan.ts`. The storefront labels it "Manual Payment" with a card icon (`apps/storefront/src/lib/constants.tsx`) |
| Mark COD cash as collected | Built in | The admin order page shows a Capture button for any uncaptured payment (`@medusajs/dashboard` order-payment-section); `capturePaymentWorkflow` |
| Order states | Partial | `OrderStatus` is a fixed enum: pending, completed, draft, archived, canceled, requires_action (`@medusajs/utils/dist/order/status.d.ts`, `@medusajs/order/dist/models/order.js`). Core code only sets completed, canceled and archived. No custom states |
| "Pending confirmation" hold | Missing | `createOrderFulfillmentWorkflow` only checks for cancellation and valid items, never payment or confirmation, and its only hook is `fulfillmentCreated` (`@medusajs/core-flows/dist/order/workflows/create-fulfillment.js`) |
| Reject an order at checkout | Partial (hook) | `completeCartWorkflow.hooks.validate` runs before the order is created and payment authorized. It is the workflow's only public hook (`complete-cart.d.ts`) |
| Cancel an unconfirmed order | Built in | `cancelOrderWorkflow` releases reserved stock, cancels uncaptured payments and emits `order.canceled`. It refuses while any fulfillment is not canceled |
| Customer identity for a risk score | Partial | Guest customers are keyed by email (`findOrCreateCustomerStep`, `hasAccount: false`, core-flows AGENTS.md). Phone lives on addresses and `Customer.phone`. The storefront phone field is not required (`apps/storefront/src/modules/checkout/components/shipping-address/index.tsx`) |
| SMS / WhatsApp sending | Partial | Notification Module takes one provider per channel; only the local logging provider is registered. Medusa's official tutorial builds a Twilio SMS provider plus phone OTP login [17]. Community `@sam-ael/medusa-plugin-whatsapp` 0.2.5 sends templates on events; its peer dependency is Medusa 2.12.4 (npm, untested on 2.22) [18] |
| Inbound webhooks (WhatsApp replies) | Built in mechanism | File-based API routes; middleware option `preserveRawBody` for signature checks (`@medusajs/framework/dist/http/types.d.ts`) |
| Rate limiting for OTP | Missing | No rate-limit middleware found in `@medusajs/framework` or `@medusajs/medusa` dist |
| COD fee or prepaid price | Partial | Shipping options with prices and rules, plus a `setShippingOptionsContext` hook (`list-shipping-options-for-cart.js`); Promotion Module. Nothing ties a price to the payment method |
| Events for delivery history | Built in | `order.placed`, `order.canceled`, `shipment.created`, `delivery.created`, `order.return_received` (`@medusajs/utils/dist/core-flows/events.js`) |
| Admin and storefront UI | Partial | Widget zones `order.details.before/after/side.before/side.after` and `order.list.before/after` (`@medusajs/admin-shared`), plus custom admin pages. Neither the admin nor the starter storefront has anything COD-specific |
| Ready-made COD or fraud plugin | Missing | None found for Medusa v2 |

## What we would build
1. Verification module (M). A custom module `cod-verification` with an `OrderVerification` record: status (pending, confirmed, cancelled, no answer), attempts, channel, staff notes, timestamps. Link it to the order with `defineLink`. A subscriber on `order.placed` creates the record. An admin widget in `order.details.side.before` gives Confirm and Cancel buttons and an attempt log, and an admin page lists pending orders oldest first as a call queue. Both run custom workflows. Depends on nothing. Risks: it only works if staff work the queue every day, and the core `requires_action` status should not be repurposed for this.
2. Fulfillment guard (S). Middleware in `apps/backend/src/api/middlewares.ts` on `POST /admin/orders/:id/fulfillments` that refuses unless the order is confirmed. Put the check in a shared step so courier booking (report 02) uses it too. Risk: any other code path that creates fulfillments skips the middleware.
3. Auto-cancel job (S). A scheduled job every 30 minutes runs `cancelOrderWorkflow` on orders still unconfirmed after N hours, which frees their stock. Until an email or SMS provider exists, the customer message is only logged.
4. Required phone (S). Make the storefront phone field required, accept Pakistani mobile numbers (03XXXXXXXXX), store them as +923XXXXXXXXX, and enforce the same in the `validate` hook. Rename "Manual Payment" to Cash on Delivery.
5. Phone history and risk score (M). A `PhoneReputation` record keyed by a hash of the normalised phone, counting delivered, returned, cancelled-unconfirmed and open orders. Subscribers on `delivery.created`, `order.canceled` and `order.return_received` keep it current, plus an admin action to mark a parcel as returned undelivered (recording that sits with reports 02 and 12). Simple rules run at `order.placed` and show the score in the widget: a past refusal, several open orders, or a new phone with a large basket. A staff blocklist is enforced in the `validate` hook. Do not trust `cart.metadata` for any of this, because the store API accepts any metadata from the browser. Risks: family members share phones, and stored phones need a retention rule.
6. WhatsApp confirmation (M). A notification provider on a `whatsapp` channel that calls Meta's WhatsApp Cloud API or a reseller, using an approved template with Confirm and Cancel buttons. An inbound webhook route checks the signature (via `preserveRawBody`) and updates the verification record. Orders with no reply fall back to the call queue. Depends on Meta business verification, approved templates and a number. Cost: Meta raised Pakistan's utility message rates on 1 Oct 2026 (seen); one news site reports $0.015 per message (unverified against Meta's rate card) [19], [20]. The community plugin targets 2.12.4, so test it before relying on it.
7. OTP at checkout (M). Custom store routes to send and check a code, held server-side as a hash per cart with a 5-minute expiry and an attempt limit. The `validate` hook refuses a COD cart without a verified phone. Rate-limit by phone and IP, either with Nginx `limit_req` on the VPS or a Redis counter. Twilio SMS to Pakistan costs $0.4734 per segment (seen 2026-11-06) [21], so a WhatsApp authentication template or a local SMS gateway (unverified) is cheaper. Risk: extra checkout friction; Releasit reviewers complain the OTP step sometimes blocks checkout [5].
8. COD fee, COD cap, prepaid incentive (S each). Two shipping options at different prices (like Bonanza's 249 and 199), picked through `setShippingOptionsContext` in both shipping-option list workflows, or a promotion applied when the buyer pays online. A COD cap by order value means hiding COD in the storefront and refusing it in the `validate` hook. The prepaid price needs an online gateway first (report 03).
9. Automated calls and a shared cross-store blocklist: outside services only (Courifire, Munshi are Shopify-only). Not worth building.

## Recommendation
- Launch: required phone (stops unreachable orders); verification module with call queue and widget (the big PK brands all confirm by phone); fulfillment guard (stops unconfirmed parcels leaving); auto-cancel job (frees stock held by fake orders); staff blocklist (cheap way to stop known refusers).
- Soon after launch: WhatsApp confirmation (cuts call workload once volume grows); phone history score (needs some delivery history first); COD value cap (limits loss on large fake orders).
- Later: COD premium and prepaid discount (needs an online gateway); OTP at checkout (only if fake orders stay high after confirmation, since it adds friction); part payment up front.
- Skip: automated or AI calls built in-house (vendor job); shared cross-store blocklist (no Medusa network exists); card-style fraud scoring (COD has no card signals).

## Questions for the owner
1. How long should an unconfirmed COD order wait before auto-cancel, and how many call attempts? (Limelight waits 3 days, Outfitters makes 2 calls.)
2. Should COD buyers pay more than prepaid buyers (Bonanza charges PKR 249 against 199), or should there be one price?
3. Will you register a WhatsApp Business number and pay per message (about $0.015 reported), or rely on staff calls at launch?

## Sources
1. https://help.shopify.com/en/manual/payments/manual-payments
2. https://shopify.dev/docs/apps/build/checkout/payments/create-payments-function
3. https://apps.shopify.com/advanced-cash-on-delivery
4. https://easysellapp.com/blogs/wiki/shopify-advanced-cod-app-alternative-replacement-2026
5. https://apps.shopify.com/cash-on-delivery-fee
6. https://apps.shopify.com/orderpilot-1
7. https://apps.shopify.com/cod-verify
8. https://apps.shopify.com/codbot-cod-sms-verification
9. https://apps.shopify.com/universal-courier
10. https://apps.shopify.com/munshi-trust-network
11. https://apps.shopify.com/byteinfy-cod-partial-pay
12. https://help.shopify.com/en/manual/orders/fraud-analysis
13. https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/holding-fulfillments
14. https://www.ordernation.com/blogs/research/state-of-online-shopping-pakistan-2026
15. https://www.simpaisa.com/blogs/why-cash-on-delivery-is-killing-your-e-commerce-business-and-what-to-do/ , https://trackmyorder.pk/blog/shopify-tips/cod-return-rate-pakistan-shopify , https://weproms.com/blog/should-online-store-offer-free-delivery-pakistan/
16. https://www.casestudies.com/company/gokwik/case-study/the-man-company-reduces-returns-by-20-using-gokwik
17. https://docs.medusajs.com/resources/how-to-tutorials/tutorials/phone-auth
18. https://registry.npmjs.org/@sam-ael%2Fmedusa-plugin-whatsapp
19. https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
20. https://propakistani.pk/2026/09/15/meta-charges-pakistan-11x-more-than-india-for-whatsapp-business-messages/
21. https://www.twilio.com/en-us/sms/pricing/pk
22. Shop pages, fetched 2026-11-05: https://www.gulahmedshop.com/policies/shipping-policy , https://www.limelight.pk/policies/shipping-policy , https://outfitters.com.pk/policies/shipping-policy , https://bonanzasatrangi.com/pages/faqs , https://nishatlinen.com/policies/shipping-policy , https://zellbury.com/pages/faqs , https://www.breakout.com.pk/policies/shipping-policy , https://beechtree.pk/policies/shipping-policy
