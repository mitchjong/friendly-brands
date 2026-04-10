-- Add suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  catalog_url TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add supplier_id to brands
ALTER TABLE brands ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id);

-- RLS for suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active suppliers" ON suppliers
  FOR SELECT USING (active = true);
CREATE POLICY "Admin full access suppliers" ON suppliers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed suppliers
INSERT INTO suppliers (name, slug, description, sort_order) VALUES
  ('FCB of Sweden', 'fcb-of-sweden', 'One of Scandinavia''s leading FMCG distributors with a wide portfolio of health, sports nutrition, personal care, and household brands.', 1),
  ('NIJE', 'nije', 'Innovative consumer brands focused on modern lifestyle products.', 2),
  ('Club Tails', 'club-tails', 'Ready-to-drink cocktails and mocktails for the Caribbean lifestyle.', 3),
  ('BioForce / Estel', 'bioforce-estel', 'Natural health, herbal remedies, and wellness products rooted in European tradition.', 4);

-- Link existing brands to suppliers
UPDATE brands SET supplier_id = (SELECT id FROM suppliers WHERE slug = 'fcb-of-sweden')
  WHERE slug IN ('probrands', 'healthyco', 'tweek', 'pandy', 'body-science', 'humble', 'aloes', 'wolverine');

UPDATE brands SET supplier_id = (SELECT id FROM suppliers WHERE slug = 'nije')
  WHERE slug IN ('propod', 'locally');

UPDATE brands SET supplier_id = (SELECT id FROM suppliers WHERE slug = 'club-tails')
  WHERE slug IN ('club-tails-brand', 'crushers-from-europe', 'club-tails-mocktails');

UPDATE brands SET supplier_id = (SELECT id FROM suppliers WHERE slug = 'bioforce-estel')
  WHERE slug IN ('bioforce', 'estel');
