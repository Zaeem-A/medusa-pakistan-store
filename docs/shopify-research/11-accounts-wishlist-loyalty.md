# Accounts, wishlist and loyalty

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers how shoppers sign in (email, phone code, Google), their order history and saved addresses, finding an order without an account, wishlists, loyalty points, referrals and store credit. Medusa 2.22.2 already ships email-and-password accounts with order history and an address book in the starter, plus a Google login provider; phone login, wishlists and points exist only as official guides you build from, and none of this needs Medusa Cloud or a paid plan. Launch with guest checkout plus the existing accounts and a working forgot-password flow, add phone-code login (with old guest orders pulled in) and a wishlist soon after, and leave points, referrals and store credit for later.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Customer accounts with passwordless sign-in (6-digit email code), order history, saved addresses, self-serve returns | Native ("customer accounts") | All plans. The older email-and-password accounts are deprecated, and new stores could not turn them on from Feb 2026 (Shopify staff post) | help.shopify.com compare-features; community.shopify.dev |
| Sign in with Shop, Google, Facebook | Native, new accounts only | Shop sign-in depends on Shop Pay, which Pakistan lacks (report 03) | help.shopify.com customer-accounts |
| Your own identity provider | Native | Plus only | help.shopify.com customer-accounts |
| Phone number or SMS code login | App only | Neither account version offers it (seen). Apps: Ex OTP Login (Islamabad developer, free up to 50 codes), Simplify My Login, OTP+ (vendor says, 2026-11-06) | apps.shopify.com/login-with-phone-number, /login-using-otp, /otp-plus-social-login |
| Store credit | Native, new accounts only | Issued by admin, API or refund, with an expiry per issue. The customer must apply the whole balance. Stores created from 12 May 2025 pay third-party fees on credit-paid amounts | help.shopify.com store-credit |
| Wishlist | App only | Wishlist Hero (free plan), Joy Wishlist (free), Growave (free to 200 orders a month) (vendor says, 2026-11-05) | apps.shopify.com wishlists category |
| Loyalty points, VIP tiers, referrals | App only | Smile: free to 200 orders a month, then $15, $79 or $199 a month. Joy: free to 250 orders (vendor says, 2026-11-05) | apps.shopify.com/smile-io, /joyio |
| Referral-only programme | App | SC Conjured Referral, from $19 a month plus commission (vendor says) | apps.shopify.com/referral-program |

## What real shops do
I checked 8 shops on 2026-11-05 and 2026-11-06: login pages for 6, homepages for 5, and no more than 2 pages per shop. Shopify's hosted login page answered our requests with HTTP 406, which I did not retry, so I never saw its sign-in methods.

Pakistan:
- Gul Ahmed, Junaid Jamshed, Beechtree and Bonanza Satrangi: `/account/login` sends you to Shopify's hosted account page (shopify.com/<id>/account; for Gul Ahmed, account.gulahmedshop.com). That means they use the new accounts, which sign in with an email code by default (seen redirect; methods unseen).
- Outfitters: the old account form with only email and password. No phone, social or code markers (seen).
- Sapphire: `/account/login` returns 404 on pk.sapphireonline.pk, which runs on Salesforce Commerce Cloud (report 03).
- Junaid Jamshed: a heavy wishlist built into the theme, with heart toggles, a popup and a counter. Its app blocks are reviews, image search, merchandising and WebEngage, with no loyalty app (seen).
- Maria B: a wishlist app served at `/apps/wishlist/`, with hearts on product cards keyed by product, not by size (seen).
- Gul Ahmed runs Ideas Rewards (official FAQ, read through search results; the page returned 404 to our fetch):
  - points on every purchase, online and in store, usable for part or full payment;
  - four tiers set by six months of spending (Bronze, PKR 5,000 to 20,000, earns 1%);
  - membership keyed to the mobile number and joined with an SMS code.
- Pakistani shoppers look orders up by order number and phone on track pages, without logging in (report 02).

