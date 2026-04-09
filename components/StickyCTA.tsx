"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";

export default function StickyCTA({
  onOpenCatalog,
}: {
  onOpenCatalog: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("sticky_cta_dismissed")) {
      setDismissed(true);
      return;
    }

    function handleScroll() {
      // Show after scrolling 40% down the page
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(scrollPercent > 0.4);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-700 text-white shadow-lg transform transition-transform">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-5 h-5 flex-shrink-0 hidden sm:block" />
          <p className="text-sm font-medium truncate">
            Download our brand catalog — see all products &amp; pricing
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenCatalog}
            className="bg-white text-primary-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors"
          >
            Get Catalog
          </button>
          <button
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem("sticky_cta_dismissed", "true");
            }}
            className="text-primary-200 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
