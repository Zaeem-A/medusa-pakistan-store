/**
 * Removes the Europe demo data that the initial data seed creates: the Europe
 * region, the European Warehouse with its fulfillment set and shipping
 * options, the Europe tax regions, and the EUR and USD store currencies.
 *
 *   npm run remove:europe-demo                    (lists only)
 *   CONFIRM_DELETE=1 npm run remove:europe-demo   (deletes)
 *
 * Run it after setup:pakistan. The initial data seed runs on every new
 * database, so each new database needs this once.
 *
 * Without CONFIRM_DELETE=1 it only lists what it would delete. It stops if any
 * order uses the Europe region or a demo currency, so real data is never
 * removed by mistake.
 *
 * Orders placed before setup-pakistan unlinked the European Warehouse reserved
 * their stock there. Those reservations are moved to the Pakistan Warehouse
 * first, so the orders can still be fulfilled.
 */
import {
  deleteFulfillmentSetsWorkflow,
  deletePricePreferencesWorkflow,
  deleteRegionsWorkflow,
  deleteShippingOptionsWorkflow,
  deleteStockLocationsWorkflow,
  deleteTaxRegionsWorkflow,
  updateReservationsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

const REGION_NAME = "Europe"
const STOCK_LOCATION_NAME = "European Warehouse"
const KEPT_STOCK_LOCATION_NAME = "Pakistan Warehouse"
const COUNTRY_CODES = ["gb", "de", "dk", "se", "fr", "es", "it"]
const DEMO_CURRENCIES = ["eur", "usd"]
const KEPT_CURRENCY = "pkr"

export default async function removeEuropeDemo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventory = container.resolve(Modules.INVENTORY)
  const pricing = container.resolve(Modules.PRICING)
  const confirmed = process.env.CONFIRM_DELETE === "1"

  // ---- What exists ------------------------------------------------------------

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
    filters: { name: REGION_NAME },
  })
  const regionIds = regions.map((region) => region.id)

  const { data: regionOrders } = regionIds.length
    ? await query.graph({
        entity: "order",
        fields: ["id", "display_id"],
        filters: { region_id: regionIds },
      })
    : { data: [] }
  const { data: currencyOrders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id"],
    filters: { currency_code: DEMO_CURRENCIES },
  })
  const { data: regionCarts } = regionIds.length
    ? await query.graph({
        entity: "cart",
        fields: ["id", "completed_at"],
        filters: { region_id: regionIds },
      })
    : { data: [] }

  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "name",
      "sales_channels.id",
      "fulfillment_sets.id",
      "fulfillment_sets.name",
      "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.name",
      "fulfillment_sets.service_zones.shipping_options.id",
      "fulfillment_sets.service_zones.shipping_options.name",
    ],
    filters: { name: STOCK_LOCATION_NAME },
  })
  const locationIds = locations.map((location) => location.id)
  const fulfillmentSets = locations
    .flatMap((location) => location.fulfillment_sets ?? [])
    .filter((set) => !!set)
  const shippingOptions = fulfillmentSets
    .flatMap((set) => set.service_zones ?? [])
    .flatMap((zone) => zone?.shipping_options ?? [])
    .filter((option) => !!option)

  const inventoryLevels = locationIds.length
    ? await inventory.listInventoryLevels({ location_id: locationIds })
    : []
  const reservations = locationIds.length
    ? await inventory.listReservationItems({ location_id: locationIds })
    : []

  const {
    data: [keptLocation],
  } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
    filters: { name: KEPT_STOCK_LOCATION_NAME },
  })
  const keptLevels =
    keptLocation && reservations.length
      ? await inventory.listInventoryLevels({
          location_id: keptLocation.id,
          inventory_item_id: reservations.map((r) => r.inventory_item_id),
        })
      : []
  const unmovableReservations = reservations.filter(
    (reservation) =>
      !keptLevels.some(
        (level) => level.inventory_item_id === reservation.inventory_item_id
      )
  )

  const { data: reservedOrderItems } = reservations.length
    ? await query.graph({
        entity: "order_line_item",
        fields: ["id", "title", "variant_sku"],
        filters: {
          id: reservations
            .map((reservation) => reservation.line_item_id)
            .filter((id): id is string => !!id),
        },
      })
    : { data: [] }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code", "province_code", "parent_id"],
    filters: { country_code: COUNTRY_CODES },
  })

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: [
      "id",
      "supported_currencies.currency_code",
      "supported_currencies.is_default",
    ],
  })
  const storeCurrencies = (store?.supported_currencies ?? []).filter(
    (currency) => !!currency
  )

  const pricePreferences = await pricing.listPricePreferences({})
  const demoPricePreferences = pricePreferences.filter(
    (preference) =>
      (preference.attribute === "currency_code" &&
        DEMO_CURRENCIES.includes(preference.value ?? "")) ||
      (preference.attribute === "region_id" &&
        regionIds.includes(preference.value ?? ""))
  )
  const [, demoPriceCount] = await pricing.listAndCountPrices({
    currency_code: DEMO_CURRENCIES,
  })

  logger.info(
    `Regions: ${JSON.stringify(
      regions.map((region) => ({
        id: region.id,
        name: region.name,
        currency: region.currency_code,
        countries: (region.countries ?? []).map((country) => country?.iso_2),
      }))
    )}`
  )
  logger.info(
    `Orders in the region: ${regionOrders.length}. Orders in EUR or USD: ${currencyOrders.length}. Carts in the region: ${regionCarts.length} (${regionCarts.filter((cart) => cart.completed_at).length} completed).`
  )
  logger.info(
    `Stock locations: ${JSON.stringify(
      locations.map((location) => ({
        id: location.id,
        name: location.name,
        sales_channels: (location.sales_channels ?? []).map(
          (channel) => channel?.id
        ),
      }))
    )}`
  )
  logger.info(
    `Fulfillment sets: ${JSON.stringify(
      fulfillmentSets.map((set) => ({
        id: set.id,
        name: set.name,
        zones: (set.service_zones ?? []).map((zone) => zone?.name),
      }))
    )}`
  )
  logger.info(
    `Shipping options: ${JSON.stringify(
      shippingOptions.map((option) => ({ id: option.id, name: option.name }))
    )}`
  )
  logger.info(
    `Inventory levels at the location: ${inventoryLevels.length} (stocked ${inventoryLevels.reduce(
      (sum, level) => sum + Number(level.stocked_quantity),
      0
    )}, reserved ${inventoryLevels.reduce(
      (sum, level) => sum + Number(level.reserved_quantity),
      0
    )}). Reservations: ${JSON.stringify(
      reservations.map((reservation) => ({
        id: reservation.id,
        line_item_id: reservation.line_item_id,
        quantity: reservation.quantity,
        item: reservedOrderItems.find(
          (item) => item.id === reservation.line_item_id
        )?.title,
      }))
    )}.`
  )
  logger.info(
    `Tax regions: ${JSON.stringify(
      taxRegions.map((taxRegion) => ({
        id: taxRegion.id,
        country: taxRegion.country_code,
        province: taxRegion.province_code,
        parent: taxRegion.parent_id,
      }))
    )}`
  )
  logger.info(`Store currencies: ${JSON.stringify(storeCurrencies)}`)
  logger.info(
    `Price preferences: ${JSON.stringify(
      pricePreferences.map((preference) => ({
        id: preference.id,
        attribute: preference.attribute,
        value: preference.value,
        is_tax_inclusive: preference.is_tax_inclusive,
      }))
    )}`
  )
  logger.info(
    `Price preferences to delete: ${demoPricePreferences.length}. Prices in EUR or USD (kept): ${demoPriceCount}.`
  )

  // ---- Safety checks ----------------------------------------------------------

  const blockers: string[] = []
  if (regionOrders.length || currencyOrders.length) {
    blockers.push("orders use the Europe region or a demo currency")
  }
  if (unmovableReservations.length) {
    blockers.push(
      `${unmovableReservations.length} reservations at the European Warehouse have no matching stock at the ${KEPT_STOCK_LOCATION_NAME} to move to`
    )
  }
  if (!storeCurrencies.some((c) => c.currency_code === KEPT_CURRENCY)) {
    blockers.push("the store has no PKR currency to keep")
  }

  if (blockers.length) {
    logger.warn(`Stopping without changes: ${blockers.join("; ")}.`)
    return
  }

  if (!confirmed) {
    logger.info("Dry run. Set CONFIRM_DELETE=1 to delete the items above.")
    return
  }

  // ---- Delete -----------------------------------------------------------------

  if (keptLocation && reservations.length) {
    await updateReservationsWorkflow(container).run({
      input: {
        updates: reservations.map((reservation) => ({
          id: reservation.id,
          location_id: keptLocation.id,
        })),
      },
    })
    logger.info(
      `Moved ${reservations.length} reservations to the ${KEPT_STOCK_LOCATION_NAME}.`
    )
  }

  // Shipping options and the fulfillment set first, so nothing is left
  // pointing at a deleted location.
  if (shippingOptions.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: { ids: shippingOptions.map((option) => option.id) },
    })
    logger.info(`Deleted ${shippingOptions.length} shipping options.`)
  }

  if (fulfillmentSets.length) {
    await deleteFulfillmentSetsWorkflow(container).run({
      input: { ids: fulfillmentSets.map((set) => set.id) },
    })
    logger.info(`Deleted ${fulfillmentSets.length} fulfillment sets.`)
  }

  // Deleting a location does not remove its inventory levels, so they are
  // soft-deleted here. Not through deleteInventoryLevelsWorkflow: on Medusa
  // 2.22.2, moving a reservation adds it to the new location's reserved count
  // but never takes it off the old one, and the workflow refuses to delete a
  // level that still shows reserved stock. The check below covers what that
  // refusal guards against.
  if (inventoryLevels.length) {
    const remaining = await inventory.listReservationItems({
      location_id: locationIds,
    })
    if (remaining.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `${remaining.length} reservations are still at the ${STOCK_LOCATION_NAME}.`
      )
    }

    await inventory.softDeleteInventoryLevels(
      inventoryLevels.map((level) => level.id)
    )
    logger.info(`Deleted ${inventoryLevels.length} inventory levels.`)
  }

  if (locationIds.length) {
    await deleteStockLocationsWorkflow(container).run({
      input: { ids: locationIds },
    })
    logger.info(`Deleted ${locationIds.length} stock locations.`)
  }

  if (regionIds.length) {
    await deleteRegionsWorkflow(container).run({ input: { ids: regionIds } })
    logger.info(`Deleted ${regionIds.length} regions.`)
  }

  // Child (province) tax regions go with their parent, so only the top-level
  // ones are passed.
  const topLevelTaxRegions = taxRegions.filter((taxRegion) => !taxRegion.parent_id)
  if (topLevelTaxRegions.length) {
    await deleteTaxRegionsWorkflow(container).run({
      input: { ids: topLevelTaxRegions.map((taxRegion) => taxRegion.id) },
    })
    logger.info(`Deleted ${topLevelTaxRegions.length} tax regions.`)
  }

  const keptCurrencies = storeCurrencies.filter(
    (currency) => !DEMO_CURRENCIES.includes(currency.currency_code)
  )
  if (store && keptCurrencies.length !== storeCurrencies.length) {
    // The workflow also writes a price preference for every currency it is
    // given, so pass the current tax setting to leave PKR's unchanged.
    const taxInclusive = new Map(
      pricePreferences
        .filter((preference) => preference.attribute === "currency_code")
        .map((preference) => [preference.value, preference.is_tax_inclusive])
    )

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: keptCurrencies.map((currency) => ({
            currency_code: currency.currency_code,
            is_default: currency.is_default,
            is_tax_inclusive: taxInclusive.get(currency.currency_code) ?? false,
          })),
        },
      },
    })
    logger.info(
      `Store currencies now: ${keptCurrencies.map((c) => c.currency_code).join(", ")}.`
    )
  }

  // Neither workflow above removes the price preferences for the dropped
  // currencies and region.
  if (demoPricePreferences.length) {
    await deletePricePreferencesWorkflow(container).run({
      input: demoPricePreferences.map((preference) => preference.id),
    })
    logger.info(`Deleted ${demoPricePreferences.length} price preferences.`)
  }

  logger.info("Europe demo data removed.")
}
