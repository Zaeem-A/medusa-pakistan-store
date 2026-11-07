# Couriers and tracking

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers four jobs: booking a Pakistani courier for each order with its airway bill (CN), giving the customer a tracking link and live status, recording delivery or return-to-origin (RTO), and checking the courier's COD remittance against orders. Medusa 2.22.2 has the right framework: fulfillment providers that return tracking labels, shipments, mark-as-delivered, events and an admin shipment form. It has no provider for any Pakistani courier, no courier status updates and no reconciliation, and neither the store API nor the starter storefront ever shows a tracking number. At launch, book in the courier's own portal, type the CN into Medusa and add a track-order page. Soon after, build one courier provider, a status-polling job and a COD settlement ledger.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Tracking number on a fulfillment, linked to the carrier | Native | All plans. Unknown carriers show the number with a link to the carrier site | [1] |
| Order status page: Confirmed, On its way, Out for delivery, Delivered | Native | Live stages only for supported carriers. Otherwise the page stays at Confirmed until the order is marked delivered by hand | [2] |
| Shipping confirmation and shipping update emails | Native | Can be turned off per fulfillment | [1], [3] |
| Bulk fulfillment | Native | All plans | [4] |
| Buying labels in the admin (Shopify Shipping) | Native, not in Pakistan | Listed for US, Canada, Australia, UK and a few EU countries. No Pakistani courier | [5], [6] |
| Carrier-calculated rates from your own carrier account | Native | Advanced and Plus. Grow pays a fee or bills annually. UPS, FedEx, USPS, Australia Post and Canada Post only | [7] |
| Pakistani courier booking, CN or airway bill, loadsheet | App | PostEx official app: free, courier bills per order, 2.9 stars from 10 reviews. Universal Courier Pakistan (Devsol): 10 bookings a day free, $5 for 1,000 bookings in 30 days, $25 for unlimited over 12 months, 20 couriers named. Courierfy (GrowZar, launched 2026-01-30): $9.99, $19.99 or $99.99 a month, 6 couriers. Prices seen 2026-11-05 | [8], [9], [10] |
| Courier status synced back into the order | App | Courierfy and Universal Courier claim automatic sync (vendor says). The PostEx app does not list it | [8], [9], [10] |
| Branded tracking page, tracking sent by WhatsApp | App | Universal Courier Pakistan (vendor says) | [9] |
| COD settlement reconciliation | App or outside service | Not native. Courierfy Pro lists a settlement discrepancy audit (vendor says). Aggregators Orio and Flaship advertise fast COD payouts to a wallet (vendor says) | [10], [11], [12] |
| Single-courier booking apps (BlueEx, Trax, Swyft) | App | Free Devsol apps. The Swyft app has 0 reviews | [13], [14], [15] |

The All In One Courier app (Wovrex) is no longer on the App Store (seen).

## What real shops do
Pakistan, checked 2026-11-06. I fetched the homepage and the linked track page for six shops (12 requests, all returned 200):
- Sapphire: the track link goes to pk.sapphireonline.pk/track. That host runs Salesforce Commerce Cloud, not Shopify (page title and Salesforce scripts seen). The page has a field for the consignment number (CN) and one for the order number.
- Junaid Jamshed: TRACKar by Unity Retail (trackar.unityretail.com/jdot, which now redirects to trackar.firaasa.com). One box takes an order ID or a tracking number, and there is a support-ticket form with an OTP step (seen).
- Outfitters: outfitters.ginkgoretail.net/ordertracking, a JavaScript app run by their retail system vendor Ginkgo Retail. I could not see its fields without running the page (unverified).
- Bonanza Satrangi: track.siardigital.com/bonanza, Siar Digital's order tracking (beta). It asks for the order number plus a phone or email (seen).
- Maria B: the Shopify page /pages/oms-tracking-page uses a custom theme template that loads its content by script. Which system or courier sits behind it is unverified.
- Zellbury: /pages/tracking-page is only delivery and returns policy text, with no lookup form (seen).
- The pattern: the big brands track orders through their order-management or ERP vendor, outside Shopify, and look orders up by order number plus phone. No courier is named on any of these 12 pages, so the shops hide the courier behind their own page.
- Delivery fees and courier attempt policies (Gul Ahmed PKR 249 flat; Bonanza PKR 199 prepaid and PKR 249 COD; Outfitters makes two courier attempts before return) are in report 01.
- Not re-checked, to save requests and avoid blocks: Limelight, Gul Ahmed, Ethnc, Beechtree, Nishat, Breakout.