Global:
- Gymshark: its own programme, Gymshark Loyalty, where each product shows the XP it earns. Wishlist buttons sit on collection cards. The "rivo" marker hits were image IDs, not the Rivo app (seen).
- Kylie Cosmetics: the Yotpo Loyalty and Rewards app block, plus wishlist code (seen).
- Allbirds: the loyalty and referral hits were privacy-policy text and the word "frivolous". It is a false positive (seen).
- Gymshark gives $10 for a referral, and Brooklinen sells store credit as a gift card (report 05).

Marker counts (README: accounts 7/4, wishlist 6/4, loyalty 0/3):
- Accounts: too low. Beechtree had no marker but does have accounts, so most Pakistani shops have them.
- Wishlist: held for Junaid Jamshed and Maria B. The others were not rechecked.
- Loyalty: 0/12 for Pakistan misses Gul Ahmed, whose scheme runs outside a Shopify app. The global count held for Gymshark and Kylie, and Allbirds was wrong.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Email and password accounts | Built in | `@medusajs/auth-emailpass`. Starter: `modules/account/components/login`, `register`; after login the guest cart moves to the customer (`transferCart` in `lib/data/customer.ts`). Admin: Customers |
| Email verification | Built in, off | `projectConfig.http.authVerificationsPerActor` (since 2.16), not set in `medusa-config.ts`. Starter has `/verify-account`. Needs an email provider (report 10) |
| Forgot password | Partial | Backend: `POST /auth/customer/emailpass/reset-password` emits `auth.password_reset` (docs reset-password). There is no subscriber or provider, and no starter page (seen by grep) |
| Google login | Built in, not configured | `@medusajs/auth-google` is installed. The OAuth flow and a storefront guide are documented. The starter has no button and no callback page |
| Facebook or Apple login | Missing | Only emailpass, Google, GitHub and OIDC providers ship. Facebook would need a custom `AbstractAuthModuleProvider`; whether `auth-oidc` fits it is unverified |
| Phone code (OTP) login | Missing, official tutorial | docs phone-auth: custom auth provider (phone as `entity_id`, a signed 6-digit code valid 60 s) plus a Twilio `sms` notification provider and starter screens. Problems: see below |
| Profile: name, phone, password, billing address | Built in | Starter `/account/profile`. Email change is a stub (`profile-email/index.tsx` TODO), and the Store API cannot change email |
| Address book with default shipping and billing | Built in | `@medusajs/customer` (`CustomerAddress`). Starter `/account/addresses`. Admin customer page |
| Order history and details | Built in | `GET /store/orders` (login required). Starter `/account/orders` and `/account/orders/details/[id]` |
| Guest orders joining an account | Partial | Registering creates a second customer row (`has_account: true`), and guest orders stay on the guest row, which can never be flipped (docs customer-accounts). The starter "Order transfers" form asks for an order ID. Medusa then makes a token and emits `order.transfer_requested`, but nothing sends it today. Admin can transfer an order by hand |
| Order lookup without an account | Partial | `GET /store/orders/:id` is open to anyone with the ID (docs secure-order-retrieval). Lookup by number plus phone is missing (report 02) |
| Customer groups for tiers | Built in | `@medusajs/customer` groups, usable in promotion and price-list rules (report 05). Admin: Customer Groups |
| Wishlist | Missing, official guide | docs plugins/guides/wishlist: `Wishlist` per customer per sales channel, `WishlistItem` per variant, a share token, a product count widget for the admin, logged-in only, no storefront. Community packages exist (`@alphabite/medusa-wishlist` 0.7.6, 2026-10-18; `@rsc-labs/medusa-wishlist`), not reviewed |
| Loyalty points | Missing, official tutorial | docs loyalty-points: a custom module, points added on `order.placed`, spent as a one-off per-customer promotion, checked in `completeCartWorkflow.hooks.validate`. The official loyalty plugin has no points (2.22.2 code: gift cards and store credit only) |
| Referrals | Missing | No guide in the docs index and no Medusa package found on npm (searched 2026-11-05) |
| Store credit | Built in via plugin, not installed | `@medusajs/loyalty-plugin` 2.22.2, covered in report 05. For accounts: `/store/store-credit-accounts` lists the balance, an account can be claimed by code, and applying credit needs a logged-in owner of the cart. A refund to credit fails for guests. Credit has no expiry field |
| Cloud or paid plan | Not needed | The packages are MIT on npm and the docs install them with no Cloud step. Cloud pricing lists hosting and Medusa Emails, with no account or loyalty features (docs cloud/pricing) |

