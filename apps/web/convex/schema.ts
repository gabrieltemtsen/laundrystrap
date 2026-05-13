import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  orders: defineTable({
    code: v.string(),
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    status: v.union(
      v.literal('Awaiting Intake'),
      v.literal('In Wash'),
      v.literal('Ready for Pickup'),
      v.literal('Completed'),
    ),
    expectedLocation: v.optional(v.string()),
    dueAt: v.optional(v.number()), // ms timestamp
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_code', ['code'])
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  orderItems: defineTable({
    orderId: v.id('orders'),
    tagId: v.string(),
    name: v.string(),
    expectedLocation: v.optional(v.string()),
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
})
