import {
  createInstantSearchAdapter,
  type SearchQuery,
  type SearchRequester,
  type SearchResult,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@lib/config"

const SEARCH_PATH = "/store/search"

export const PRODUCT_INDEX_NAME = "product"

/**
 * The currencies the product index holds prices in, one field set each. Keep
 * in sync with `PRICE_CURRENCIES` in the backend's `src/search/product.ts`.
 */
export const SEARCH_PRICE_CURRENCIES = ["pkr", "eur", "usd"]

export type PriceField =
  | "min_price"
  | "max_price"
  | "original_price"
  | "on_sale"

/**
 * The indexed currency to read prices in for a region. A region whose currency
 * the index doesn't hold falls back to the first one, so the listing still
 * shows a price rather than none.
 */
export const indexedCurrency = (currencyCode: string) => {
  const code = currencyCode.toLowerCase()
  return SEARCH_PRICE_CURRENCIES.includes(code)
    ? code
    : SEARCH_PRICE_CURRENCIES[0]
}

export const priceAttribute = (field: PriceField, currencyCode: string) =>
  `${field}_${indexedCurrency(currencyCode)}`

const postSearch = async (queries: SearchQuery[]): Promise<SearchResult[]> => {
  const payload = await sdk.client.fetch<
    { results: SearchResult[] } | SearchResult[]
  >(SEARCH_PATH, {
    method: "POST",
    body: { queries },
  })
  const results = Array.isArray(payload) ? payload : payload.results

  if (results?.length !== queries.length) {
    throw new Error(
      `Search returned ${results?.length ?? 0} result(s) for ${queries.length} query(s)`
    )
  }

  return results
}

const hasSearchText = (query: SearchQuery) =>
  typeof query.filters?.q === "string" && query.filters.q.trim() !== ""

const foundNothing = (result: SearchResult) =>
  result.hits.length === 0 && !result.metadata.skip

/**
 * Typo tolerance only when the exact search finds nothing, so "kurtii" and
 * "shalwaar" still find products. Postgres trigram matching also pairs
 * unrelated words (lawn and lace, shalwar and shawl), so turning it on for
 * every search would pad results and facet counts for searches that already
 * work. InstantSearch sends one query per facet group, so the retry happens
 * only when every query with search text came back empty, which means the
 * text itself matched nothing rather than a filter excluding everything.
 */
const searchWithTypoFallback: SearchRequester = async (queries) => {
  const results = await postSearch(queries)

  const textQueryIndexes = queries.flatMap((query, index) =>
    hasSearchText(query) ? [index] : []
  )

  const textMatchedNothing =
    textQueryIndexes.length > 0 &&
    textQueryIndexes.every((index) => foundNothing(results[index]))

  if (!textMatchedNothing) {
    return results
  }

  const retried = await postSearch(
    textQueryIndexes.map((index) => ({
      ...queries[index],
      search_options: {
        ...queries[index].search_options,
        typo_tolerance: true,
      },
    }))
  )

  textQueryIndexes.forEach((queryIndex, retryIndex) => {
    results[queryIndex] = retried[retryIndex]
  })

  return results
}

/**
 * Shared by the navbar search drawer and the store listing. An empty query
 * searches rather than short-circuiting, which is what the listing needs to
 * show every product before anything is refined.
 */
export const { searchClient } = createInstantSearchAdapter({
  requester: searchWithTypoFallback,
  additionalSearchParameters: {
    search_options: {
      match_strategy: "last",
    },
  },
  // Range widgets read `facets_stats`, which the adapter only produces for
  // fields listed here. The price fields are declared with a `stats` facet on
  // the index, which is what makes the stats available at all.
  numericAttributes: SEARCH_PRICE_CURRENCIES.flatMap((currency) => [
    `min_price_${currency}`,
    `max_price_${currency}`,
  ]),
})
