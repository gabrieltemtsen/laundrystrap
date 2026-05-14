/**
 * Seed script — populates the DB with realistic LaundryStrap demo data.
 * Run from your terminal:
 *   npx convex run seed:run
 *
 * To clear all data first:
 *   npx convex run seed:clear
 */

import { internalMutation } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function now() { return Date.now() }
function daysAgo(n: number) { return now() - n * 86_400_000 }
function hoursFromNow(h: number) { return now() + h * 3_600_000 }
function hoursAgo(h: number) { return now() - h * 3_600_000 }

/* Fixed codes so the seed is deterministic */
const ORDER_CODES = [
  'LS-0042', 'LS-0041', 'LS-0040', 'LS-0039', 'LS-0038',
  'LS-0037', 'LS-0036', 'LS-0035', 'LS-0034', 'LS-0033',
  'LS-0032', 'LS-0031',
]

/* ─────────────────────────────────────────────
   Clear
───────────────────────────────────────────── */
export const clear = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Delete all documents in reverse-dependency order
    for (const doc of await ctx.db.query('orderItems').collect()) await ctx.db.delete(doc._id)
    for (const doc of await ctx.db.query('orders').collect())     await ctx.db.delete(doc._id)
    for (const doc of await ctx.db.query('customers').collect())  await ctx.db.delete(doc._id)
    for (const doc of await ctx.db.query('prices').collect())     await ctx.db.delete(doc._id)
    return { cleared: true }
  },
})

