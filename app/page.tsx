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
  CheckCircle,
} from "lucide-react";
import { getBrands, getCustomers, getSiteContent, getSuppliers } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [brands, customers, content, suppliers] = await Promise.all([
    getBrands(),
    getCustomers(),
    getSiteContent(),
    getSuppliers(),
  ]);

  const featuredBrands = brands.filter((b) => b.featured).slice(0, 8);

  const stats = [
    { icon: Package, value: content.stat_brands, label: "Brands" },
    { icon: Globe, value: content.stat_islands, label: "Islands Served" },
    { icon: Box, value: content.stat_products, label: "Products" },
    { icon: Store, value: content.stat_partners, label: "Retail Partners" },
  ];

  return (
    <>
      {/* Hero — Bold & Visual */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Now serving {customers.length}+ retailers across the Caribbean</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                Your Gateway to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                  Premium Brands
                </span>
                in the Caribbean
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                We distribute {brands.length}+ European brands across the Dutch
                Caribbean. Mix multiple brands from the same supplier on one
                pallet — no full containers needed. Excellent pricing, delivered
                to your freight forwarder.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/brands"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors text-lg"
                >
                  Explore Our Brands
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors"
                >
                  Get In Touch
                </Link>
              </div>

              {/* Quick trust signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Exclusive Caribbean rights
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  No minimum containers
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Competitive pricing
                </span>
              </div>
            </div>

            {/* Brand logos cloud */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-4">
                {featuredBrands.slice(0, 6).map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/brands/${brand.slug}`}
                    className="bg-white rounded-2xl p-5 flex items-center justify-center aspect-square hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-700 text-center">
                        {brand.name}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner — Visual Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Retailers Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We make it simple and profitable for Caribbean retailers,
              pharmacies, and supermarkets to stock in-demand European brands.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: "Mix Brands, One Pallet",
                description:
                  "Combine multiple brands from the same supplier onto one pallet. No full containers — start small, grow fast.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: DollarSign,
                title: "Excellent Pricing",
                description:
                  "Direct wholesale pricing from European brand owners. Better margins for your store, no middlemen.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Truck,
                title: "We Handle Logistics",
                description:
                  "Ex-works delivery to your freight forwarder in the Netherlands. We optimize every pallet for maximum value.",
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: ShieldCheck,
                title: "Exclusive Rights",
                description:
                  "We hold exclusive distribution rights for our brands in the Dutch Caribbean. Guaranteed supply and support.",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((prop) => (
              <div
                key={prop.title}
                className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${prop.color}`}
                >
                  <prop.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
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

      {/* Suppliers Showcase */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {suppliers.length} Suppliers, {brands.length}+ Brands
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Browse our supplier portfolio. Mix brands within each supplier on
              a single pallet.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suppliers.map((supplier) => (
              <Link
                key={supplier.slug}
                href={`/brands/supplier/${supplier.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                  {supplier.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {supplier.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {supplier.brands.slice(0, 4).map((b) => (
                    <span
                      key={b.slug}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                    >
                      {b.name}
                    </span>
                  ))}
                  {supplier.brands.length > 4 && (
                    <span className="text-gray-400 text-xs px-2 py-0.5">
                      +{supplier.brands.length - 4} more
                    </span>
                  )}
                </div>
                <span className="text-primary-600 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View brands <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-10">
            Trusted by retailers across the Caribbean
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {customers.map((customer) => (
              <div key={customer.name} className="text-center group">
                <div className="w-32 h-32 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-3 mx-auto overflow-hidden group-hover:shadow-md transition-shadow">
                  {customer.logo_url ? (
                    <img
                      src={customer.logo_url}
                      alt={customer.name}
                      className="w-full h-full object-contain p-3"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700 text-center px-3">
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

      {/* How It Works — Quick Version */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Getting Started Is Simple
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Four steps from browsing to delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Browse Brands", desc: "Explore our portfolio grouped by supplier." },
              { step: "02", title: "Request a Quote", desc: "Tell us what you need. We respond within 24h." },
              { step: "03", title: "We Build Your Pallet", desc: "Mix brands from the same supplier. We optimize space." },
              { step: "04", title: "Delivered to Your Forwarder", desc: "We ship to your freight forwarder in the Netherlands." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-primary-500/30 mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/how-it-works"
              className="text-primary-400 hover:text-primary-300 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Learn more about how it works
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {content.cta_title}
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            {content.cta_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-lg"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/brands"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50 text-gray-700 px-8 py-3.5 rounded-xl font-semibold transition-colors"
            >
              View All Brands
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
