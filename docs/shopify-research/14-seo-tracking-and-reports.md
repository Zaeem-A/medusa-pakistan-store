# SEO, tracking and reports

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers how search engines and ad platforms see the store (sitemap, robots, structured data, SEO titles, redirects, product feeds), how visits and orders are measured (Meta, TikTok and Google tags, server-side conversions, Clarity, consent), and the reports the owner reads. The starter storefront already has a good sitemap, robots file and product JSON-LD, but it has no tracking code, no editable SEO fields, no redirects and a canonical bug on category pages, and the admin has no reports at all. Fix the SEO basics and add Meta, TikTok, GA4 and Clarity tags with server-side purchase events at launch, and build a COD outcome report from day one, because gross orders say little when many COD parcels come back.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| XML sitemap, split by products, pages and collections | Native | All plans. Nishat Linen's index also lists an "agentic discovery" sitemap (seen) | [S1], shop fetch |
| robots.txt, editable through `robots.txt.liquid` | Native | All plans. Editing is unsupported by Shopify Support | [S2] |
| Editable SEO title and meta description | Native | Products, collections, pages, blog posts, homepage | [S3] |
| Structured data | Theme, plus apps | Themes output Organization and WebSite JSON-LD. Zellbury adds a JSON-LD app (report 08) | shop fetch, report 08 |
| URL redirects with CSV import and export | Native | Up to 100,000 redirects, or 20 million on Plus. Redirects fire only on URLs that return 404 | [S4] |
| Google and YouTube channel (GA4, Google Ads tags, Merchant Center sync) | App by Google | Free to install (vendor says). Merchant Center does not list Pakistan as a target country (seen) | [S5], [G1] |
| Facebook and Instagram channel (pixel, catalog sync, Conversions API) | App by Meta | Free to install, ad spend billed by Meta. Rated 3.9 from 5,836 reviews (seen 2026-11-06). The Maximum data-sharing level adds server-side events (vendor says, page may be old) | [S6], [S7] |
| TikTok pixel and catalog | App | TikTok's own app and Omega's TikTok pixel app both appear at PK shops (seen in pixel config). Listing price not checked | shop fetch |
| Pixel manager: app pixels and custom pixels in a sandbox | Native | All plans. Also runs on checkout | [S8] |
| Microsoft Clarity heatmaps and recordings | App | Free with no paid tier. Caps of 100,000 recordings per day and 100,000 page views per heatmap (vendor says) | [C1], [C2] |
| Cookie banner and consent API | Native | Shown by default to UK and EEA visitors and can be turned on elsewhere. Price not stated | [S9] |
| Reports | Native | "200+ real-time reports, plus custom analytics" on every plan. US$22, 58, 359 and from 2,300 a month, yearly billing (seen 2026-11-05). Custom reports from Basic (vendor says). A payments-by-gateway report exists | [S10], [S11] |

Shopify has no COD-aware report. I could not confirm how its sales reports count unpaid COD orders or parcels that come back (unverified).

## What real shops do
Method: other researchers saved pages from 9 shops between 2026-11-05 and 2026-11-06, and I parsed them offline. On 2026-11-06 I fetched 5 more homepages, plus Nishat Linen's robots.txt and sitemap. None of the 7 requests was blocked. I read Shopify's `webPixelsConfigList`, which names every sandboxed pixel app with its config, so I could check pixels without a browser. Pixel apps were identified from their config keys: `facebook_pixel` for Meta, `google_tag_ids` for Google and `pixelCode` for TikTok. The Clarity app was identified from a Clarity project ID plus the `clarity.ms` tag (an inference). Product pages were not reachable, so product JSON-LD at these shops is unverified.

