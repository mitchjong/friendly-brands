import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, ArrowRight } from "lucide-react";
import { getBrands, getBrandBySlug } from "@/lib/data";
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
              <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {brand.category}
              </span>
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
    </>
  );
}
