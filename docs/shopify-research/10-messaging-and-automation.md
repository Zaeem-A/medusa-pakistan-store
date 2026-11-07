# Messaging and marketing automation

Researched 2026-11-05 against Medusa 2.22.2.

## Summary
This area covers order and shipping messages, abandoned checkout recovery, email, SMS and WhatsApp campaigns, customer segments and signup popups. Medusa provides the plumbing (Notification Module, events, subscribers, scheduled jobs, an official abandoned cart tutorial), but our store sends nothing: no email provider is configured, no subscriber handles `order.placed`, and the thank-you page still promises an email. Fix the confirmation email first. Next, require a phone number and capture WhatsApp consent at checkout, and treat WhatsApp as the main channel for Pakistan. Leave campaigns and segments to an outside email tool until later.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Order, shipping and cancel emails | Native | Editable templates under Settings > Notifications on all plans (seen) | help.shopify.com notification templates |
| Order SMS notifications | Native | Not confirmed for Pakistan (unverified) | none found |
| Abandoned checkout recovery | Native | A checkout counts as abandoned 10 minutes after the email is entered. The newer automation waits 10 hours by default and sends only to marketing subscribers. These emails are free and do not count toward the allowance (seen, search summary of help pages) | help.shopify.com abandoned-checkouts, Messaging pricing |
| Email campaigns and automations (Shopify Messaging) | Native app | 10,000 emails a month free, then $1 per 1,000 (seen 2026-11-05). Templates for abandoned cart, browse and checkout, welcome and win-back | apps.shopify.com/shopify-messaging |
| SMS and WhatsApp inside Shopify Messaging | Native app | Listed as channels and charged separately. SMS and WhatsApp automations go only to marketing subscribers. Pakistan availability unverified | listing, automations help page |
| Customer segments | Native | Filter editor backed by ShopifyQL. Membership updates automatically and segments can be campaign audiences (seen) | help.shopify.com customer-segmentation |
| Popups and signup forms | Shopify Forms (Shopify app) | Signups tag customers, and tags feed segments (seen). Price unverified | help.shopify.com forms-app |
| Rule-based automation | Shopify Flow | Has a "customer abandons checkout" trigger and can tag customers or update metafields (seen) | help.shopify.com Flow trigger |
| Email and SMS marketing suite | App | Klaviyo: free tier of 250 profiles and 500 emails a month (vendor says). Its SMS country list leaves out Pakistan (seen, article updated 2026-03-09) | klaviyo.com/pricing, help.klaviyo.com |
| Pakistan SMS order alerts | App | Branded SMS Pakistan (H3 Technologies, Karachi): free to $15 a month, abandoned cart SMS only on the $15 plan, rated 5.0 from 60 reviews (vendor says, 2026-11-05) | apps.shopify.com/branded-sms-pakistan |
| WhatsApp cart recovery | App | Many listings, for example Alintro and Dondy (vendor says, not evaluated) | apps.shopify.com |

