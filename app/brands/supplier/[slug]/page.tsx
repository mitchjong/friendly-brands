"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ArrowRight,
  Boxes,
  FileText,
  Download,
  X,
  Mail,
} from "lucide-react";

interface Brand {
  name: string;
  slug: string;
  description: string;
  category: string;
  logo_url?: string | null;
}

interface Supplier {
  name: string;
  slug: string;
  description: string;
  catalog_url?: string | null;
  brands: Brand[];
}

const fallbackSuppliers: Record<string, Supplier> = {
  "fcb-of-sweden": {
    name: "FCB of Sweden",
    slug: "fcb-of-sweden",
    description:
      "One of Scandinavia's leading FMCG distributors with a wide portfolio of health, sports nutrition, personal care, and household brands.",
    brands: [
      { name: "ProBrands", slug: "probrands", description: "Premium sports nutrition and functional beverages.", category: "Beverages", logo_url: "https://static.wixstatic.com/media/b721ce_ef373aa72ddc4074bd06762a5595229e~mv2.png/v1/fill/w_217,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/probrands.png" },
      { name: "HealthyCo", slug: "healthyco", description: "Better-for-you food alternatives with less sugar.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_c06d698ba6f34ce6a4dd7cec1f87c305~mv2.png/v1/fill/w_332,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/healthyco.png" },
      { name: "Tweek", slug: "tweek", description: "Swedish candy with less sugar.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_156db46d48be4efb91df8f9ce3209fa3~mv2.png/v1/fill/w_334,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tweek.png" },
      { name: "Pandy", slug: "pandy", description: "Protein-enriched candy and snacks.", category: "Food & Snacks", logo_url: "https://static.wixstatic.com/media/b721ce_8c06ea82374641a998c81c02c6245254~mv2.png/v1/fill/w_322,h_178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pandy_logo_red_RGB_690x.png" },
      { name: "Body Science", slug: "body-science", description: "Premium sports nutrition from Sweden.", category: "Health & Beauty" },
      { name: "Humble", slug: "humble", description: "Eco-friendly personal care products.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_25d4bb0645ad491f8a52b5ee5bcd1437~mv2.png/v1/fill/w_272,h_151,al_c,lg_1,q_85,enc_avif,quality_auto/humble.png" },
      { name: "Aloes", slug: "aloes", description: "Pure aloe vera products.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_f9c0f8e0e3e6451caea046c722a63a99~mv2.png/v1/fill/w_256,h_258,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aloes_logo.png" },
      { name: "Wolverine", slug: "wolverine", description: "Professional work gloves.", category: "Household", logo_url: "https://static.wixstatic.com/media/b721ce_25ea824982844fe9aad78b47cb8e05e8~mv2.png/v1/fill/w_390,h_108,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wolverine_logo.png" },
    ],
  },
  nije: {
    name: "NIJE",
    slug: "nije",
    description: "Innovative consumer brands focused on modern lifestyle products.",
    brands: [
      { name: "Propod", slug: "propod", description: "Next-generation pod-based products.", category: "Beverages" },
      { name: "Locally", slug: "locally", description: "Locally sourced and sustainably produced goods.", category: "Food & Snacks" },
    ],
  },
  "club-tails": {
    name: "Club Tails",
    slug: "club-tails",
    description: "Ready-to-drink cocktails and mocktails for the Caribbean lifestyle.",
    brands: [
      { name: "Club Tails", slug: "club-tails-brand", description: "Premium ready-to-drink cocktails.", category: "Beverages" },
      { name: "Crushers from Europe", slug: "crushers-from-europe", description: "European-style crushed fruit cocktail drinks.", category: "Beverages" },
      { name: "Club Tails Mocktails", slug: "club-tails-mocktails", description: "Premium non-alcoholic cocktails.", category: "Beverages" },
    ],
  },
  "bioforce-estel": {
    name: "BioForce / Estel",
    slug: "bioforce-estel",
    description: "Natural health, herbal remedies, and wellness products rooted in European tradition.",
    brands: [
      { name: "BioForce", slug: "bioforce", description: "Natural health and herbal remedies.", category: "Health & Beauty", logo_url: "https://static.wixstatic.com/media/b721ce_9677ccd123934bb1bc42a4b31dc627f1~mv2.png/v1/fill/w_368,h_230,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20BioForce-01.png" },
      { name: "Estel", slug: "estel", description: "Professional beauty and personal care.", category: "Health & Beauty" },
    ],
  },
};

type Step = "form" | "verify" | "done";

