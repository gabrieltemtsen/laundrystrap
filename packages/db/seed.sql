-- Seed: sample tenant + pricing catalogue for local dev

INSERT INTO tenants (
  id, name, slug, primary_color, accent_color, tagline,
  phone, whatsapp, email, city,
  service_areas, turnaround_standard_days, turnaround_express_days,
  lost_item_policy
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Laundry Abuja',
  'demo-abuja',
  '#0B7A75',
  '#0F3460',
  'Never lose a garment again.',
  '+2348000000000',
  '+2348000000000',
  'hello@demolaundry.com',
  'Abuja',
  ARRAY['Wuse 2','Wuse','Garki','Maitama','Asokoro','Jabi','Utako','Gwarinpa','Apo','Lugbe'],
  3,
  1,
  'In the unlikely event that we lose an item, we will compensate up to ₦50,000 per item. We photograph every item at drop-off as proof.'
);

-- Pricing catalogue
INSERT INTO pricing_catalogue (tenant_id, item_type, service_type, price) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Shirt', 'wash', 500),
  ('00000000-0000-0000-0000-000000000001', 'Shirt', 'wash_iron', 800),
  ('00000000-0000-0000-0000-000000000001', 'Shirt', 'iron', 400),
  ('00000000-0000-0000-0000-000000000001', 'Trouser', 'wash', 600),
  ('00000000-0000-0000-0000-000000000001', 'Trouser', 'wash_iron', 900),
  ('00000000-0000-0000-0000-000000000001', 'Trouser', 'iron', 450),
  ('00000000-0000-0000-0000-000000000001', 'Native/Agbada', 'wash_iron', 2500),
  ('00000000-0000-0000-0000-000000000001', 'Native/Agbada', 'dry_clean', 3500),
  ('00000000-0000-0000-0000-000000000001', 'Suit', 'dry_clean', 4000),
  ('00000000-0000-0000-0000-000000000001', 'Bedsheet (single)', 'wash', 1000),
  ('00000000-0000-0000-0000-000000000001', 'Bedsheet (double)', 'wash', 1500),
  ('00000000-0000-0000-0000-000000000001', 'Duvet', 'wash', 3000),
  ('00000000-0000-0000-0000-000000000001', 'Towel', 'wash', 500),
  ('00000000-0000-0000-0000-000000000001', 'Dress', 'wash_iron', 1200),
  ('00000000-0000-0000-0000-000000000001', 'Dress', 'dry_clean', 2000),
  ('00000000-0000-0000-0000-000000000001', 'Jacket', 'dry_clean', 2500),
  ('00000000-0000-0000-0000-000000000001', 'Skirt', 'wash_iron', 700),
  ('00000000-0000-0000-0000-000000000001', 'Shirt', 'starch', 600),
  ('00000000-0000-0000-0000-000000000001', 'Trouser', 'starch', 700);
