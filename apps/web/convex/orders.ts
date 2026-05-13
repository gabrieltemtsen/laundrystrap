import { v } from 'convex/values'
import { mutationGeneric as mutation, queryGeneric as query } from 'convex/server'

function now() {
  return Date.now()
}

function genOrderCode() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `LS-${Math.floor(1000 + Math.random() * 9000)}-${suffix}`
}

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('Awaiting Intake'),
        v.literal('In Wash'),
        v.literal('Ready for Pickup'),
        v.literal('Completed'),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200)

    if (args.status) {
      return await ctx.db
        .query('orders')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .order('desc')
        .take(limit)
    }

    return await ctx.db.query('orders').withIndex('by_createdAt').order('desc').take(limit)
  },
})

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('orders').withIndex('by_code', (q) => q.eq('code', args.code)).unique()
  },
})

export const create = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    expectedLocation: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const t = now()
    const code = genOrderCode()
    const id = await ctx.db.insert('orders', {
      code,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      status: 'Awaiting Intake',
      expectedLocation: args.expectedLocation,
      dueAt: args.dueAt,
      notes: args.notes,
      createdAt: t,
      updatedAt: t,
    })

    return { id, code }
  },
})

export const updateStatus = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.union(
      v.literal('Awaiting Intake'),
      v.literal('In Wash'),
      v.literal('Ready for Pickup'),
      v.literal('Completed'),
    ),
    expectedLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      expectedLocation: args.expectedLocation,
      updatedAt: now(),
    })
  },
})
