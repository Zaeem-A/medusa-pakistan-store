# Selling internationally

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers selling to overseas buyers: country stores or domains, prices in USD, GBP or AED, international shipping and duties, overseas payments, and translation including Urdu. Medusa 2.22.2 has most of the building blocks (regions with one currency each, per-currency prices, tax regions, shipping zones, a translation module behind an off-by-default feature flag), and the starter already routes by country prefix, but there is no exchange-rate conversion, no duties support, no Urdu locale and no translated UI. Launch Pakistan-only after deleting the leftover Europe demo data, add one USD "International" region once an overseas card gateway is approved, and leave Urdu and per-country stores for later.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Markets: group countries, per-market catalog pricing, domains or subfolders, languages | Native | On all plans; B2B catalogs capped at 3 below Plus. The help page states no retail market cap. A third party says 3 markets below Plus (unverified) | help.shopify.com managing-markets |
| Checkout in the buyer's currency with automatic exchange rates | Native | Requires Shopify Payments. Shopify Payments is not offered in Pakistan (see report 03) | help.shopify.com multi-currency |
| Display-only currency converter (checkout stays in shop currency) | App | Hoppy Currency Converter, MLVeda (both seen on PK shops) | Shop homepages |
| Country selector and geo redirect | Theme form or app | Native localization form; GeoIP Country Redirect app (seen on Maria B) | Shop homepages |
| Duties and import taxes collected at checkout | Native | Advanced or Plus only, needs HS codes, not in a Rest of World zone, extra 0.85% to 1.5% fee (search summary of help page) | help.shopify.com charging-duties |
| Managed Markets (Global-e as merchant of record) | Native | Business must be based in the US, Canada or UK with Shopify Payments (search summary) | shopify.com/ca/international/managed |
| Translations | Native languages + Translate & Adapt app | Free. Auto-translation for 2 languages; manual translation unlimited (vendor says). Urdu support not checked | apps.shopify.com/translate-and-adapt |
| Separate overseas store per country | Separate Shopify store | Each is its own store and plan (common on PK shops, seen) | Shop homepages, /meta.json |

## What real shops do
I reused homepages saved on 2026-11-05 by other researchers and made about 25 new requests (shop /meta.json, shipping policies, docs). No request was blocked. Shopify's public /meta.json gives a store's currency and ships-to country list.

Pakistan (12):
- Separate overseas stores are the norm (seen): Junaid Jamshed (us., uk., au., sa. subdomains plus /ca and /nz; the US store is USD and ships only to the US), Gul Ahmed (uae., uk., bd.; the UK store is GBP and ships only to GB), Ethnc (pk., uk., us., ae., bd. and global.; global is USD and ships to 218 countries), Beechtree (global.beechtree.pk, USD, 212 countries), Maria B (mariab.ae, USD, 237 countries, set as hreflang x-default), Bonanza Satrangi (a geo script sends US and Canadian visitors to bonanzasatrangi.us and .ca; the .us store ships to 28 countries).
- Sapphire's PK site has a country menu linking to sapphire-online.com (US and rest of world, USD), uae. (AED) and uk. (GBP), plus a "Switch to Global" modal. Neither site showed Shopify markers and sapphire-online.com/meta.json returned 404, so Sapphire is probably not on Shopify now (unverified).
- One PKR store that ships abroad: Limelight (MLVeda converter with PKR, GBP and USD; ships to 214 countries; DHL; customer pays customs). Nishat Linen ships to 21 countries plus the rest of the world in PKR, with no switcher seen. Gul Ahmed's PK store also loads a currency converter (USD, AED, SAR, CAD, EUR, GBP).
- Domestic only: Outfitters, Zellbury and Breakout had no overseas link or switcher (seen; meta.json not checked).
- Geolocation: Beechtree shows a modal using Shopify's detected country, offering the global site or staying on the Pakistan site, which states global shipping is unavailable. Maria B uses a GeoIP redirect app.
- Shipping and duties (policies, seen): every policy read is "duties unpaid". The buyer pays customs: Beechtree, Maria B, Limelight, and Gul Ahmed UK, which names DHL and DDU. Times are 7 to 15 business days. Beechtree charges by weight in USD, with free shipping over USD 100 or 150, and lists UK VAT handling under GBP 135. COD is Pakistan-only at Beechtree. Gul Ahmed UK runs COD with phone verification in the UK.
- Overseas payments: Beechtree's policy names 2Checkout for PayPal, Amex, Discover and JCB. Gul Ahmed UK's wallet config lists Visa, Mastercard, Amex and others (gateway not identified). Maria B's page showed no payment detail.
- Language: 0 of 12 have a language switcher (no locale form and no Weglot, Langify, Transcy, GTranslate or LangShop script), and 0 of 12 homepages contain any Urdu-script character. hreflang appears on 3 shops, and all of it points to English country stores.
- Marker counts did not hold. The currency (10/12) and language (11/12) patterns match `Shopify.currency` and `Shopify.locale`, which every Shopify page prints. Real counts: overseas selling 9/12, on-site currency switcher 3/12, language switcher 0/12.