## What real shops do
- Scan matrix (homepages, 2026-11-05). Email or SMS tool markers: Pakistan 2/12 (Bonanza Satrangi, Maria B), global 5/6. Newsletter: 10/12 and 6/6. Popup: 11/12 and 5/6. WhatsApp: 8/12 and 0/6. COD markers: 3/12.
- I re-checked homepages on 2026-11-05 and 2026-11-06. Sapphire returned 200: newsletter and popup markup were there, with no email-tool or WhatsApp-tool marker and with Microsoft Clarity loaded. That matches the matrix row. Gymshark returned 200: a large newsletter footprint and a chat widget, but no email-tool marker in the HTML, so its tool probably loads outside the page code (unverified).
- 11 shops returned 403 to plain requests, and I did not retry: Bonanza, Maria B, Limelight, Gul Ahmed, Outfitters, Junaid Jamshed, Beechtree, Zellbury, Allbirds, Fashion Nova and Brooklinen. Our shared address probably triggered a block. As a result, I could not re-confirm the Pakistani Klaviyo-type markers.
- Takeaways. Newsletter signup and popups are close to universal, so those counts are credible, although "popup" also matches cart and menu popups. A dedicated email tool shows up far less often in Pakistan than abroad. Pakistani shops lean on WhatsApp links (8/12 versus 0/6 global), which fits WhatsApp as the local customer channel. No shop page was checked for SMS, since SMS leaves no storefront marker.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Notification Module (channels, providers, status and idempotency records) | Built in | `node_modules/@medusajs/notification/AGENTS.md`. By default only `notification-local` is registered, and only on the `feed` channel |
| Email provider | Built in but off | `@medusajs/notification-sendgrid`, commented out in `apps/backend/medusa-config.ts` |
| Resend, Mailchimp, Twilio SMS and Slack | Partial (official guides with custom provider code) | docs integrations: Resend, Mailchimp, phone-auth Step 3 (Twilio) |
| Order confirmation message | Missing | `apps/backend/src/subscribers/` has only a README. The built-in `configurable-notifications` subscriber listens for `order.created` and not `order.placed`, and no provider serves `email` |
| Lifecycle events | Built in | `order.placed`, `order.canceled`, `order.fulfillment_created`, `shipment.created`, `delivery.created`, `auth.password_reset`, `auth.verification_requested`, `cart.updated` (`@medusajs/utils` core-flows events) |
| Scheduled jobs | Built in | `apps/backend/src/jobs/` (empty). Jobs run only in `shared` or `worker` mode |
| Abandoned cart detection | Missing (official tutorial exists) | docs tutorial "Send Abandoned Cart Notifications". Community plugin `medusa-plugin-abandoned-cart` 0.1.0 (2026-08-16, one maintainer, unverified) |
| Static segments | Built in, admin UI | Customer groups in `@medusajs/customer`, with a Customer Groups page in the admin |
| Dynamic segments, campaigns, popups, consent field | Missing | The Customer model has no marketing-consent field (only `metadata`). Promotion "campaigns" are discount budgets, not messaging |
| WhatsApp provider | Missing | No official guide. An npm search (2026-11-05) found no Medusa WhatsApp plugin |
| Klaviyo | Community only | `@eancarr/klaviyo-medusa` 0.2.5 (2025-10-31, unverified) |

UI exposure:
- Admin. The notification bell shows only `feed` items, such as export results. There is no UI for templates, message logs per order, campaigns or abandoned carts.
- Storefront. `modules/order/components/order-details/index.tsx` tells the buyer that confirmation details were sent to their email.
- Checkout. The email field is required but phone is optional (`modules/checkout/components/shipping-address/index.tsx`).
- Account and lead capture. The account pages already handle a login that requires email verification (`lib/data/customer.ts`), which would also need email. There is no forgot-password page, newsletter form or signup popup. The only "popup" in the code is the free-shipping nudge.
- Medusa Emails, the managed email service, exists only on Medusa Cloud, so it does not apply to a Hetzner deployment.

## What we would build
1. **Smallest fix for the false email promise (S, under 1 day).**
   - Immediately: change the sentence in `order-details/index.tsx` so it no longer claims an email was sent.
   - Then:
     - Register one email provider in `medusa-config.ts`. Option 1 is the built-in SendGrid block. SendGrid's pricing page showed only a trial, so its cost is unverified. Option 2 is the Resend provider from the official guide, free for 3,000 emails a month with a 100-a-day cap, or $20 a month for 50,000 (seen 2026-11-05).
     - Keep `notification-local` registered on `feed`. Overriding `providers` removes the default, and the admin bell depends on it.
     - Add `src/subscribers/order-placed.ts` and a workflow built from `useQueryGraphStep` and `sendNotificationsStep`, with `idempotency_key` set to the order ID. This is Step 6 of the Resend guide.
     - Set SPF and DKIM on the sending domain.
   - Risk: after email is enabled, the built-in `order.created` subscriber may log failed sends (unverified, so test it).
