# Admin and operations

Researched 2026-11-06 against Medusa 2.22.2.

## Summary
This area covers the tools staff use behind the store: accounts and permissions, phone orders, order edits, notes and tags, invoices and packing slips, bulk edits, CSV files, stock locations and transfers, automation and activity logs. Medusa 2.22.2 handles the basics (staff invites, draft orders, order edits, product CSV, stock grids, stock at several locations, order export), but roles need a paid Enterprise licence, and it has no order notes, order tags, status filters, bulk order actions, printing or activity log. Before launch, lock down exported CSV files, which the default file provider leaves at a public URL, and add order notes and tags, a packing slip print and a simple staff deny-list. Soon after launch, build a dispatch queue with bulk actions.

## What Shopify offers
| Capability | Native or app | Plan limit or typical app | Source |
| --- | --- | --- | --- |
| Staff accounts | Native | Basic has no extra staff accounts, Grow 5, Advanced 15, Plus unlimited (seen 2026-11-05). Report 14 has the prices | [1] |
| Permissions | Native | Per area, down to single actions: edit orders, apply discounts, record payment, refund, export, delete, view or edit cost and price, manage transfers. Staff cannot be limited to particular orders or products | [2] |
| Draft orders | Native | Custom items, line or order discounts, custom prices, payment terms, an emailed invoice or checkout link, stock held until an expiry date, tags (55 characters) and notes | [3] |
| Order editing | Native | Before fulfillment: add or remove items, change quantities, shipping fee and manual discounts. The balance is collected by invoice or the difference refunded. Orders in Pending payment status may not be editable | [4][5] |
| Packing slips | Native | Print one order or many from the Orders page. Template in Liquid | [6] |
| Invoices, receipts, pick lists | Shopify Order Printer app | Free, bulk printing up to 50 orders, 3.6 stars from 387 reviews (seen 2026-11-06). Order Printer Pro: 4.9 stars from 3,050 reviews (listing, seen 2026-11-05) | [7][8] |
| Bulk editor | Native | Spreadsheet grid for products, variants, collections, customers and inventory | [9] |
| CSV | Native | Products (prices, tags, status, SEO fields), a separate inventory CSV for stock at several locations, customers, order export | [10] |
| Locations | Native | 10 on Basic, Grow and Advanced, 200 on Plus (seen 2026-11-05) | [1] |
| Stock transfers | Native | Between locations or from a supplier. Ready to ship, in transit, partial receipt, shipments with tracking | [11] |
| Purchase orders | Native | Suppliers with terms and currency. Draft, then ordered, then received through a transfer | [12] |
| Stock adjustment history | Native | 180 days per variant, showing who made each change and why. Older history through a report | [13] |
| Timeline | Native | On orders, drafts, customers and transfers: internal comments, attachments, @mentions that alert staff, links to other records | [14] |
| Tags | Native | On orders, drafts, products, customers, transfers and discounts. Up to 250 per object, list filters by tag, bulk add or remove | [15] |
| Shopify Flow | Free app, all plans | Trigger, condition, action. The HTTP request action needs Grow or higher. Templates include capture or cancel by risk level, daily tagging of late orders and an out-of-stock summary email (search snippet, details unverified) | [16][17] |
| Store activity log | Native | The old view shows the last 250 entries. The new log keeps 18 months and filters by staff, resource and date. No export | [18] |

## What real shops do
Admin features cannot be seen from a storefront and the README has no marker for this area, so no scan count applies. I used two indirect sources.

Pakistan:
- Public product JSON (`/products.json?limit=3`, 2026-11-05, all returned 200) at Outfitters, Limelight and Zellbury (seen).
  - Outfitters puts 26 to 29 tags on each product (season, year, internal batch codes, dates) and uses the vendor field as the department (Women, Men, Boys Junior).
  - Limelight uses 11 to 12 tags, including a sale campaign, a discount band and an internal item code.
  - Zellbury uses one tag, which repeats the product type.
  - So tags carry merchandising and internal codes, and staff edit them in bulk.
- A freshfits job ad on Qureos (seen 2026-11-06) lists the daily routine:
  - process COD and prepaid orders, and confirm every COD order by WhatsApp or phone;
  - cancel and log unverified or duplicate orders;
  - pack orders, book couriers (Leopards, TCS, Trax, PostEx), track daily and chase RTOs;
  - handle returns and exchanges, update a stock sheet after every dispatch, return and restock, flag low stock and log daily counts;
  - tools: Shopify, WhatsApp (WhatZi) and Excel.
- Other ads in the same search mention updating fulfillment status and tracking in Shopify each day, and COD settlements (search snippets, unverified).

