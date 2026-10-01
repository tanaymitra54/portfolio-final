-- Upsert personalized site settings and contact info for Tanay Mitra
INSERT INTO site_settings (key, value, updated_at)
VALUES 
  ('site_title', 'Tanay Mitra', NOW()),
  ('hero_title', 'Hi, I''m Tanay Mitra', NOW()),
  ('hero_subtitle', 'Full Stack Developer', NOW()),
  ('github_url', 'https://github.com/tanaymitra98', NOW()),
  ('owner_name', 'Tanay Mitra', NOW()),
  ('contact_phone', '8761985584', NOW())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
