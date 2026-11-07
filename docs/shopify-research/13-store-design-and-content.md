# Store design and content

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers what staff can change without a developer: homepage sections, the announcement bar, static pages, FAQ, blog, lookbooks, store locator, contact form and menus. Medusa 2.22 has no content features and our starter hardcodes the store name, hero, footer, side menu and policy text, but Medusa provides everything needed to build a small content module with admin pages. Build that module with a fixed set of section types, scheduling and editable pages, and keep Sanity as the upgrade path if staff later want visual editing.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Theme editor with live preview | Native, all plans | Edits layout, colours and type without code (seen) | help.shopify.com theme-editor |
| Sections and blocks | Native | Up to 25 sections and 1,250 blocks per template, blocks nest 8 levels deep (seen) | help.shopify.com sections-and-blocks |
| Announcement bar | Native in most themes | One bar section, up to 12 rotating messages (Shopify help, via search snippet) | help.shopify.com add-announcement-banner |
| Static pages | Native | Pages are hidden until published and must be added to a menu (search snippet) | help.shopify.com add-edit-pages |
| Blog | Native | Default blog "News", more blogs allowed (search snippet) | help.shopify.com adding-a-blog |
| Contact form | Native | Contact page template; messages go to the store's sender email. Shopify's Forms app also exists (search snippet) | help.shopify.com add-contact-page |
| FAQ and structured content | Native metaobjects | Shopify suggests an FAQ metaobject shown in a theme section (search snippet) | help.shopify.com metaobjects |
| Menus | Native | 3 levels; see report 06 | report 06 |
| Store locator | App | Stockist from $10/mo, Lifter $7.95/mo, The Shop Maps $4.99/mo (App Store listings, vendor says, 2026-11-05) | apps.shopify.com |
| Lookbook / shop the look | Theme section or app | Not checked (unverified) | none |
| Plan cost | Themes on every plan | Basic $25/mo monthly or $19/mo yearly, USD (seen 2026-11-05) | shopify.com/pricing |

## What real shops do
Method: on 2026-11-05 I parsed homepage copies that other researchers had saved that day, using the Shopify section IDs and theme name in the HTML. Those copies are now wiped. I fetched 9 content pages myself, and all returned 200. Several saved copies were "Verifying your connection" challenges (Zellbury in one copy, Breakout, Allbirds, Fashion Nova, Kylie, MVMT and Brooklinen). I did not retry those.

