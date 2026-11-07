# Reviews and social proof

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers product reviews and star ratings, photo reviews, asking for a review after delivery, moderation, stars in Google results, Q&A, Instagram and customer content feeds, and trust badges. Medusa 2.22.2 has no review feature in any package, but an official tutorial builds a review module with admin moderation and a storefront section, and the 2.22 framework provides the remaining pieces: the `delivery.created` event, the File Module and admin extensions. Build reviews ourselves on top of that tutorial, with a signed review link sent after delivery so guest COD buyers can review, and add trust badges at launch; outside review services are either tied to Shopify (Judge.me) or a heavy integration with unpublished pricing (Yotpo).

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Product reviews and stars | App only. Shopify's own Product Reviews app was delisted in 2023 (exact cut-off dates differ between sources, unverified) | Judge.me: Free, Awesome $15/month; 5.0 stars from 49,679 reviews (seen 2026-11-05) | [1], [2] |
| Photo and video reviews | App | Judge.me Free includes unlimited photo and video reviews (vendor says, 2026-11-06). Loox: free tier with an order cap, Convert $49.99/month for 300 orders plus $50 per extra 300, Unlimited $299.99/month; 4.9 from 10,035 reviews (seen 2026-11-05) | [2], [3] |
| Review request after fulfillment, reminders | App | All three apps send requests. Judge.me reminders need Awesome. Yotpo: Free up to 50 orders a month, Starter $15, Pro $119, price rises with order volume; 4.8 from 4,628 reviews (seen 2026-11-05) | [2], [4] |
| SMS or WhatsApp requests | App | Judge.me lists SMS as a way to collect reviews, on an unstated plan. None of the three listings mentions WhatsApp (seen 2026-11-06) | [2] |
| Moderation, replies, review coupons | App | Built into all of these apps. Judge.me coupons need Awesome (vendor says) | [2] |
| Stars in Google results | App adds JSON-LD | Judge.me Free includes rich snippets. Google accepts `aggregateRating` on Product only when the rating is also visible on the page | [2], [5] |
| Q&A | App | Judge.me Awesome includes a Q&A widget (vendor says) | [2] |
| Instagram and customer content feed | App | GSC Instagram Feed (Getsitecontrol): Free (1 widget), Grow $9/month, Unlimited $29/month; 4.9 from 317 reviews (seen 2026-11-06). Foursixty and Firework appear at one global shop; their prices were not checked | [6] |
| Trust badges | Theme section or app | No trust-badge app was seen at any of the 18 shops | this scan |

## What real shops do
Method: on 2026-11-05 my own pass over all 18 homepages got 403 "Verifying your connection" challenges on 16 of them. Only Gymshark and Sapphire answered. I did not retry. Instead I read pages other researchers had saved that day (homepages, policy and content pages, and the only two real product pages: Junaid Jamshed and Allbirds). The strongest evidence was Shopify's list of installed app blocks and web pixels in each page. Judge.me loads its pixel on every page of a store that has it installed. The scan files have since been wiped. Everything below was seen on 2026-11-05.

