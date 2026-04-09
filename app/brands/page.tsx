"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface Brand {
  name: string;
  slug: string;
  description: string;
  category: string;
  logo_url: string | null;
  featured: boolean;
}

const fallbackBrands: Brand[] = [
  { name: "Tweek", slug: "tweek", description: "Swedish candy with less sugar.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_156db46d48be4efb91df8f9ce3209fa3~mv2.png/v1/fill/w_334,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tweek.png", featured: true },
  { name: "Humble", slug: "humble", description: "Eco-friendly personal care.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_25d4bb0645ad491f8a52b5ee5bcd1437~mv2.png/v1/fill/w_272,h_151,al_c,lg_1,q_85,enc_avif,quality_auto/humble.png", featured: true },
  { name: "Wolverine", slug: "wolverine", description: "Professional work gloves.", category: "Household", logo_url: "https://static.wixstatic.com/media/b721ce_25ea824982844fe9aad78b47cb8e05e8~mv2.png/v1/fill/w_390,h_108,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wolverine_logo.png", featured: true },
  { name: "Clif Bar", slug: "clif-bar", description: "Organic energy bars.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_b23500db6e8140fe823f9e9eff7c5c31~mv2.png/v1/fill/w_326,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Clifbarlogo_svg.png", featured: true },
  { name: "ProBrands", slug: "probrands", description: "Sports nutrition beverages.", category: "Beverages", logo_url: "https://static.wixstatic.com/media/b721ce_ef373aa72ddc4074bd06762a5595229e~mv2.png/v1/fill/w_217,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/probrands.png", featured: true },
  { name: "SOOF", slug: "soof", description: "Premium personal care.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_71d08c56d3fc434caa4727fe093603f7~mv2.png/v1/fill/w_424,h_424,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SOOF_CIRKELLOGO%20STRIPES.png", featured: false },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createSupabaseBrowser();
        const [brandsRes, catsRes] = await Promise.all([
          supabase.from("brands").select("*").eq("active", true).order("sort_order"),
          supabase.from("categories").select("name").order("sort_order"),
        ]);
        if (brandsRes.data && brandsRes.data.length > 0) {
          setBrands(brandsRes.data);
        } else {
          setBrands(fallbackBrands);
        }
        if (catsRes.data && catsRes.data.length > 0) {
          setCategories(catsRes.data.map((c: { name: string }) => c.name));
        } else {
          setCategories(Array.from(new Set(fallbackBrands.map((b) => b.category))));
        }
      } catch {
        setBrands(fallbackBrands);
        setCategories(Array.from(new Set(fallbackBrands.map((b) => b.category))));
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    activeCategory === "All"
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  return (
    <>
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Brands
            </h1>
            <p className="text-lg text-gray-600">
              Explore the brands we distribute across the Dutch Caribbean.
              Health &amp; beauty, household, food, beverages, and more — all
              available on mixed pallets.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "All"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{brand.category}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {brand.description}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No brands in this category yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