Pakistan (seen):
- Meta app pixel at 9 of 9 Shopify shops whose pixel config I read: Outfitters, Junaid Jamshed, Gul Ahmed, Maria B, Zellbury, Bonanza Satrangi, Limelight, Beechtree and Nishat Linen. The scan's 0/12 was wrong, as the README expected. Outfitters and Maria B carry a Meta system-user token in the config, which suggests server-side events are on (unverified).
- Google and YouTube app at the same 9 of 9. The target country is PK at 5 of the 7 where I read it, and Junaid Jamshed and Gul Ahmed use "ZZ". Outfitters, Maria B, Nishat Linen and Breakout also carry Google Ads conversion IDs.
- TikTok at 4 of 9: TikTok's own app at Junaid Jamshed and Gul Ahmed, and Omega's TikTok pixel app at Outfitters and Nishat Linen. The scan's 0/12 was too low.
- Microsoft Clarity at 8 of 10: Outfitters, Junaid Jamshed, Maria B, Zellbury, Bonanza Satrangi, Limelight, Nishat Linen and Breakout. It was not seen at Gul Ahmed or Beechtree. Sapphire also runs Clarity and GTM, but it is on Salesforce Commerce Cloud, not Shopify (report 04). The heatmap count of 7 roughly held.
- Outfitters also sends events to its own collector hosted on Railway, which is a home-built server-side pipeline. Other pixels seen: Judge.me, Mailchimp and a currency converter.
- Breakout runs a custom front end, with GA4, Google Ads and Clarity IDs in its page data and no Shopify pixel config. Ethnc's homepage is a landing page with almost no tags.
- Consent: Shopify's own privacy-banner script loads at Junaid Jamshed and Gul Ahmed, and its consent API loads widely. I saw no consent-app markup, so 0/12 for consent held. A Pakistani visitor most likely sees no banner, since Shopify defaults the banner to the UK and EEA.
- Structured data: every homepage has Organization or WebSite with SearchAction markup. Junaid Jamshed and Gul Ahmed add BreadcrumbList, and Beechtree adds ClothingStore. Junaid Jamshed has 7 hreflang tags and Maria B has 3. Nishat Linen's robots.txt is Shopify's default (51 Disallow lines, an adsbot-google group and a Sitemap line). Structured data 11/12 held at homepage level.

Global (seen):
- Brooklinen runs the Meta and Google apps plus Elevar, Northbeam and OneTrust.
- Allbirds runs OneTrust, Elevar, Triple Whale and a Clarity app, but no Meta app. Its Meta tracking probably runs through Elevar (unverified).
- Kylie Cosmetics and MVMT run GTM, OneTrust and Klaviyo with no Meta or Google app.
- Gymshark and Fashion Nova run custom front ends with no Shopify pixel config. Gymshark uses OneTrust.
- OneTrust appears at 5 of 6, so the consent count of 5 held. The Meta count of 1/6 held only for the Meta app. The others probably send Meta events through GTM or server-side tools (unverified).

