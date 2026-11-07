import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  beginOrderEditOrderWorkflow,
  capturePaymentWorkflow,
  confirmOrderEditRequestWorkflow,
  createOrderPaymentCollectionWorkflow,
  createOrderWorkflow,
  createPaymentSessionsWorkflow,
  createRegionsWorkflow,
  markPaymentCollectionAsPaid,
  orderEditUpdateItemQuantityWorkflow,
  requestOrderEditRequestWorkflow,
} from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

jest.setTimeout(120 * 1000)

// Backlog item 0.10. The admin capture button always sends the payment's
// original amount. This checks what happens to a Cash on Delivery payment when
// staff edit an order down before the cash is collected: is there still a
// payment that could be captured for the old, higher total?
//
// Answer on Medusa 2.22.2: no. Confirming the edit cancels the authorized
// payment and opens a new unpaid collection for the new total, which staff
// then mark as paid. Code that records cash at delivery must therefore look
// for that unpaid collection, not capture the original payment.
//
// The order is built the way checkout leaves a COD order: one payment
// collection with the system (manual) provider, authorized and not captured.
//
// Runs in a throwaway database. Set DB_HOST, DB_PORT, DB_USERNAME and
// DB_PASSWORD for a Postgres user that can create databases, then run
// npm run test:integration:http from apps/backend.

const COD_PROVIDER = "pp_system_default"
const UNIT_PRICE = 3000

// The fields the query below asks for. Query types relations as nullable,
// but these are always present on an order created by the test.
type TestPayment = {
  id: string
  amount: number
  captured_at: Date | null
  canceled_at: Date | null
}

