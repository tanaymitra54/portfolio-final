CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[], -- Array of technology names
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE skills (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- e.g., "Frontend", "Backend", "Database"
  proficiency INTEGER NOT NULL CHECK (proficiency >= 1 AND proficiency <= 5), -- 1-5 scale
  icon_name TEXT, -- Lucide icon name
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT NOT NULL UNIQUE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_title', 'My Portfolio'),
  ('site_description', 'Welcome to my professional portfolio'),
  ('hero_title', 'Full Stack Developer'),
  ('hero_subtitle', 'Building amazing web experiences'),
  ('about_text', 'I am a passionate developer with expertise in modern web technologies.'),
  ('theme_color', '#3b82f6'),
  ('contact_email', 'contact@example.com'),
  ('github_url', ''),
  ('linkedin_url', ''),
  ('twitter_url', '');
