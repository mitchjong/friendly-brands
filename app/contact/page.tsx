"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [brands, setBrands] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const supabase = createSupabaseBrowser();
        const { data } = await supabase
          .from("brands")
          .select("name, slug")
          .eq("active", true)
          .order("sort_order");
        if (data && data.length > 0) {
          setBrands(data);
        } else {
          setBrands([
            { name: "Brand 1", slug: "brand-1" },
            { name: "Brand 2", slug: "brand-2" },
            { name: "Brand 3", slug: "brand-3" },
          ]);
        }
      } catch {
        setBrands([
          { name: "Brand 1", slug: "brand-1" },
          { name: "Brand 2", slug: "brand-2" },
          { name: "Brand 3", slug: "brand-3" },
        ]);
      }
    }
    loadBrands();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const selectedBrands = formData.getAll("brands") as string[];

    const data = {
      name: formData.get("name"),
      business_name: formData.get("business"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      island: formData.get("island"),
      message: formData.get("message"),
      brands_interested: selectedBrands,
      email_opted_in: formData.get("newsletter") === "on",
      source: "contact_page",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again or contact us via WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section className="py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Message Sent!
          </h1>
          <p className="text-gray-600">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours
            with a tailored response.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Interested in distributing our brands? Tell us about your business
            and we&apos;ll prepare a tailored offer.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      id="business"
                      name="business"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="island" className="block text-sm font-medium text-gray-700 mb-1">
                    Island / Country
                  </label>
                  <select
                    id="island"
                    name="island"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value="">Select your location...</option>
                    <option value="Curacao">Curaçao</option>
                    <option value="Bonaire">Bonaire</option>
                    <option value="Sint Maarten">Sint Maarten</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Brand Interest Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which brands are you interested in?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {brands.map((brand) => (
                      <label
                        key={brand.slug}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          name="brands"
                          value={brand.name}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        {brand.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your store, what products you're looking for, and any questions you have..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                  />
                </div>

                {/* Newsletter opt-in */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletter"
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">
                    Keep me updated on new brands, promotions, and Caribbean
                    distribution news.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Other Ways to Reach Us
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a
                        href="mailto:info@thefriendlybrands.com"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        info@thefriendlybrands.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a
                        href="tel:+2975555555"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        +297 555 5555
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        WhatsApp
                      </p>
                      <a
                        href="https://wa.me/2975555555"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline"
                      >
                        Chat with us
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Location
                      </p>
                      <p className="text-sm text-gray-600">
                        Oranjestad, Aruba
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Quick Response
                </h3>
                <p className="text-sm text-primary-800">
                  We typically respond within 24 hours. For urgent inquiries,
                  reach out via WhatsApp for the fastest response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
