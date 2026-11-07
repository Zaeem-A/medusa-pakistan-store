import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

// POST /store/returns is open by default: anyone who knows an order ID can file
// a return for it. The storefront has no return flow yet and staff create
// returns in the admin, so the route is limited to the logged-in customer who
// placed the order. Pattern from the Medusa guide:
// https://docs.medusajs.com/resources/commerce-modules/order/secure-return-creation

type StoreReturnBody = {
  order_id?: unknown
  receive_now?: unknown
  location_id?: unknown
  return_shipping?: { price?: unknown }
}

export async function ensureReturnOrderOwner(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const { order_id } = (req.body ?? {}) as StoreReturnBody

  if (typeof order_id !== "string" || !order_id) {
    return next(
      new MedusaError(MedusaError.Types.INVALID_DATA, "order_id is required.")
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: {
      id: order_id,
    },
  })

  // A missing order gets the same answer as someone else's order, so the
  // route does not reveal which order IDs exist.
  if (!order || order.customer_id !== req.auth_context.actor_id) {
    return next(
      new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "You're not allowed to create a return for this order."
      )
    )
  }

  next()
}

// Customers may not mark items as received, pick the stock location or set
// their own return shipping price. Staff decide those in the admin.
export async function rejectCustomerControlledReturnFields(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const body = (req.body ?? {}) as StoreReturnBody

  if (body.receive_now) {
    return next(
      new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You can't receive a return's items."
      )
    )
  }

  if (body.location_id !== undefined && body.location_id !== null) {
    return next(
      new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You can't choose where a return is received."
      )
    )
  }

  if (body.return_shipping?.price !== undefined) {
    return next(
      new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You can't set the return shipping price."
      )
    )
  }

  next()
}
