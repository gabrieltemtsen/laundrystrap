-- LaundryStrap RLS Policies
-- Run AFTER schema.sql

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (for server-side + worker)
-- All policies below are for anon/authenticated roles

-- Tenants: public read of active tenants (for subdomain resolution)
CREATE POLICY "public_read_active_tenants" ON tenants
  FOR SELECT USING (active = true);

-- Customers can read their own tenant's public info
CREATE POLICY "customers_read_own_orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers
      WHERE clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "customers_read_own_items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders
      WHERE customer_id IN (
        SELECT id FROM customers
        WHERE clerk_user_id = (auth.jwt() ->> 'sub')
      )
    )
  );

CREATE POLICY "customers_read_own_photos" ON item_photos
  FOR SELECT USING (
    order_item_id IN (
      SELECT oi.id FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN customers c ON c.id = o.customer_id
      WHERE c.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "customers_read_own_payments" ON payments
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders
      WHERE customer_id IN (
        SELECT id FROM customers
        WHERE clerk_user_id = (auth.jwt() ->> 'sub')
      )
    )
  );

-- Public order status page (no auth) - via order id lookup (handled server-side with service role)

-- Pricing catalogue: public read per tenant
CREATE POLICY "public_read_pricing" ON pricing_catalogue
  FOR SELECT USING (active = true);

-- Public can submit pickup requests
CREATE POLICY "public_insert_pickup_requests" ON pickup_requests
  FOR INSERT WITH CHECK (true);

-- Public can submit feedback
CREATE POLICY "public_insert_feedback" ON customer_feedback
  FOR INSERT WITH CHECK (true);
