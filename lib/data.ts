import { createClient } from "@supabase/supabase-js";

// Server-side data fetching (no auth needed — uses anon key with RLS public read)
function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ─── BRANDS ─────────────────────────────────────────────
export interface Brand {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logo_url?: string | null;
  image_url?: string | null;
  featured: boolean;
}

const fallbackBrands: Brand[] = [
  { name: "Tweek", slug: "tweek", description: "Swedish candy brand offering better-for-you sweets with less sugar. A guilt-free treat for the whole family.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_156db46d48be4efb91df8f9ce3209fa3~mv2.png/v1/fill/w_334,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tweek.png", featured: true },
  { name: "Humble", slug: "humble", description: "Eco-friendly personal care products. Sustainable brushes, dental care and everyday essentials.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_25d4bb0645ad491f8a52b5ee5bcd1437~mv2.png/v1/fill/w_272,h_151,al_c,lg_1,q_85,enc_avif,quality_auto/humble.png", featured: true },
  { name: "Wolverine", slug: "wolverine", description: "Professional-grade work gloves and protective gear trusted by professionals worldwide.", category: "Household", logo_url: "https://static.wixstatic.com/media/b721ce_25ea824982844fe9aad78b47cb8e05e8~mv2.png/v1/fill/w_390,h_108,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wolverine_logo.png", featured: true },
  { name: "The Eco Gang", slug: "the-eco-gang", description: "Fun, colorful eco-friendly products for kids and families. Making sustainability accessible and playful.", category: "Household", logo_url: "https://static.wixstatic.com/media/b721ce_3afe720edfb04228ae0fdc7d02b6ffc4~mv2.png/v1/fill/w_354,h_242,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/the%20eco%20gang.png", featured: true },
  { name: "SOOF", slug: "soof", description: "Premium personal care brand with natural ingredients. Skincare and body care for the modern consumer.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_71d08c56d3fc434caa4727fe093603f7~mv2.png/v1/fill/w_424,h_424,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SOOF_CIRKELLOGO%20STRIPES.png", featured: true },
  { name: "Pandy", slug: "pandy", description: "Protein-enriched candy and snacks from Sweden. Great taste meets smart nutrition.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_8c06ea82374641a998c81c02c6245254~mv2.png/v1/fill/w_322,h_178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pandy_logo_red_RGB_690x.png", featured: true },
  { name: "BioForce", slug: "bioforce", description: "Natural health and herbal remedies rooted in tradition. A.Vogel products for natural wellbeing.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_9677ccd123934bb1bc42a4b31dc627f1~mv2.png/v1/fill/w_368,h_230,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20BioForce-01.png", featured: true },
  { name: "GlorySmile", slug: "glorysmile", description: "Professional teeth whitening and oral care products. Bright smiles made accessible.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_a9f515df17394d1da33e83661e48014e~mv2.png/v1/fill/w_248,h_60,al_c,lg_1,q_85,enc_avif,quality_auto/glorysmile.png", featured: false },
  { name: "Clif Bar", slug: "clif-bar", description: "America's favorite energy bar. Organic, plant-based nutrition for active lifestyles.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_b23500db6e8140fe823f9e9eff7c5c31~mv2.png/v1/fill/w_326,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Clifbarlogo_svg.png", featured: true },
  { name: "Green Origins", slug: "green-origins", description: "Organic superfoods and natural supplements. Pure nutrition sourced from the best origins.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_b6fd4c2c6f7f420fa996899a986cb932~mv2.jpeg/v1/fill/w_452,h_452,al_c,lg_1,q_80,enc_avif,quality_auto/green%20origins_logo.jpeg", featured: false },
  { name: "HealthyCo", slug: "healthyco", description: "Better-for-you food alternatives. Delicious spreads, snacks, and pantry staples with less sugar.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_c06d698ba6f34ce6a4dd7cec1f87c305~mv2.png/v1/fill/w_332,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/healthyco.png", featured: true },
  { name: "ProBrands", slug: "probrands", description: "Premium sports nutrition and functional beverages. BCAA drinks, protein bars, and more.", category: "Beverages", logo_url: "https://static.wixstatic.com/media/b721ce_ef373aa72ddc4074bd06762a5595229e~mv2.png/v1/fill/w_217,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/probrands.png", featured: true },
  { name: "Aloes", slug: "aloes", description: "Pure aloe vera products for health and wellness. Natural care from the Caribbean.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_f9c0f8e0e3e6451caea046c722a63a99~mv2.png/v1/fill/w_256,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aloes_logo.png", featured: false },
  { name: "HealthyStar", slug: "healthystar", description: "Health-conscious products for mindful living.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_8cca7f198ec94803873eeaad59b0e943~mv2.png/v1/fill/w_220,h_100,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_hs.png", featured: false },
];

