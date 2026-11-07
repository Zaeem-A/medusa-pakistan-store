import {
  ensureReturnOrderOwner,
  rejectCustomerControlledReturnFields,
} from "../restrict-store-returns"

type Order = { id: string; customer_id: string | null }

function buildRequest(body: Record<string, unknown>, orders: Order[] = []) {
  const graph = jest.fn().mockResolvedValue({ data: orders })

  return {
    graph,
    req: {
      body,
      auth_context: { actor_id: "cus_owner" },
      scope: { resolve: () => ({ graph }) },
    } as any,
  }
}

function errorFrom(next: jest.Mock) {
  expect(next).toHaveBeenCalledTimes(1)
  return next.mock.calls[0][0]
}

describe("ensureReturnOrderOwner", () => {
  it("lets the customer who placed the order through", async () => {
    const { req, graph } = buildRequest({ order_id: "order_1" }, [
      { id: "order_1", customer_id: "cus_owner" },
    ])
    const next = jest.fn()

    await ensureReturnOrderOwner(req, {} as any, next)

    expect(graph).toHaveBeenCalledWith(
      expect.objectContaining({ filters: { id: "order_1" } })
    )
    expect(next).toHaveBeenCalledWith()
  })

  it("rejects another customer's order", async () => {
    const { req } = buildRequest({ order_id: "order_1" }, [
      { id: "order_1", customer_id: "cus_someone_else" },
    ])
    const next = jest.fn()

    await ensureReturnOrderOwner(req, {} as any, next)

    expect(errorFrom(next).type).toBe("unauthorized")
  })

  it("rejects a guest order, which has no customer", async () => {
    const { req } = buildRequest({ order_id: "order_1" }, [
      { id: "order_1", customer_id: null },
    ])
    const next = jest.fn()

    await ensureReturnOrderOwner(req, {} as any, next)

    expect(errorFrom(next).type).toBe("unauthorized")
  })

  it("gives a missing order the same answer as someone else's", async () => {
    const { req } = buildRequest({ order_id: "order_missing" }, [])
    const next = jest.fn()

    await ensureReturnOrderOwner(req, {} as any, next)

    expect(errorFrom(next).type).toBe("unauthorized")
  })

  it("rejects an order_id that is not a string without querying", async () => {
    const { req, graph } = buildRequest({ order_id: { $ne: "x" } })
    const next = jest.fn()

    await ensureReturnOrderOwner(req, {} as any, next)

    expect(graph).not.toHaveBeenCalled()
    expect(errorFrom(next).type).toBe("invalid_data")
  })
})

describe("rejectCustomerControlledReturnFields", () => {
  const base = {
    order_id: "order_1",
    items: [{ id: "item_1", quantity: 1 }],
    return_shipping: { option_id: "so_1" },
  }

  it("lets a plain return request through", async () => {
    const next = jest.fn()

    await rejectCustomerControlledReturnFields(
      { body: base } as any,
      {} as any,
      next
    )

    expect(next).toHaveBeenCalledWith()
  })

  it("allows receive_now set to false and a null location", async () => {
    const next = jest.fn()

    await rejectCustomerControlledReturnFields(
      { body: { ...base, receive_now: false, location_id: null } } as any,
      {} as any,
      next
    )

    expect(next).toHaveBeenCalledWith()
  })

  it.each([
    ["receive_now", { receive_now: true }],
    ["location_id", { location_id: "sloc_1" }],
    [
      "return shipping price",
      { return_shipping: { option_id: "so_1", price: -500 } },
    ],
  ])("rejects a customer-set %s", async (_, extra) => {
    const next = jest.fn()

    await rejectCustomerControlledReturnFields(
      { body: { ...base, ...extra } } as any,
      {} as any,
      next
    )

    expect(errorFrom(next).type).toBe("not_allowed")
  })
})
