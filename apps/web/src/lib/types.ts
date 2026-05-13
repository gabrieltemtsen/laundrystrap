// Shared types matching the Convex schema shapes.
// Since api uses AnyApi, we cast query results to these types.

export type OrderStatus = 'Awaiting Intake' | 'In Wash' | 'Ready for Pickup' | 'Completed'
export type ItemStatus = 'At intake' | 'In wash' | 'Drying' | 'Folded' | 'Bagged'

export type Customer = {
  _id: string
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: number
  updatedAt: number
}

export type Order = {
  _id: string
  code: string
  customerId?: string
  customerName: string
  customerPhone?: string
  status: OrderStatus
  expectedLocation?: string
  dueAt?: number
  notes?: string
  totalPrice?: number
  createdAt: number
  updatedAt: number
}

export type OrderItem = {
  _id: string
  orderId: string
  tagId: string
  name: string
  expectedLocation?: string
  priceNgn?: number
  status: ItemStatus
  createdAt: number
  updatedAt: number
}

export type Price = {
  _id: string
  itemType: string
  priceNgn: number
  unit: string
  updatedAt: number
}

export type OrderWithItems = Order & { items: OrderItem[] }