Phone login on our version (read in code, not run):
- 2.22.2's `validateCustomerAccountCreation` rejects a new customer unless the customer's email matches the login identity's `entity_id` or `user_metadata.email`. The tutorial sets neither, so its sign-up fails on 2.22.2.
- 2.22.3 (released 2026-11-04) skips that check when the identity has no email, and adds a `validate` hook (release notes, docs customer-accounts).
- An email is still required either way. The tutorial invents `<phone>@gmail.com`, which may be a real stranger's inbox.
- It has no attempt limit and no rate limit, and it sends the code in the query string, which ends up in Nginx logs.

## What we would build
1. Forgot password (S). Add a subscriber on `auth.password_reset` and a starter request page and reset page, following the docs guide. It depends on report 10's email provider (or WhatsApp). Also hide the email-change stub. Risk: until a provider exists, a customer who forgets their password is locked out.
2. Phone code login (M). Follow the phone-auth tutorial with these fixes:
   - normalise numbers to +923XXXXXXXXX (report 01);
   - keep a hashed code that lasts 5 minutes and allows 5 attempts;
   - rate-limit by phone and IP in a middleware and in Nginx, since Medusa has none (report 01);
   - send the code as a WhatsApp authentication template (about $0.015, report 10), with SMS through a local aggregator as the fallback;
   - list the provider in `authMethodsPerActor`;
   - on 2.22.2, store the placeholder email in `user_metadata.email`, or upgrade to 2.22.3 first;
   - use a placeholder domain we own, never gmail, and block mail sent to it.

   Share the code service with report 01's checkout code. Risks: SMS pumping, slow SMS delivery, and recycled SIMs that would show a stranger old orders (mask addresses).
3. Pull in guest orders after phone login (S to M). A workflow finds guest orders whose shipping phone matches the verified number. It runs `requestOrderTransferWorkflow`, reads the token stored on the order change, then runs `acceptOrderTransferWorkflow` (token use seen in code, flow not run). Risk: one phone shared by a family.
4. Google login (S). Configure `@medusajs/auth-google` and re-add emailpass when overriding providers. Add the button and callback page from the storefront guide.
5. Wishlist (M). A custom module and links as in the official guide. Store `product_id`, with an optional variant, because shoppers save a dress before picking a size. Guests keep the list in the browser, and it merges into the account at login. Add a heart on cards and product pages and an account page. It can feed report 07's back-in-stock alert. The guide's admin widget shows demand per product.
6. Loyalty points and tiers (M to L). Start from the tutorial, with changes for COD:
   - earn on `delivery.created` or order completion, not `order.placed`, because refused COD parcels must not earn;
   - take points back on return or cancel;
   - keep a ledger with expiry;
   - recompute Gul Ahmed-style tiers into customer groups with a scheduled job.

   The tutorial's `validate` hook handler is the only one allowed and report 01 also needs it, so combine both checks in one handler. It needs item 2 if membership is keyed to the phone.
7. Referrals (M). A custom module with a code per customer. Reward both sides with a promotion code or store credit only after the friend's first delivered order, one reward per phone.
8. Store credit in the account (S, after report 05 installs the plugin). Show the balance on `/account` and an Apply button at checkout. Guests get a credit account with a code that they claim after signing up, or a gift card.