2. **Order status emails (S).** Add subscribers for `shipment.created`, `delivery.created` and `order.canceled`, reusing the same provider and templates.
3. **Phone-first contact and consent (S).** Make phone required and normalize it to +92. Add an opt-in checkbox at checkout that states the store name, as Meta's opt-in rules require, and store the answer in cart and order `metadata`. Coordinate with report 04 (checkout) and report 01 (COD confirmation).
4. **WhatsApp provider (M).**
   - Build a custom notification provider on channel `whatsapp` for the WhatsApp Cloud API, following the provider-module reference. Send approved templates and add a webhook route for delivery status and opt-outs. Report 01's COD confirmation would use the same provider.
   - Dependencies: Meta business verification, a dedicated number and template approval.
   - Cost: Meta's USD list rate card, as linked from its pricing page on 2026-11-05, charges Pakistan $0.0473 per marketing message and $0.015 per utility, authentication or service message. Service messages are free for the first 1,000 a month per number. Since 2026-10-01, utility messages inside the 24-hour window are billed. At about PKR 280 per USD (rate assumed, not checked), that is roughly PKR 13 per marketing message and PKR 4 per utility message.
   - Rules: cart reminders count as marketing, and an order update that includes a promotion also becomes marketing. A new account can message 250 unique users per 24 hours until it verifies or reaches 2,000 quality sends.
   - Risk: a reseller (BSP) adds a platform fee or markup (vendor says PKR 3,000 to 14,000 a month locally, or 15 to 25% abroad).
5. **SMS fallback (S to M).** Build a custom `sms` provider for a PTA-licensed Pakistani aggregator. The Twilio guide shows the pattern.
   - Avoid Twilio for Pakistan: it lists $0.4734 per segment (2026-10), does not preserve the sender name and has no two-way SMS.
   - PTA rules (Gazette SRO 2402(I)/2022, seen):
     - Promotional SMS needs prior consent, gathered by message in English and Urdu.
     - It must include an unsubscribe option and arrive during normal business hours.
     - It must go through approved short codes or registered alphanumeric sender IDs.
     - Numbers on the central do-not-call register (3627) must be suppressed.
     - Repeat offenders are suspended within 24 hours.
     - Order updates appear to fall outside the promotional definition (my reading, not legal advice).
   - Local prices of about PKR 2.5 to 3.5 per SMS and sender ID fees of PKR 5,000 to 25,000 are vendor claims (unverified).
   - PTA's June 2026 consultation proposing Corporate SMS as a separate regulated market is still a proposal.
6. **Abandoned cart recovery (S to M).** Follow the official tutorial: a daily job finds incomplete carts with an email and items that have not been updated for a day, sends the notification, marks the cart metadata, and a storefront route at `cart/recover/[id]` restores the cart.
   - Adjustments for us:
     - Await the starter's async `setCartId`.
     - Use a signed token instead of the raw cart ID in the link, because the cart holds the address and phone.
     - Run the job hourly.
     - Send WhatsApp reminders only to opted-in buyers, as marketing messages.
   - Limit: in the starter, a cart has an email only after the address step.
7. **Newsletter signup and popup (S).** Build a footer form and an optional popup in the storefront, backed by a store API route. Save guests in a small custom module or as customers with consent `metadata`. The official Mailchimp guide is another option.
8. **Campaigns and dynamic segments (M).** Do not build an editor. Sync consented contacts and order totals through subscribers to an outside tool (Mailchimp guide, Klaviyo community plugin or Resend marketing at $40 a month for 5,000 contacts, seen) and segment there. Customer groups cover simple manual lists.
9. **Admin message log (S).** Add a widget on the order page listing notifications by `resource_id`, with their status, so staff can see what each buyer received.

## Recommendation
- **Launch:**
  - Order confirmation email via one provider, or at least correct the copy, because the page currently makes a false promise.
  - Phone required at checkout plus consent capture, because WhatsApp and SMS depend on them.
  - Shipping and cancel emails, which are cheap once the provider exists.
