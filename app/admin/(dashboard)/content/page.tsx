"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Save, Check } from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  label: string | null;
  section: string | null;
}

const sectionLabels: Record<string, string> = {
  hero: "Hero Section",
  stats: "Statistics",
  cta: "Call to Action",
  about: "About Page",
  footer: "Footer",
  contact: "Contact Info",
};

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const supabase = createSupabaseBrowser();

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").order("section").order("key");
    setContent(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function updateLocal(id: string, value: string) {
    setContent((items) =>
      items.map((item) => (item.id === id ? { ...item, value } : item))
    );
    setSaved((s) => ({ ...s, [id]: false }));
  }

  async function saveItem(item: ContentItem) {
    setSaving((s) => ({ ...s, [item.id]: true }));
    await supabase
      .from("site_content")
      .update({ value: item.value, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    setSaving((s) => ({ ...s, [item.id]: false }));
    setSaved((s) => ({ ...s, [item.id]: true }));
    setTimeout(() => setSaved((s) => ({ ...s, [item.id]: false })), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Group by section
  const sections: Record<string, ContentItem[]> = {};
  content.forEach((item) => {
    const section = item.section || "other";
    if (!sections[section]) sections[section] = [];
    sections[section].push(item);
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Edit the text and content displayed on the website. Changes take effect immediately.
      </p>

      {Object.entries(sections).map(([section, items]) => (
        <div key={section} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">
              {sectionLabels[section] || section}
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {item.label || item.key}
                    </label>
                    <p className="text-xs text-gray-400 mb-2">{item.key}</p>
                    {item.type === "text" && item.value.length > 100 ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => updateLocal(item.id, e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                      />
                    ) : item.type === "image" ? (
                      <div className="space-y-2">
                        {item.value && (
                          <img src={item.value} alt="" className="h-16 rounded-lg border border-gray-100" />
                        )}
                        <input
                          value={item.value}
                          onChange={(e) => updateLocal(item.id, e.target.value)}
                          placeholder="Image URL"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    ) : (
                      <input
                        value={item.value}
                        onChange={(e) => updateLocal(item.id, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => saveItem(item)}
                    disabled={saving[item.id]}
                    className={`mt-6 p-2 rounded-lg text-sm transition-colors ${
                      saved[item.id]
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                    }`}
                  >
                    {saved[item.id] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
