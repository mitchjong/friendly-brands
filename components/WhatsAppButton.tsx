"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "2975940837";

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Build a pre-filled message that identifies the website + page
  const pageName =
    pathname === "/"
      ? "Home"
      : pathname
          .replace(/^\//, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  const message = encodeURIComponent(
    `Hi! I'm contacting you via thefriendlybrands.com (${pageName} page). I'm interested in distributing your brands. Can we talk?`
  );

  function trackClick() {
    // Track in Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: pathname,
      });
    }
    // Track internally
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "whatsapp_click", page: pathname }),
    }).catch(() => {});
  }

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 group"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 text-sm font-medium px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
