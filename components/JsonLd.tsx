export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Friendly Brands",
    url: "https://thefriendlybrands.com",
    description:
      "Wholesale distribution of trusted European brands across the Dutch Caribbean. Mix brands on one pallet.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Oranjestad",
      addressCountry: "AW",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Protegy Trading",
    },
    areaServed: [
      { "@type": "Country", name: "Aruba" },
      { "@type": "Country", name: "Curaçao" },
      { "@type": "Country", name: "Bonaire" },
      { "@type": "Country", name: "Sint Maarten" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@thefriendlybrands.com",
      contactType: "sales",
      availableLanguage: ["English", "Dutch"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