Global: not re-checked this session. The first scan's tracking marker matched Gymshark, Fashion Nova and Kylie Cosmetics (3 of 6), and none of the global shops mentioned a Pakistani courier. Which tracking tool they use is unverified.

Marker counts:
- README "PK couriers 6/0" (6 of 12 Pakistani shops) did not hold up. None of the six re-checked homepages names a courier. Junaid Jamshed's only hit was the SKU fragment BLUE-EXS (blue, size XS) matching "blue-ex".
- README "tracking 10/3" mostly held for Pakistan. All six checked shops link to a track page, but Zellbury's is a policy page.

## What Medusa already has
| Capability | Built in, Partial or Missing | Where |
| --- | --- | --- |
| Fulfillment sets, service zones, geo zones, shipping options and profiles | Built in | `node_modules/@medusajs/fulfillment/AGENTS.md` |
| Our setup: manual provider, one "Standard Delivery" option at PKR 250 for all of Pakistan | Built in (configured) | `apps/backend/src/scripts/setup-pakistan.ts` (`manual_manual`) |
| Custom fulfillment provider: `createFulfillment` returns `data` plus `labels` (`tracking_number`, `tracking_url`, `label_url`); also `calculatePrice`, `cancelFulfillment`, `getShipmentDocuments` | Built in (extension point) | docs `references/fulfillment/provider`; `@medusajs/fulfillment-manual/AGENTS.md` |
| A provider for any Pakistani courier | Missing | The Medusa integrations page lists only ShipStation for fulfillment. Web searches found no Medusa plugin (npm not checked directly) |
| Shipment with tracking labels typed in by staff | Built in | `POST /admin/orders/:id/fulfillments/:fulfillment_id/shipments` (each label has tracking number, tracking URL and label URL, `@medusajs/medusa/dist/api/admin/orders/validators.js`); admin create-shipment form |
| Mark a fulfillment delivered | Built in | `markOrderFulfillmentAsDeliveredWorkflow`, admin button |
| Events | Built in | `order.fulfillment_created`, `shipment.created`, `delivery.created` (`@medusajs/utils/dist/core-flows/events.js`). Our code has no subscribers (`apps/backend/src/subscribers/` has only a README) |
| Order fulfillment status | Partial | Not fulfilled through delivered, plus canceled (`@medusajs/types` `FulfillmentStatus`). No in-transit, failed-attempt or RTO state |
| Cancel a booking | Partial | `cancelFulfillment` refuses once `shipped_at` or `delivered_at` is set, so a returned parcel needs the return flow (report 12) |
| Rates by city | Partial | A city geo zone needs country, province code and city, matched against the cart address (`fulfillment-module-service.js`). The storefront's "State / Province" box is free text, so a city zone would not match reliably. The manual provider cannot calculate prices |
| Tracking shown to the customer | Missing | `GET /store/orders/:id` allows `fulfillments` but not `fulfillments.labels`, and allowed fields must match exactly (`store/orders/query-config.js`, framework `field-validator.js`; read from code, not tested live). The order page shows only a status word (`apps/storefront/src/modules/order/components/order-details/index.tsx`) |
| Guest track-order lookup | Missing | The store order route opens only by order ID. There is no lookup by order number plus phone, and the storefront has no track page |
| Courier status updates (webhook or polling) | Missing | No fulfillment webhook route exists (payments have one). The ShipStation guide has no status updates either |
| COD remittance reconciliation | Missing | Payment capture exists (`capturePaymentWorkflow`, admin capture button, see report 03), but nothing ties a capture to a courier statement |
| Airway bill and loadsheet printing | Partial | `label_url` can point at the courier's PDF. No bulk print and no loadsheet |

Admin: staff can create fulfillments, add tracking labels to a shipment and mark it delivered. The admin has no courier booking, no status timeline and no settlement view. Storefront: no tracking anywhere.

