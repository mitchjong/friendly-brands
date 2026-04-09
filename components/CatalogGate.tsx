"use client";

import { useState } from "react";
import { Download, FileText, X } from "lucide-react";

interface CatalogGateProps {
  open: boolean;
  onClose: () => void;
}

export default function CatalogGate({ open, onClose }: CatalogGateProps) {
  const [sending, setSending] = useState(false);
  const [catalogUrl, setCatalogUrl] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      business_name: (form.elements.namedItem("business") as HTMLInputElement).value,
      island: (form.elements.namedItem("island") as HTMLSelectElement).value,
    };

    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.catalog_url) {
        setCatalogUrl(result.catalog_url);
      } else {
        // No catalog uploaded yet — show success anyway
        setCatalogUrl("pending");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {catalogUrl ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Your Catalog is Ready!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Thank you for your interest. We&apos;ll also send you updates on new brands.
            </p>
            {catalogUrl !== "pending" ? (
              <a
                href={catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Catalog
              </a>
            ) : (
              <p className="text-sm text-gray-500">
                Our catalog is being prepared. We&apos;ll email it to you shortly!
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Download Our Brand Catalog
                </h3>
                <p className="text-sm text-gray-500">
                  See all available brands, products &amp; pricing
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  name="name"
                  required
                  placeholder="Your Name *"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address *"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <input
                  name="business"
                  placeholder="Business Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <select
                  name="island"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="">Island / Country</option>
                  <option value="Curacao">Cura&ccedil;ao</option>
                  <option value="Bonaire">Bonaire</option>
                  <option value="Sint Maarten">Sint Maarten</option>
                  <option value="Trinidad">Trinidad</option>
                  <option value="Aruba">Aruba</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {sending ? "Processing..." : "Get the Catalog"}
              </button>
              <p className="text-xs text-gray-400 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
