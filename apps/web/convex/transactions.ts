import { v } from 'convex/values'
import { mutationGeneric as mutation, queryGeneric as query } from 'convex/server'

function now() {
  return Date.now()
}

export const create = mutation({
  args: {
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
    status: v.optional(
      v.union(
        v.literal('Paid'),
        v.literal('Pending'),
        v.literal('Overdue'),
        v.literal('Waived'),
      ),
    ),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    collectedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const t = now()
    const id = await ctx.db.insert('transactions', {
      orderId: args.orderId,
      customerId: args.customerId,
      customerName: args.customerName,
      orderCode: args.orderCode,
      amountNgn: args.amountNgn,
      method: args.method,
      status: args.status ?? 'Paid',
      reference: args.reference,
      notes: args.notes,
      collectedBy: args.collectedBy,
      createdAt: t,
      updatedAt: t,
    })
    return { id }
  },
})

export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('Paid'),
        v.literal('Pending'),
        v.literal('Overdue'),
        v.literal('Waived'),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 200, 1), 500)

    if (args.status) {
      return await ctx.db
        .query('transactions')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .order('desc')
        .take(limit)
    }

    return await ctx.db
      .query('transactions')
      .withIndex('by_createdAt')
      .order('desc')
      .take(limit)
  },
})

export const listByOrder = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('transactions')
      .withIndex('by_order', (q) => q.eq('orderId', args.orderId))
      .order('desc')
      .collect()
  },
})

export const listByCustomer = query({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('transactions')
      .withIndex('by_customer', (q) => q.eq('customerId', args.customerId))
      .order('desc')
      .collect()
  },
})

export const updateStatus = mutation({
  args: {
    transactionId: v.id('transactions'),
    status: v.union(
      v.literal('Paid'),
      v.literal('Pending'),
      v.literal('Overdue'),
      v.literal('Waived'),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.transactionId, {
      status: args.status,
      updatedAt: now(),
    })
  },
})
