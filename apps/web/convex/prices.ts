import { v } from 'convex/values'
import { mutationGeneric as mutation, queryGeneric as query } from 'convex/server'

function now() {
  return Date.now()
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('prices').collect()
  },
})

export const upsert = mutation({
  args: {
    itemType: v.string(),
    priceNgn: v.number(),
    unit: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('prices')
      .withIndex('by_itemType', (q) => q.eq('itemType', args.itemType))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        priceNgn: args.priceNgn,
        unit: args.unit,
        updatedAt: now(),
      })
      return { id: existing._id }
    }

    const id = await ctx.db.insert('prices', {
      itemType: args.itemType,
      priceNgn: args.priceNgn,
      unit: args.unit,
      updatedAt: now(),
    })
    return { id }
  },
})

export const remove = mutation({
  args: { priceId: v.id('prices') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.priceId)
  },
})
