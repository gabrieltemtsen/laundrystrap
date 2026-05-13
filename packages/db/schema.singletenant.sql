-- LaundryStrap (single-tenant) schema
-- Intended for one laundry business (no tenants table).
-- Postgres + Supabase

create extension if not exists "pgcrypto";

-- =========================
-- ENUMS
-- =========================

do $$ begin
  create type staff_role as enum ('owner','admin','intake','washfloor','runner','support');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('open','in_progress','ready','collected','disputed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type item_status as enum ('received','sorted','washing','drying','ironing','packaged','ready','collected','lost','found','damaged');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum ('wash','wash_iron','iron','dry_clean','starch');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cash','bank_transfer','pos','paystack');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tag_kind as enum ('garment','bag');
exception when duplicate_object then null; end $$;

do $$ begin
  create type scan_action as enum ('check_in','move','check_out','audit','resolve');
exception when duplicate_object then null; end $$;

-- Optional: if you want strict station names for anti-misplacement

do $$ begin
  create type station as enum ('intake','sorting','wash','dry','iron','qa','packaging','storage','pickup','delivery','unknown');
exception when duplicate_object then null; end $$;

-- =========================
-- PROFILES (AUTH)
-- =========================
-- Use Supabase auth.users as the identity source.

create table if not exists staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role staff_role not null default 'intake',
  display_name text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  phone text not null,
  name text not null,
  email text,
  addresses jsonb not null default '[]',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(phone)
);

-- =========================
-- ORDERS
-- =========================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_profiles(id),
  order_number text not null unique, -- e.g. LS-2026-000123

  drop_off_at timestamptz not null default now(),
  promised_ready_at timestamptz,       -- SLA promise
  ready_at timestamptz,
  collected_at timestamptz,

  status order_status not null default 'open',

  subtotal numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  discount_reason text,
  total numeric(10,2) not null default 0,
  deposit_paid numeric(10,2) not null default 0,
  balance_due numeric(10,2) not null default 0,

  notes text,
  intake_staff_user_id uuid references auth.users(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- TAGS / QR CODES
-- =========================
-- A tag is a physical QR/label code. We keep it separate so the tag lifecycle
-- (printed, lost, replaced) is manageable.

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- the QR payload / human readable
  kind tag_kind not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  retired_at timestamptz
);

-- =========================
-- GARMENTS (ORDER ITEMS)
-- =========================

create table if not exists garments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,

  tag_id uuid not null unique references tags(id),

  item_type text not null, -- e.g. "shirt", "bedsheet" (freeform or FK to catalogue)
  color text,
  service service_type not null,
  condition_notes text,

  price numeric(10,2) not null,

  status item_status not null default 'received',

  -- Anti-misplacement / chain-of-custody
  current_station station not null default 'intake',
  current_bag_id uuid,

  received_at timestamptz not null default now(),
  packaged_at timestamptz,
  ready_at timestamptz,
  collected_at timestamptz,

  created_at timestamptz not null default now()
);

-- =========================
-- BAGS
-- =========================

create table if not exists bags (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  tag_id uuid not null unique references tags(id),
  label text,
  sealed_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

alter table garments
  add constraint garments_current_bag_fk
  foreign key (current_bag_id) references bags(id) on delete set null;

-- =========================
-- PHOTOS
-- =========================

create table if not exists garment_photos (
  id uuid primary key default gen_random_uuid(),
  garment_id uuid not null references garments(id) on delete cascade,
  photo_url text not null,
  captured_at timestamptz not null default now(),
  captured_by uuid references auth.users(id),
  note text
);

-- =========================
-- EVENTS / SCANS (ANTI-MISPLACEMENT)
-- =========================
-- Every scan can be recorded, even if the code cannot be resolved.

create table if not exists scan_events (
  id uuid primary key default gen_random_uuid(),
  scanned_code text not null,
  action scan_action not null default 'move',

  resolved_tag_id uuid references tags(id) on delete set null,
  resolved_garment_id uuid references garments(id) on delete set null,
  resolved_bag_id uuid references bags(id) on delete set null,
  resolved_order_id uuid references orders(id) on delete set null,

  from_station station,
  to_station station,
  at_station station not null default 'unknown',

  staff_user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists garment_status_events (
  id uuid primary key default gen_random_uuid(),
  garment_id uuid not null references garments(id) on delete cascade,
  from_status item_status,
  to_status item_status not null,
  from_station station,
  to_station station,
  staff_user_id uuid references auth.users(id),
  note text,
  scanned_event_id uuid references scan_events(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================
-- PAYMENTS
-- =========================

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  amount numeric(10,2) not null,
  method payment_method not null,
  external_ref text,
  paid_at timestamptz not null default now(),
  received_by uuid references auth.users(id),
  notes text
);

-- =========================
-- PRICING
-- =========================

create table if not exists pricing_catalogue (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,
  service service_type not null,
  price numeric(10,2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(item_type, service)
);

-- =========================
-- BASIC INDEXES
-- =========================

create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_dropoff on orders(drop_off_at desc);

create index if not exists idx_garments_order on garments(order_id);
create index if not exists idx_garments_status on garments(status);
create index if not exists idx_garments_station on garments(current_station);
create index if not exists idx_garments_bag on garments(current_bag_id);

create index if not exists idx_tags_kind on tags(kind);

create index if not exists idx_scan_events_created on scan_events(created_at desc);
create index if not exists idx_scan_events_code on scan_events(scanned_code);
create index if not exists idx_scan_events_resolved_tag on scan_events(resolved_tag_id);

create index if not exists idx_garment_status_events_garment on garment_status_events(garment_id, created_at desc);

create index if not exists idx_payments_order on payments(order_id);

-- Optional but useful for "find everything scanned at station X recently"
create index if not exists idx_scan_events_station_time on scan_events(at_station, created_at desc);