## What we would build
Courier APIs, checked 2026-11-05 and 2026-11-06 with one unauthenticated request each:
| Courier | API exists? | Public docs? |
| --- | --- | --- |
| PostEx | Yes (seen). api.postex.pk answers and asks for a `token` header. The error reply included a full server stack trace | No official docs found. A community Laravel wrapper (API v4.1.9) covers create order, tracking (10 per call), airway bill, loadsheet, cancel, city check and payment status [16] |
| Leopards | Yes (seen). merchantapi.leopardscourier.com replies that an API key is required | No public docs. Leopards issues an API key and password. Community PHP wrapper covers book, track and cities [17] |
| TCS | Unverified. ociconnect and devconnect.tcscourier.com returned 502 | None found. An Odoo vendor says you need an account number, API user and cost centre [18] |
| Trax | Yes (seen). sonic.pk/api asks for an Authorization token. trax.pk now redirects to slgtrax.com | None public |
| M&P | Host seen (mnpcourier.com/mycodapi), API unverified | None. Asaan Retail connects with a username, password and account number [19] |
| BlueEx | Vendor says: its site advertises a COD API and plugins | None found. A Devsol Shopify app uses it [13] |
| Swyft | Unverified. swyftlogistics.com did not resolve on 2026-11-06 | None |
| Rider | Unverified. withrider.com resolves but did not answer | None |

1. Track-order page and tracking on the order page (S). Add a store route `src/api/store/track/route.ts`. It takes the order number plus a phone number (normalised as in report 01) and returns status, courier, CN, tracking link and dates, using Query on order, then fulfillments, then labels. Add rate limiting in `middlewares.ts`, a storefront route `app/[countryCode]/(main)/track` and a tracking block on the order page. Risk: people guessing order numbers, so require a phone match and return as little data as possible.
2. One courier provider (M). A fulfillment provider in `src/modules/<courier>` registered in `medusa-config.ts`, with the API token in an environment variable.
   - `validateFulfillmentData` checks the city is serviceable.
   - `createFulfillment` books the parcel with the outstanding COD amount and returns the CN as `tracking_number`, plus the courier tracking URL and the airway bill as `label_url`.
   - `cancelFulfillment` cancels the booking.
   - Booking must go through report 01's confirmation guard.
   - Dependency: a merchant account, because docs come only with an account. Risks: undocumented APIs, PostEx's leaky error replies, and a wrong COD amount if the order is edited after booking.
3. Status sync (M). A custom module `courier-shipment` with status events, linked to the fulfillment by a module link.
   - A scheduled job in `src/jobs/` polls open CNs every 30 to 60 minutes. A webhook route goes in `src/api/hooks/` wherever a courier offers webhooks.
   - Courier codes map to booked, picked up, in transit, out for delivery, failed attempt, returning, delivered and returned.
   - Pick-up runs `createShipmentWorkflow`. Delivery runs `markOrderFulfillmentAsDeliveredWorkflow`. An RTO hands the order to the return flow (report 12) and to report 01's phone history.
   - Risk: courier status lists and rate limits stay unknown until we have an account.