- **Soon after launch:**
  - The WhatsApp utility provider, which is shared with COD confirmation and is the channel Pakistani buyers read. Start Meta verification now.
  - Abandoned cart email, since the official tutorial makes it a few days of work.
  - Footer newsletter signup.
  - Admin message log.
- **Later:**
  - WhatsApp marketing reminders, which need opt-in and cost about PKR 13 each.
  - SMS fallback, which needs an aggregator contract and PTA-compliant sender registration.
  - Campaigns, segments and popups through an outside tool.
- **Skip:**
  - Klaviyo SMS (Pakistan is not supported).
  - Twilio SMS to Pakistan (expensive and the sender name is overwritten).
  - A home-built campaign editor (the outside tools already do this).

## Questions for the owner
1. Will WhatsApp be the main customer channel? If so, which business entity and dedicated number will go through Meta verification?
2. Should email stay required at checkout, or should checkout be phone-first with email optional? This decides the confirmation and recovery channels.
3. Will the launch send promotional messages (WhatsApp at about PKR 13 each, SMS under PTA consent rules), or transactional messages only?

## Sources
- https://docs.medusajs.com/llms.txt, https://docs.medusajs.com/resources/infrastructure-modules/notification.md, .../notification/send-notification.md, https://docs.medusajs.com/resources/references/notification-provider-module.md
- https://docs.medusajs.com/resources/how-to-tutorials/tutorials/abandoned-cart.md, https://docs.medusajs.com/resources/integrations/guides/resend.md, .../guides/mailchimp.md, https://docs.medusajs.com/resources/how-to-tutorials/tutorials/phone-auth.md, https://docs.medusajs.com/resources/integrations.md
- Local: `node_modules/@medusajs/{notification,notification-sendgrid,notification-local,customer,auth,medusa}/AGENTS.md`, `@medusajs/medusa/dist/subscribers/configurable-notifications.js`, `@medusajs/utils/dist/core-flows/events.js`, `apps/backend/medusa-config.ts`, `apps/storefront/src/...` files named above
- https://registry.npmjs.org/medusa-plugin-abandoned-cart, npm search API (2026-11-05)
- https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing (and its USD list rates file), .../templates/template-categorization, .../getting-opt-in/, .../messaging-limits/
- https://digiteazy.com/whatsapp-business-api-pricing-pakistan/ (2026-09-29), https://www.flowcall.co/blog/whatsapp-business-api-pricing (updated 2026-11-04)
- https://www.pta.gov.pk/category/regulations-1674158059-2023-05-30 and https://www.pta.gov.pk/assets/media/31-12-22_gazette_notification_protection_spam_regs_2022_2nd_amendment_31_03_2023.zip
- https://www.broadnet.me/blog/pakistan-a2p-sms-pta-sender-id-guide-2026, https://weproms.com/blog/pta-blocks-pakistani-store-marketing-sms/, https://www.brecorder.com/news/40423992, https://www.sent.dm/resources/pakistan-sms-pricing
- https://www.twilio.com/en-us/guidelines/pk/sms, https://www.twilio.com/en-us/sms/pricing/pk, https://www.twilio.com/en-us/sendgrid, https://resend.com/pricing
- https://apps.shopify.com/shopify-messaging, https://apps.shopify.com/branded-sms-pakistan, https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/email/pricing, https://help.shopify.com/en/manual/promoting-marketing/create-marketing/abandoned-checkouts, https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/marketing-automations/create, https://help.shopify.com/en/manual/shopify-flow/reference/triggers/customer-abandons-checkout, https://help.shopify.com/en/manual/fulfillment/setup/notifications/customizing-notification-template, https://help.shopify.com/en/manual/customers/customer-segmentation/create-customer-segments, https://help.shopify.com/en/manual/promoting-marketing/create-marketing/forms-app/manage
- https://www.klaviyo.com/pricing, https://help.klaviyo.com/hc/en-us/articles/4404274419355
- Shop homepages: www.sapphireonline.pk, www.gymshark.com (200); 11 others returned 403 as listed above
