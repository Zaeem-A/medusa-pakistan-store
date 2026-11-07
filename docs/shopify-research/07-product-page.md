# Product page

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers everything on a product page that helps a shopper pick and trust a variant: swatches, size charts, media, zoom, quick add, sticky add to cart, stock messages, back-in-stock alerts, pre-orders and custom options such as stitching. Medusa already has the data underneath (options, variants, images per variant, metadata, inventory per sales channel), and the starter shows a sticky mobile bar and a variant-filtered gallery, but it has no swatches, size chart, zoom, video, low-stock message, quick add or restock alerts. For launch, build a shared size-chart module, colour swatches from option-value metadata, zoom, a low-stock message and sold-out marking on sizes. Back-in-stock alerts come after the messaging channel from report 10. Custom stitching and pre-orders come later, if at all.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Options and variants | Native | 3 options and 2,048 variants per product on all plans since 2025-10-15 | shopify.dev changelog |
| Colour swatches | Native | Product category, plus a colour category metafield whose entries fill the option values. Theme must support swatches. No plan limit stated | help center, category metafields |
| Combined listings (separate products shown as one listing, linked by colour) | Native app | Plus or enterprise only. Up to 60 products and 2,048 variants. Online Store channel only | help center, combined listings |
| Metafields and metaobjects | Native | Types include json, rich text, file and metaobject references, and lists. Shown in themes through dynamic sources | help center, shopify.dev data types |
| Size chart | App or theme | Smart Size Chart: free for 2 charts, $9 to $19 a month. Wellmade: $4 a month. Jotly: from $6.99 a month (vendor says, 2026-11-05) | apps.shopify.com |
| Product media | Native | Images, video and 3D. Variants can have images. Theme must support video and 3D | help center, product media |
| Zoom, quick add, sticky add to cart | Theme | Built into premium themes (seen on Junaid Jamshed's Kalles theme). Dawn's help page does not cover them (unverified for free themes) | seen; Dawn help page |
| Remaining stock on page | Native theme block | Inventory block in free OS 2.0 themes from v8.0.0. Thresholds come from premium themes | help center, show remaining quantity |
| Back-in-stock alerts | App only | Restock Rocket: listing shows a free plan. Paid tiers of $4 to $20 a month come from a competitor's blog (unverified) | apps.shopify.com/restock-rocket-1 |
| Pre-orders | Native mechanism, app required | Selling plans with deferred payment. PreOrder Now WOD: free for 1 product, then $19.95 to $59.95 a month. PQ: from $7.99 a month (vendor says, 2026-11-06) | shopify.dev preorder-tbyb, App Store |
| Custom options (text, measurements, add-on prices) | Native line item properties, app for the UI | Globo: free, paid from $9.9 a month. Easify: free, $9.99 to $99.99 a month. Infinite Options: $9.99 a month (vendor says, 2026-11-06) | App Store; properties seen on Junaid Jamshed |

## What real shops do
Pakistani shops. On 2026-11-05 I read the public product list (`/products.json`, first 30 to 40 items) for Maria B, Gul Ahmed, Nishat Linen, Limelight, Zellbury, Junaid Jamshed, Beechtree and Bonanza Satrangi. Only Junaid Jamshed and Breakout returned a full product page. The other product pages returned 429. Breakout's product list returned 404, and Sapphire's returned a 301 that I did not follow.
- Stitched and unstitched are separate products, not an option (seen). Nishat Linen's 40 items were all no-option "Pack Suit" products tagged unstitched. Limelight's "Unstitched Printed" and Gul Ahmed's "Women Fabric" products also have no options. Beechtree records the piece count as a size value ("2PC"), with Fabric as a third option. Maria B sells loose fabric by piece (shirt, dupatta, shirt front, shirt back) and lists the metres in the description.
- None of the eight lists showed a stitching service or a custom-measurement option (seen). A web search found measurement-based stitching only at small or overseas sellers. A Maria Faisal page returned 429, so that case is unverified.
- Colour is usually one product per colour (seen at Maria B, Beechtree, Bonanza Satrangi, Junaid Jamshed and Zellbury). Zellbury's polo lists 8 colours in its options but carries only its own 4 Summer Sand variants, which is the combined-listing pattern. Which tool produces it is unverified.
- Variant images: 36 of 40 Zellbury products and 9 of 40 Junaid Jamshed products assign images per variant. Shops with one product per colour assign none.
- Size charts are shared, not per product (seen). Maria B and Zellbury attach them by tag (for example a women's size-guide tag). Breakout stores a structured chart per product type ("Regular / Zipper Hoodie") in a product field.
- Junaid Jamshed's page (Kalles 5.2.1 theme) had:
  - a size-guide image popup, zoom up to 4x and a sticky add-to-cart bar
  - a quick-add modal on product cards
  - a low-stock message that turns on at 15 units
  - a sale countdown (report 05)
  - hidden cart properties for an internal charge code and barcode
  - the Restock Rocket notify-me app
  - a "Pre-order" label that exists in the theme markup but was hidden
- 10 of Junaid Jamshed's first 40 products were fully sold out, so sold-out handling matters.
- Breakout had a size guide and quick add on cards. It had no zoom, video, sticky bar or notify-me.

Global shops. Allbirds' product page returned 200. It had colour swatches that link sibling products (one product per colourway), a fit guide, zoom, an autoplay video, a sticky add-to-cart variant, quick add, and a notify-me modal on sold-out sizes. Brooklinen's product list showed bundle tags and variant images, but its product page returned 429. Gymshark returned 403. For Fashion Nova I reached only the gift-card page, so I have no product evidence.

How the marker counts held up:
- Size chart (12/5) and back in stock (6/6) held up on every page I could open.
- Quick view (10/6) mostly means quick add. Allbirds has quick add with quick view switched off.
- Swatches (11/6) are inflated. Shopify's product JSON carries a `swatch` field even when it is empty (Breakout), and Junaid Jamshed's only matches were in script comments.
- Pre-order is inflated by theme strings that ship with the theme.
- Sticky add to cart (2/0) is undercounted, because it only shows on product pages. Junaid Jamshed and Allbirds both have it.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Options, variants, global shared options (since 2.16.0) | Built in | `@medusajs/product` AGENTS.md. Admin has `/product-options`. No variant cap is documented |
| Images per variant, variant thumbnail | Built in | `ProductVariantProductImage`, `addImageToVariant`. Admin variant Media section since v2.11.2 (user guide). Starter `variant-image-gallery.tsx` filters by `?v_id` |
| Metadata on product, variant, option, option value and image | Built in | `metadata` json column on each model in `@medusajs/product`. Admin has metadata pages for product, variant, option and option value, but only string, number and boolean values can be edited there. Objects and arrays are read-only (`metadata-form.tsx`) |
| Admin custom form fields | Partial (experimental) | `unstable_defineCustomFieldsConfig` in `@medusajs/admin-sdk`, product model only |
| Admin widget zones | Built in | `product.details(.side)`, `product_variant.details(.side)`, `product_option_value.details` (`@medusajs/admin-shared`) |
| Stock on the page | Partial | `+variants.inventory_quantity`, counted over the stock locations of the sales channel (storefront inventory guide). Starter shows only "In stock" or "Out of stock" text (`product-actions/index.tsx`) and does not mark sold-out sizes (`option-select.tsx`) |
| Sticky add to cart | Built in (mobile only) | `product-actions/mobile-actions.tsx`: fixed bottom bar when the main button scrolls away |
| Swatches, size chart, zoom, video, quick add | Missing | Starter shows text option buttons and a plain image stack (`image-gallery/index.tsx`). Cards are links only (`product-preview`) |
| Back-in-stock alerts | Missing (official recipe) | Restock-notification recipe and example repo. npm `medusa-plugin-restock-notification` 7.0.6 (2024) looks like a Medusa v1 plugin (unverified for v2) |
| Pre-orders | Missing (official tutorial) | Preorder tutorial: module, links to variant and order, variant widget, custom cart completion. `allow_backorder` exists on variants |
| Custom options and measurements | Partial | Store add-line-item accepts `metadata` (`carts/validators.js`). Items with different metadata are not merged (`find-matching-line-item.js`). Product-builder tutorial and custom-item-price guide. Starter `addToCart` sends no metadata |

The storefront fetches product `metadata` but never renders it. Nothing here needs a backend change to start. Most gaps are storefront and admin UI.

## What we would build
1. **Size chart (M, low end).** Make a `size-chart` module with a `SizeChart` model: name, unit, column headings, rows as json, an optional image and fit notes. Add a module link from product to size chart, many products to one chart, which matches how the shops share charts. Admin: a UI route to manage charts, plus a `product.details.side` widget to pick a product's chart. Don't put charts in raw metadata, because the admin can't edit nested json. Storefront: a "Size guide" link next to the size option that opens a modal, fed by a small store route. Risk: if many products have no chart, add a per-category default later.
2. **Colour swatches (S).** Use a global Color option. Store a hex code (or image URL) in each option value's metadata, which is a plain string the admin can edit. Change `option-select.tsx` to draw circles for the Color option. Depends on the colour model decision (question 1).
3. **Sold-out sizes and low-stock message (S).** Use the `inventory_quantity` data already fetched to cross out sold-out values and to show "only N left" under a threshold, for example 5. Risk: exact counts are already public through the API. Show a band rather than the number if that matters.
4. **Zoom and lightbox (S).** Client-side pinch and click zoom on the gallery, using a small React lightbox library (not yet chosen). Fabric detail matters for lawn and embroidery.
5. **Video (S to M).** Put a `video_url` string in product metadata, upload the file through the File Module (S3-compatible or local) or use an unlisted host, and render a muted looping `<video>` in the gallery. Risk: large files on a single Hetzner VPS. Whether the admin media uploader takes video is unverified.
6. **Quick add on cards (S to M).** The list query already returns variants, options and stock. Reuse `ProductActions` in a drawer opened from `product-preview`.
7. **Back-in-stock alerts (M).** Follow the official restock recipe:
   - restock module and a link to variants
   - subscribe route, open to guests by phone number
   - daily scheduled job or inventory subscriber that sends the alerts
   - admin list of subscriptions as a widget
   
   Depends on a notification provider (report 10). WhatsApp or SMS fits Pakistan better than email. Risks: consent, and a gap in notify-me options until a provider exists.
8. **Colour siblings, the combined-listing equivalent (M).** If each colour is its own product, link products into a style group (a link to a small module, or a shared string metadata key read by a custom store route) and show the sibling swatches on the page and on cards.
9. **Custom stitching and measurements (M).** Follow the product-builder pattern:
   - Measurement fields go into line-item metadata.
   - The stitching fee is either a separate "Stitching" service variant added next to the fabric (simplest) or a custom price through the custom-item-price workflow.
   - Show the measurements in the cart, the order page and an admin order widget.
   
   Risks: tailoring operations, longer delivery and a return exclusion that must be written into policy (report 12).
10. **Pre-orders (S or L).** S: allow backorder on chosen variants and add a "ships by" date in metadata, shown on the page and in the cart. L: the full tutorial with pre-order records and automatic fulfilment. Risk under COD: buyers who wait weeks are more likely to refuse delivery.

## Recommendation
- **Launch:**
  - Variant images: built in, so it only needs content.
  - Size chart: every Pakistani shop checked has one, and wrong sizes drive COD refusals and returns.
  - Sold-out marking and a low-stock message: cheap, using data already loaded.
  - Swatches: shoppers pick by colour, and it is small once the colour model is chosen.
  - Zoom: fabric and embroidery detail sells unstitched suits.
  - Stitched and unstitched as product type, tags and categories: matches every shop seen and needs no code.
- **Soon after launch:**
  - Back-in-stock alerts: needs the messaging channel from report 10 first.
  - Quick add: speeds up browsing on mobile.
  - Colour siblings: only if one product per colour is chosen.
  - Video: useful for drape, but not essential.
- **Later:**
  - Custom stitching and measurements: none of the large Pakistani shops seen offer it, and it adds tailoring operations.
  - Simple pre-order ("ships by" date): useful for collection launches once delivery-refusal rates are known.
- **Skip:**
  - A separate quick-view modal: quick add covers it.
  - The full pre-order module: too heavy for COD without deposits.
  - 3D models and AI fit finders: little value for this catalogue.
  - Experimental admin custom fields: unstable API, so use widgets instead.

## Questions for the owner
1. Will each colour be its own product, as most Pakistani shops do, or one product with a Color option? This decides how swatches, images and colour siblings are built.
2. Will you offer custom stitching or custom measurements? If so, at what fee, and are those orders excluded from returns?
3. Will you take pre-orders for new collections under COD, or sell only stock on hand?

## Sources
- Medusa package docs (2.22.2): node_modules/@medusajs/product/AGENTS.md, inventory/AGENTS.md, admin-sdk/AGENTS.md, admin-shared/AGENTS.md, dashboard/AGENTS.md. Code: dashboard `src/components/forms/metadata-form/metadata-form.tsx`, core-flows `dist/cart/utils/find-matching-line-item.js`, medusa `dist/api/store/carts/validators.js`
- Starter: apps/storefront/src/modules/products/**, apps/storefront/src/lib/data/products.ts, apps/storefront/src/lib/util/inventory.ts
- https://docs.medusajs.com/resources/commerce-modules/product/variant-inventory.md
- https://docs.medusajs.com/resources/storefront-development/products/inventory.md
- https://docs.medusajs.com/resources/commerce-modules/product/admin-widget-zones.md
- https://docs.medusajs.com/resources/commerce-modules/product/extend.md
- https://docs.medusajs.com/user-guide/products/variants.md
- https://docs.medusajs.com/resources/recipes/commerce-automation/restock-notification.md
- https://docs.medusajs.com/resources/how-to-tutorials/tutorials/preorder.md
- https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-builder.md
- https://docs.medusajs.com/resources/examples/guides/custom-item-price.md
- https://registry.npmjs.org/-/v1/search?text=medusa%20restock
- https://help.shopify.com/en/manual/products/combined-listings-app
- https://help.shopify.com/en/manual/custom-data/metafields
- https://help.shopify.com/manual/custom-data/metafields/category-metafields/using-category-metafields
- https://shopify.dev/docs/apps/build/custom-data/metafields/list-of-data-types
- https://help.shopify.com/en/manual/products/product-media
- https://help.shopify.com/en/manual/online-store/themes/os20/themes-by-shopify/dawn/customize
- https://help.shopify.com/en/manual/online-store/themes/os/customize/show-remaining-quantity
- https://shopify.dev/changelog/posts/the-product-variant-limit-is-now-2048-for-all-merchants
- https://shopify.dev/docs/storefronts/themes/pricing-payments/preorder-tbyb.md
- https://apps.shopify.com/restock-rocket-1, https://apps.shopify.com/preorder-now, https://apps.shopify.com/preorder-manager-prequik
- https://apps.shopify.com/product-options-pro, https://apps.shopify.com/easify-product-options, https://apps.shopify.com/custom-options
- https://apps.shopify.com/smartsize, https://apps.shopify.com/size-chart-guide-by-jotly, https://apps.shopify.com/size-chart-studio-1
- Shop pages seen 2026-11-05: www.junaidjamshed.com/products/beige-lawn-embroidered-stitched-3pc-jls26396s, www.allbirds.com/products/mens-wool-runner-nz-shadow-blue-natural-white-sole, www.breakout.com.pk/products/k25wu215-hgy, and `/products.json` for mariab.pk, gulahmedshop.com, nishatlinen.com, limelight.pk, zellbury.com, junaidjamshed.com, beechtree.pk, bonanzasatrangi.com, allbirds.com, brooklinen.com
- Search results only (pages not opened): tarzemashriq.com and mariafaisal.com listings on custom stitching