Pakistan (11 Shopify shops; Sapphire's pages load from `demandware.static`, which is Salesforce Commerce Cloud, so Sapphire is not on Shopify):
- Judge.me is installed at exactly the 5 shops the README counts, so the reviews count of 5 held up as "app installed":
  - Junaid Jamshed and Maria B: the `judge-me-reviews` app block and pixel.
  - Zellbury: the same, plus a separate JSON-LD rich-snippet app (`gp-json-ld-schema`).
  - Bonanza Satrangi: the pixel, plus theme code that styles the Judge.me review list and the write-a-review popup.
  - Gul Ahmed: the pixel only. Its product page could not be reached.
- Whether reviews are actually visible is mostly unverified. On the one Junaid Jamshed product page I could read, the review widget was present but the rating badge said 0 reviews and 0 questions and was hidden. Its settings also showed the photo gallery, trust badge and review coupons switched off, and the Q&A labels filled in. The product's JSON-LD had no rating.
- No other review vendor was found at any Pakistani shop. Limelight, Ethnc, Beechtree, Outfitters, Nishat Linen and Breakout showed no review app on the pages read.
- The UGC count of 5 did not hold: only Gul Ahmed has a real feed, the GSC Instagram Feed block under a heading inviting visitors to follow the brand on Instagram.
  - Junaid Jamshed, Maria B and Zellbury matched only on Judge.me's settings for its UGC feature, which is not switched on.
  - Limelight matched on random letters inside product IDs.
  - My own blocked pages even matched "ugc" inside challenge tokens.
- Sapphire, although not on Shopify, has a homepage carousel linking to the Instagram profiles of about a dozen Pakistani celebrities. It is curated, hand-built social proof, not a feed app.
- No Pakistani shop showed a trust-badge app. Rendered badge images cannot be judged from raw HTML (unverified).

Global (6):
- Reviews were seen at 5 of the 6:
  - Yotpo: Allbirds (star widget on the product page), MVMT (`yotpo-product-reviews` block) and Fashion Nova.
  - Fashion Nova is a headless Shopify Hydrogen store that loads Yotpo's image grid and uses Yotpo albums for homepage customer photos.
  - Kylie Cosmetics: Bazaarvoice reviews, plus a shoppable Foursixty Instagram feed and a Firework shoppable video block. Its Yotpo use is loyalty only.
  - Gymshark: a headless Next.js store whose product cards show stars and a count (1 to 24 reviews on 16 cards) from its own product data. The vendor is not named.
- Brooklinen's Yotpo code is the rewards SDK, so its marker comes from loyalty. Its review vendor is unverified. The global reviews count of 6 is therefore really 5.
- The `loox` hit at Gymshark was a Contentful ID. Loox was found at 0 of 18 shops.
- The UGC count of 3 is really 2 (Fashion Nova and Kylie). Gymshark's two UGC flags are switched off.

## What Medusa already has
| Capability | Built in, Partial or Missing | Where |
| --- | --- | --- |
| Review data, routes, moderation | Missing natively; official tutorial | No `review` or `rating` in any `node_modules/@medusajs/*/AGENTS.md`. Tutorial "Implement Product Reviews in Medusa" [7] |
| What the tutorial builds | Recipe | `productReview` module with a `Review` model: title, content, rating 1-5, first and last name, status pending/approved/rejected, product_id, customer_id. Read-only link to product. Create and update workflows. `POST /store/reviews` (logged-in customers only), `GET /store/products/:id/reviews` (approved reviews plus average), `GET /admin/reviews`, `POST /admin/reviews/status`. Admin Reviews page with bulk approve and reject. Storefront list and form [7] |
| What the tutorial leaves out | Missing | Verified purchase, photos, review requests, replies, votes, summary for listing cards. Its next steps name customer link, votes and images [7]. It averages with raw SQL in the service |
| Community plugins | Partial, third party | `@lambdacurry/medusa-product-reviews` 1.4.0 (2026-04-02, MIT, 6,769 downloads last month): pending/approved/flagged, admin responses, stats route. It pins `@mikro-orm/*` 6.4.16 as a peer while we run 6.6.14. Others are small: `@devx-commerce/plugin-product-reviews` 173, `medusa-plugin-ratings` 87, `medusa-review-rating` 85 downloads [8]. None is in Medusa's integrations list [9] |
| Delivered trigger | Built in | `delivery.created` (payload: fulfillment id), emitted by `markOrderFulfillmentAsDeliveredWorkflow` (`@medusajs/core-flows/dist/order/workflows/mark-order-fulfillment-as-delivered.js`). Staff mark delivered in the admin (report 02) |
| Sending the request | Missing in our store | Only the local feed notification provider is registered; nothing reaches customers (report 10) |
| Photo upload | Partial | File Module and `uploadFilesWorkflow` (`@medusajs/file` AGENTS.md). `/admin/uploads` uses multer, but the store API has no upload route. Our config uses local files; S3 is commented out in `apps/backend/medusa-config.ts` |
| Guest reviewers | Missing | Checkout uses the cart email. `findOrCreateCustomer` creates guests with `has_account: false`, so most COD buyers cannot log in to use the tutorial's route |
| Exposing ratings on product APIs | Partial | Store routes return only allowed fields. A linked model needs a global middleware to appear in `?fields=` (`@medusajs/medusa` AGENTS.md) |
| Rate limiting | Missing | No rate-limit middleware found in `@medusajs/framework` http code |
| Admin and storefront UI | Missing | `apps/backend/src/admin` holds only i18n. The product page has two tabs (`modules/products/components/product-tabs`). Cards show price only. JSON-LD has offers but no rating (`apps/storefront/src/lib/util/product-structured-data.ts`). Product data is cached with `force-cache` plus revalidate (`src/lib/data/products.ts`) |

## What we would build
1. Review module (M). Start from the tutorial rather than the plugin, because the plugin's ORM peer pin does not match 2.22 and we need different fields.
   - Add to `Review`: order_id, line item and variant (the size bought), verified flag, images, staff reply, fit (small, true, large) for clothing, and display name.
   - Add a `ProductRatingSummary` model (average, count, star split), recomputed by the moderation workflow.
   - Link it to product and expose it through a store middleware, so listing cards get stars without one call per product.
   - Link to customer as well. Risk: low; this is the documented pattern.
2. Review link after delivery (S to M).
   - A subscriber on `delivery.created` runs a workflow that stores a `ReviewInvite` (hashed random token, order, expiry, used flag).
   - It sends the link through report 10's WhatsApp or email provider.
   - Store routes `GET/POST /store/review-invites/:token` let guests review only what they bought.
   - Depends on delivered being recorded (report 02, by hand at first) and on a message provider (report 10). Until then, staff can share links by hand.
3. Admin moderation (S).
   - A Reviews UI route (tutorial steps 7 and 9) with approve, reject and reply, plus a product-page widget showing the rating summary.
   - Default to pending.
4. Storefront display (S to M).
   - A reviews section with summary, fit bar and paged list in the product template.
   - Stars on `product-preview`.
   - The invite form page.
   - `aggregateRating` in the JSON-LD only when the product has approved reviews shown on the page [5].
   - Revalidate the product cache when a review is approved, or new reviews stay hidden until the cache expires.
5. Photo reviews (M).
   - A store upload route modelled on `/admin/uploads`, allowed only with a valid invite token.
   - Limit type and size, strip location data, keep photos private until approved.
   - Move files to an S3-compatible bucket or a backed-up Docker volume.
   - Risk: abuse and storage growth.
6. Abuse controls (S). Posting only through a token or a verified purchase, Nginx `limit_req` on review routes, and manual moderation.
7. Q&A (M, later). A `Question` model in the same module, with answers from the admin.
8. Instagram feed (S to M, later).
   - Meta's Instagram API with Instagram Login serves business and creator accounts without a linked Facebook Page [10]. The old Basic Display API ended in December 2024 [11].
   - A scheduled job would cache recent posts. Token refresh and app review needs are unverified.
   - A curated section edited by staff, as Sapphire does, is S.
9. Trust badges (S). A static storefront strip: COD available, delivery time, exchange policy and secure ordering, linking to the policy pages. No backend.
10. Outside service instead of 1 to 5 (compared).
    - Judge.me's API needs a myshopify.com shop domain [12], so it does not fit Medusa (unverified beyond that help article; judge.me blocked our fetch).
    - Yotpo's generic-platform guide requires syncing products and orders through Core API v3. It sends email requests a few days after an order is marked fulfilled, loads widgets by JavaScript, and warns of extensive developer work. It does not mention SMS [13]. Non-Shopify pricing is not published (unverified).
    - REVIEWS.io documents an invitation API by email or SMS, priced by quote [14]. Its pricing page blocked our fetch.
    - Building costs about one M plus a few S, keeps the data in our database, and uses WhatsApp, which matters more in Pakistan than email.

## Recommendation
- Launch:
  - Trust badge strip and clear COD, delivery and exchange notes on the product page. Cheap reassurance for first-time COD buyers.
  - Links to the brand's Instagram. No feed needed.
- Soon after launch:
  - Review module with a verified-purchase link sent after delivery, admin moderation with replies, the product-page section and stars on cards. The first delivered orders are the moment to start collecting.
  - Rating JSON-LD once reviews exist. Google stars need visible reviews.
- Later:
  - Photo reviews. They need storage and moderation, and Pakistani shops had Judge.me's photo gallery off.
  - Q&A. No shop showed questions.
  - Instagram API feed or customer photo gallery. Only 1 of 11 Pakistani Shopify shops runs one.
- Skip:
  - Judge.me (Shopify only) and Loox (no shop in the sample uses it).
  - Yotpo or Bazaarvoice for now. Heavy integration, email-centric, unpublished pricing.
  - Review-for-discount incentives until the review policy is settled.

## Questions for the owner
1. Should only verified buyers (through the delivery link) be able to review, or anyone who visits the page?
2. Do you want photo reviews early, and are you willing to pay for a storage bucket and to moderate photos?
3. Will staff approve every review before it appears, and will negative reviews be published once approved?

## Sources
1. https://community.shopify.com/t/whats-going-on-with-the-product-reviews-app-its-no-longer-available/249489
2. https://apps.shopify.com/judgeme
3. https://apps.shopify.com/loox
4. https://apps.shopify.com/yotpo-social-reviews
5. https://developers.google.com/search/docs/appearance/structured-data/review-snippet
6. https://apps.shopify.com/gsc-instagram-feed-instafeed
7. https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-reviews
8. https://registry.npmjs.org/@lambdacurry%2fmedusa-product-reviews (and the same registry for the other packages named); https://api.npmjs.org/downloads/point/last-month/
9. https://docs.medusajs.com/resources/integrations
10. https://developers.facebook.com/docs/instagram-platform/overview
11. https://smashballoon.com/instagram-is-shutting-down-basic-display-api-continue-displaying-instagram-feeds-on-your-site/
12. https://judge.me/help/en/articles/8409180 (seen only as a search result; the site returned 403)
13. https://support.yotpo.com/docs/generic-other-platforms-installing-yotpo-reviews-v3
14. https://intercom.help/reviews-io/en/articles/9185068-reviews-io-api (seen only as a search result)
- Shop pages read on 2026-11-05: the 18 homepages listed in BRIEF.md, plus the pages saved that day by researchers 01, 02, 03, 09, 12, 13, 17 (since wiped).
- Repo: `node_modules/@medusajs/{core-flows,file,medusa,notification,admin-sdk}/AGENTS.md`, `node_modules/@medusajs/utils/dist/core-flows/events.js`, `apps/backend/medusa-config.ts`, `apps/storefront/src/lib/util/product-structured-data.ts`, `apps/storefront/src/lib/data/products.ts`, `apps/storefront/src/modules/products/`.
