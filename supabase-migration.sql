-- The Friendly Brands — Full CMS Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- BRANDS (manageable from admin)
-- ============================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  logo_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CUSTOMERS / PARTNERS (trusted-by section)
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  country TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- LEADS (contact form submissions)
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  island TEXT,
  message TEXT,
  brands_interested TEXT[],
  status TEXT DEFAULT 'new',
  email_opted_in BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'website',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SITE CONTENT (editable text/images from admin)
-- ============================================
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'text', -- text, html, image, number, json
  label TEXT, -- human-readable label for admin UI
  section TEXT, -- group: hero, stats, about, footer, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CATEGORIES (brand categories)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EMAIL CAMPAIGNS
-- ============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  recipient_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ANALYTICS EVENTS (internal tracking)
-- ============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL, -- page_view, whatsapp_click, catalog_download, exit_intent_shown, quote_request
  page TEXT,
  meta TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public can insert analytics events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert events" ON analytics_events
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can read events" ON analytics_events
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- SEED DATA: Default customers
-- ============================================
INSERT INTO customers (name, location, country, sort_order) VALUES
  ('Botika di Servisio', 'Curaçao', 'CW', 1),
  ('Service Drogist Bonaire', 'Bonaire', 'BQ', 2),
  ('NSAM Marketing Ltd', 'Trinidad', 'TT', 3);

-- ============================================
-- SEED DATA: Default categories
-- ============================================
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Health & Beauty', 'health-beauty', 1),
  ('Household', 'household', 2),
  ('Food & Snacks', 'food-snacks', 3),
  ('Beverages', 'beverages', 4);

-- ============================================
-- SEED DATA: Default site content
-- ============================================
INSERT INTO site_content (key, value, type, label, section) VALUES
  ('hero_title', 'Bring Trusted Brands to the Caribbean', 'text', 'Hero Title', 'hero'),
  ('hero_subtitle', 'We distribute premium European brands across the Dutch Caribbean. Mix multiple brands on one pallet — no full containers needed. From Aruba to Curaçao, Bonaire, and beyond.', 'text', 'Hero Subtitle', 'hero'),
  ('hero_cta_primary', 'Explore Our Brands', 'text', 'Hero Primary Button', 'hero'),
  ('hero_cta_secondary', 'Get In Touch', 'text', 'Hero Secondary Button', 'hero'),
  ('stat_brands', '15+', 'text', 'Brands Count', 'stats'),
  ('stat_islands', '3+', 'text', 'Islands Served', 'stats'),
  ('stat_products', '500+', 'text', 'Products Count', 'stats'),
  ('stat_partners', '10+', 'text', 'Retail Partners', 'stats'),
  ('cta_title', 'Ready to Stock New Brands?', 'text', 'CTA Section Title', 'cta'),
  ('cta_subtitle', 'Whether you run a pharmacy, supermarket, or specialty store in the Caribbean — we''ll help you get started with a mixed pallet tailored to your market.', 'text', 'CTA Section Subtitle', 'cta'),
  ('about_intro', 'We are a division of Protegy Trading, based in Aruba. For years, we''ve been distributing trusted European brands to retailers and pharmacies on the island. Now, we''re expanding those same brands across the Dutch Caribbean — and making it easier than ever for stores to access them.', 'text', 'About Intro Text', 'about'),
  ('footer_tagline', 'Your trusted distribution partner for the Caribbean. We bring the best brands from Europe to your shelves — one pallet at a time.', 'text', 'Footer Tagline', 'footer'),
  ('contact_email', 'info@thefriendlybrands.com', 'text', 'Contact Email', 'contact'),
  ('contact_phone', '+297 555 5555', 'text', 'Contact Phone', 'contact'),
  ('contact_address', 'Oranjestad, Aruba', 'text', 'Contact Address', 'contact'),
  ('whatsapp_number', '2975555555', 'text', 'WhatsApp Number', 'contact'),
  ('catalog_url', '', 'text', 'Catalog PDF URL (upload to media storage)', 'catalog');

