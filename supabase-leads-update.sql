-- Enhance leads table with address and contacts
ALTER TABLE leads ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]';
-- contacts format: [{"name": "John", "email": "john@co.com", "phone": "+123", "role": "Buyer"}, ...]