type TestOrder = {
  id: string
  total: number
  summary: { paid_total: number; pending_difference: number }
  items: { id: string; quantity: number }[]
  payment_collections: {
    id: string
    amount: number
    status: string
    payments: TestPayment[]
  }[]
}

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    const getOrder = async (orderId: string) => {
      const query = getContainer().resolve(ContainerRegistrationKeys.QUERY)
      const {
        data: [order],
      } = await query.graph({
        entity: "order",
        fields: [
          "id",
          "total",
          "summary.*",
          "items.id",
          "items.quantity",
          "payment_collections.id",
          "payment_collections.amount",
          "payment_collections.status",
          "payment_collections.payments.id",
          "payment_collections.payments.amount",
          "payment_collections.payments.captured_at",
          "payment_collections.payments.canceled_at",
        ],
        filters: { id: orderId },
      })

      return order as unknown as TestOrder
    }

    const placeCodOrder = async (quantity: number) => {
      const container = getContainer()

      const {
        result: [region],
      } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name: "Pakistan",
              currency_code: "pkr",
              countries: ["pk"],
              payment_providers: [COD_PROVIDER],
            },
          ],
        },
      })

      const { result: order } = await createOrderWorkflow(container).run({
        input: {
          region_id: region.id,
          email: "cod-test@example.com",
          currency_code: "pkr",
          items: [
            {
              title: "Lawn suit",
              quantity,
              unit_price: UNIT_PRICE,
            },
          ],
          shipping_address: {
            first_name: "Test",
            last_name: "Buyer",
            address_1: "1 Test Road",
            city: "Lahore",
            country_code: "pk",
            phone: "+923001234567",
          },
        },
      })

      const {
        result: [paymentCollection],
      } = await createOrderPaymentCollectionWorkflow(container).run({
        input: { order_id: order.id, amount: UNIT_PRICE * quantity },
      })

      const { result: session } = await createPaymentSessionsWorkflow(
        container
      ).run({
        input: {
          payment_collection_id: paymentCollection.id,
          provider_id: COD_PROVIDER,
        },
      })

      // Checkout authorizes the session through the payment module (the
      // authorizePaymentSessionStep in completeCartWorkflow). The manual
      // provider authorizes at once, which is how COD orders start.
      await container
        .resolve(Modules.PAYMENT)
        .authorizePaymentSession(session.id, {})

      return order.id
    }

    const editQuantity = async (orderId: string, quantity: number) => {
      const container = getContainer()
      const order = await getOrder(orderId)

      await beginOrderEditOrderWorkflow(container).run({
        input: { order_id: orderId },
      })
      await orderEditUpdateItemQuantityWorkflow(container).run({
        input: {
          order_id: orderId,
          items: [{ id: order.items[0].id, quantity }],
        },
      })
      await requestOrderEditRequestWorkflow(container).run({
        input: { order_id: orderId },
      })
      await confirmOrderEditRequestWorkflow(container).run({
        input: { order_id: orderId },
      })
    }

    it("starts as an authorized, uncaptured COD payment", async () => {
      const order = await getOrder(await placeCodOrder(2))

      expect(Number(order.total)).toBe(6000)
      expect(order.payment_collections).toHaveLength(1)
      expect(order.payment_collections[0].status).toBe("authorized")

      const [payment] = order.payment_collections[0].payments
      expect(Number(payment.amount)).toBe(6000)
      expect(payment.captured_at).toBeNull()
    })

    it("cancels the original payment when an edit lowers the total", async () => {
      const orderId = await placeCodOrder(2)
      const [originalPayment] = (await getOrder(orderId)).payment_collections[0]
        .payments

      await editQuantity(orderId, 1)

      const order = await getOrder(orderId)
      expect(Number(order.total)).toBe(3000)

      const original = order.payment_collections.find((collection) =>
        collection.payments.some((p) => p.id === originalPayment.id)
      )
      const replacement = order.payment_collections.find(
        (collection) => collection.id !== original?.id
      )

      // The authorized collection is cancelled, along with its payment.
      expect(original?.status).toBe("canceled")
      expect(original?.payments[0].canceled_at).not.toBeNull()
      expect(original?.payments[0].captured_at).toBeNull()

      // A new, unpaid collection holds the lower total.
      expect(Number(replacement?.amount)).toBe(3000)
      expect(replacement?.status).toBe("not_paid")
      expect(replacement?.payments ?? []).toHaveLength(0)
      expect(Number(order.summary.pending_difference)).toBe(3000)

    })

    it("refuses to capture the cancelled payment at the old amount", async () => {
      const orderId = await placeCodOrder(2)
      const [originalPayment] = (await getOrder(orderId)).payment_collections[0]
        .payments

      await editQuantity(orderId, 1)

      // What the admin capture button would send. The admin hides the button
      // once the payment is cancelled; this checks the backend refuses too.
      // The error is checked by its message, because errors thrown inside
      // Medusa come from another realm under Jest and fail instanceof Error
      // and rejects.toThrow().
      let message: string | undefined
      try {
        await capturePaymentWorkflow(getContainer()).run({
          input: {
            payment_id: originalPayment.id,
            amount: originalPayment.amount,
          },
        })
      } catch (e) {
        message = (e as { message?: string }).message
      }

      expect(message).toMatch(/has been canceled/)

      const order = await getOrder(orderId)
      const captured = order.payment_collections
        .flatMap((collection) => collection.payments)
        .filter((payment) => payment.captured_at !== null)

      expect(captured).toHaveLength(0)
      expect(Number(order.summary.paid_total)).toBe(0)
      expect(Number(order.summary.pending_difference)).toBe(3000)
    })

    it("records only the new total when staff mark the cash as received", async () => {
      const orderId = await placeCodOrder(2)
      await editQuantity(orderId, 1)

      const replacement = (await getOrder(orderId)).payment_collections.find(
        (collection) => collection.status === "not_paid"
      )

      await markPaymentCollectionAsPaid(getContainer()).run({
        input: {
          payment_collection_id: replacement!.id,
          order_id: orderId,
        },
      })

      const order = await getOrder(orderId)
      const captured = order.payment_collections
        .flatMap((collection) => collection.payments)
        .filter((payment) => payment.captured_at !== null)

      expect(captured).toHaveLength(1)
      expect(Number(captured[0].amount)).toBe(3000)
      expect(Number(order.summary.paid_total)).toBe(3000)
      expect(Number(order.summary.pending_difference)).toBe(0)
    })
  },
})