-- ============================================
-- SEED DATA: Placeholder brands
-- ============================================
INSERT INTO brands (name, slug, description, category, logo_url, featured, sort_order) VALUES
  ('Tweek', 'tweek', 'Swedish candy brand offering better-for-you sweets with less sugar.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_156db46d48be4efb91df8f9ce3209fa3~mv2.png/v1/fill/w_334,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tweek.png', true, 1),
  ('Humble', 'humble', 'Eco-friendly personal care products. Sustainable brushes, dental care and everyday essentials.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_25d4bb0645ad491f8a52b5ee5bcd1437~mv2.png/v1/fill/w_272,h_151,al_c,lg_1,q_85,enc_avif,quality_auto/humble.png', true, 2),
  ('Wolverine', 'wolverine', 'Professional-grade work gloves and protective gear trusted by professionals worldwide.', 'Household', 'https://static.wixstatic.com/media/b721ce_25ea824982844fe9aad78b47cb8e05e8~mv2.png/v1/fill/w_390,h_108,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wolverine_logo.png', true, 3),
  ('The Eco Gang', 'the-eco-gang', 'Fun, colorful eco-friendly products for kids and families.', 'Household', 'https://static.wixstatic.com/media/b721ce_3afe720edfb04228ae0fdc7d02b6ffc4~mv2.png/v1/fill/w_354,h_242,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/the%20eco%20gang.png', true, 4),
  ('SOOF', 'soof', 'Premium personal care brand with natural ingredients.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_71d08c56d3fc434caa4727fe093603f7~mv2.png/v1/fill/w_424,h_424,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SOOF_CIRKELLOGO%20STRIPES.png', true, 5),
  ('Pandy', 'pandy', 'Protein-enriched candy and snacks from Sweden.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_8c06ea82374641a998c81c02c6245254~mv2.png/v1/fill/w_322,h_178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pandy_logo_red_RGB_690x.png', true, 6),
  ('BioForce', 'bioforce', 'Natural health and herbal remedies. A.Vogel products for natural wellbeing.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_9677ccd123934bb1bc42a4b31dc627f1~mv2.png/v1/fill/w_368,h_230,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20BioForce-01.png', true, 7),
  ('GlorySmile', 'glorysmile', 'Professional teeth whitening and oral care products.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_a9f515df17394d1da33e83661e48014e~mv2.png/v1/fill/w_248,h_60,al_c,lg_1,q_85,enc_avif,quality_auto/glorysmile.png', false, 8),
  ('Clif Bar', 'clif-bar', 'Organic, plant-based energy bars for active lifestyles.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_b23500db6e8140fe823f9e9eff7c5c31~mv2.png/v1/fill/w_326,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Clifbarlogo_svg.png', true, 9),
  ('Green Origins', 'green-origins', 'Organic superfoods and natural supplements.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_b6fd4c2c6f7f420fa996899a986cb932~mv2.jpeg/v1/fill/w_452,h_452,al_c,lg_1,q_80,enc_avif,quality_auto/green%20origins_logo.jpeg', false, 10),
  ('HealthyCo', 'healthyco', 'Better-for-you food alternatives with less sugar.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_c06d698ba6f34ce6a4dd7cec1f87c305~mv2.png/v1/fill/w_332,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/healthyco.png', true, 11),
  ('ProBrands', 'probrands', 'Premium sports nutrition and functional beverages.', 'Beverages', 'https://static.wixstatic.com/media/b721ce_ef373aa72ddc4074bd06762a5595229e~mv2.png/v1/fill/w_217,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/probrands.png', true, 12),
  ('Aloes', 'aloes', 'Pure aloe vera products for health and wellness.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_f9c0f8e0e3e6451caea046c722a63a99~mv2.png/v1/fill/w_256,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aloes_logo.png', false, 13),
  ('HealthyStar', 'healthystar', 'Health-conscious products for mindful living.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_8cca7f198ec94803873eeaad59b0e943~mv2.png/v1/fill/w_220,h_100,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_hs.png', false, 14);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Public read access for brands, customers, categories, site_content
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Public can read active brands
CREATE POLICY "Public can read active brands" ON brands
  FOR SELECT USING (active = true);

-- Public can read active customers
CREATE POLICY "Public can read active customers" ON customers
  FOR SELECT USING (active = true);

-- Public can read categories
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT TO anon USING (true);

-- Public can read site content
CREATE POLICY "Public can read site content" ON site_content
  FOR SELECT TO anon USING (true);

-- Public can insert leads (contact form)
CREATE POLICY "Public can insert leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users have full access to all tables
CREATE POLICY "Admin full access brands" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access customers" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access site_content" ON site_content
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access leads" ON leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access campaigns" ON campaigns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET for logos/images
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'media');

CREATE POLICY "Authenticated can upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated can update media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media');

CREATE POLICY "Authenticated can delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');