## Recommendation
- Launch:
  - guest checkout as the default: Pakistani brands sell that way, and Medusa supports it today;
  - existing email accounts, order history and address book: already built, so ship them, with forgot password (item 1) once report 10's provider exists;
  - order lookup by number plus phone: report 02 covers it, and shoppers expect it more than a login.
- Soon after launch:
  - phone code login with guest-order pull-in (items 2 and 3): customers in Pakistan are known by their mobile number, and it reuses reports 01 and 10;
  - wishlist (item 5): seen at Junaid Jamshed and Maria B, cheap, and useful for clothing;
  - Google login (item 4): the provider already ships, so it is small.
- Later:
  - points and tiers (item 6): only Gul Ahmed runs them in Pakistan, and they need phone identity and delivery-based earning first;
  - store credit in the account (item 8): it waits on report 05's plugin decision;
  - referrals (item 7): open to abuse with COD, and seen only abroad.
- Skip:
  - Facebook and Apple login: a custom provider for little gain;
  - two-step login with an authenticator app for shoppers: not needed.

## Questions for the owner
1. Should a customer account be keyed to the mobile number (a code by WhatsApp or SMS, about $0.015 each) or to email and password?
2. Do you want a points programme in year one? If yes, should points be earned only after delivery, and at what rate (for example, 1% like Gul Ahmed's Bronze tier)?
3. Should guests be able to keep a wishlist in their browser, or should saving items need an account?

## Sources
- node_modules/@medusajs/{auth,auth-emailpass,auth-google,auth-oidc,customer,core-flows,medusa,js-sdk,notification}/AGENTS.md and dist (validate-customer-account-creation.js, transfer/*.js, api/store/orders); apps/storefront/src/{modules/account,lib/data/customer.ts,lib/data/orders.ts,app}; apps/backend/medusa-config.ts
- https://registry.npmjs.org/@medusajs/loyalty-plugin (2.22.2 tarball read)
- https://api.github.com/repos/medusajs/medusa/releases/tags/v2.22.3
- https://docs.medusajs.com/resources/how-to-tutorials/tutorials/phone-auth.md , /tutorials/loyalty-points.md
- https://docs.medusajs.com/resources/plugins/guides/wishlist.md
- https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers.md , /auth/email-verification.md , /auth/reset-password.md
- https://docs.medusajs.com/resources/storefront-development/customers/third-party-login.md
- https://docs.medusajs.com/resources/commerce-modules/customer/customer-accounts.md
- https://docs.medusajs.com/resources/commerce-modules/order/secure-order-retrieval.md , /order/transfer-to-guest.md
- https://docs.medusajs.com/resources/commerce-modules/store-credit.md , /store-credit/concepts , /loyalty.md ; https://docs.medusajs.com/user-guide/loyalty.md , /loyalty/store-credits.md
- https://docs.medusajs.com/cloud/pricing.md ; https://medusajs.com/blog/announcing-store-credits-and-gift-cards/
- https://registry.npmjs.org/-/v1/search (wishlist, loyalty, phone, referral queries)
- https://help.shopify.com/en/manual/customers/customer-accounts , /customer-accounts/upgrade/compare-features , /customers/store-credit
- https://community.shopify.dev/t/legacy-customer-accounts-availability-update/31724
- https://apps.shopify.com/login-with-phone-number , /login-using-otp , /otp-plus-social-login , /smile-io , /joyio , /growave , /referral-program , /categories/marketing-and-conversion-customer-loyalty-wishlists/all
- Shop pages: outfitters.com.pk/account/login; /account/login on gulahmedshop.com, junaidjamshed.com, beechtree.pk, bonanzasatrangi.com, pk.sapphireonline.pk; homepages of junaidjamshed.com, mariab.pk, gymshark.com, kyliecosmetics.com, allbirds.com
- https://gulahmedshop.com/ideas-rewards-faqs (through search results; direct fetch 404)
