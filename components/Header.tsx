"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageSquareQuote, FileText } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/brands", label: "Brands" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  onOpenQuote,
  onOpenCatalog,
}: {
  onOpenQuote: () => void;
  onOpenCatalog: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="The Friendly Brands"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={onOpenCatalog}
              className="inline-flex items-center gap-1.5 border border-primary-200 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Catalog
            </button>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <MessageSquareQuote className="w-4 h-4" />
              Request Quote
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 py-2"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenCatalog();
              }}
              className="inline-flex items-center justify-center gap-2 border border-primary-200 text-primary-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download Catalog
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenQuote();
              }}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <MessageSquareQuote className="w-4 h-4" />
              Request Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
