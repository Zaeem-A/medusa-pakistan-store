# Online payments

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers taking money before delivery: cards, JazzCash and Easypaisa wallets, BNPL instalments and express checkout. Shopify Payments and Shop Pay are not available in Pakistan, so Pakistani Shopify shops use the same local hosted gateways (PayFast, Safepay, banks) and the Baadmay or Yango BNPL apps that a Medusa store would use. Medusa 2.22.2 has the payment module, webhooks, capture and refund flows and admin UI, but no provider exists for any Pakistani gateway. Launch on COD, apply for one aggregator account now, and build one custom hosted-checkout provider soon after launch.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Shopify Payments (cards, local methods) | Native | 41 countries. Pakistan is not one of them (seen) | help.shopify.com supported-countries |
| Shop Pay one-click checkout | Native | Part of Shopify Payments (seen), so Pakistani merchants cannot use it | help.shopify.com shop-pay |
| Accelerated buttons (Shop Pay, Apple Pay, Google Pay, Amazon Pay, PayPal) | Native | Only where the active provider offers them (seen) | help.shopify.com accelerated-checkouts |
| Third-party gateways, direct or redirect ("external") | Native hook plus provider app | A plan-dependent third-party transaction fee applies (seen on the PK pricing page; the rates are filled in by script, not shown) | help.shopify.com third-party-providers, shopify.com/pk/pricing |
| PayFast cards, bank account and wallets | App | PayFast Gateway App, free to install, support by Devsinc (seen) | apps.shopify.com/payfast-gateway-app |
| Safepay hosted or onsite checkout | App or plugin | Vendor says it has Shopify hosted and onsite checkout | getsafepay.pk |
| BNPL: Baadmay, 3 instalments | App | Free to install, 0 reviews (seen). The vendor says the merchant is paid upfront | apps.shopify.com/baadmay |
| BNPL: Yango Pay later, 4 instalments | App or widget | Seen only on Gul Ahmed | gulahmedshop.com |
| Manual methods (COD, bank deposit) | Native | Not re-checked this session (unverified) | - |

## What real shops do
Method: one homepage per shop (18 pages), one payment or FAQ page for 11 Pakistani shops, plus two App Store listings. I could not view any checkout because the brief forbids starting one, so the gateway behind a card button is often unknown.