Pakistan (seen):
- Sapphire is not a Shopify theme. Its homepage calls Salesforce Commerce Cloud paths (`/on/demandware.store/Sites-Sapphire-Site`) and only loads some files from Shopify's CDN.
- Breakout has no Shopify theme sections in its copy. Its stack is unverified.
- Ethnc's homepage is a single landing section for choosing Pakistan, UK or the rest of the world.
- Nine homepages had section lists: Limelight, Gul Ahmed, Junaid Jamshed, Beechtree, Outfitters, Bonanza Satrangi, Nishat Linen, Maria B and Zellbury. Across them the typical layout is:
  - a hero slider or video on 9/9 (Gul Ahmed's is a "film" section), and an announcement bar on 5/9 (Limelight: free delivery above Rs 4,999; Junaid Jamshed: sale countdown)
  - category or collection tiles on 7/9, and product rails or tabbed rails such as "Trending" or "New Arrivals" on 6/9
  - campaign banners (Outfitters has 13 banner sections; Maria B has sale and bridal sliders), and reels or video strips at Gul Ahmed, Bonanza, Outfitters and Nishat
  - a newsletter block, a floating WhatsApp button (Beechtree, Bonanza), a mobile bottom bar (Gul Ahmed, Bonanza, Maria B), and a footer linking store locator, FAQ, contact, order tracking and policies
- Outfitters' homepage has 26 sections and Limelight's has 18.
- Theme names suggest that shops copy the whole theme for each campaign and publish the copy. Examples: Beechtree "Eid Sale 7-6-2025", Maria B "Azadi Sale - Slow Menu Fixes", Limelight "Image Quality Improvement | 21 Oct 2026", Outfitters "Copy of Denim Layout-Live Copy". Section names such as `bt_slide`, `film`, `home_edit` and `mega_banner` are custom code. So the big shops pay developers for a section library, and staff then fill and reorder those sections (inference).
- Store locator links appeared on 10/12 homepages: all except Ethnc and Breakout, with Sapphire's labelled "Our Stores".
  - Limelight's locator page is a hand-written list by city with address, opening hours, phone number and Google Maps links. No app was detected.
  - Bonanza's is a custom section listing about 30 cities.
  - Nishat's raw HTML showed only the page frame, so its list probably loads by script (unverified).
- FAQ pages: Gul Ahmed, Beechtree (separate local and international FAQs plus a help center), Bonanza and Nishat. Bonanza's is a plain question-and-answer text page covering delivery times (2-3 working days, 6-8 during sales).
- Contact: Limelight uses Shopify's native form (name, email, phone, comment). Five more shops link a contact page.
- Blog links appeared at Limelight, Gul Ahmed, Beechtree, Nishat and Maria B. Gul Ahmed's blog is active, with 4 SEO posts between 19 Oct and 2 Nov 2026, such as its 11.11 sale and winter trouser styles. Nishat's posts are undated and old.
- Lookbooks: Gul Ahmed's `/pages/lookbook` is one image-banner section. Maria B uses "Shop The Look" blocks and Sapphire has a "shop the looks" carousel and catalogue pages. Junaid Jamshed also has a fabric glossary page and Beechtree a style guide.

Global (seen): Allbirds' homepage has a site-wide banner, full-bleed hero, category row, product carousels, three promo tiles, SEO text tiles and two blogs. Gymshark is a Next.js front end with no theme sections, plus many about, policy and loyalty pages. The other four global shops were blocked.

Marker counts: store locator 10/1 held for Pakistan (the global 1 is Brooklinen, which I could not check). Blog 5/2 held for Pakistan, with Allbirds confirmed and Brooklinen not checked. Lookbook 3/1 held for Pakistan (Sapphire, Gul Ahmed, Maria B), but Sapphire is not on Shopify.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Store name | Partial | Store module `name` is editable in admin Settings > Store (`@medusajs/store` AGENTS.md). The Store API has no store route (route list in `@medusajs/medusa/dist/api/store`), and the storefront hardcodes `STORE_NAME` |
| Homepage sections | Missing | `app/[countryCode]/(main)/page.tsx` renders a fixed Hero plus one product rail per collection |
| Static pages | Partial | `/shipping`, `/returns`, `/terms`, `/privacy` and `/contact` are coded pages with a placeholder notice. Shipping and return numbers come from region metadata (`lib/util/store-policies.ts`) |
| Menus | Partial | The category tree can feed a menu; see report 06 |
| Announcement bar, FAQ, blog, lookbook, contact form | Missing | Nothing in the backend or storefront. The free-shipping popup is covered in report 04 |
| Store locator data | Partial | Stock Location module has name, address, phone and metadata (`@medusajs/stock-location`). Admin exposes it under Settings > Locations; there is no store route |
| Metadata editors | Built in | The dashboard has metadata editors for store, region, collection, category and location (`@medusajs/dashboard/src/routes/*-metadata`). Collections and categories have no image field, so images go in metadata |
| Image uploads | Built in | File module plus the admin uploads route and `sdk.admin.upload`. The local provider is for development only. `file-s3` takes an `endpoint` for S3-compatible storage (package AGENTS.md files) |
| Admin extension points | Built in | `defineRouteConfig` for pages and `defineWidgetConfig` for widgets (`@medusajs/admin-sdk`), plus custom modules and API routes (AGENTS.md) |
| Translatable fields | Partial | `.translatable()` on custom fields, behind `MEDUSA_FF_TRANSLATION` (`@medusajs/translation`) |
| Cache refresh and preview | Built in | Home and policy pages are `force-static` with `revalidate = 60`, and data fetches carry cache tags. Next 16 ships `revalidateTag` and `draft-mode` docs (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions`) |
| CMS guides | Docs only | Medusa has guides for Sanity, Payload (built with v3.54.0), Strapi (v5.30.1) and Contentful. All four sync products into the CMS; none builds a homepage, pages or a blog |
| Plugins | None usable | npm `medusa-plugin-content` 0.2.6 (Aug 2026) lists no licence and no readme, so it is unverified. I found no official content plugin |

Hardcoded in `apps/storefront/src` (seen):
- "Medusa Store" appears in `lib/util/site.ts`, the nav, footer, side menu and checkout layout, the register component, the category and collection page titles, and the login and profile metadata.
- The home page title and description name the Medusa and Next.js starter.
- The hero shows "Ecommerce Starter Template" with a GitHub button.
- The footer has a "Medusa" column (GitHub, docs, source) and a "Powered by Medusa & Next.js" badge, which also appears at checkout.
- Footer customer-service links and the side menu items (Home, Store, Account, Cart) are fixed in code.
- `app/opengraph-image.jpg`, `twitter-image.jpg` and the favicon are starter files.
- `<html lang="en">` is set in the root layout.
- The default country falls back to `dk`.
- The terms page says orders are confirmed by email once payment is received. That is wrong for Cash on Delivery, and nothing is emailed today.

## What we would build
1. **Brand cleanup (S).** Read the store name and contact details from env or a settings route. Remove the Medusa links, the GitHub hero and the starter images, and rewrite the terms text for COD. This is code work with no dependencies, and it should be done before launch whichever option is chosen.
2. **Content module with admin pages (M, about 2 weeks).** A custom module in `apps/backend/src/modules/content`, with these models:
   - `announcement`: message, link, colours, start and end times, rank.
   - `home_section`: a type drawn from a fixed library, rank, active flag, start and end times, and JSON settings. The library: hero slider with separate desktop and mobile images or video, category tiles, collection rail with tabs, banner grid, reels or video strip, rich text, newsletter.
   - `page`: handle, title, markdown body, SEO fields, status. FAQ is a page type with ordered questions.
   - Mechanisms: workflows for writes; admin UI routes with drag-and-drop ordering, built with `@medusajs/ui`, uploading images through the File module; `/store/content/*` routes and a storefront `lib/data/content.ts`; one React component per section type, plus a `/pages/[handle]` route that replaces the coded policy pages; a subscriber or the route itself calls a storefront revalidate endpoint (`revalidateTag`); draft preview through Next draft mode (adds S).
   - Scheduling replaces the shops' habit of copying the whole theme for each campaign (Eid, Azadi, 11.11).
   - Risks: a rich-text editor would add an admin dependency, so start with markdown and a preview. Staff need size guidance for images. We own the editor's upkeep across Medusa upgrades.
3. **Store locator (S).** A `store_location` model in the content module (city, address, phone, hours, Maps link), shown as a city-grouped page with plain Google Maps links, which need no API key. Use Stock Location instead only if each shop is also a pickup point (report 17), because stock locations drive fulfillment.
4. **Contact (S).** At launch, a contact block with a WhatsApp click-to-chat link, phone and email. Later, a form that saves a `contact_message` record, shows an admin inbox and has a rate limit. Notifying staff waits for a provider (report 10).
5. **Blog and lookbook (S to M on top of item 2).**
   - Blog: a `post` model with cover image, tags and publish date. Add it to the sitemap and emit Article structured data (report 14).
   - Lookbook: a page type with images and linked product IDs.
6. **Menus (S).** Follow report 06: build from the category tree, and add custom links (Sale, New In) as content-module rows.
7. **Headless CMS instead of item 2, compared.** Hetzner prices were seen 2026-11-05, excl. VAT, incl. IPv4: CPX22 (2 vCPU, 4 GB) €19.99/mo, CPX32 (4 vCPU, 8 GB) €35.99/mo, CPX42 (8 vCPU, 16 GB) €69.99/mo. The page showed EU plans as unavailable to order at that moment. Medusa's docs require at least 2 GB of RAM. Fitting Medusa, its worker, Postgres, Redis and Next.js on CPX32 is my estimate (unverified).

| Option | Staff experience | Extra on the VPS | Monthly fee (dated) |
| --- | --- | --- | --- |
| Metadata settings only | Key-value JSON boxes; image URLs pasted by hand; no ordering | None | €0 |
| Custom content module | Pages inside Medusa admin, one login, fixed blocks | None (same process and DB) | €0 |
| Sanity (hosted) | Best editor and visual preview; Studio embedded at `/studio` in the storefront per Medusa's guide | None; content stored at Sanity | Free: 20 seats, Admin and Viewer roles only, 10k documents. Growth $15/seat for an Editor role (vendor says, 2026-11-05) |
| Payload (self-hosted, MIT) | Good editor; admin runs inside the storefront app per Medusa's guide, which restructures `src/app` | Second Postgres DB, heavier storefront build | €0. Figma ownership reported by secondary sources (unverified) |
| Strapi 5 Community | Separate admin and login | New Node service, 2 GB min and 4 GB recommended (vendor says), likely CPX32 to CPX42, +€16 to +€34/mo | €0. Live Preview and Releases need Growth, $45/mo for 3 users (vendor says, 2026-11-05) |
| Contentful | SaaS; Medusa's guide is about localization | None | Pricing page returned 429. Third parties say Lite costs about $300/mo (unverified) |

Banner images on any option: Hetzner Object Storage through `file-s3`, about €4.99 to €6.49/mo for 1 TB storage plus 1 TB egress. That price comes from secondary sources, because Hetzner's page failed to load (unverified).

## Recommendation
- **Launch:**
  - Brand cleanup and correct COD wording, because the starter text is visibly not our store.
  - Announcement bar with scheduling, because 5/9 Pakistani homepages use one for delivery thresholds and sales.
  - Homepage sections from a fixed library, because the hero and collection rails change every campaign.
  - Editable pages for About, FAQ, contact details and policies, because staff must fix delivery times without a developer.
  - A store locator list if the brand has physical shops, because 10/12 Pakistani homepages link one.
  - The menu from report 06.
- **Soon after launch:** draft preview, so campaign pages can be checked before going live. A contact form and admin inbox, once a notification channel exists. Lookbook and catalogue pages, which suit unstitched and seasonal drops.
- **Later:** a blog, because it is SEO work that only pays off with regular posting (Gul Ahmed posts weekly). Urdu content fields (report 15). Moving to Sanity, which is worth it if several marketers need visual editing.
- **Skip:** a free-form drag-and-drop theme editor, because Pakistani shops on Shopify still use developer-built sections. Strapi, because it adds a service and RAM and puts preview behind a paywall. Contentful, on price. Copying the theme for each campaign, because scheduling covers it.

## Questions for the owner
1. How many people will edit the store, and is a fixed set of blocks in the Medusa admin enough, or do they need Sanity's visual editor (a USD bill, with content hosted outside our VPS)?
2. Does the brand have physical shops, and should the store locator list them by city at launch?
3. At launch, should customers contact you by WhatsApp and phone only, or do you also want a web contact form whose messages staff read in the admin?

## Sources
- https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections-and-blocks ; https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor ; https://help.shopify.com/en/manual/online-store/themes/customizing-themes/common-customizations/add-announcement-banner
- https://help.shopify.com/en/manual/online-store/add-edit-pages ; https://help.shopify.com/en/manual/online-store/blogs/adding-a-blog ; https://help.shopify.com/en/manual/online-store/themes/os20/customize/add-contact-page ; https://help.shopify.com/en/manual/custom-data/metaobjects
- https://www.shopify.com/pricing ; https://apps.shopify.com/stockist-store-locator ; https://apps.shopify.com/lifter-store-locator ; https://apps.shopify.com/the-shop-maps
- Shop pages fetched 2026-11-05: https://www.limelight.pk/pages/store-locator , https://www.limelight.pk/pages/contact-us , https://www.gulahmedshop.com/pages/lookbook , https://www.gulahmedshop.com/blogs/news , https://www.bonanzasatrangi.com/pages/faqs , https://www.bonanzasatrangi.com/pages/store-locator , https://www.nishatlinen.com/blogs/news , https://www.nishatlinen.com/pages/shopify-store-locator , https://www.junaidjamshed.com/pages/fabric-glossary ; homepage copies of the 18 shops saved by other researchers (now wiped)
- https://docs.medusajs.com/resources/integrations.md ; https://docs.medusajs.com/resources/integrations/guides/sanity.md ; .../payload.md ; .../strapi.md ; .../contentful.md
- https://docs.medusajs.com/learn/deployment/general.md ; https://registry.npmjs.org/medusa-plugin-content
- node_modules/@medusajs/{store,stock-location,product,file,file-s3,file-local,admin-sdk,admin-shared,translation,settings}/AGENTS.md ; node_modules/@medusajs/dashboard/src/routes ; node_modules/next/dist/docs
- https://www.hetzner.com/cloud/regular-performance ; https://www.hetzner.com/cloud ; https://sliplane.io/blog/cheap-object-storage-providers-europe ; https://www.pressebox.com/pressrelease/hetzner-online-ag/hetzner-object-storage-modern-storage-solution-for-growing-amounts-of-data/boxid/1227086
- https://www.sanity.io/pricing ; https://strapi.io/pricing-self-hosted ; https://docs.strapi.io/cms/deployment ; https://payloadcms.com/enterprise ; https://ai-solutions.daviesmeyer.com/en/blog/payload-cms-figma-nextjs-headless-cms ; https://www.costbench.com/changelog/contentful-price-decrease-2026-02-3/
