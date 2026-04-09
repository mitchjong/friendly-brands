import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  FileText,
  Package,
  Truck,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to order from The Friendly Brands. Browse brands, request a quote, we optimize your pallet, and deliver to your freight forwarder in the Netherlands.",
};

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Our Brands",
    description:
      "Explore our portfolio of trusted European brands across health & beauty, household, food, and more. See what fits your market.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Request a Quote",
    description:
      "Tell us which brands and products you're interested in, along with your business details. We'll prepare a tailored offer within 24 hours.",
  },
  {
    icon: Package,
    number: "03",
    title: "We Optimize Your Pallet",
    description:
      "Mix multiple brands onto a single pallet — no full containers needed. Our team maximizes pallet space so you get the best value per shipment.",
  },
  {
    icon: Truck,
    number: "04",
    title: "Delivered to Your Freight Forwarder",
    description:
      "We work Ex-works and deliver your order to your freight forwarder in the Netherlands. From there, it ships directly to your island.",
  },
];

const faqs = [
  {
    q: "Do I need to order a full container?",
    a: "No! That's one of our biggest advantages. You can mix multiple brands from the same supplier onto a single pallet. This means you can start small and add variety to your store without the commitment of a full container.",
  },
  {
    q: "Can I mix brands from different suppliers?",
    a: "Brands can be mixed on one pallet within the same supplier, but not across different suppliers — because each supplier ships from a different location. On our Brands page, you can see which brands belong to each supplier and can be combined.",
  },
  {
    q: "What does Ex-works mean?",
    a: "Ex-works means the price is for the goods at our supplier's warehouse. We then arrange delivery to your freight forwarder in the Netherlands at competitive rates. You handle the ocean freight from there — or we can recommend partners.",
  },
  {
    q: "Which islands do you serve?",
    a: "We primarily serve the Dutch Caribbean: Curaçao, Bonaire, Sint Maarten, and Aruba. We're open to other Caribbean islands too — just reach out and we'll see how we can help.",
  },
  {
    q: "What's the minimum order?",
    a: "We're flexible. We can work with as little as a few cases of each brand to build a mixed pallet. The minimum depends on the brands and products — contact us for specifics.",
  },
  {
    q: "How long does delivery take?",
    a: "Once your order is confirmed and paid, we typically deliver to your freight forwarder within 1-2 weeks. Ocean freight to the Caribbean usually takes an additional 2-4 weeks depending on the destination.",
  },
  {
    q: "Do you offer exclusivity?",
    a: "For certain brands and territories, yes. We hold exclusive distribution rights for many of our brands in the Dutch Caribbean. Contact us to discuss exclusive arrangements for your island.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h1>
            <p className="text-lg text-gray-600">
              Getting started is simple. Four steps from browsing to delivery —
              we handle the complexity so you can focus on selling.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-primary-100 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-xs font-bold text-primary-600 mb-1">
                    STEP {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pallet Highlight */}
      <section className="bg-accent-50 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-12 h-12 text-accent-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            The Mixed Pallet Advantage
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Most distributors require you to order full containers of a single
            brand. With us, you can combine{" "}
            <strong>multiple brands from the same supplier on one pallet</strong>.
            For example, a pharmacy in Bonaire can stock ProBrands, Humble, Tweek,
            and HealthyCo — all from FCB of Sweden — in a single shipment. We
            optimize every centimeter of pallet space to maximize your investment.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white border border-gray-100 rounded-xl"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 text-gray-900 font-medium">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-primary-100 mb-6">
            Send us a message and we&apos;ll have a quote ready for you within 24
            hours.
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
