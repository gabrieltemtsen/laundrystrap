// Auto-generate with: supabase gen types typescript --project-id <id> > packages/db/src/types.ts
// This is a manual stub — replace with generated types after Supabase project is created

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ServiceType = 'wash' | 'wash_iron' | 'iron' | 'dry_clean' | 'starch'
export type ItemStatus = 'received' | 'sorted' | 'washing' | 'drying' | 'ironing' | 'packaged' | 'ready' | 'collected'
export type OrderStatus = 'active' | 'ready' | 'collected' | 'disputed' | 'cancelled'
export type StaffRole = 'owner' | 'admin' | 'intake' | 'washfloor'
export type PaymentMethod = 'cash' | 'bank_transfer' | 'pos' | 'paystack'
export type NotificationType = 'ready_for_pickup' | 'reminder_3day' | 'reminder_7day' | 'stale_item' | 'balance_due' | 'dropoff_confirmation'

export interface Tenant {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  accent_color: string
  font: string
  border_radius: string
  tagline: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  city: string | null
  service_areas: string[]
  turnaround_standard_days: number
  turnaround_express_days: number
  lost_item_policy: string | null
  paystack_public_key: string | null
  created_at: string
  active: boolean
}

export interface User {
  id: string
  clerk_user_id: string
  phone: string
  name: string | null
  email: string | null
  created_at: string
}

export interface TenantMembership {
  id: string
  tenant_id: string
  user_id: string
  role: StaffRole
  status: 'active' | 'suspended'
  created_at: string
}

export interface Customer {
  id: string
  tenant_id: string
  clerk_user_id: string | null
  phone: string
  name: string
  email: string | null
  addresses: Json
  notes: string | null
  created_at: string
}

export interface Order {
  id: string
  tenant_id: string
  customer_id: string
  order_number: string
  drop_off_date: string
  expected_pickup_date: string | null
  status: OrderStatus
  subtotal: number
  discount_amount: number
  discount_reason: string | null
  deposit_paid: number
  balance_due: number
  notes: string | null
  intake_staff_id: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  tenant_id: string
  item_type: string
  color: string | null
  service_type: ServiceType
  condition_notes: string | null
  price: number
  tag_code: string
  current_status: ItemStatus
  created_at: string
}

export interface ItemPhoto {
  id: string
  order_item_id: string
  photo_url: string
  captured_at: string
  captured_by: string | null
}

export interface StatusEvent {
  id: string
  order_item_id: string
  from_status: ItemStatus | null
  to_status: ItemStatus
  staff_id: string | null
  scanned_at: string
  notes: string | null
}

export interface Payment {
  id: string
  order_id: string
  tenant_id: string
  amount: number
  method: PaymentMethod
  paystack_ref: string | null
  paid_at: string
  received_by: string | null
  notes: string | null
}

export interface PricingCatalogue {
  id: string
  tenant_id: string
  item_type: string
  service_type: ServiceType
  price: number
  active: boolean
}

export interface PickupRequest {
  id: string
  tenant_id: string
  name: string
  phone: string
  address: string
  preferred_window: string | null
  estimated_items: number | null
  service_type: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
}

export interface NotificationJob {
  id: string
  tenant_id: string
  type: NotificationType
  order_id: string | null
  customer_id: string | null
  phone: string
  message: string
  scheduled_for: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  retry_count: number
  last_error: string | null
  sent_at: string | null
  created_at: string
}

// Placeholder for full Database type (replace with supabase gen types output)
export interface Database {
  public: {
    Tables: {
      tenants: { Row: Tenant; Insert: Partial<Tenant>; Update: Partial<Tenant> }
      users: { Row: User; Insert: Partial<User>; Update: Partial<User> }
      customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> }
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> }
      item_photos: { Row: ItemPhoto; Insert: Partial<ItemPhoto>; Update: Partial<ItemPhoto> }
      status_events: { Row: StatusEvent; Insert: Partial<StatusEvent>; Update: Partial<StatusEvent> }
      payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> }
      pricing_catalogue: { Row: PricingCatalogue; Insert: Partial<PricingCatalogue>; Update: Partial<PricingCatalogue> }
      pickup_requests: { Row: PickupRequest; Insert: Partial<PickupRequest>; Update: Partial<PickupRequest> }
      notification_jobs: { Row: NotificationJob; Insert: Partial<NotificationJob>; Update: Partial<NotificationJob> }
    }
  }
}
