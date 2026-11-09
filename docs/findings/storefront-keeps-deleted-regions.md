# The starter storefront keeps deleted regions

- **Affects:** the storefront in Medusa's [DTC starter](https://github.com/medusajs/dtc-starter), checked against its code on 9 November 2026
- **Upstream:** reported as [medusajs/dtc-starter#100](https://github.com/medusajs/dtc-starter/issues/100)
- **In this repository:** fixed in [`regions.ts`](../../apps/storefront/src/lib/data/regions.ts) and [`middleware.ts`](../../apps/storefront/src/middleware.ts)

## What happens

Delete a region in the Medusa admin, or remove a country from one, and the storefront keeps serving it. The country's URLs still load, and the country stays in the sitemap, the hreflang links and the country selector. Restarting the storefront does not help.

This repository found it after removing the seeded Europe region: `/dk` and the other European pages kept loading after the region was gone.

## Cause

Three caches each hold on to the old region list.

1. **The data cache.** `listRegions` and `retrieveRegion` fetch with `cache: "force-cache"` and no `revalidate`. Nothing in the starter invalidates the regions tag when a region changes, so Next.js keeps the first response indefinitely. The data cache is stored on disk, which is why a restart does not clear it.
2. **A module-level map in `getRegion`.** Regions are added to it and never removed, so a running server keeps every region it has seen.
3. **The middleware's region map.** It is refreshed every hour, but the refresh writes into the existing map. New countries appear, while removed ones stay.

## Fix

- Region fetches revalidate after an hour, matching the middleware's refresh interval.
- `getRegion` looks the country up in `listRegions` each time. That call is already cached, so the extra map is not needed.
- The middleware builds a new map on each refresh and swaps it in, so removed countries drop out.

A deleted region can still take up to an hour to leave the storefront. Making it immediate would need a backend subscriber that calls a revalidation endpoint on the storefront. That is not built here.

Until then, deleting `apps/storefront/.next` and restarting clears the cache straight away.