Global (6):
- Allbirds: about 86 hreflang links to country domains, several in other languages, run as separate sites, with a customs and duties notice for international buyers. Gymshark: country subdomains with English, German, French, Spanish and Dutch hreflang and a language selector element. Kylie Cosmetics: Global-e scripts, en-XX subfolders, separate UK and EU stores. MVMT: native country selector only. Fashion Nova: English and Spanish hreflang. Brooklinen: US only, with a product notice that it does not ship internationally (all seen).
- Language switchers held up on about 2 to 3 of 6, not 6 of 6. Currency or country selection held up on 5 of 6.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Regions: country group, one currency, payment providers per region, `automatic_taxes` | Built in | `@medusajs/region` AGENTS.md; admin Settings > Regions |
| Prices per currency or per region, price lists | Built in, all set by hand | `@medusajs/pricing` AGENTS.md. The admin variant grid shows a column per store currency (seen: PKR, EUR, USD) |
| Exchange-rate conversion or display converter | Missing | The region docs say to create one region per currency. Plugins `medusa-plugin-currency-exchange-rates` and `@kb0912/currency-exchange-plugin` exist on npm, but v2 support is unverified |
| Tax regions, rates, tax-inclusive price preferences per region or currency | Built in | `@medusajs/tax`, pricing tax-inclusive-pricing docs. `setup-pakistan.ts` creates no Pakistan tax region |
| Duties or landed cost | Missing | Tax provider interface could host one. `medusa-plugin-zonos` is unpublished (search result) |
| Overseas shipping zones, flat or calculated options | Partial | `@medusajs/fulfillment` (geo zones, `price_type` flat/calculated). Weight-based rates need a provider `calculatePrice` |
| Country-prefixed routes and "Shipping to" selector | Built in (starter) | `apps/storefront/src/middleware.ts` picks the region from the URL, not IP, defaulting to `NEXT_PUBLIC_DEFAULT_REGION=pk`. `country-select` and `updateRegion` in `lib/data/cart.ts` |
| Geo-IP suggestion | Missing | Middleware is deliberately not IP-based |
| hreflang and sitemap per country | Partial | `(main)/page.tsx` and `products/[handle]/page.tsx` emit `en-XX` for every region country, and `sitemap.ts` repeats all pages per country |
| Translation module (products, variants, options, categories, collections, types, tags, regions, shipping options, tax rates) | Built in, but off | `@medusajs/translation`. `defineConfig` disables it unless `MEDUSA_FF_TRANSLATION` or `featureFlags.translation` is set. Neither `.env` nor `medusa-config.ts` sets it (counted, values not printed). Turning it on needs `db:migrate` |
| Admin "Manage translations" | Built in, flag-gated | Every "Manage translations" action, Settings > Translations and the Store locales section check `useFeatureFlag("translation")` (`@medusajs/dashboard` src). When on, it opens a bulk editor per entity and locale (user guide) |
| Storefront language picker, locale cookie, `x-medusa-locale` header, cart locale | Partial (starter) | `language-select`, `lib/data/locale-actions.ts`, `lib/config.ts`. Shown only when `/store/locales` answers, which needs the flag |
| Urdu locale, UI string translation, RTL, `lang` attribute | Missing | 52 built-in locales, no `ur`. Admin locale routes are GET only. Starter strings are hard-coded English, `<html lang="en">` is fixed, there is no RTL, and money formats with `en-US` |
| Overseas card payments | Missing for PK | See report 03. No Pakistani gateway provider. COD can be limited per region through region payment providers |