## What Medusa already has
| Capability | Built in, Partial or Missing | Where |
| --- | --- | --- |
| Sitemap: static pages, products, categories and collections per country, with `lastModified` | Built in (starter) | `apps/storefront/src/app/sitemap.ts`. One file, no split past 50,000 URLs |
| robots.txt blocking cart, checkout, account and order paths, with a Sitemap line | Built in (starter) | `apps/storefront/src/app/robots.ts` |
| Product title, description, canonical, hreflang and OpenGraph price tags | Partial | `app/[countryCode]/(main)/products/[handle]/page.tsx`. Built from the product title and description. `STORE_NAME` is hard-coded to "Medusa Store" (`lib/util/site.ts`) |
| Category, collection and home metadata | Partial, with a bug | The category canonical is a relative path that Next joins to the site root, producing `/<handle>` with no `/pk/categories/` (`categories/[...category]/page.tsx` line 33, `next/dist/lib/metadata/resolvers/resolve-url.js`). The category title repeats "Medusa Store" twice. Collections have no canonical. The home title still reads "Medusa Next.js Starter Template". Seen in code, not run |
| Product JSON-LD (Product or ProductGroup, offers, stock, shipping, return policy), plus Organization and WebSite SearchAction | Built in (starter) | `lib/util/product-structured-data.ts`, `(main)/page.tsx`. No GTIN although variants have `ean`, `upc` and `barcode`. Brand is the store name. `variesBy` uses option titles, not schema.org URLs. No BreadcrumbList, no `priceValidUntil` |
| AI-agent discovery (llms.txt, Markdown product pages, UCP) | Built in (starter) | `src/app/llms.txt`, `.well-known/ucp`, `next.config.js` rewrites |
| Editable SEO title and description | Partial | No SEO fields on product, category or collection (`@medusajs/product` models). The admin has generic metadata editors (`dashboard/src/routes/products/product-metadata`, `categories-metadata`, `collection-metadata`), but the storefront reads none of them |
| URL redirects | Missing | No `redirects()` in `next.config.js`. `src/middleware.ts` only adds the country code, so a changed handle returns 404 |
| Product feed for Meta, TikTok and Google | Missing, official guide exists | Tutorial: workflow plus a `GET /product-feed` RSS route with Google `g:` fields [M4]. Community plugin `medusa-product-feed` is tested on 2.7.x (search result, unverified) |
| Analytics Module (server-side `track` and `identify`) | Built in, not registered | `@medusajs/analytics` AGENTS.md. Since v2.8.3. Exactly one provider allowed: Local (logs only) or PostHog. Segment guide shows a custom provider [M1-M3]. No GA4, Meta, TikTok or Clarity provider [M5] |
| Browser tags (GA4, Meta Pixel, TikTok Pixel, Clarity) | Missing | No tracking code anywhere in `apps/storefront/src` |
| Attribution on orders (UTM, click IDs, `_fbp`, `_fbc`, IP, user agent) | Missing, path exists | `completeCartWorkflow` copies `cart.metadata` to the order (`core-flows/dist/cart/workflows/complete-cart.js` line 454) |
| Cookie consent | Missing | Nothing in the storefront. Customer has no consent field (report 10) |
| Admin reports | Missing | Dashboard home just redirects to Orders (`dashboard/src/routes/home/home.tsx`). Order CSV export is built in (`exportOrdersWorkflow`, delivered as a feed notification), with order, payment and fulfillment status, totals and refunded total |
| Status filters for reports | Partial | `payment_status` and `fulfillment_status` are computed when read (`core-flows/dist/order/utils/aggregate-status.js`), not stored, so they cannot be filtered or summed in a query |
| Report plugins | Third party | `@agilo/medusa-analytics-plugin` 1.4.0 (MIT, Medusa 2.11 or later, 2026-02-26): sales charts, status pie, top products. `@rsc-labs/medusa-store-analytics-v2` 0.1.9 (MIT, 2.7.1 or later, 2025-11-17): refunds, top returned variants. Neither shows delivered, returned or cash collected (npm READMEs, seen) |

Admin and storefront: SEO and JSON-LD reach shoppers, but staff can edit none of it. Tracking and reports have no UI in either.