4. Shipment messages (S, after report 10's provider). Subscribers on `shipment.created` and `delivery.created`, plus custom events for out-for-delivery and failed attempts, send the tracking link by WhatsApp or SMS.
5. City rates (S to M). Option A: a province dropdown with fixed codes plus a flat option per city zone. Option B: `calculatePrice` in the courier provider using a city-to-rate table that also checks serviceability. Neither is needed for a single nationwide rate.
6. COD settlement ledger (M). A `cod-settlement` module with a Settlement (courier, statement reference, date, fees) and Settlement lines (CN, COD amount, charges, amount paid).
   - Staff import the courier's statement CSV in an admin route. The courier API can feed it later (PostEx payment status, per the community wrapper only).
   - A workflow matches lines to orders, runs `capturePaymentWorkflow` for the amount paid and flags mismatches: wrong amount, delivered but unpaid after N days, or paid but returned.
   - An admin page lists the flags. Risk: every courier uses a different statement format and deducts its fees differently.
7. Airway bill and loadsheet printing (S). An order widget opens `label_url`. An admin route merges several airway bills into one PDF and requests the loadsheet from the courier.
8. Aggregators (Orio, Flaship, TrackKaro) could replace items 2, 3 and 6 with one integration, but I found no public API docs for any of them (unverified).

## Recommendation
- Launch:
  - Book in the courier's portal and type the CN into Medusa's built-in shipment form. This needs no build and works with any courier.
  - Track-order page and tracking on the order page (S). Every checked Pakistani brand offers order-number-plus-phone lookup, and Medusa hides tracking today.
  - Keep the flat nationwide rate. This matches the big shops' flat PKR 150 to 249 fees.
- Soon after launch:
  - One courier provider with booking and airway bill. It ends typing every order twice.
  - Status polling with RTO states. COD returns have to be caught, and report 01's phone history depends on them.
  - COD settlement ledger. Couriers hold the cash for a week to a month, according to PostEx in press coverage from 2021 to 2024 (vendor says).
  - Shipment WhatsApp messages. Buyers expect them, once report 10's provider exists.
- Later:
  - A second courier, choosing the courier by city, city rates and serviceability checks. Worth it only after delivery data shows where the first courier fails.
  - Bulk airway bill and loadsheet printing. It becomes painful only at high daily volume.
  - Settlement fed by API. CSV import covers it until then.
- Skip:
  - Shopify-style carrier-calculated rates and label buying. No Pakistani carrier offers them.
  - Paid tracking aggregators such as TrackingMore. The courier's own API is free with the account.

## Questions for the owner
1. Which courier will you sign with first (PostEx, Leopards, TCS, Trax or M&P)? The first provider depends on it, and API docs come only with a merchant account.
2. Do you want PostEx-style upfront COD payment, where the courier advances cash (vendor says), or standard remittance? The answer changes the reconciliation design.
3. One flat delivery fee, or different fees by city, a free-delivery threshold, or a COD surcharge (see report 01)?

## Sources
1. https://help.shopify.com/en/manual/orders/status-tracking/add-tracking-numbers
2. https://help.shopify.com/en/manual/fulfillment/setup/order-status-page/order-tracking
3. https://help.shopify.com/en/manual/fulfillment/setup/notifications/customer-notifications
4. https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/bulk-fulfillment
5. https://help.shopify.com/en/manual/fulfillment/shopify-shipping/index
6. https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/buying-labels
7. https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/third-party-carrier-calculated-shipping
8. https://apps.shopify.com/postex-official
9. https://apps.shopify.com/universal-courier-pakistan
10. https://apps.shopify.com/courierify (also https://apps.shopify.com/all-in-one-courier)
11. https://getorio.com/blog/common-e-commerce-delivery-problems-and-how-orio-solves-them
12. https://www.flaship.pk/
13. https://apps.shopify.com/blueex-courier-pakistan, https://www.blue-ex.com/
14. https://apps.shopify.com/trax-pakistan
15. https://apps.shopify.com/swyft-logistics-official
16. https://packagist.org/packages/cw-alihyder/postex-laravel
17. https://github.com/developifynet/leopardscod-php
18. https://ecosire.com/apps/odoo/tcs-courier-connector
19. https://asaanretail.freshdesk.com/support/solutions/articles/150000004116-m-p-integration-and-booking
20. PostEx payment cycle and upfront model: https://dawn.com/news/1650256/pakistani-startup-postex-raises-15m-for-its-fintech-and-logistics-platform, https://profit.pakistantoday.com.pk/2024/12/20/zindigi-and-postex-set-to-revolutionise-e-commerce-with-digital-cod-payments
21. Courier API probes: https://api.postex.pk/services/integration/api/order/v1/get-operational-city, https://merchantapi.leopardscourier.com/api/getAllCities/format/json/, https://sonic.pk/api/cities, https://ociconnect.tcscourier.com/, https://mnpcourier.com/mycodapi/
22. Shop track pages: https://pk.sapphireonline.pk/track, https://trackar.unityretail.com/jdot/, https://outfitters.ginkgoretail.net/ordertracking, https://track.siardigital.com/bonanza, https://www.mariab.pk/pages/oms-tracking-page, https://www.zellbury.com/pages/tracking-page
23. Medusa: https://docs.medusajs.com/resources/references/fulfillment/provider.md, https://docs.medusajs.com/resources/commerce-modules/fulfillment/item-fulfillment.md, https://docs.medusajs.com/resources/integrations/guides/shipstation.md, https://docs.medusajs.com/resources/integrations.md