Leftover demo data (`apps/backend/src/migration-scripts/initial-data-seed.ts`, `setup-pakistan.ts`):
- A "Europe" region (EUR; gb, de, dk, se, fr, es, it) with the system payment provider (COD) enabled.
- Tax regions for those 7 countries.
- EUR and USD as non-default store currencies.
- A "European Warehouse" (Copenhagen) holding a Europe service zone with Standard and Express options at 10 EUR/USD. The setup script unlinked it from the sales channel, so /dk browses but cannot check out (repo README line 147).

These leak into the "Shipping to" list (8 countries), the sitemap and hreflang (7 duplicate English country trees), and the admin price grid. GB sits in Europe, and a country can belong to only one region, so a later UK region must take GB out first.

Why the "Manage translations" menu is seen: with the code and env as they are, the flag is off and the menu should not render. If the owner sees it, the running backend got the flag from somewhere else, such as a shell variable. GET http://localhost:9000/admin/feature-flags needs no login and shows the live value.

## What we would build
1. **Remove the Europe demo data (S).** In the admin (Settings > Regions, Locations, Tax Regions, Store currencies) or with a script using `deleteRegionsWorkflow`, `deleteStockLocationsWorkflow`, the tax region delete workflows and `updateStoresWorkflow`. Then clear the storefront region cache, as the setup script notes. Risk: whether deleting a location cascades its shipping options is unverified; check after.
2. **International USD region (M).** A region over chosen countries with currency `usd` and only a card provider (no COD). Add a service zone on the Pakistan Warehouse fulfillment set for those countries. Give variants USD prices by hand, or with a scheduled job that converts PKR at an admin-set rate and writes through `upsertVariantPricesWorkflow`, marking manual prices so they are never overwritten. Depends on an overseas-capable gateway (report 03 item 1). Risk: FX drift and rounding.
3. **Weight-based international shipping (M).** A custom fulfillment provider whose `calculatePrice` uses variant weight against a zone rate table kept in region metadata. A DHL API integration would be L. Depends on weights being filled in.
4. **Duties notice (S).** A `duties_notice` key in region metadata next to the existing policy keys (`apps/backend/src/lib/region-store-policies.ts`), shown on the product, cart and shipping pages. Every PK shop checked is "duties unpaid", so landed-cost calculation can wait.
5. **Geo suggestion banner (S).** Read a country header set by Nginx GeoIP or a CDN in `middleware.ts` and show "Shopping from the UK?" instead of redirecting, so crawlers stay stable. Whether the Hetzner Nginx setup provides that header is unverified.
6. **Display-only currency converter (S to M).** Only for the one-PKR-store model (Limelight): a scheduled job stores a daily rate, and a storefront component shows an approximate amount next to PKR. Risk: buyers expect to pay the shown amount.
7. **Urdu (L in total).** Turn the flag on and run `db:migrate` (S). Add `ur-PK` with a script calling the translation module's `createLocales`, since the admin cannot create locales (S). Translate the catalog in the admin (ongoing content work). Add a storefront i18n dictionary for UI strings, a locale in the URL for SEO, a `lang`/`dir` attribute, an RTL layout and an Urdu font (M to L). Risk: every product needs two texts, and the starter assumes left-to-right.
8. **Fix hreflang and sitemap (S).** After step 1 only `pk` remains. Emit real `en-US` and similar alternates only for live regions, with an `x-default`.

