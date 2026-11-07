import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { isVariantInStock } from "@lib/util/inventory"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

const MAX_RELATED = 8
const MIN_RELATED = 4

// Product pages do not load categories, so fetch them here. The store API
// returns nothing for "categories.id"; it needs the "*categories" form.
const getCategoryIds = async (productId: string, countryCode: string) => {
  const { response } = await listProducts({
    countryCode,
    queryParams: { id: [productId], fields: "id,*categories", limit: 1 },
  })

  return response.products[0]?.categories?.map((category) => category.id) ?? []
}

// Same category first, then the same collection, leaving out the current
// product and anything sold out. There is no catch-all fallback: the starter
// filled the row with any 12 products, and an unrelated row is worse than
// none.
export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const categoryIds = await getCategoryIds(product.id, countryCode)

  const filters: HttpTypes.StoreProductListParams[] = []
  if (categoryIds.length) {
    filters.push({ category_id: categoryIds })
  }
  if (product.collection_id) {
    filters.push({ collection_id: [product.collection_id] })
  }

  const related: HttpTypes.StoreProduct[] = []

  for (const filter of filters) {
    if (related.length >= MIN_RELATED) {
      break
    }

    const { response } = await listProducts({
      countryCode,
      queryParams: { ...filter, is_giftcard: false, limit: 12 },
    })

    for (const candidate of response.products) {
      const alreadyShown =
        candidate.id === product.id ||
        related.some((shown) => shown.id === candidate.id)

      if (!alreadyShown && candidate.variants?.some(isVariantInStock)) {
        related.push(candidate)
      }
    }
  }

  const products = related.slice(0, MAX_RELATED)

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