## What we would build
1. **SEO fixes (S, storefront).** Read the store name from config, fix the category canonical to the full `/pk/categories/...` URL, add canonicals and descriptions to collection pages, set a real homepage title, and stop the doubled title. Risk: none, apart from checking other routes for the same relative-canonical pattern.
2. **Editable SEO fields (S).** Store `seo_title`, `seo_description` and an optional `noindex` in product, category and collection `metadata`. Edit them through an admin widget on each detail page (check zone names in `@medusajs/admin-sdk` AGENTS.md), and have `generateMetadata` prefer them. Translation for Urdu is in report 15.
3. **JSON-LD polish (S).** Take GTIN from `ean`, `upc` or `barcode`, use schema.org `variesBy` URLs, add BreadcrumbList from the category tree, add `aggregateRating` once reviews exist (report 08), and take the brand from config.
4. **URL redirects (S to M).** Build a `redirect` module (from path, to path, 301 or 302) with an admin route for CSV import. Add a `product_handle` history table, updated by subscribers on `product.created` and `product.updated`, that adds a redirect automatically when a handle changes. Do the same for categories. The storefront looks up the path through a cached store route before showing 404 and calls `permanentRedirect`. Risk: loops, so reject from = to and chains.
5. **Browser tags (S to M, storefront module).** One `track()` helper loads GA4 (gtag or GTM), Meta Pixel, TikTok Pixel and Clarity with `next/script` after hydration, and maps view_item, add_to_cart, begin_checkout and purchase. Store a fresh `event_id`, `_fbp`, `_fbc`, `ttclid`, `gclid`, the GA client ID, UTMs, IP and user agent in `cart.metadata` before completion, so they reach the order. Risks: page speed, ad blockers and duplicate purchase events on page reload.
6. **Server-side conversions (M).** A workflow runs from subscribers on `order.placed`, `delivery.created`, `order.canceled` and `order.return_received`. It sends to Meta's Conversions API, TikTok's Events API and GA4's Measurement Protocol. Because the Analytics Module takes exactly one provider, either write one custom fan-out provider or call each vendor from its own workflow step. Use the order ID as `event_id`, so the browser and server copies are de-duplicated: Meta matches `event_id` plus name (vendor says) and TikTok within 48 hours (vendor says).
   - COD signal: send Purchase at placement (fast but includes fake orders) and a custom "Delivered" event on delivery, so ads can later optimise on delivered orders.
   - Timing: Meta rejects any event timed more than 7 days back (vendor says), so send each delivery event when it happens with the delivery time. GA4's protocol only adds to the browser tag and needs the GA client ID (vendor says).
   - Risks: hashing rules for email and phone (not confirmed this session), API tokens and retry handling.
7. **Product feeds (S).** Follow Medusa's product-feed tutorial for `?currency_code=pkr&country_code=pk`. Fill in brand, GTIN and size or color fields, cache it with the Redis caching module already configured, and register the URL in Meta Commerce Manager and the TikTok catalog. TikTok feed support is unverified.
8. **COD reports (M to L).** Build a custom `order_report` module with one row per order, updated by subscribers on placed, canceled, `shipment.created`, `delivery.created`, `payment.captured`, `order.return_received` and `payment.refunded`, plus courier and RTO events (report 02). A read model is needed because order statuses are not stored. An admin route `/reports` with `@medusajs/ui` tables and charts, plus CSV export, shows:
   - Outcome funnel: placed, confirmed, shipped, delivered, RTO and canceled, with counts, values and rates by day, city, courier and product size (reports 01 and 02).
   - Booked value vs delivered revenue vs cash collected (captured). Delivered but not yet remitted, aged by courier (report 02 reconciliation).
   - RTO cost (shipping out and back), post-delivery returns and exchanges (report 12), and refunds.
   - Delivered revenue per UTM or ad channel, which gives true ROAS once item 5 stores attribution.
   - Dependencies: courier status sync (report 02) and order confirmation (report 01). Risk: defining revenue, see question 3.
9. **Consent banner (S).** A client-side overlay that sets GA4 consent mode and calls Clarity's ConsentV2 [C3]. Needed only for EEA or UK traffic (report 15). Pakistan still has no enacted data protection law as of mid-2026 (secondary sources [P1], [P2]), but a privacy notice is still sensible.

## Recommendation
- **Launch:**
  - SEO fixes (item 1). The starter ships wrong titles and a broken canonical.
  - Editable SEO fields (item 2). Staff need them for every new product.
  - Browser tags with attribution capture (item 5). Every checked PK Shopify shop runs the Meta and Google tags, and most run Clarity.
  - Meta server-side Purchase with de-duplication (item 6, Meta part). Ad tracking is unreliable without it.
  - First version of the COD outcome report (item 8): delivered vs RTO vs cash collected. The owner cannot see real revenue without it.
- **Soon after launch:**
  - Meta catalog feed (item 7). Needed for catalog and retargeting ads.
  - TikTok Events API and the Delivered event (item 6). TikTok is common at PK shops.
  - URL redirects (item 4). Needed before any handle is renamed.
  - JSON-LD polish (item 3). Better search listings.
  - Full report breakdowns by courier, city and channel (item 8).
