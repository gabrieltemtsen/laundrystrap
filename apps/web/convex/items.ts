import { v } from 'convex/values'
import { mutationGeneric as mutation, queryGeneric as query } from 'convex/server'

function now() {
  return Date.now()
}

export const listByOrder = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    return await ctx.db.query('orderItems').withIndex('by_order', (q) => q.eq('orderId', args.orderId)).collect()
  },
})

export const addToOrder = mutation({
  args: {
    orderId: v.id('orders'),
    tagId: v.string(),
    name: v.string(),
    expectedLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('orderItems').withIndex('by_tagId', (q) => q.eq('tagId', args.tagId)).unique()
    if (existing) throw new Error('Tag already exists')

    const t = now()
    const id = await ctx.db.insert('orderItems', {
      orderId: args.orderId,
      tagId: args.tagId,
      name: args.name,
      expectedLocation: args.expectedLocation,
      status: 'At intake',
      createdAt: t,
      updatedAt: t,
    })
    return { id }
  },
})

export const updateItemStatus = mutation({
  args: {
    itemId: v.id('orderItems'),
    status: v.union(
      v.literal('At intake'),
      v.literal('In wash'),
      v.literal('Drying'),
      v.literal('Folded'),
      v.literal('Bagged'),
    ),
    expectedLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      status: args.status,
      expectedLocation: args.expectedLocation,
      updatedAt: now(),
    })
  },
})

export const findByTagId = query({
  args: { tagId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('orderItems').withIndex('by_tagId', (q) => q.eq('tagId', args.tagId)).unique()
  },
})
