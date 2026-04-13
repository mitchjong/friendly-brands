"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { ChevronDown, X, Plus, UserPlus, Trash2, Mail, Phone as PhoneIcon, Building } from "lucide-react";

interface Contact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Lead {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  island: string | null;
  address: string | null;
  country: string | null;
  message: string | null;
  brands_interested: string[] | null;
  contacts: Contact[] | null;
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

const emptyContact: Contact = { name: "", email: "", phone: "", role: "" };

const emptyLead = {
  name: "",
  business_name: "",
  email: "",
  phone: "",
  island: "",
  address: "",
  country: "",
  message: "",
  notes: "",
  source: "manual",
  status: "new",
  contacts: [] as Contact[],
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyLead);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  function openAdd() {
    setEditingId(null);
    setForm(emptyLead);
    setAddOpen(true);
  }

  function openEdit(lead: Lead) {
    setEditingId(lead.id);
    setForm({
      name: lead.name || "",
      business_name: lead.business_name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      island: lead.island || "",
      address: lead.address || "",
      country: lead.country || "",
      message: lead.message || "",
      notes: lead.notes || "",
      source: lead.source || "manual",
      status: lead.status || "new",
      contacts: lead.contacts || [],
    });
    setSelected(null);
    setAddOpen(true);
  }

  function addContact() {
    setForm((f) => ({ ...f, contacts: [...f.contacts, { ...emptyContact }] }));
  }

  function updateContact(index: number, field: keyof Contact, value: string) {
    setForm((f) => ({
      ...f,
      contacts: f.contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  }

  function removeContact(index: number) {
    setForm((f) => ({ ...f, contacts: f.contacts.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    const data = {
      name: form.name,
      business_name: form.business_name || null,
      email: form.email,
      phone: form.phone || null,
      island: form.island || null,
      address: form.address || null,
      country: form.country || null,
      message: form.message || null,
      notes: form.notes || null,
      source: form.source || "manual",
      status: form.status,
      contacts: form.contacts.length > 0 ? form.contacts : null,
    };

    let error;
    if (editingId) {
      const res = await supabase.from("leads").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("leads").insert(data);
      error = res.error;
    }

    if (error) {
      console.error("Save error:", error);
      alert(`Error saving lead: ${error.message}`);
      setSaving(false);
      return;
    }

    setAddOpen(false);
    setSaving(false);
    await load();
  }

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

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    setSelected(null);
    load();
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
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
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
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
              {selected.address && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="text-gray-900 text-right max-w-[60%]">{selected.address}</span>
                </div>
              )}
              {selected.country && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Country</span>
                  <span className="text-gray-900">{selected.country}</span>
                </div>
              )}

              {/* Contacts */}
              {selected.contacts && selected.contacts.length > 0 && (
                <div>
                  <span className="text-gray-500 block mb-2">Contacts</span>
                  <div className="space-y-2">
                    {selected.contacts.map((c, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-900 text-sm">{c.name} {c.role && <span className="text-gray-400 font-normal">· {c.role}</span>}</p>
                        {c.email && <p className="text-xs text-primary-600">{c.email}</p>}
                        {c.phone && <p className="text-xs text-gray-500">{c.phone}</p>}
                      </div>
                    ))}
                  </div>
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
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                defaultValue={selected.notes || ""}
                onBlur={(e) => updateNotes(selected.id, e.target.value)}
                rows={3}
                placeholder="Add internal notes..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(selected)}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Edit Lead
              </button>
              <button
                onClick={() => deleteLead(selected.id)}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAddOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setAddOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? "Edit Lead" : "Add Lead"}
            </h3>

            <div className="space-y-4">
              {/* Company Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4" /> Company Info
                </h4>
                <input
                  value={form.business_name}
                  onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
                  placeholder="Company Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.island}
                    onChange={(e) => setForm((f) => ({ ...f, island: e.target.value }))}
                    placeholder="Island / Region"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <input
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    placeholder="Country"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              {/* Primary Contact */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Primary Contact</h4>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Contact Name *"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    type="email"
                    placeholder="Email *"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    type="tel"
                    placeholder="Phone"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              {/* Additional Contacts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Additional Contacts</h4>
                  <button
                    onClick={addContact}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add Contact
                  </button>
                </div>

                {form.contacts.length === 0 && (
                  <p className="text-xs text-gray-400 py-3 text-center">No additional contacts. Click &quot;Add Contact&quot; to add more people.</p>
                )}

                <div className="space-y-3">
                  {form.contacts.map((contact, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2 relative">
                      <button
                        onClick={() => removeContact(i)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={contact.name}
                          onChange={(e) => updateContact(i, "name", e.target.value)}
                          placeholder="Name"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <input
                          value={contact.role}
                          onChange={(e) => updateContact(i, "role", e.target.value)}
                          placeholder="Role (e.g. Buyer, Owner)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                          <input
                            value={contact.email}
                            onChange={(e) => updateContact(i, "email", e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                          />
                        </div>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                          <input
                            value={contact.phone}
                            onChange={(e) => updateContact(i, "phone", e.target.value)}
                            type="tel"
                            placeholder="Phone"
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    value={form.source}
                    onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                    placeholder="e.g. manual, referral, website"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  placeholder="Internal notes about this lead..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.email}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Lead" : "Add Lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