- **Later:**
  - PostHog product analytics through the built-in provider. Nice to have once traffic grows.
  - Consent banner (item 9). Needed only with EU or UK sales.
  - GA4 refund and RTO events. Refinement.
  - Agilo-style sales charts. Generic, and they miss COD outcomes.
- **Skip:**
  - Google Merchant Center feed and Shopping ads for Pakistan. Pakistan is not a supported target country.
  - Paid attribution tools (Elevar, Triple Whale, Northbeam). Only global brands use them.
  - Hotjar. Clarity is free.

## Questions for the owner
1. Is there an existing website whose old URLs must redirect at launch? If yes, redirects (item 4) move to Launch.
2. Which ad platforms will run at launch (Meta, TikTok, Google)? Who will own the Business Manager, pixel and ad accounts and supply the API tokens?
3. Which figure counts as revenue: delivered orders, or cash remitted by the courier? Should ads optimise on placed or on delivered orders?

## Sources
- [S1] https://nishatlinen.com/robots.txt and https://nishatlinen.com/sitemap.xml (fetched 2026-11-06)
- [S2] https://help.shopify.com/en/manual/promoting-marketing/seo/editing-robots-txt
- [S3] https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords
- [S4] https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect
- [S5] https://help.shopify.com/en/manual/promoting-marketing/pixels/app-pixels (search result)
- [S6] https://apps.shopify.com/facebook
- [S7] https://help.shopify.com/en/manual/promoting-marketing/analyze-marketing/meta-data-sharing (search result)
- [S8] https://help.shopify.com/en/manual/promoting-marketing/pixels
- [S9] https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings (search result)
- [S10] https://www.shopify.com/pricing (copy saved 2026-11-05)
- [S11] https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types and https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans/plans-features/basic-shopify-plan (search result)
- [G1] https://support.google.com/merchants/answer/160637 (raw page checked, no Pakistan row)
- https://developers.facebook.com/documentation/ads-commerce/conversions-api/using-the-api
- https://ads.tiktok.com/help/article?aid=10012410 and https://ads.tiktok.com/help/article/tiktok-adobe-eapi-implementation-guide?lang=en
- https://developers.google.com/analytics/devguides/collection/protocol/ga4
- [C1] https://clarity.microsoft.com/pricing, [C2] https://learn.microsoft.com/en-us/clarity/faq, [C3] https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- [M1] https://docs.medusajs.com/resources/infrastructure-modules/analytics.md, [M2] node_modules/@medusajs/analytics-posthog/AGENTS.md and analytics-local/AGENTS.md, [M3] https://docs.medusajs.com/resources/integrations/guides/segment.md, [M4] https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-feed/index.html.md, [M5] https://docs.medusajs.com/resources/integrations.md
- https://medusajs.com/integrations/agilo-analytics/, https://registry.npmjs.org/@agilo%2Fmedusa-analytics-plugin, https://registry.npmjs.org/@rsc-labs%2Fmedusa-store-analytics-v2, https://github.blesdmm.dns-dynamic.net/Oak-Digital/medusa-product-feed (not opened)
- [P1] https://commoner-law.com/pakistan/data-privacy-digital-rights/data-privacy-without-pdp-act, [P2] https://tribune.com.pk/story/2625470/pakistan-can-no-longer-wait-for-personal-data-protection-law
- Shop homepages: outfitters.com.pk, www.junaidjamshed.com, www.gulahmedshop.com, www.mariab.pk, www.zellbury.com, www.bonanzasatrangi.com, www.limelight.pk (collection page), www.beechtree.pk, www.nishatlinen.com, www.breakout.com.pk, www.ethnc.com, www.sapphireonline.pk, www.allbirds.com, www.brooklinen.com, www.kyliecosmetics.com, www.mvmt.com, www.gymshark.com, www.fashionnova.com
- Reports 01, 02, 04, 08, 10, 12 and 15 in this folder
