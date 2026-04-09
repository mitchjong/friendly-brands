"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import QuoteModal from "./QuoteModal";
// Uncomment when catalogs are ready
// import CatalogGate from "./CatalogGate";
// import ExitIntentPopup from "./ExitIntentPopup";
// import StickyCTA from "./StickyCTA";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  // const [catalogOpen, setCatalogOpen] = useState(false); // Uncomment when catalogs are ready
  const pathname = usePathname();

  // Track page views
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", page: pathname }),
    }).catch(() => {});
  }, [pathname]);

  // Don't show conversion features on admin pages
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <Header
        onOpenQuote={() => setQuoteOpen(true)}
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {!isAdmin && (
        <>
          <WhatsAppButton />
          {/* Uncomment when catalogs are ready
          <StickyCTA onOpenCatalog={() => setCatalogOpen(true)} />
          <ExitIntentPopup />
          */}
        </>
      )}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
      {/* <CatalogGate open={catalogOpen} onClose={() => setCatalogOpen(false)} /> */}
    </>
  );
}
