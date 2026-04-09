import Link from "next/link";
import {
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  Store,
  Globe,
  Box,
  DollarSign,
} from "lucide-react";
import { getBrands, getCustomers, getSiteContent } from "@/lib/data";

const valueProps = [
  {
    icon: Package,
    title: "Mix Brands on One Pallet",
    description:
      "Combine multiple brands from the same supplier onto a single pallet — no full containers needed. Add variety to your shelves from day one.",
  },
  {
    icon: DollarSign,
    title: "Excellent Pricing",
    description:
      "Competitive wholesale pricing direct from European brand owners. Better margins for your store with no middlemen.",
  },
  {
    icon: Truck,
    title: "Delivered to Your Freight Forwarder",
    description:
      "We work Ex-works and deliver to your freight forwarder in the Netherlands. We help optimize every pallet for maximum value.",
  },
  {
    icon: ShieldCheck,
    title: "Exclusive Caribbean Rights",
    description:
      "We hold exclusive distribution rights for our brands in the Dutch Caribbean. Partner with us for guaranteed supply.",
  },
];

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [brands, customers, content] = await Promise.all([
    getBrands(),
    getCustomers(),
    getSiteContent(),
  ]);

  const featuredBrands = brands.filter((b) => b.featured);

  const stats = [
    { icon: Package, value: content.stat_brands, label: "Brands" },
    { icon: Globe, value: content.stat_islands, label: "Islands Served" },
    { icon: Box, value: content.stat_products, label: "Products" },
    { icon: Store, value: content.stat_partners, label: "Retail Partners" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              {content.hero_title}
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed">
              {content.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/brands"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                {content.hero_cta_primary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {content.hero_cta_secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Partner With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make it easy for Caribbean retailers, pharmacies, and
              supermarkets to stock the brands their customers want.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <prop.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {prop.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted By Leading Retailers
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {customers.map((customer) => (
              <div key={customer.name} className="text-center">
                <div className="w-28 h-28 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-3 mx-auto overflow-hidden">
                  {customer.logo_url ? (
                    <img
                      src={customer.logo_url}
                      alt={customer.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700 text-center px-2">
                      {customer.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{customer.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Brands
              </h2>
              <p className="text-gray-600">
                A selection of the brands we distribute across the Caribbean.
              </p>
            </div>
            <Link
              href="/brands"
              className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand) => (
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
              </Link>
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/brands"
              className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm"
            >
              View All Brands <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{content.cta_title}</h2>
          <p className="text-primary-100 mb-8 text-lg">{content.cta_subtitle}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Contact Us Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
