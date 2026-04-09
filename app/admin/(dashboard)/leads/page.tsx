"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { ChevronDown, X } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  island: string | null;
  message: string | null;
  brands_interested: string[] | null;
  status: string;
  email_opted_in: boolean;
  source: string | null;
  notes: string | null;
  created_at: string;
}

const statuses = ["new", "contacted", "quoted", "converted", "lost"];
const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-yellow-50 text-yellow-700",
  quoted: "bg-purple-50 text-purple-700",
  converted: "bg-green-50 text-green-700",
  lost: "bg-gray-100 text-gray-500",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState("all");

  const supabase = createSupabaseBrowser();

  const load = useCallback(async () => {
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (filter !== "all") {
      query = query.eq("status", filter);
    }
    const { data } = await query;
    setLeads(data || []);
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (selected?.id === id) {
      setSelected((s) => (s ? { ...s, status } : null));
    }
    load();
  }

  async function updateNotes(id: string, notes: string) {
    await supabase.from("leads").update({ notes, updated_at: new Date().toISOString() }).eq("id", id);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({leads.length})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500">Lead</th>
              <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Island</th>
              <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-400">
                    {lead.business_name && `${lead.business_name} · `}
                    {lead.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                  {lead.island || "—"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[lead.status] || statusColors.new}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="text-center text-gray-400 py-12 text-sm">No leads found.</p>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{selected.name}</h3>
            {selected.business_name && (
              <p className="text-sm text-gray-500 mb-4">{selected.business_name}</p>
            )}

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <a href={`mailto:${selected.email}`} className="text-primary-600">{selected.email}</a>
              </div>
              {selected.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <a href={`tel:${selected.phone}`} className="text-primary-600">{selected.phone}</a>
                </div>
              )}
              {selected.island && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Island</span>
                  <span className="text-gray-900">{selected.island}</span>
                </div>
              )}
              {selected.brands_interested && selected.brands_interested.length > 0 && (
                <div>
                  <span className="text-gray-500 block mb-1">Brands Interested</span>
                  <div className="flex flex-wrap gap-1">
                    {selected.brands_interested.map((b) => (
                      <span key={b} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selected.message && (
                <div>
                  <span className="text-gray-500 block mb-1">Message</span>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">{selected.message}</p>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Newsletter</span>
                <span className="text-gray-900">{selected.email_opted_in ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Source</span>
                <span className="text-gray-900">{selected.source || "website"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">{new Date(selected.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                defaultValue={selected.notes || ""}
                onBlur={(e) => updateNotes(selected.id, e.target.value)}
                rows={3}
                placeholder="Add internal notes about this lead..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
