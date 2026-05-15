import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  customers: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_name', ['name'])
    .index('by_createdAt', ['createdAt']),

  orders: defineTable({
    code: v.string(),
    customerId: v.optional(v.id('customers')),
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    status: v.union(
      v.literal('Awaiting Intake'),
      v.literal('In Wash'),
      v.literal('Ready for Pickup'),
      v.literal('Completed'),
    ),
    expectedLocation: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    totalPrice: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_code', ['code'])
    .index('by_status', ['status'])
    .index('by_customer', ['customerId'])
    .index('by_createdAt', ['createdAt']),

  orderItems: defineTable({
    orderId: v.id('orders'),
    tagId: v.string(),
    name: v.string(),
    expectedLocation: v.optional(v.string()),
    priceNgn: v.optional(v.number()),
    status: v.union(
      v.literal('At intake'),
      v.literal('In wash'),
      v.literal('Drying'),
      v.literal('Folded'),
      v.literal('Bagged'),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_order', ['orderId'])
    .index('by_tagId', ['tagId']),

  prices: defineTable({
    itemType: v.string(),
    priceNgn: v.number(),
    unit: v.string(),
    updatedAt: v.number(),
  }).index('by_itemType', ['itemType']),

  transactions: defineTable({
    orderId: v.id('orders'),
    customerId: v.optional(v.id('customers')),
    customerName: v.string(),
    orderCode: v.string(),
    amountNgn: v.number(),
    method: v.union(
      v.literal('Cash'),
      v.literal('Transfer'),
      v.literal('Paystack'),
      v.literal('POS'),
      v.literal('Invoice'),
    ),
    status: v.union(
      v.literal('Paid'),
      v.literal('Pending'),
      v.literal('Overdue'),
      v.literal('Waived'),
    ),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    collectedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_order', ['orderId'])
    .index('by_customer', ['customerId'])
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),
})
