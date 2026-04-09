"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

const defaults = {
  footer_tagline: "Your trusted distribution partner for the Caribbean. We bring the best brands from Europe to your shelves — one pallet at a time.",
  contact_email: "info@thefriendlybrands.com",
  contact_phone: "+297 594 0837",
  contact_address: "Oranjestad, Aruba",
};

export default function Footer() {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createSupabaseBrowser();
        const { data } = await supabase
          .from("site_content")
          .select("key, value")
          .in("key", Object.keys(defaults));
        if (data) {
          const updated = { ...defaults };
          data.forEach((item: { key: string; value: string }) => {
            if (item.key in updated) {
              (updated as Record<string, string>)[item.key] = item.value;
            }
          });
          setContent(updated);
        }
      } catch {
        // Use defaults
      }
    }
    load();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-3">
              <img src="/images/logo.png" alt="The Friendly Brands" className="h-10 w-auto invert brightness-200" />
            </div>
            <p className="text-sm leading-relaxed">{content.footer_tagline}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brands" className="hover:text-white transition-colors">Our Brands</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Get In Touch</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href={`mailto:${content.contact_email}`} className="hover:text-white transition-colors">
                  {content.contact_email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href={`tel:${content.contact_phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                  {content.contact_phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>{content.contact_address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} The Friendly Brands. A division of
          Protegy Trading. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