Global:
- Allbirds product JSON (seen): 6 to 7 tags per product, including drop dates, a stock flag and shipment references, so tags double as operations notes.
- Gymshark returned 403, so I stopped there.

## What Medusa already has
| Capability | Status | Where |
| --- | --- | --- |
| Staff accounts and invites | Built in, admin | `@medusajs/user` AGENTS.md (invites expire after 24 hours by default). Settings > Users can copy an invite link, so no email is needed (`dashboard/dist/user-invite-*.mjs`, docs settings/users/invites) |
| Staff password reset | Partial | `auth.password_reset` is emitted, but no core subscriber acts on it (`medusa/dist/subscribers` holds three unrelated ones). The docs assume Medusa Emails on Cloud |
| Roles and permissions | Missing without a paid licence | RBAC is an Enterprise feature. It needs `MEDUSA_FF_RBAC=true` plus a `MEDUSA_LICENSE_KEY` that covers `rbac`, or boot fails (`rbac/AGENTS.md`, `modules-sdk/dist/loaders/utils/load-internal.js`, docs enterprise/rbac). The package is proprietary (`rbac/LICENSE`). Medusa's pricing page lists RBAC and audit logs on Enterprise only, at a custom price (seen 2026-11-05). Without RBAC every admin user can do everything. The only guard is that users cannot delete themselves |
| Draft orders | Built in, admin | `@medusajs/draft-order` plugin, Orders > Drafts: items, custom items, promotions, shipping, addresses, convert to order. Email and customer are optional. Converting reserves stock and emits `order.placed` (`core-flows/dist/draft-order/workflows/convert-draft-order.js`). No stock hold was seen while it is still a draft (unverified). No invoice, checkout link or payment terms |
| Order edits | Built in, admin | Add an item, change a quantity, remove, duplicate, add an internal note, force-confirm (docs user-guide/orders/edit). Confirming re-reserves stock and opens a payment collection for any extra amount, which staff close with Mark as paid. The API accepts `unit_price` and shipping changes, but the admin form does not. No storefront page for the customer to approve an edit |
| Address, email and owner changes | Built in, admin | Order detail page (docs user-guide/orders/manage) |
| Order search | Partial | `q` searches display ID, email and address fields, phone included (`order/dist/models/order.js`, `address.js`; read in code, not run) |
| Order list filters and bulk actions | Missing | Filters are region, sales channel and dates only. The payment and fulfillment filters are commented out (`dashboard/dist/chunk-B2C3RWOZ.mjs`, `chunk-PRJK2BND.mjs`) because both statuses are computed when read (report 14). The order list has no multi-select |
| Order timeline and notes | Partial | The Activity section lists events, plus edits with their note and user. No comments: the notes list is hard-coded empty in the order-detail bundle |
| Order tags | Missing | Only order `metadata` through a JSON editor. Product tags exist |
| Invoices and packing slips | Missing | An official tutorial builds a PDF invoice module with pdfmake, with admin and storefront download and an email attachment (docs tutorials/invoice-generator). Nothing prints today |
| Product CSV import and export | Built in, admin | One row per variant, with prices, status and tag IDs. No stock quantity column (docs user-guide/products/import) |
| Order, customer and inventory export | Built in, admin | Order export since 2.12.3. Inventory export, with quantities per location, since 2.19.0. The order CSV has no phone, items or COD amount (`core-flows/dist/order/steps/export-orders.js`). No order, customer or stock import |
| Export file privacy | Risk | Exports arrive as a link in the admin bell. The default local file provider writes "private" files into the public `static` folder under a timestamp name, served at `/static` without login (`file-local/AGENTS.md`, `framework/dist/http/express-loader.js`) |
| Bulk editing | Partial | Spreadsheet editor for variant prices, variant stock per location, price lists and shipping prices. A multi-select on the inventory list opens the stock editor (docs user-guide/tips/bulk-editor). The product list has no multi-select for status, tags or collections |
| Stock locations | Built in, admin | Several locations, stock levels, reservations, manual allocation, links to sales channels (`inventory` and `stock-location` AGENTS.md) |
| Stock transfers and purchase orders | Missing | No models. Stock levels have `incoming_quantity`, but no core flow sets it |
| Stock adjustment history | Missing | The inventory models are item, level and reservation only |
| Activity log | Missing | Order changes keep `created_by` and `confirmed_by`. Settings > Workflows shows workflow runs, for developers |
| Automation | Built in, for developers | Subscribers, scheduled jobs (`src/jobs`, run only in `shared` or `worker` mode) and workflow hooks (docs recipes/commerce-automation). No rule builder for staff, and the docs index lists no general outbound webhooks. The admin bell (`feed` channel) works without email |
| Saved table views | Partial | `MEDUSA_FF_VIEW_CONFIGURATIONS`, marked work in progress, off by default |

