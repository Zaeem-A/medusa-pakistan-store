# Moving a reservation leaves stock reserved at the old location

- **Affects:** Medusa 2.22.2 to 2.22.4, the latest release when this was written (November 2026)
- **Upstream:** [medusajs/medusa#17215](https://github.com/medusajs/medusa/issues/17215), open. Two fix pull requests were closed without being merged.
- **In this repository:** worked around in [`remove-europe-demo.ts`](../../apps/backend/src/scripts/remove-europe-demo.ts)

## What happens

A reservation holds stock for an order at one stock location. When a reservation moves to another location, Medusa adds its quantity to the new location's `reserved_quantity` but never takes it off the old one. The old location keeps reserved units that no reservation accounts for, so its available stock reads too low until someone corrects it.

With 10 units at location A, 10 at location B, and 3 reserved at A, moving the reservation to B gives:

| | A reserved | B reserved |
| --- | --- | --- |
| Expected | 0 | 3 |
| Actual | 3 | 3 |

## When it happens

- **Fulfilling from another warehouse.** `createFulfillmentWorkflow` moves the reservation to the location the order ships from. Any store with more than one warehouse that ships from a location other than the reserved one will drift.
- **Any code that changes a reservation's `location_id`**, for example `updateReservationsWorkflow`.

## Cause

`updateReservationItems_` in the inventory module builds the adjustments correctly: minus the quantity at the old location, plus at the new one. It then loads inventory levels for `data.location_id ?? reservation.location_id` only, which is the new location. The loop that applies the adjustments walks the loaded levels, so the old location's adjustment is dropped.

## How this repository ran into it

The initial seed creates a "European Warehouse". Some demo orders had stock reserved there, so `remove-europe-demo.ts` moves those reservations to the Pakistan Warehouse before deleting the old warehouse's inventory levels. `deleteInventoryLevelsWorkflow` then refused: the levels still showed reserved stock, although no reservation pointed at them any more.

## Workaround

The script:

1. moves the reservations with `updateReservationsWorkflow`;
2. checks that no live reservation still points at the old location, and stops if one does;
3. soft-deletes the old levels through the inventory module directly. The check in step 2 covers what the workflow's guard protects against.

This store has one warehouse, so fulfilment from a second location is not handled.

## Checking a database

This read-only query lists stock levels whose reserved count does not match their live reservations:

```sql
select il.inventory_item_id, il.location_id, il.reserved_quantity,
       coalesce(sum(ri.quantity), 0) as live_reserved
from inventory_level il
left join reservation_item ri
  on ri.inventory_item_id = il.inventory_item_id
 and ri.location_id = il.location_id
 and ri.deleted_at is null
where il.deleted_at is null
group by il.id
having il.reserved_quantity <> coalesce(sum(ri.quantity), 0);
```

An empty result means every level matches.

Medusa ships a migration script, `reconcile-inventory-reserved-quantity`, that recalculates these counts from active reservations. It runs once per database during `medusa db:migrate`, so it does not repair drift that happens afterwards. Medusa stores each count twice, in `reserved_quantity` and `raw_reserved_quantity`, so a fix by hand has to update both columns.