export default function SupplierPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", business: "", island: "" });
  const [verifyCode, setVerifyCode] = useState("");
  const [catalogUrl, setCatalogUrl] = useState("");

  useEffect(() => {
    setSupplier(fallbackSuppliers[slug] || null);
  }, [slug]);

  function openCatalog() {
    setStep("form");
    setError("");
    setVerifyCode("");
    setCatalogOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      business: (form.elements.namedItem("business") as HTMLInputElement).value,
      island: (form.elements.namedItem("island") as HTMLSelectElement).value,
    };
    setFormData(data);

    try {
      // Send verification code
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, action: "send" }),
      });
      const result = await res.json();

      if (result.success) {
        setStep("verify");
      } else {
        setError(result.error || "Failed to send verification code.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, action: "verify", code: verifyCode }),
      });
      const result = await res.json();

      if (!result.verified) {
        setError(result.error || "Invalid code.");
        setSending(false);
        return;
      }

      // Verified! Save as lead
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.business,
          island: formData.island,
          source: `catalog_${slug}`,
          email_opted_in: true,
          brands_interested: supplier?.brands.map((b) => b.name) || [],
        }),
      });

      // Track
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "catalog_download",
          page: `/brands/supplier/${slug}`,
          meta: JSON.stringify({ supplier: supplier?.name, email: formData.email }),
        }),
      });

      setCatalogUrl(supplier?.catalog_url || "");
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function resendCode() {
    setSending(true);
    setError("");
    try {
      await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, action: "send" }),
      });
      setError("New code sent! Check your inbox.");
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (!supplier) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">Supplier not found.</p>
        <Link href="/brands" className="text-primary-600 text-sm mt-2 inline-block">
          Back to all brands
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1 text-sm text-primary-200 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All Suppliers
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {supplier.name}
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl">
            {supplier.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={openCatalog}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download {supplier.name} Catalog
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pallet info */}
      <section className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Boxes className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">
              All {supplier.brands.length} brands below can be{" "}
              <strong>combined on a single pallet</strong>. No full containers
              needed — mix and match to fit your store.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Brands from {supplier.name}
          </h2>
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
                <p className="text-xs text-gray-500 mt-1">{brand.category}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {brand.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Want the Full {supplier.name} Product List?
          </h2>
          <p className="text-gray-600 mb-6">
            Download the complete catalog with all products, packaging details,
            and pricing information.
          </p>
          <button
            onClick={openCatalog}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Get the Catalog
          </button>
        </div>
      </section>

      {/* Catalog Gate Modal */}
      {catalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCatalogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <button onClick={() => setCatalogOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Contact Form */}
            {step === "form" && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{supplier.name} Catalog</h3>
                    <p className="text-sm text-gray-500">Products, packaging &amp; pricing</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-3">{error}</div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <input name="name" required placeholder="Your Name *" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  <input name="email" type="email" required placeholder="Email Address *" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  <input name="phone" type="tel" required placeholder="Phone Number *" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  <input name="business" placeholder="Business Name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  <select name="island" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                    <option value="">Island / Country</option>
                    <option value="Curacao">Cura&ccedil;ao</option>
                    <option value="Bonaire">Bonaire</option>
                    <option value="Sint Maarten">Sint Maarten</option>
                    <option value="Trinidad">Trinidad</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Other">Other</option>
                  </select>
                  <button type="submit" disabled={sending} className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50">
                    {sending ? "Sending verification code..." : "Continue"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    We&apos;ll send a verification code to your email.
                  </p>
                </form>
              </>
            )}

            {/* Step 2: Email Verification */}
            {step === "verify" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Check Your Email</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    We sent a 6-digit code to <strong>{formData.email}</strong>
                  </p>
                </div>

                {error && (
                  <div className={`text-sm px-4 py-2 rounded-lg mb-3 ${error.includes("sent") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={sending || verifyCode.length !== 6}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {sending ? "Verifying..." : "Verify & Download Catalog"}
                  </button>
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={resendCode}
                      disabled={sending}
                      className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                    >
                      Resend code
                    </button>
                    <button
                      onClick={() => { setStep("form"); setError(""); }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      Change email
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Download */}
            {step === "done" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Verified!
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Thank you, {formData.name}. Your {supplier.name} catalog is ready.
                </p>
                {catalogUrl ? (
                  <a
                    href={catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download {supplier.name} Catalog
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">
                    The catalog is being prepared. We&apos;ll email it to you at{" "}
                    <strong>{formData.email}</strong> shortly!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