/* ─────────────────────────────────────────────
   Seed
───────────────────────────────────────────── */
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const t = now()

    /* ── 1. Prices ── */
    const PRICES = [
      { itemType: 'Shirt',              priceNgn: 800,   unit: 'per piece' },
      { itemType: 'Trouser / Pants',    priceNgn: 900,   unit: 'per piece' },
      { itemType: 'Dress',              priceNgn: 1200,  unit: 'per piece' },
      { itemType: 'Suit (2 piece)',      priceNgn: 3500,  unit: 'per suit'  },
      { itemType: 'Native Attire',       priceNgn: 1500,  unit: 'per piece' },
      { itemType: 'Bed Sheet',           priceNgn: 1000,  unit: 'per piece' },
      { itemType: 'Duvet / Blanket',     priceNgn: 2500,  unit: 'per piece' },
      { itemType: 'Jeans',               priceNgn: 900,   unit: 'per piece' },
      { itemType: 'Hoodie / Sweatshirt', priceNgn: 1100,  unit: 'per piece' },
      { itemType: 'Socks (pair)',         priceNgn: 200,   unit: 'per pair'  },
      { itemType: 'Underwear',            priceNgn: 200,   unit: 'per piece' },
      { itemType: 'Jacket / Coat',        priceNgn: 2000,  unit: 'per piece' },
      { itemType: 'Agbada (3 piece)',     priceNgn: 4500,  unit: 'per set'   },
      { itemType: 'Senator / Kaftan',     priceNgn: 2000,  unit: 'per piece' },
      { itemType: 'Ankara Dress',         priceNgn: 1400,  unit: 'per piece' },
      { itemType: 'Wedding Gown',         priceNgn: 8000,  unit: 'per piece' },
      { itemType: 'Curtains (pair)',       priceNgn: 3000,  unit: 'per pair'  },
      { itemType: 'Bath Towel',           priceNgn: 700,   unit: 'per piece' },
    ]

    for (const p of PRICES) {
      // Skip if already exists
      const existing = await ctx.db
        .query('prices')
        .withIndex('by_itemType', (q) => q.eq('itemType', p.itemType))
        .unique()
      if (!existing) {
        await ctx.db.insert('prices', { ...p, updatedAt: t })
      }
    }

    /* ── 2. Customers ── */
    const customersData = [
      { name: 'Amaka Obi',        phone: '+234 803 210 5678', email: 'amaka.obi@gmail.com',        address: '14 Wuse II, Abuja',            notes: 'Prefers no fabric softener. Hang-dry only.' },
      { name: 'Emeka Nwosu',      phone: '+234 806 543 2100', email: 'emeka.nwosu@yahoo.com',       address: '7 Maitama, Abuja',             notes: 'Always in a hurry — call when ready.' },
      { name: 'Ngozi Adeyemi',    phone: '+234 811 876 5432', email: 'ngozi.adeyemi@outlook.com',   address: '22 Garki II, Abuja',           notes: '' },
      { name: 'Chidi Eze',        phone: '+234 815 333 4444', email: 'chidi.eze@gmail.com',         address: '3 Asokoro, Abuja',             notes: 'VIP — always press agbada before bagging.' },
      { name: 'Fatima Bello',     phone: '+234 809 765 4321', email: 'fatima.bello@gmail.com',      address: '8 Gwarinpa, Abuja',            notes: '' },
      { name: 'Bola Adewale',     phone: '+234 802 111 2222', email: 'bola.adewale@hotmail.com',    address: '11 Jabi, Abuja',               notes: 'Use mild detergent only.' },
      { name: 'Kemi Okafor',      phone: '+234 818 999 8888', email: 'kemi.okafor@gmail.com',       address: '5 Utako, Abuja',               notes: '' },
      { name: 'Tunde Fashola',    phone: '+234 807 444 5555', email: 'tunde.fashola@work.com',      address: '18 Central Business District',  notes: 'Corporate account — invoice monthly.' },
      { name: 'Zainab Musa',      phone: '+234 813 222 3333', email: 'zainab.musa@gmail.com',       address: '2 Kubwa, Abuja',               notes: 'Delicate fabrics — gentle cycle.' },
      { name: 'Seun Abiodun',     phone: '+234 805 678 9012', email: 'seun.abiodun@yahoo.com',      address: '9 Lugbe, Abuja',               notes: '' },
    ]

    const customerIds: Id<'customers'>[] = []
    for (const c of customersData) {
      // Avoid duplicate customers on repeated seeding
      const existing = await ctx.db
        .query('customers')
        .withIndex('by_name', (q) => q.eq('name', c.name))
        .unique()
      if (existing) {
        customerIds.push(existing._id)
        continue
      }
      const id = await ctx.db.insert('customers', {
        ...c,
        createdAt: daysAgo(Math.floor(Math.random() * 30 + 1)),
        updatedAt: t,
      })
      customerIds.push(id)
    }

    /* ── 3. Orders ── */
    const ordersData = [
      {
        code: ORDER_CODES[0],
        customerIdx: 0,
        status: 'Ready for Pickup' as const,
        dueAt: hoursFromNow(3),
        notes: 'Wash & Fold | Walk-in',
        totalPrice: 4500,
        items: [
          { tagId: 'LS0042-A', name: 'Shirt',           priceNgn: 800,  status: 'Bagged' as const,   expectedLocation: 'Shelf B-3' },
          { tagId: 'LS0042-B', name: 'Trouser / Pants', priceNgn: 900,  status: 'Bagged' as const,   expectedLocation: 'Shelf B-3' },
          { tagId: 'LS0042-C', name: 'Native Attire',   priceNgn: 1500, status: 'Bagged' as const,   expectedLocation: 'Shelf B-3' },
          { tagId: 'LS0042-D', name: 'Shirt',           priceNgn: 800,  status: 'Bagged' as const,   expectedLocation: 'Shelf B-3' },
          { tagId: 'LS0042-E', name: 'Socks (pair)',    priceNgn: 200,  status: 'Bagged' as const,   expectedLocation: 'Shelf B-3' },
          { tagId: 'LS0042-F', name: 'Underwear',       priceNgn: 200,  status: 'Bagged' as const,   expectedLocation: 'Shelf B-3' },
        ],
      },
      {
        code: ORDER_CODES[1],
        customerIdx: 1,
        status: 'In Wash' as const,
        dueAt: hoursFromNow(6),
        notes: 'Dry Clean | Walk-in',
        totalPrice: 6200,
        items: [
          { tagId: 'LS0041-A', name: 'Suit (2 piece)',      priceNgn: 3500, status: 'In wash' as const,  expectedLocation: 'Washer 2' },
          { tagId: 'LS0041-B', name: 'Senator / Kaftan',   priceNgn: 2000, status: 'In wash' as const,  expectedLocation: 'Washer 2' },
          { tagId: 'LS0041-C', name: 'Shirt',              priceNgn: 800,  status: 'In wash' as const,  expectedLocation: 'Washer 2' },
        ],
      },
      {
        code: ORDER_CODES[2],
        customerIdx: 2,
        status: 'Awaiting Intake' as const,
        dueAt: hoursFromNow(24),
        notes: 'Wash & Iron | Walk-in',
        totalPrice: 3800,
        items: [
          { tagId: 'LS0040-A', name: 'Dress',              priceNgn: 1200, status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0040-B', name: 'Ankara Dress',       priceNgn: 1400, status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0040-C', name: 'Shirt',              priceNgn: 800,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
        ],
      },
      {
        code: ORDER_CODES[3],
        customerIdx: 3,
        status: 'In Wash' as const,
        dueAt: hoursFromNow(5),
        notes: 'Wash & Fold | Walk-in',
        totalPrice: 8100,
        items: [
          { tagId: 'LS0039-A', name: 'Agbada (3 piece)',   priceNgn: 4500, status: 'In wash' as const,  expectedLocation: 'Washer 1' },
          { tagId: 'LS0039-B', name: 'Senator / Kaftan',   priceNgn: 2000, status: 'In wash' as const,  expectedLocation: 'Washer 1' },
          { tagId: 'LS0039-C', name: 'Shirt',              priceNgn: 800,  status: 'In wash' as const,  expectedLocation: 'Washer 1' },
          { tagId: 'LS0039-D', name: 'Trouser / Pants',    priceNgn: 900,  status: 'Drying' as const,   expectedLocation: 'Dryer A'  },
          { tagId: 'LS0039-E', name: 'Underwear',          priceNgn: 200,  status: 'Drying' as const,   expectedLocation: 'Dryer A'  },
        ],
      },
      {
        code: ORDER_CODES[4],
        customerIdx: 4,
        status: 'Awaiting Intake' as const,
        dueAt: daysAgo(-2), // overdue
        notes: 'Wash & Fold | Drop-off',
        totalPrice: 2900,
        items: [
          { tagId: 'LS0038-A', name: 'Jeans',             priceNgn: 900,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0038-B', name: 'Hoodie / Sweatshirt',priceNgn: 1100, status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0038-C', name: 'Shirt',             priceNgn: 800,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
        ],
      },
      {
        code: ORDER_CODES[5],
        customerIdx: 5,
        status: 'Ready for Pickup' as const,
        dueAt: hoursAgo(2), // overdue pickup
        notes: 'Dry Clean | Walk-in',
        totalPrice: 5500,
        items: [
          { tagId: 'LS0037-A', name: 'Native Attire',     priceNgn: 1500, status: 'Bagged' as const, expectedLocation: 'Shelf A-1' },
          { tagId: 'LS0037-B', name: 'Senator / Kaftan',  priceNgn: 2000, status: 'Bagged' as const, expectedLocation: 'Shelf A-1' },
          { tagId: 'LS0037-C', name: 'Shirt',             priceNgn: 800,  status: 'Bagged' as const, expectedLocation: 'Shelf A-1' },
          { tagId: 'LS0037-D', name: 'Trouser / Pants',   priceNgn: 900,  status: 'Bagged' as const, expectedLocation: 'Shelf A-1' },
          { tagId: 'LS0037-E', name: 'Socks (pair)',      priceNgn: 200,  status: 'Bagged' as const, expectedLocation: 'Shelf A-1' },
        ],
      },
      {
        code: ORDER_CODES[6],
        customerIdx: 6,
        status: 'In Wash' as const,
        dueAt: hoursFromNow(8),
        notes: 'Wash & Fold | Walk-in',
        totalPrice: 7200,
        items: [
          { tagId: 'LS0036-A', name: 'Wedding Gown',      priceNgn: 8000, status: 'In wash' as const,  expectedLocation: 'Delicate Washer' },
          // Underpriced — customer discount
          { tagId: 'LS0036-B', name: 'Dress',             priceNgn: 0,    status: 'In wash' as const,  expectedLocation: 'Delicate Washer' },
        ],
      },
      {
        code: ORDER_CODES[7],
        customerIdx: 7,
        status: 'Awaiting Intake' as const,
        dueAt: hoursFromNow(48),
        notes: 'Corporate — Wash & Iron | Delivery',
        totalPrice: 12400,
        items: [
          { tagId: 'LS0035-A', name: 'Shirt',             priceNgn: 800,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0035-B', name: 'Shirt',             priceNgn: 800,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0035-C', name: 'Shirt',             priceNgn: 800,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0035-D', name: 'Trouser / Pants',   priceNgn: 900,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0035-E', name: 'Trouser / Pants',   priceNgn: 900,  status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0035-F', name: 'Suit (2 piece)',    priceNgn: 3500, status: 'At intake' as const, expectedLocation: 'Intake Rack' },
          { tagId: 'LS0035-G', name: 'Jacket / Coat',     priceNgn: 2000, status: 'At intake' as const, expectedLocation: 'Intake Rack' },
        ],
      },
      {
        code: ORDER_CODES[8],
        customerIdx: 8,
        status: 'Completed' as const,
        dueAt: daysAgo(1),
        notes: 'Wash & Fold | Walk-in',
        totalPrice: 3200,
        items: [
          { tagId: 'LS0034-A', name: 'Dress',             priceNgn: 1200, status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0034-B', name: 'Jeans',             priceNgn: 900,  status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0034-C', name: 'Shirt',             priceNgn: 800,  status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0034-D', name: 'Socks (pair)',      priceNgn: 200,  status: 'Bagged' as const, expectedLocation: 'Collected' },
        ],
      },
      {
        code: ORDER_CODES[9],
        customerIdx: 9,
        status: 'Completed' as const,
        dueAt: daysAgo(2),
        notes: 'Wash & Iron | Walk-in',
        totalPrice: 4700,
        items: [
          { tagId: 'LS0033-A', name: 'Native Attire',     priceNgn: 1500, status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0033-B', name: 'Agbada (3 piece)',  priceNgn: 4500, status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0033-C', name: 'Shirt',             priceNgn: 800,  status: 'Bagged' as const, expectedLocation: 'Collected' },
        ],
      },
      {
        code: ORDER_CODES[10],
        customerIdx: 0,
        status: 'Completed' as const,
        dueAt: daysAgo(3),
        notes: 'Dry Clean | Walk-in',
        totalPrice: 6400,
        items: [
          { tagId: 'LS0032-A', name: 'Suit (2 piece)',    priceNgn: 3500, status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0032-B', name: 'Senator / Kaftan',  priceNgn: 2000, status: 'Bagged' as const, expectedLocation: 'Collected' },
          { tagId: 'LS0032-C', name: 'Shirt',             priceNgn: 800,  status: 'Bagged' as const, expectedLocation: 'Collected' },
        ],
      },
      {
        code: ORDER_CODES[11],
        customerIdx: 1,
        status: 'In Wash' as const,
        dueAt: hoursFromNow(12),
        notes: 'Wash & Fold | Walk-in',
        totalPrice: 3100,
        items: [
          { tagId: 'LS0031-A', name: 'Bed Sheet',         priceNgn: 1000, status: 'In wash' as const, expectedLocation: 'Washer 3' },
          { tagId: 'LS0031-B', name: 'Duvet / Blanket',   priceNgn: 2500, status: 'Drying' as const,  expectedLocation: 'Dryer B'  },
        ],
      },
    ]

    for (const o of ordersData) {
      // Skip if code already exists
      const existing = await ctx.db
        .query('orders')
        .withIndex('by_code', (q) => q.eq('code', o.code))
        .unique()
      if (existing) continue

      const customerId = customerIds[o.customerIdx]
      const customer   = customersData[o.customerIdx]
      const createdTs  = daysAgo(Math.floor(Math.random() * 5))

      const orderId = await ctx.db.insert('orders', {
        code:         o.code,
        customerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        status:       o.status,
        dueAt:        o.dueAt,
        notes:        o.notes,
        totalPrice:   o.totalPrice,
        createdAt:    createdTs,
        updatedAt:    createdTs,
      })

      for (const item of o.items) {
        await ctx.db.insert('orderItems', {
          orderId,
          tagId:            item.tagId,
          name:             item.name,
          priceNgn:         item.priceNgn,
          status:           item.status,
          expectedLocation: item.expectedLocation,
          createdAt:        createdTs,
          updatedAt:        createdTs,
        })
      }
    }

    const counts = {
      customers: customerIds.length,
      orders:    ordersData.length,
      prices:    PRICES.length,
      items:     ordersData.reduce((sum, o) => sum + o.items.length, 0),
    }

    return counts
  },
})
