import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Globe,
  Handshake,
  TrendingUp,
} from "lucide-react";
import { getCustomers, getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about The Friendly Brands and Protegy Trading — your experienced distribution partner for the Dutch Caribbean.",
};

export const revalidate = 60;

const strengths = [
  {
    icon: Globe,
    title: "Caribbean Expertise",
    text: "Deep understanding of the Dutch Caribbean market, import regulations, and consumer preferences across Aruba, Curaçao, Bonaire, and beyond.",
  },
  {
    icon: Handshake,
    title: "Strong Relationships",
    text: "Long-standing partnerships with brand owners in Europe and retailers across the Caribbean. We are a bridge between two worlds.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused",
    text: "We don't just deliver products — we help partners grow by recommending the right mix of brands for their specific market.",
  },
  {
    icon: Users,
    title: "Hands-On Service",
    text: "Small team, big commitment. You'll always deal with people who know your account, your market, and your goals.",
  },
];

export default async function AboutPage() {
  const [customers, content] = await Promise.all([
    getCustomers(),
    getSiteContent(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About The Friendly Brands
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content.about_intro}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Work
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Many of the products we sell through Protegy Trading in Aruba,
                  we also hold exclusive distribution rights for across other
                  Caribbean islands — primarily the Dutch Caribbean.
                </p>
                <p>
                  Our model is simple and efficient: we work{" "}
                  <strong className="text-gray-900">Ex-works</strong>, but we
                  make sure your products are delivered to your freight
                  forwarder in the Netherlands. We have broad experience with
                  this process and will assist in maximizing containers or
                  pallets.
                </p>
                <p>
                  The biggest benefit? You can{" "}
                  <strong className="text-gray-900">
                    mix several brands onto a single pallet
                  </strong>
                  . That means you can add many brands to your supermarket or
                  store right away — no need for full containers. We&apos;ll help
                  you optimize the pallet space as much as possible.
                </p>
              </div>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <h3 className="font-semibold text-primary-900 mb-4">
                Currently Serving
              </h3>
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div
                    key={customer.name}
                    className="bg-white rounded-lg p-4 border border-primary-100 flex items-center gap-3"
                  >
                    {customer.logo_url ? (
                      <img
                        src={customer.logo_url}
                        alt={customer.name}
                        className="w-10 h-10 rounded-lg object-contain"
                      />
                    ) : null}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.location}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="bg-white rounded-lg p-4 border border-primary-100 border-dashed">
                  <p className="font-semibold text-gray-400">
                    Your store could be next
                  </p>
                  <p className="text-sm text-gray-400">Get in touch today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Why Work With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {strengths.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <item.icon className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-gray-600 mb-8">
            Whether you&apos;re looking to add a single brand or build an entire
            product range, we&apos;re here to help you succeed in the Caribbean
            market.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Get In Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