export async function getBrands(): Promise<Brand[]> {
  const client = getPublicClient();
  if (!client) return fallbackBrands;
  const { data } = await client.from("brands").select("*").eq("active", true).order("sort_order");
  return data && data.length > 0 ? data : fallbackBrands;
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const client = getPublicClient();
  if (!client) return fallbackBrands.find((b) => b.slug === slug) || null;
  const { data } = await client.from("brands").select("*").eq("slug", slug).eq("active", true).single();
  return data || fallbackBrands.find((b) => b.slug === slug) || null;
}

// ─── CUSTOMERS ──────────────────────────────────────────
export interface Customer {
  id?: string;
  name: string;
  location: string;
  logo_url?: string | null;
}

const fallbackCustomers: Customer[] = [
  { name: "Botika di Servisio", location: "Curaçao" },
  { name: "Service Drogist Bonaire", location: "Bonaire" },
  { name: "NSAM Marketing Ltd", location: "Trinidad" },
];

export async function getCustomers(): Promise<Customer[]> {
  const client = getPublicClient();
  if (!client) return fallbackCustomers;
  const { data } = await client.from("customers").select("*").eq("active", true).order("sort_order");
  return data && data.length > 0 ? data : fallbackCustomers;
}

// ─── CATEGORIES ─────────────────────────────────────────
export async function getCategories(): Promise<string[]> {
  const client = getPublicClient();
  if (!client) {
    return Array.from(new Set(fallbackBrands.map((b) => b.category)));
  }
  const { data } = await client.from("categories").select("name").order("sort_order");
  if (data && data.length > 0) return data.map((c: { name: string }) => c.name);
  return Array.from(new Set(fallbackBrands.map((b) => b.category)));
}

// ─── SITE CONTENT ───────���───────────────────────────────
const fallbackContent: Record<string, string> = {
  hero_title: "Bring Trusted Brands to the Caribbean",
  hero_subtitle: "We distribute premium European brands across the Dutch Caribbean. Mix multiple brands on one pallet — no full containers needed. From Aruba to Curaçao, Bonaire, and beyond.",
  hero_cta_primary: "Explore Our Brands",
  hero_cta_secondary: "Get In Touch",
  stat_brands: "14+",
  stat_islands: "4+",
  stat_products: "500+",
  stat_partners: "3+",
  cta_title: "Ready to Stock New Brands?",
  cta_subtitle: "Whether you run a pharmacy, supermarket, or specialty store in the Caribbean — we'll help you get started with a mixed pallet tailored to your market.",
  about_intro: "We are a division of Protegy Trading, based in Aruba. For years, we've been distributing trusted European brands to retailers and pharmacies on the island. Now, we're expanding those same brands across the Dutch Caribbean — and making it easier than ever for stores to access them.",
  footer_tagline: "Your trusted distribution partner for the Caribbean. We bring the best brands from Europe to your shelves — one pallet at a time.",
  contact_email: "info@thefriendlybrands.com",
  contact_phone: "+297 555 5555",
  contact_address: "Oranjestad, Aruba",
  whatsapp_number: "2975555555",
};

export async function getSiteContent(): Promise<Record<string, string>> {
  const client = getPublicClient();
  if (!client) return fallbackContent;
  const { data } = await client.from("site_content").select("key, value");
  if (!data || data.length === 0) return fallbackContent;
  const content: Record<string, string> = { ...fallbackContent };
  data.forEach((item: { key: string; value: string }) => {
    content[item.key] = item.value;
  });
  return content;
}
