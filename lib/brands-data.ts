export interface Brand {
  name: string;
  slug: string;
  description: string;
  category: string;
  featured: boolean;
  image?: string;
}

// Placeholder brands — replace with real data from Supabase in Phase 2
export const brands: Brand[] = [
  {
    name: "Brand 1",
    slug: "brand-1",
    description: "Premium health & beauty products trusted across the Caribbean.",
    category: "Health & Beauty",
    featured: true,
  },
  {
    name: "Brand 2",
    slug: "brand-2",
    description: "Quality household essentials for everyday use.",
    category: "Household",
    featured: true,
  },
  {
    name: "Brand 3",
    slug: "brand-3",
    description: "Delicious snacks and treats loved by consumers.",
    category: "Food & Snacks",
    featured: true,
  },
  {
    name: "Brand 4",
    slug: "brand-4",
    description: "Professional personal care products.",
    category: "Health & Beauty",
    featured: false,
  },
  {
    name: "Brand 5",
    slug: "brand-5",
    description: "Refreshing beverages for the Caribbean market.",
    category: "Beverages",
    featured: true,
  },
  {
    name: "Brand 6",
    slug: "brand-6",
    description: "Natural wellness and supplement products.",
    category: "Health & Beauty",
    featured: false,
  },
];

export const categories = Array.from(new Set(brands.map((b) => b.category)));