Everything above that exists is admin-only. The starter storefront has no invoice download and no order-edit page (grep of `apps/storefront/src`).

## What we would build
Reports 01 (verification and call queue), 02 (courier booking, airway bills, settlement) and 14 (reports) cover their own parts. These are the remaining staff tools.
1. Lock down export files (S). Option A: move files to private S3-compatible storage through `file-s3` (Hetzner Object Storage, report 13), so export links are presigned and expire. Option B: deny `/static/private-*` in Nginx and serve exports through an authenticated admin route. Either way, add a scheduled job that deletes exports after a few days. Risk: option A moves product images too, so plan it with report 13.
2. Staff deny-list (S). Store a role (owner or staff) in a small table or in `user.metadata`. An `/admin/*` middleware in `middlewares.ts` reads `req.auth_context.actor_id` and refuses chosen routes to staff: users and invites, API keys, store settings, exports, refunds, price lists, product delete.
   - Staff must also be blocked from editing users, or they could raise their own role.
   - Write our own code; do not copy or patch the licensed RBAC package.
   - Risks: buttons still show and fail with an error, and the route list needs a recheck after each upgrade.
3. Order notes and tags (S to M). An `order-ops` module with OrderNote (author, text, time) and OrderTag, linked to the order with `defineLink`. A widget on the order page, shared with report 01's verification widget, plus an admin route that lists orders by tag through Query.
4. Packing slip and pick list (S). An admin UI route renders a printable page for one or many orders (items, size, quantity, COD amount, address, phone) and opens the browser's print dialog. It can double as the invoice in the parcel. A PDF invoice built from the tutorial is M. Check first that pdfmake renders Urdu (unverified).
5. Dispatch queue with bulk actions (M). An admin page backed by a stored operations status (confirmed, packed, booked, delivered, returned) that subscribers keep current.
   - Filters, phone search and multi-select actions: print slips, mark shipped (`createShipmentWorkflow`), mark delivered (`markOrderFulfillmentAsDeliveredWorkflow`), capture COD (`capturePaymentWorkflow`).
   - Depends on reports 01 and 02. Risk: bulk actions must run the same workflows as the single-order buttons.
6. Courier-ready export (S). A custom export route with phone, items, COD amount and city, in the courier's bulk-booking column order, until report 02's courier provider exists.
7. Stock load and CSV import (S). A `medusa exec` script for the first load, then an admin route that takes SKU, location and quantity into `batchInventoryItemLevelsWorkflow`.
8. Admin activity log (S). A middleware on every non-GET `/admin/*` request writes actor, method, path, resource ID and result to a small module. Leave out request bodies, because they hold customer data. An admin page lists the entries, a job prunes old ones, and the log also gives a stock adjustment trail.
9. Staff password reset (S). A subscriber on `auth.password_reset` once report 10 adds a provider. Until then, a script that sets a new password through the Auth Module. Confirm the method in `auth` AGENTS.md at build time.
10. Phone rule for draft orders (S). Drafts skip the cart `validate` hook, so apply report 01's phone rule in a middleware on `POST /admin/draft-orders/:id/convert-to-order`.
11. Scheduled digests (S each). Jobs that post to the admin bell: morning counts by status, stock below a threshold, drafts older than N days.
12. Stock transfers (M). A `stock-transfer` module (from, to, lines, status) and workflows that lower stock on sending and raise it on receipt.
13. Bulk product actions (S to M). A multi-select page that sets status, tags and collections through `/admin/products/batch`.
14. Purchase orders (M to L). A supplier and purchase-order module that sets `incoming_quantity` and receives goods into stock.

## Recommendation
- Launch:
  - Use what is built in: staff accounts through copied invite links, draft orders for phone and WhatsApp orders, order and address edits, product CSV, stock grids, order export.
  - Lock down export files (item 1). Order CSVs with names and addresses would otherwise sit at a public URL.
  - Staff deny-list (item 2), if anyone besides the owner gets a login. Otherwise any staff member can export every customer and delete products.
  - Order notes and tags (item 3). Confirmation and delivery staff need one shared place for notes such as "call after 5 pm".
  - Packing slip print (item 4). Every parcel needs one, and the admin cannot print.
  - Initial stock load script (item 7). The product CSV has no stock column.
  - Test COD capture after an edit that lowers the total. The capture button sends the payment's original amount (order-detail bundle), which may leave the order overpaid (read in code, not run).
