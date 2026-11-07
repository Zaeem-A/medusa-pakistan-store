"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Regions change rarely, but a region removed in the admin has to leave the
// storefront without a rebuild. force-cache alone keeps the old list forever.
// Matches the middleware's refresh interval.
const REGIONS_REVALIDATE_SECONDS = 3600

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
    revalidate: REGIONS_REVALIDATE_SECONDS,
  }

  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
    revalidate: REGIONS_REVALIDATE_SECONDS,
  }

  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
}

// Looked up from listRegions each time, which is cached, rather than kept in a
// module-level map that would hold on to deleted regions until a restart.
export const getRegion = async (countryCode: string) => {
  const regions = await listRegions()

  if (!regions) {
    return null
  }

  const code = countryCode || "us"

  return regions.find((region) =>
    region.countries?.some((country) => country?.iso_2 === code)
  )
}
