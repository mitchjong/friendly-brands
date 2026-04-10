-- Remove discontinued brands
DELETE FROM brands WHERE slug IN ('the-eco-gang', 'soof', 'glorysmile', 'green-origins', 'healthystar', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6');

-- Make sure we have the correct brands. First delete all and re-insert clean data:
DELETE FROM brands;

INSERT INTO brands (name, slug, description, category, logo_url, featured, active, sort_order) VALUES
  ('ProBrands', 'probrands', 'Premium sports nutrition and functional beverages. BCAA drinks, protein bars, and more.', 'Beverages', 'https://static.wixstatic.com/media/b721ce_ef373aa72ddc4074bd06762a5595229e~mv2.png/v1/fill/w_217,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/probrands.png', true, true, 1),
  ('HealthyCo', 'healthyco', 'Better-for-you food alternatives. Delicious spreads, snacks, and pantry staples with less sugar.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_c06d698ba6f34ce6a4dd7cec1f87c305~mv2.png/v1/fill/w_332,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/healthyco.png', true, true, 2),
  ('Tweek', 'tweek', 'Swedish candy brand offering better-for-you sweets with less sugar.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_156db46d48be4efb91df8f9ce3209fa3~mv2.png/v1/fill/w_334,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tweek.png', true, true, 3),
  ('Pandy', 'pandy', 'Protein-enriched candy and snacks from Sweden. Great taste meets smart nutrition.', 'Food & Snacks', 'https://static.wixstatic.com/media/b721ce_8c06ea82374641a998c81c02c6245254~mv2.png/v1/fill/w_322,h_178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pandy_logo_red_RGB_690x.png', true, true, 4),
  ('Body Science', 'body-science', 'Premium sports nutrition brand from Sweden. Protein powders, supplements, and performance products.', 'Health & Beauty', null, true, true, 5),
  ('Humble', 'humble', 'Eco-friendly personal care products. Sustainable brushes, dental care, and everyday essentials.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_25d4bb0645ad491f8a52b5ee5bcd1437~mv2.png/v1/fill/w_272,h_151,al_c,lg_1,q_85,enc_avif,quality_auto/humble.png', true, true, 6),
  ('Aloes', 'aloes', 'Pure aloe vera products for health and wellness.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_f9c0f8e0e3e6451caea046c722a63a99~mv2.png/v1/fill/w_256,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aloes_logo.png', false, true, 7),
  ('Wolverine', 'wolverine', 'Professional-grade work gloves and protective gear.', 'Household', 'https://static.wixstatic.com/media/b721ce_25ea824982844fe9aad78b47cb8e05e8~mv2.png/v1/fill/w_390,h_108,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wolverine_logo.png', false, true, 8),
  ('Propod', 'propod', 'Next-generation pod-based products for the modern consumer.', 'Beverages', null, true, true, 9),
  ('Locally', 'locally', 'Locally sourced and sustainably produced consumer goods.', 'Food & Snacks', null, true, true, 10),
  ('Club Tails', 'club-tails-brand', 'Premium ready-to-drink cocktails. Bold flavors, party-ready.', 'Beverages', null, true, true, 11),
  ('Crushers from Europe', 'crushers-from-europe', 'European-style crushed fruit cocktail drinks.', 'Beverages', null, true, true, 12),
  ('Club Tails Mocktails', 'club-tails-mocktails', 'All the flavor, none of the alcohol. Premium non-alcoholic cocktails.', 'Beverages', null, true, true, 13),
  ('BioForce', 'bioforce', 'Natural health and herbal remedies. A.Vogel products for natural wellbeing.', 'Health & Beauty', 'https://static.wixstatic.com/media/b721ce_9677ccd123934bb1bc42a4b31dc627f1~mv2.png/v1/fill/w_368,h_230,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20BioForce-01.png', true, true, 14),
  ('Estel', 'estel', 'Professional beauty and personal care products from Europe.', 'Health & Beauty', null, true, true, 15);

-- Also update site content with correct phone/whatsapp
UPDATE site_content SET value = '+297 594 0837' WHERE key = 'contact_phone';
UPDATE site_content SET value = '2975940837' WHERE key = 'whatsapp_number';
