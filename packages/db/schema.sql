-- LaundryStrap Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- MULTI-TENANCY
-- =====================

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#0B7A75',
  accent_color text DEFAULT '#0F3460',
  font text DEFAULT 'Inter',
  border_radius text DEFAULT '0.5rem',
  tagline text,
  phone text,
  whatsapp text,
  email text,
  address text,
  city text,
  service_areas text[] DEFAULT '{}',
  turnaround_standard_days int DEFAULT 3,
  turnaround_express_days int DEFAULT 1,
  lost_item_policy text,
  paystack_public_key text,
  paystack_secret_key_enc text,
  termii_key_enc text,
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

CREATE TABLE tenant_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain text UNIQUE NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =====================
-- USERS / AUTH
-- =====================

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  name text,
  email text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tenant_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'intake', 'washfloor')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

CREATE TABLE staff_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pin_hash text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- =====================
-- CUSTOMERS
-- =====================

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  clerk_user_id text,
  phone text NOT NULL,
  name text NOT NULL,
  email text,
  addresses jsonb DEFAULT '[]',
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, phone)
);

-- =====================
-- ORDERS
-- =====================

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id),
  order_number text NOT NULL,
  drop_off_date date NOT NULL DEFAULT CURRENT_DATE,
  expected_pickup_date date,
  status text DEFAULT 'active' CHECK (status IN ('active','ready','collected','disputed','cancelled')),
  subtotal numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  discount_reason text,
  deposit_paid numeric(10,2) DEFAULT 0,
  balance_due numeric(10,2) DEFAULT 0,
  notes text,
  intake_staff_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  item_type text NOT NULL,
  color text,
  service_type text NOT NULL CHECK (service_type IN ('wash','wash_iron','iron','dry_clean','starch')),
  condition_notes text,
  price numeric(10,2) NOT NULL,
  tag_code text UNIQUE NOT NULL,
  current_status text DEFAULT 'received' CHECK (current_status IN ('received','sorted','washing','drying','ironing','packaged','ready','collected')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE item_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  captured_at timestamptz DEFAULT now(),
  captured_by uuid REFERENCES users(id)
);

CREATE TABLE status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  staff_id uuid REFERENCES users(id),
  scanned_at timestamptz DEFAULT now(),
  notes text
);

-- =====================
-- PAYMENTS
-- =====================

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  amount numeric(10,2) NOT NULL,
  method text NOT NULL CHECK (method IN ('cash','bank_transfer','pos','paystack')),
  paystack_ref text,
  paid_at timestamptz DEFAULT now(),
  received_by uuid REFERENCES users(id),
  notes text
);

-- =====================
-- PRICING
-- =====================

CREATE TABLE pricing_catalogue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  service_type text NOT NULL,
  price numeric(10,2) NOT NULL,
  active boolean DEFAULT true,
  UNIQUE(tenant_id, item_type, service_type)
);

-- =====================
-- PICKUP REQUESTS
-- =====================

CREATE TABLE pickup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  preferred_window text,
  estimated_items int,
  service_type text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  created_at timestamptz DEFAULT now()
);

-- =====================
-- NOTIFICATIONS
-- =====================

CREATE TABLE notification_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  type text NOT NULL,
  order_id uuid REFERENCES orders(id),
  customer_id uuid REFERENCES customers(id),
  phone text NOT NULL,
  message text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','cancelled')),
  retry_count int DEFAULT 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES notification_jobs(id) ON DELETE CASCADE,
  provider text DEFAULT 'termii',
  status text,
  response jsonb,
  attempted_at timestamptz DEFAULT now()
);

-- =====================
-- FEEDBACK
-- =====================

CREATE TABLE customer_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text,
  submitted_at timestamptz DEFAULT now()
);

-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_tag ON order_items(tag_code);
CREATE INDEX idx_customers_tenant_phone ON customers(tenant_id, phone);
CREATE INDEX idx_notification_jobs_scheduled ON notification_jobs(status, scheduled_for);
CREATE INDEX idx_tenant_memberships_user ON tenant_memberships(user_id);
