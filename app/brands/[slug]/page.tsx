import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, ArrowRight, Boxes } from "lucide-react";
import { getBrands, getBrandBySlug, getSuppliers } from "@/lib/data";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description,
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) notFound();

  const suppliers = await getSuppliers();
  const supplier = suppliers.find((s) =>
    s.brands.some((b) => b.slug === params.slug)
  );
  const siblingBrands = supplier?.brands.filter((b) => b.slug !== params.slug) || [];

  return (
    <>
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Brands
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {brand.logo_url || brand.image_url ? (
                <img
                  src={brand.image_url || brand.logo_url || ""}
                  alt={brand.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <Package className="w-20 h-20 text-gray-300" />
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {brand.category}
                </span>
                {supplier && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                    Supplier: {supplier.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {brand.name}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                {brand.description}
              </p>

              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Distribution Details
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Territory</span>
                    <span className="font-medium text-gray-900">
                      Dutch Caribbean
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rights</span>
                    <span className="font-medium text-gray-900">
                      Exclusive
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mixed Pallet</span>
                    <span className="font-medium text-green-700">
                      Available
                    </span>
                  </li>
                  {supplier && (
                    <li className="flex justify-between">
                      <span>Supplier</span>
                      <span className="font-medium text-gray-900">
                        {supplier.name}
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Request a Quote for {brand.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Combine with these brands */}
      {siblingBrands.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Boxes className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Combine on one pallet with:
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {siblingBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Package className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {b.name}
                    </p>
                    <p className="text-xs text-gray-400">{b.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
