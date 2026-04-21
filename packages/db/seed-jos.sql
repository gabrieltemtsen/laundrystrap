-- Seed: second demo tenant (Jos)

INSERT INTO tenants (
  id, name, slug, primary_color, accent_color, tagline,
  phone, whatsapp, email, city,
  service_areas, turnaround_standard_days, turnaround_express_days,
  lost_item_policy
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Demo Laundry Jos',
  'demo-jos',
  '#0B7A75',
  '#0F3460',
  'Photo-verified laundry. Zero mix-ups.',
  '+2348000000000',
  '+2348000000000',
  'hello@demolaundryjos.com',
  'Jos',
  ARRAY['Rayfield','Terminus','Tudun Wada','Angwan Rukuba','Bukuru','Dadin Kowa'],
  3,
  1,
  'In the unlikely event that we lose an item, we will compensate up to ₦50,000 per item. We photograph every item at drop-off as proof.'
);