Pakistan (12):
- None run Shop Pay. Shopify's Shop Pay storefront script (`shopify_pay/storefront`) and PayPal in-context metadata appear on 0 of 12 (seen). The scan's Shop Pay hit (10/12) is a false positive: its `shopifypay` pattern matches `ShopifyPaypalV4VisibilityTracking`, which every Shopify theme page carries.
- Sapphire's storefront is served from Salesforce Commerce Cloud (Demandware asset paths, seen), not Shopify. Its scan hits are not Shopify evidence. Baadmay lists Salesforce Commerce Cloud as an integration (vendor says).
- Card payments (Visa and Mastercard) are listed on the FAQ or payment pages of Zellbury, Outfitters, Gul Ahmed (also AmEx), Bonanza Satrangi, Nishat and Junaid Jamshed. Limelight lists only "Online Payments" (seen). The gateway names are not shown.
- Zellbury is the clearest case: cards through a 3-D Secure redirect gateway; JazzCash, EasyPaisa, UPaisa and Zindigi wallets through a redirect; a PayFast logo in the footer; and Baadmay with a 15% processing fee charged to the customer over 3 monthly instalments (all seen 2026-11-05).
- Baadmay is live (widget or FAQ text) on Outfitters, Beechtree and Zellbury, and report 01 saw it on Breakout's policy page. Gul Ahmed links a Baadmay user manual and also renders Yango's 4-instalment widget on product cards, with repayment through the Yango app by wallet or card (seen). Junaid Jamshed and Nishat only load a Baadmay stylesheet, and Nishat's FAQ lists COD and cards only, so their BNPL is unverified or leftover.
- Other notes: Gul Ahmed caps COD at Rs 25,000, and Outfitters runs a fraud check on online-paid orders (seen). No shop page listed bank transfer or Raast. Prepaid incentives are covered in report 01: Bonanza charges PKR 50 less delivery when prepaid, and Nishat ships prepaid orders free.
- Marker verdicts: Shop Pay 10/12 did not hold up (real count 0). BNPL 8/12 holds for 5 live shops (Sapphire is not Shopify, and two are stylesheet only). Installments is inflated in the same way (Nishat's hit is a CSS selector). PK gateways 2/12 holds only for Zellbury: Gul Ahmed's JazzCash and Easypaisa mention is Yango repayment text.

Global (6):
- Allbirds, Kylie Cosmetics, MVMT and Brooklinen load the Shop Pay script and PayPal in-context (seen). MVMT's footer icons show Amex, Apple Pay, Google Pay, PayPal, Bancontact and others.
- Gymshark's footer shows Klarna, Afterpay, Sezzle, PayPal and Apple Pay. Fashion Nova's page data carries Afterpay and Klarna. Its "affirm" hit is the word "Affirmation" (false positive). Both are headless sites, so the Shop Pay marker cannot be read from the homepage.
- Global BNPL 3/6 and Shop Pay 4/6 held up.

Limits: a Limelight product request returned 429. gopayfast.com returned 403. The JazzCash sandbox reset the connection. The Easypaisa developer portal host did not resolve. home.baadmay.com served a Cloudflare challenge. I did not retry any of them.

**Pakistani gateways and BNPL that these shops use or could use:**

| Provider | Developer docs | Sandbox | Merchant requirements (where a source states them) | Medusa provider |
| --- | --- | --- | --- | --- |
| Safepay | Seen: integration guide and Postman API reference; webhooks over HTTPS with HMAC signatures | Seen: a separate sandbox account, test cards and test dashboard, usable before approval | Seen: the application must be approved; the site must show refund, delivery, return and privacy policies and a business address. Vendor says it is a regulated PSO/PSP | None found |
| PayFast | No official docs reached (site 403). Third-party SDKs exist | Third-party SDKs mention one (unverified) | An unofficial copy of a partner guide lists, for a sole proprietor: CNIC, NTN or business registration, utility bill and an account certificate (unverified). Vendor says it is a regulated PSP | None found |
| JazzCash | Not reached. Community libraries describe merchant ID, password, integrity salt, HMAC-SHA256 and an IPN callback (unverified) | sandbox.jazzcash.com.pk exists; the connection was reset | A secondary blog cites CNIC, NTN, business registration and a bank account (unverified) | None found |
| Easypaisa | A developer portal is reported but did not resolve. Unofficial packages for hosted and direct checkout exist | Reported (unverified) | Production needs registration and an Easypaisa account (unverified) | None found |
| Bank gateways (Alfalah, HBL, UBL, MCB, Meezan) | No public API docs found. Vendor blogs cite Mastercard gateway (MIGS) setups | Unverified | Bank merchant agreement (unverified) | None found |
| Baadmay BNPL | Vendor says a REST API and SDKs exist, with docs from its partnerships team | Unverified | Not stated | None found |
| Yango Pay later | Not checked | Unverified | Customer must be 18+ with a Pakistani mobile number (seen on Gul Ahmed) | None found |
| QisstPay | It wound down in 2024 and is re-entering per its CEO (Profit, 2026-04-20). Seen on no shop | - | BNPL lenders need an SECP NBFC licence (Profit) | None found |

"None found" is based on npm registry and GitHub repository searches for medusa plus each name on 2026-11-05, and on Medusa's integrations page. That page lists only Stripe, Adyen and a PayPal guide.

## What Medusa already has
| Capability | Built in, Partial or Missing | Where |
| --- | --- | --- |
| Payment module (collections, sessions, payments, captures, refunds) | Built in | `node_modules/@medusajs/payment/AGENTS.md` |
| COD via the system provider `pp_system_default` (authorizes instantly; capture and refund only record) | Built in | `@medusajs/payment/dist/providers/system.js`, `apps/backend/src/scripts/setup-pakistan.ts` |
| Custom provider: `AbstractPaymentProvider` plus `ModuleProvider(Modules.PAYMENT)`, ID `pp_{identifier}_{id}`, enabled per region | Built in (mechanism) | docs: references/payment/provider |
| Webhooks: `POST /hooks/payment/{identifier}_{id}` emits `payment.webhook_received` (5 s delay, 3 attempts), then `getWebhookActionAndData` and `processPaymentWorkflow` complete the cart | Built in | `@medusajs/medusa/dist/api/hooks/payment/[provider]/route.js`, docs: payment/webhook-events |
| Deferred payments (`pending_authorization`): the order is placed as awaiting and authorized later by webhook (since v2.17.2) | Built in | docs: payment/payment-flow |
| Capture and refund (`capturePaymentWorkflow`, `refundPaymentsWorkflow`; amounts above 0, refunds capped at the captured amount) | Built in | `@medusajs/core-flows/dist/payment/workflows/`, payment AGENTS.md |
| Admin order page: capture, refund, mark as paid, check status, pending authorization | Built in | `@medusajs/dashboard` order-detail bundle |
| Saved cards (account holders, `savePaymentMethod`) for one-click repeat buys | Partial (needs a provider with tokenization) | docs: references/payment/provider |
| Stripe and Adyen providers | Built in, but whether they accept a Pakistani business was not checked | `@medusajs/payment-stripe`, `@medusajs/payment-adyen` |
| Medusa Payments | Medusa Cloud only, so not usable on a Hetzner VPS | payment AGENTS.md (loaders) |
| JazzCash, Easypaisa, PayFast, Safepay, bank and BNPL providers | Missing | - |

Storefront: checkout handles only Stripe, Adyen, Medusa Payments and manual providers. Any other provider gets a disabled "Select a payment method" button (`apps/storefront/src/modules/checkout/components/payment-button/index.tsx`). The return route handles only Stripe and Adyen redirects (`apps/storefront/src/app/api/payment-return/route.ts`). COD appears as "Manual Payment" (`apps/storefront/src/lib/constants.tsx`).

## What we would build
1. Hosted-checkout gateway provider (Safepay or PayFast, whichever approves the account), size M.
   - Backend: module in `apps/backend/src/modules/<gateway>`.
     - `initiatePayment` creates the gateway order and stores the redirect URL in session `data`.
     - `authorizePayment` checks the status with the gateway and returns `pending_authorization` until it is paid.
     - `getWebhookActionAndData` verifies the HMAC and returns `authorized` or `captured`.
     - `refundPayment` calls the gateway's refund API.
   - Storefront: a redirect payment button, a branch in the payment-return route, and a label in `constants.tsx`.
   - Dependencies: an approved merchant account and a public HTTPS webhook URL behind Nginx. Use the Redis event bus in production so webhook retries survive restarts.
   - Risks: docs are only partly public; wallet payments are asynchronous; the provider must not trust `data.client`; gateway refunds for wallets may be manual.
2. Rename the COD label from "Manual Payment" to "Cash on Delivery", size S, storefront only. It is already item 4 in report 01, so it is listed here only for completeness.
3. BNPL provider (Baadmay first), size M. It follows the same pattern as item 1 and needs Baadmay's API docs. Risks: the 15% customer fee seen at Zellbury, and refunds that must update the instalment plan.
4. Saved cards and one-click repeat purchase, size M to L. Account holders plus gateway tokenization (Safepay advertises a Vault; vendor says). Depends on item 1.
5. Bank transfer or Raast, size S. A manual provider that returns `pending_authorization`, then staff use "mark as paid" in admin. Only worth doing if the owner wants it, since no checked shop offers it.

## Recommendation
- Launch: COD on the existing system provider, renamed. Most Pakistani shops lead with COD, and a gateway account takes time to approve.
- Launch (non-code): apply to Safepay and PayFast now, because approval needs business documents.
- Soon after launch: one hosted gateway covering cards plus JazzCash and Easypaisa. Every checked Pakistani shop offers cards, and Gul Ahmed caps COD at Rs 25,000, so larger orders need prepayment. It also unlocks the prepaid incentives and COD cap proposed in report 01.
- Later: Baadmay or Yango BNPL. Several major shops use it, but it adds a customer fee and complicates refunds.
- Later: saved cards or one-click, once repeat customers exist.
- Skip: Shop Pay, Shopify Payments look-alikes, and Apple or Google Pay. None are available to Pakistani merchants or seen on Pakistani shops.
- Skip: building on Stripe or Adyen until their acceptance of a Pakistani business is confirmed.

## Questions for the owner
1. Is the business registered (NTN, business bank account), and as which entity type? Every gateway application depends on it.
2. Which gateway should we pursue first, once fee (MDR) quotes are in: Safepay, PayFast or your bank?
3. Will you offer BNPL even though the customer pays a fee (15% at Zellbury)?

## Sources
- https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries
- https://help.shopify.com/en/manual/payments/shop-pay
- https://help.shopify.com/en/manual/payments/accelerated-checkouts
- https://help.shopify.com/en/manual/payments/third-party-providers
- https://www.shopify.com/pk/pricing
- https://apps.shopify.com/payfast-gateway-app
- https://apps.shopify.com/baadmay
- https://getsafepay.pk/
- https://safepay-docs.netlify.app/developers/safepay/sandbox-environment
- https://safepay-docs.netlify.app/developers/webhooks/overview
- https://safepay-docs.netlify.app/get-started/website-checklist
- https://home.baadmay.com/for-merchants.html (via search summary; the page served a challenge)
- https://profit.pakistantoday.com.pk/2026/04/20/with-alibaba-entering-the-buy-now-pay-later-space-and-qisstpay-making-a-comeback-what-has-changed
- https://www.scribd.com/document/890936512/Partner-Guide-PayFast (unofficial copy, search summary)
- https://github.com/zfhassaan/jazzcash and https://github.com/zfhassaan/easypaisa (unofficial)
- https://hysabone.com/blog/digital-payments-pakistan-guide/ (secondary)
- https://www.bankalfalah.com/press-releases/bank-alfalah-brings-mastercard-internet-gateway-system-to-pakistan
- Shop pages: zellbury.com/pages/payment and /pages/baadmay, outfitters.com.pk/pages/shopping-guide, gulahmedshop.com/pages/faqs, limelight.pk/pages/faqs, beechtree.pk/pages/faqs-1, bonanzasatrangi.com/pages/faqs, nishatlinen.com/pages/faqs, junaidjamshed.com/pages/payment-guideline, plus the 18 homepages
- https://docs.medusajs.com/resources/references/payment/provider.md
- https://docs.medusajs.com/resources/commerce-modules/payment/webhook-events.md
- https://docs.medusajs.com/resources/commerce-modules/payment/payment-flow.md
- https://docs.medusajs.com/resources/integrations.md
- https://registry.npmjs.org/-/v1/search and https://api.github.com/search/repositories (2026-11-05)
- docs/shopify-research/01-cod-confirmation-and-fraud.md (Breakout BaadMay, prepaid pricing)
- Local: node_modules/@medusajs/payment/AGENTS.md, node_modules/@medusajs/payment-stripe/AGENTS.md, apps/storefront/src/modules/checkout, apps/storefront/src/app/api/payment-return/route.ts
