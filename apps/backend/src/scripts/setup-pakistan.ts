/**
 * Pakistan base configuration: PKR store currency, the Pakistan region with the
 * system payment provider (Cash on Delivery placeholder), a stock location and a
 * flat-rate manual shipping option. Also makes sure the storefront has a working
 * publishable API key.
 *
 *   npm run setup:pakistan
 *
 * Safe to re-run. Everything is looked up first and only created when missing,
 * so changes made in the admin (such as a new shipping price) are never
 * overwritten. To change a value after the first run, edit it in the admin.
 */
import fs from "node:fs"
import path from "node:path"
import {
  batchLinksWorkflow,
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createLocationFulfillmentSetWorkflow,
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
  upsertVariantPricesWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"
import { DEFAULT_REGION_STORE_POLICIES } from "../lib/region-store-policies"

const REGION_NAME = "Pakistan"
const CURRENCY_CODE = "pkr"
const COUNTRY_CODE = "pk"
/** The built-in system provider, used as the Cash on Delivery placeholder. */
const PAYMENT_PROVIDER_ID = "pp_system_default"
const FULFILLMENT_PROVIDER_ID = "manual_manual"

const STOCK_LOCATION_NAME = "Pakistan Warehouse"
const SEEDED_STOCK_LOCATION_NAME = "European Warehouse"
const FULFILLMENT_SET_NAME = "Pakistan Warehouse delivery"
const SERVICE_ZONE_NAME = "Pakistan"

const SHIPPING_OPTION_NAME = "Standard Delivery"
/** Placeholder flat rate, in whole rupees. Medusa stores PKR with 0 decimals. */
const SHIPPING_RATE_PKR = 250

/**
 * Demo data only. Limited to the products created by the initial seed so a
 * re-run can never put a placeholder price or stock on a real product.
 */
const DEMO_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
const DEMO_PRICE_PKR = 2500
const DEMO_STOCK_QUANTITY = 1000

const STOREFRONT_ENV_PATH = "../storefront/.env.local"
const PUBLISHABLE_KEY_ENV_VAR = "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"

type VariantPrice = { id: string; amount: number; currency_code: string }

export default async function setupPakistan({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // ---- Prerequisites created by the initial data seed ------------------------

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: [
      "id",
      "default_sales_channel_id",
      "supported_currencies.currency_code",
      "supported_currencies.is_default",
    ],
  })
  const {
    data: [shippingProfile],
  } = await query.graph({ entity: "shipping_profile", fields: ["id"] })

  if (!store?.default_sales_channel_id || !shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Store, sales channel or shipping profile not found. Run `npx medusa db:migrate` first."
    )
  }

  const salesChannelId = store.default_sales_channel_id

  // ---- Store currency --------------------------------------------------------

  const currencies = (store.supported_currencies ?? []).filter(
    (currency) => !!currency
  )
  const pkrIsDefault = currencies.some(
    (currency) => currency.currency_code === CURRENCY_CODE && currency.is_default
  )

  if (pkrIsDefault) {
    logger.info("Store currency: PKR is already the default.")
  } else {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: CURRENCY_CODE, is_default: true },
            ...currencies
              .filter((currency) => currency.currency_code !== CURRENCY_CODE)
              .map((currency) => ({
                currency_code: currency.currency_code,
                is_default: false,
              })),
          ],
        },
      },
    })
    logger.info("Store currency: PKR set as the default.")
  }

  // ---- Region and payment provider -------------------------------------------

  const {
    data: [existingRegion],
  } = await query.graph({
    entity: "region",
    fields: ["id", "payment_providers.id"],
    filters: { name: REGION_NAME },
  })

  if (!existingRegion) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: REGION_NAME,
            currency_code: CURRENCY_CODE,
            countries: [COUNTRY_CODE],
            payment_providers: [PAYMENT_PROVIDER_ID],
            metadata: {
              ...DEFAULT_REGION_STORE_POLICIES,
              shipping_rate: SHIPPING_RATE_PKR,
            },
          },
        ],
      },
    })
    logger.info(`Region: created "${REGION_NAME}".`)
    // The storefront keeps /store/regions in a persistent fetch cache.
    logger.info(
      "If the storefront has already run, stop it, delete apps/storefront/.next and start it again."
    )
  } else {
    const providerIds = (existingRegion.payment_providers ?? []).flatMap(
      (provider) => (provider ? [provider.id] : [])
    )

    if (providerIds.includes(PAYMENT_PROVIDER_ID)) {
      logger.info(`Region: "${REGION_NAME}" already exists.`)
    } else {
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: existingRegion.id },
          update: { payment_providers: [...providerIds, PAYMENT_PROVIDER_ID] },
        },
      })
      logger.info(`Region: enabled ${PAYMENT_PROVIDER_ID} on "${REGION_NAME}".`)
    }
  }

  const {
    data: [region],
  } = await query.graph({
    entity: "region",
    fields: ["id"],
    filters: { name: REGION_NAME },
  })

  // ---- Stock location --------------------------------------------------------

  const locationFields = [
    "id",
    "sales_channels.id",
    "fulfillment_providers.id",
    "fulfillment_sets.id",
    "fulfillment_sets.name",
    "fulfillment_sets.service_zones.id",
    "fulfillment_sets.service_zones.name",
  ]
  const findLocation = async () => {
    const { data } = await query.graph({
      entity: "stock_location",
      fields: locationFields,
      filters: { name: STOCK_LOCATION_NAME },
    })

    return data[0]
  }

  if (!(await findLocation())) {
    await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: STOCK_LOCATION_NAME,
            address: { address_1: "", country_code: COUNTRY_CODE.toUpperCase() },
          },
        ],
      },
    })
    logger.info(`Stock location: created "${STOCK_LOCATION_NAME}".`)
  } else {
    logger.info(`Stock location: "${STOCK_LOCATION_NAME}" already exists.`)
  }

  const location = await findLocation()

  const isLinkedToChannel = (location.sales_channels ?? []).some(
    (channel) => channel?.id === salesChannelId
  )

  if (!isLinkedToChannel) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: location.id, add: [salesChannelId] },
    })
    logger.info("Stock location: linked to the default sales channel.")
  }

  const hasProvider = (location.fulfillment_providers ?? []).some(
    (provider) => provider?.id === FULFILLMENT_PROVIDER_ID
  )

  if (!hasProvider) {
    await batchLinksWorkflow(container).run({
      input: {
        create: [
          {
            [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
            [Modules.FULFILLMENT]: {
              fulfillment_provider_id: FULFILLMENT_PROVIDER_ID,
            },
          },
        ],
        delete: [],
      },
    })
    logger.info(`Stock location: enabled ${FULFILLMENT_PROVIDER_ID}.`)
  }

  // Orders reserve stock from the first location on the sales channel that has
  // any, regardless of region. Left linked, the seeded warehouse would take the
  // reservations for Pakistan orders. This also leaves the demo Europe region
  // without shipping options, so it can be browsed but not checked out.
  const {
    data: [seededLocation],
  } = await query.graph({
    entity: "stock_location",
    fields: ["id", "sales_channels.id"],
    filters: { name: SEEDED_STOCK_LOCATION_NAME },
  })
  const seededLocationIsLinked = (seededLocation?.sales_channels ?? []).some(
    (channel) => channel?.id === salesChannelId
  )

  if (seededLocationIsLinked) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: seededLocation.id, remove: [salesChannelId] },
    })
    logger.info(
      `Stock location: unlinked "${SEEDED_STOCK_LOCATION_NAME}" from the default sales channel.`
    )
  }

  // ---- Fulfillment set and service zone --------------------------------------

  const findFulfillmentSet = async () =>
    (await findLocation()).fulfillment_sets?.find(
      (set) => set?.name === FULFILLMENT_SET_NAME
    )

  if (!(await findFulfillmentSet())) {
    await createLocationFulfillmentSetWorkflow(container).run({
      input: {
        location_id: location.id,
        fulfillment_set_data: { name: FULFILLMENT_SET_NAME, type: "shipping" },
      },
    })
    logger.info(`Fulfillment: created set "${FULFILLMENT_SET_NAME}".`)
  }

  const fulfillmentSet = await findFulfillmentSet()

  if (!fulfillmentSet) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Fulfillment set "${FULFILLMENT_SET_NAME}" was not found after creation.`
    )
  }

  const findServiceZone = async () =>
    (await findFulfillmentSet())?.service_zones?.find(
      (zone) => zone?.name === SERVICE_ZONE_NAME
    )

  if (!(await findServiceZone())) {
    await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            fulfillment_set_id: fulfillmentSet.id,
            name: SERVICE_ZONE_NAME,
            geo_zones: [{ type: "country", country_code: COUNTRY_CODE }],
          },
        ],
      },
    })
    logger.info(`Fulfillment: created service zone "${SERVICE_ZONE_NAME}".`)
  }

  const serviceZone = await findServiceZone()

  if (!serviceZone) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Service zone "${SERVICE_ZONE_NAME}" was not found after creation.`
    )
  }

  // ---- Flat-rate shipping option ---------------------------------------------

  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
    filters: { name: SHIPPING_OPTION_NAME, service_zone_id: serviceZone.id },
  })

  if (existingOptions.length) {
    logger.info(`Shipping: "${SHIPPING_OPTION_NAME}" already exists.`)
  } else {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: SHIPPING_OPTION_NAME,
          price_type: "flat",
          provider_id: FULFILLMENT_PROVIDER_ID,
          service_zone_id: serviceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Flat-rate delivery across Pakistan.",
            code: "pk-standard",
          },
          prices: [
            { currency_code: CURRENCY_CODE, amount: SHIPPING_RATE_PKR },
            { region_id: region.id, amount: SHIPPING_RATE_PKR },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info(
      `Shipping: created "${SHIPPING_OPTION_NAME}" at PKR ${SHIPPING_RATE_PKR}.`
    )
  }

  // ---- Demo products: PKR prices and local stock -----------------------------

  const { data: demoProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "variants.id",
      "variants.prices.id",
      "variants.prices.amount",
      "variants.prices.currency_code",
      "variants.inventory_items.inventory_item_id",
    ],
    filters: { handle: DEMO_PRODUCT_HANDLES },
  })

  const variantPrices = demoProducts.flatMap((product) =>
    (product.variants ?? []).flatMap((variant) => {
      // `prices` comes from a module link, so it isn't on the generated type.
      const { prices = [] } = (variant ?? {}) as { prices?: VariantPrice[] }

      if (!variant || prices.some((p) => p.currency_code === CURRENCY_CODE)) {
        return []
      }

      // The workflow replaces a variant's prices, so existing ones are kept.
      return [
        {
          variant_id: variant.id,
          product_id: product.id,
          prices: [
            ...prices,
            { amount: DEMO_PRICE_PKR, currency_code: CURRENCY_CODE },
          ],
        },
      ]
    })
  )

  if (variantPrices.length) {
    await upsertVariantPricesWorkflow(container).run({
      input: {
        variantPrices,
        previousVariantIds: variantPrices.map((v) => v.variant_id),
      },
    })
    logger.info(`Demo products: added PKR prices to ${variantPrices.length} variants.`)
  }

  // Store listings read prices from the search index. Indexing normally happens
  // through events, which a short-lived `medusa exec` process can exit before
  // handling. This call is awaited, and it upserts, so it is safe to repeat.
  // On a new database the index doesn't exist until the app first starts, and it
  // is then built from current data, so there is nothing to update before that.
  const search = container.resolve(Modules.SEARCH)
  const productIndexIsReady = (await search.listIndexes()).some(
    (index) => index.name === "product" && index.status === "ready"
  )

  if (demoProducts.length && productIndexIsReady) {
    await search.ingest({
      name: "product.created",
      data: demoProducts.map((product) => ({ id: product.id })),
    } as never)
    logger.info(`Demo products: search index updated for ${demoProducts.length}.`)
  }

  const inventoryItemIds = demoProducts.flatMap((product) =>
    (product.variants ?? []).flatMap((variant) =>
      (variant?.inventory_items ?? []).flatMap((item) =>
        item?.inventory_item_id ? [item.inventory_item_id] : []
      )
    )
  )
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
    filters: { location_id: location.id },
  })
  const stockedItemIds = new Set(
    existingLevels.map((level) => level.inventory_item_id)
  )
  const missingLevels = inventoryItemIds.filter((id) => !stockedItemIds.has(id))

  if (missingLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: missingLevels.map((inventory_item_id) => ({
          inventory_item_id,
          location_id: location.id,
          stocked_quantity: DEMO_STOCK_QUANTITY,
        })),
      },
    })
    logger.info(`Demo products: stocked ${missingLevels.length} items in Pakistan.`)
  }

  // ---- Publishable API key ---------------------------------------------------

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "revoked_at", "sales_channels.id"],
    filters: { type: "publishable" },
  })
  const existingKey = apiKeys.find((key) => !key.revoked_at)
  const apiKey =
    existingKey ??
    (
      await createApiKeysWorkflow(container).run({
        input: {
          api_keys: [
            { title: "Storefront", type: "publishable", created_by: "" },
          ],
        },
      })
    ).result[0]

  const keyHasChannel = (existingKey?.sales_channels ?? []).some(
    (channel) => channel?.id === salesChannelId
  )

  if (!keyHasChannel) {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: apiKey.id, add: [salesChannelId] },
    })
    logger.info("Publishable key: linked to the default sales channel.")
  }

  // Publishable keys are public by design: the browser sends them on every call.
  const envPath = path.resolve(process.cwd(), STOREFRONT_ENV_PATH)

  if (fs.existsSync(envPath)) {
    const line = `${PUBLISHABLE_KEY_ENV_VAR}=${apiKey.token}`
    const pattern = new RegExp(`^${PUBLISHABLE_KEY_ENV_VAR}=.*$`, "m")
    const content = fs.readFileSync(envPath, "utf8")

    fs.writeFileSync(
      envPath,
      pattern.test(content)
        ? content.replace(pattern, line)
        : `${content.trimEnd()}\n${line}\n`
    )
    logger.info(`Publishable key: written to ${STOREFRONT_ENV_PATH}.`)
  } else {
    logger.info(`Publishable key: set ${PUBLISHABLE_KEY_ENV_VAR}=${apiKey.token}`)
  }

  logger.info("Pakistan setup complete.")
}
