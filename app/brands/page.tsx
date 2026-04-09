import Link from "next/link";
import { Package, ArrowRight, Boxes, FileText } from "lucide-react";
import { getSuppliers } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Brands",
  description:
    "Explore the brands we distribute across the Dutch Caribbean. Grouped by supplier — mix brands within each supplier on a single pallet.",
};

export const revalidate = 60;

export default async function BrandsPage() {
  const suppliers = await getSuppliers();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Brands
            </h1>
            <p className="text-lg text-gray-600">
              We distribute trusted brands from multiple suppliers across the
              Dutch Caribbean. Browse by supplier below.
            </p>
          </div>
        </div>
      </section>

      {/* Pallet mixing info */}
      <section className="bg-accent-50 border-y border-accent-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-start gap-3">
            <Boxes className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <strong>How pallet mixing works:</strong> You can combine multiple
              brands from the <em>same supplier</em> onto one pallet — no full
              containers needed. Brands from different suppliers ship separately.
            </p>
          </div>
        </div>
      </section>

      {/* Suppliers + Brands */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {suppliers.map((supplier) => (
            <div key={supplier.slug}>
              {/* Supplier Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/brands/supplier/${supplier.slug}`}
                      className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {supplier.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">
                      {supplier.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-3 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      <Boxes className="w-3.5 h-3.5" />
                      These brands can be combined on one pallet
                    </div>
                  </div>
                  <Link
                    href={`/brands/supplier/${supplier.slug}`}
                    className="hidden sm:inline-flex items-center gap-1.5 border border-primary-200 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors flex-shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View &amp; Download Catalog
                  </Link>
                </div>
              </div>

              {/* Brand Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {supplier.brands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/brands/${brand.slug}`}
                    className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-full aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
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
                    <p className="text-xs text-gray-500 mt-1">
                      {brand.category}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {brand.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Interested in Any of These Brands?
          </h2>
          <p className="text-primary-100 mb-6">
            Request a quote and we&apos;ll help you build the perfect mixed
            pallet for your store.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Request a Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
