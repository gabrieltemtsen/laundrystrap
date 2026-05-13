import { v } from 'convex/values'
import { mutationGeneric as mutation, queryGeneric as query } from 'convex/server'

function now() {
  return Date.now()
}

export const list = query({
  args: {
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 100, 1), 500)
    const customers = await ctx.db
      .query('customers')
      .withIndex('by_createdAt')
      .order('desc')
      .take(limit)

    if (args.search) {
      const q = args.search.toLowerCase()
      return customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.phone ?? '').includes(q) ||
          (c.email ?? '').toLowerCase().includes(q),
      )
    }

    return customers
  },
})

export const getById = query({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.customerId)
  },
})

export const getOrdersByCustomer = query({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_customer', (q) => q.eq('customerId', args.customerId))
      .order('desc')
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const t = now()
    const id = await ctx.db.insert('customers', {
      name: args.name,
      phone: args.phone,
      email: args.email,
      address: args.address,
      notes: args.notes,
      createdAt: t,
      updatedAt: t,
    })
    return { id }
  },
})

export const update = mutation({
  args: {
    customerId: v.id('customers'),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { customerId, ...fields } = args
    const patch: Record<string, unknown> = { updatedAt: now() }
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }
    await ctx.db.patch(customerId, patch)
  },
})
