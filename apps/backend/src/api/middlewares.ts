import {
  authenticate,
  configureStoreSearch,
  defineMiddlewares,
} from "@medusajs/framework/http"
import {
  ensureReturnOrderOwner,
  rejectCustomerControlledReturnFields,
} from "./middlewares/restrict-store-returns"

export default defineMiddlewares({
  routes: [
    // The product index declares filterable `status` and `sales_channel_ids`,
    // so the route narrows it to published products in the key's sales channels.
    {
      method: ["POST"],
      matcher: "/store/search",
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    // Only the logged-in customer who placed an order can file a return for
    // it, and only for the fields a customer should control.
    {
      method: ["POST"],
      matcher: "/store/returns",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        ensureReturnOrderOwner,
        rejectCustomerControlledReturnFields,
      ],
    },
  ],
})
