-- Update email and theme color to dark green
INSERT INTO site_settings (key, value, updated_at)
VALUES 
  ('contact_email', 'tanaymitra9@gmail.com', NOW()),
  ('theme_color', '#22c55e', NOW())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