## Recommendation
- **Launch:** Step 1, removing the Europe data, because it puts wrong countries in the selector, sitemap and hreflang and offers COD to Europe. Stay Pakistan-only and say so on the site, as Beechtree does on its Pakistan store. Keep the translation flag off.
- **Soon after launch:** Step 2, one USD International region on the same domain, with step 3 flat or weight rates and the step 4 duties notice, once an overseas card gateway is approved. 9 of 12 PK competitors sell to the diaspora, and all of them do it without COD.
- **Later:** Per-country regions (GBP, AED, CAD) with hand-set prices, because Junaid Jamshed and Gul Ahmed price per country. The step 5 geo banner. Urdu catalog translation if research shows demand.
- **Skip:** Separate overseas domains or stores, which are a Shopify Payments workaround that regions replace. Collecting duties at checkout (DDP) and merchant-of-record services. A full Urdu RTL storefront at launch, because 0 of 12 competitors have one. Step 6, unless overseas buyers must pay in PKR.

## Questions for the owner
1. Will you ship abroad in the first year? If so, which countries first (UK, UAE, US/Canada)? This decides the regions and currencies.
2. Do you want Urdu product content at all, given that no competitor offers it (see also report 06, question 3)?
3. Until an overseas card gateway is approved, should overseas orders be refused, or taken by bank transfer arranged on WhatsApp?

## Sources
- https://help.shopify.com/en/manual/payments/shopify-payments/multi-currency
- https://help.shopify.com/manual/markets/managing-markets
- https://help.shopify.com/manual/markets/duties-and-import-taxes/charging-duties (search summary)
- https://www.shopify.com/ca/international/managed (search summary)
- https://apps.shopify.com/translate-and-adapt (search summary)
- https://help.shopify.com/manual/markets/languages/translate-adapt-app (search summary)
- Homepages of all 18 shops saved 2026-11-05 by reports 03, 09, 12 and 17
- https://uk.gulahmedshop.com/meta.json, https://us.junaidjamshed.com/meta.json, https://global.beechtree.pk/meta.json, https://global.ethnc.com/meta.json, https://www.mariab.ae/meta.json, https://bonanzasatrangi.us/meta.json, https://www.limelight.pk/meta.json, https://www.nishatlinen.com/meta.json, https://sapphire-online.com/meta.json (404)
- https://global.beechtree.pk/policies/shipping-policy, https://www.mariab.ae/policies/shipping-policy, https://uk.gulahmedshop.com/policies/shipping-policy, https://www.limelight.pk/policies/shipping-policy, https://us.junaidjamshed.com/policies/shipping-policy (no body)
- https://docs.medusajs.com/resources/commerce-modules/translation.md, .../translation/storefront.md, .../store/locales.md, .../region.md, .../pricing/tax-inclusive-pricing.md
- https://docs.medusajs.com/user-guide/settings/translations.md
- https://www.npmjs.com/package/medusa-plugin-currency-exchange-rates, https://packages.ecosyste.ms/registries/npmjs.org/packages/medusa-plugin-zonos (search results)
- Local: node_modules/@medusajs/{translation,region,currency,tax,pricing,store,fulfillment,js-sdk}/AGENTS.md; @medusajs/dashboard/src (feature-flag-provider, settings-layout, product and translations routes); @medusajs/utils/dist/common/define-config.js; @medusajs/medusa/dist/api/store/locales/route.js; apps/backend/src/scripts/setup-pakistan.ts; apps/backend/src/migration-scripts/initial-data-seed.ts; apps/storefront/src/middleware.ts, lib/config.ts, lib/data/locale-actions.ts, lib/data/cart.ts, lib/util/site.ts, lib/util/money.ts, modules/layout/components/{country-select,language-select}, app/sitemap.ts