- Soon after launch:
  - Dispatch queue with bulk actions (item 5). Shipping, delivering and capturing one order at a time becomes the daily bottleneck.
  - Activity log (item 8). It is needed once two people share stock and refunds.
  - Courier-ready export and stock CSV import (items 6 and 7). They cut retyping until courier APIs arrive.
  - Password reset, the draft phone rule and digests (items 9 to 11). Each is small and removes a daily snag.
- Later:
  - Stock transfers (item 12), once a shop or outlet shares the stock.
  - Bulk product actions (item 13), once the catalogue outgrows CSV round trips.
  - PDF invoices by email, once report 10 adds an email provider.
  - An Enterprise RBAC licence, if the team outgrows a deny-list.
- Skip:
  - Purchase orders and suppliers. A small team can keep them in a spreadsheet.
  - A Flow-style visual rule builder. A handful of coded jobs covers a small COD store.
  - Customer approval of order edits. Staff confirm changes by phone and force-confirm them.

## Questions for the owner
1. How many people will log in at launch, and what must they be kept away from (exports, refunds, prices, staff accounts)? The answer decides between our own deny-list now and an Enterprise licence (price on request) later.
2. Does each parcel need a formal tax invoice (NTN, sales tax lines), or is a packing slip with prices enough?
3. Will there be one warehouse at launch, or shops and outlets that share stock? The answer decides when stock transfers are needed.

## Sources
- [1] https://www.shopify.com/pricing ; [2] https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions
- [3] https://help.shopify.com/en/manual/fulfillment/managing-orders/create-orders/create-draft ; [4] https://help.shopify.com/en/manual/fulfillment/managing-orders/editing-orders ; [5] the same URL plus /considerations
- [6] https://help.shopify.com/en/manual/fulfillment/managing-orders/printing-orders/packing-slips/printing-packing-slips ; [7] https://help.shopify.com/en/manual/fulfillment/managing-orders/printing-orders/shopify-order-printer ; [8] https://apps.shopify.com/shopify-order-printer and https://apps.shopify.com/order-printer (delisted, showed similar apps)
- [9] https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing-products ; [10] https://help.shopify.com/en/manual/products/import-export/using-csv
- [11] https://help.shopify.com/en/manual/products/inventory/transfers ; [12] https://help.shopify.com/en/manual/products/inventory/purchase-orders ; [13] https://help.shopify.com/en/manual/products/inventory/adjusting-inventory/adjustment-history
- [14] https://help.shopify.com/en/manual/shopify-admin/productivity-tools/timeline ; [15] https://help.shopify.com/en/manual/shopify-admin/productivity-tools/using-tags
- [16] https://help.shopify.com/en/manual/shopify-flow ; [17] https://help.shopify.com/en/manual/shopify-flow/reference/examples (search snippet) ; [18] https://help.shopify.com/en/manual/shopify-admin/activity-logs
- Shops: https://outfitters.com.pk/products.json?limit=3 , https://www.limelight.pk/products.json?limit=3 , https://www.zellbury.com/products.json?limit=3 , https://www.allbirds.com/products.json?limit=3 , https://www.gymshark.com/products.json (403)
- Job ads: https://app.qureos.com/jobs/ecommerce-operations-executive-1778481736696 (seen) ; https://app.qureos.com/jobs/logistics-coordinator-1777569690702 (search snippet)
- Medusa docs (.md): https://docs.medusajs.com/resources/enterprise/rbac , /resources/enterprise , /resources/how-to-tutorials/tutorials/invoice-generator , /resources/recipes/commerce-automation
- Medusa user guide (.md): https://docs.medusajs.com/user-guide/settings/users , /settings/users/invites , /reset-password , /orders/edit , /orders/export , /orders/manage , /orders/draft-orders/create , /products/import , /inventory/export , /inventory/inventory , /tips/bulk-editor ; https://medusajs.com/pricing/
- Local (node_modules/@medusajs/): rbac/AGENTS.md and LICENSE, user, draft-order, inventory, stock-location, file-local, medusa AGENTS.md; utils/dist/license/index.js and common/define-config.js; modules-sdk/dist/loaders/utils/load-internal.js; medusa/dist/feature-flags/{rbac,view-configurations}.js; medusa/dist/api/admin/{orders,order-edits,draft-orders}/validators.js; core-flows/dist/{order/steps/export-orders.js, draft-order/workflows/convert-draft-order.js, order/workflows/order-edit/, inventory/workflows/batch-inventory-item-levels.js}; order/dist/models/{order,address,order-change}.js; dashboard/dist order-detail, order-list, order-create-edit, user-invite and inventory-list bundles; framework/dist/http/express-loader.js
- Repo: apps/backend/medusa-config.ts, apps/backend/src/jobs/README.md, apps/storefront/src; reports 01, 02, 10, 12, 13 and 14 in this folder
