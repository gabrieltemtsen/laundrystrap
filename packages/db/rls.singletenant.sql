-- LaundryStrap (single-tenant) RLS policies
-- Run AFTER schema.singletenant.sql

alter table staff_profiles enable row level security;
alter table customer_profiles enable row level security;
alter table orders enable row level security;
alter table tags enable row level security;
alter table garments enable row level security;
alter table bags enable row level security;
alter table garment_photos enable row level security;
alter table scan_events enable row level security;
alter table garment_status_events enable row level security;
alter table payments enable row level security;
alter table pricing_catalogue enable row level security;

-- Helper: is current user staff?
create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from staff_profiles sp
    where sp.user_id = auth.uid() and sp.active = true
  );
$$;

-- Staff can read/write most operational tables.
-- Customers can read their own orders/garments/payments/photos.

-- staff_profiles
create policy staff_read_profiles on staff_profiles
  for select using (public.is_staff());

create policy staff_manage_profiles on staff_profiles
  for all using (public.is_staff()) with check (public.is_staff());

-- customer_profiles: customers can read/update their own profile by user_id
create policy customer_read_self on customer_profiles
  for select using (user_id = auth.uid());

create policy customer_update_self on customer_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- staff can manage customer profiles
create policy staff_manage_customers on customer_profiles
  for all using (public.is_staff()) with check (public.is_staff());

-- pricing: public read
create policy public_read_pricing on pricing_catalogue
  for select using (active = true);

-- orders: customers read their own; staff manage all
create policy customer_read_own_orders on orders
  for select using (
    customer_id in (select id from customer_profiles where user_id = auth.uid())
  );

create policy staff_manage_orders on orders
  for all using (public.is_staff()) with check (public.is_staff());

-- garments: customers read their own via orders; staff manage
create policy customer_read_own_garments on garments
  for select using (
    order_id in (
      select o.id from orders o
      join customer_profiles c on c.id = o.customer_id
      where c.user_id = auth.uid()
    )
  );

create policy staff_manage_garments on garments
  for all using (public.is_staff()) with check (public.is_staff());

-- bags: customers can read bags for their order; staff manage
create policy customer_read_own_bags on bags
  for select using (
    order_id in (
      select o.id from orders o
      join customer_profiles c on c.id = o.customer_id
      where c.user_id = auth.uid()
    )
  );

create policy staff_manage_bags on bags
  for all using (public.is_staff()) with check (public.is_staff());

-- tags: staff only (avoid leaking codes)
create policy staff_tags_all on tags
  for all using (public.is_staff()) with check (public.is_staff());

-- garment_photos: customers read for their garments; staff manage
create policy customer_read_own_garment_photos on garment_photos
  for select using (
    garment_id in (
      select g.id from garments g
      join orders o on o.id = g.order_id
      join customer_profiles c on c.id = o.customer_id
      where c.user_id = auth.uid()
    )
  );

create policy staff_manage_garment_photos on garment_photos
  for all using (public.is_staff()) with check (public.is_staff());

-- payments: customers read own; staff manage
create policy customer_read_own_payments on payments
  for select using (
    order_id in (
      select o.id from orders o
      join customer_profiles c on c.id = o.customer_id
      where c.user_id = auth.uid()
    )
  );

create policy staff_manage_payments on payments
  for all using (public.is_staff()) with check (public.is_staff());

-- scan_events + status events: staff only (operational log)
create policy staff_scan_events_all on scan_events
  for all using (public.is_staff()) with check (public.is_staff());

create policy staff_garment_status_events_all on garment_status_events
  for all using (public.is_staff()) with check (public.is_staff());
