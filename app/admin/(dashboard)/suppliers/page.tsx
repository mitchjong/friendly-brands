"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Plus, Pencil, Trash2, Upload, X, Package } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  supplier_id: string | null;
}

interface Supplier {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  catalog_url: string | null;
  logo_url: string | null;
  active: boolean;
  sort_order: number;
  brands?: Brand[];
}

const emptySupplier = {
  name: "",
  slug: "",
  description: "",
  catalog_url: "",
  logo_url: "",
  active: true,
  sort_order: 0,
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptySupplier);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const supabase = createSupabaseBrowser();

  const load = useCallback(async () => {
    const [suppliersRes, brandsRes] = await Promise.all([
      supabase.from("suppliers").select("*").order("sort_order"),
      supabase.from("brands").select("id, name, slug, supplier_id").order("sort_order"),
    ]);
    const suppliersData = (suppliersRes.data || []) as Supplier[];
    const brandsData = (brandsRes.data || []) as Brand[];
    setBrands(brandsData);

    // Attach brands to suppliers
    setSuppliers(
      suppliersData.map((s) => ({
        ...s,
        brands: brandsData.filter((b) => b.supplier_id === s.id),
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function openNew() {
    setEditing(null);
    setForm(emptySupplier);
    setModalOpen(true);
  }

  function openEdit(supplier: Supplier) {
    setEditing(supplier);
    setForm({
      name: supplier.name,
      slug: supplier.slug,
      description: supplier.description || "",
      catalog_url: supplier.catalog_url || "",
      logo_url: supplier.logo_url || "",
      active: supplier.active,
      sort_order: supplier.sort_order,
    });
    setModalOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "catalog_url") {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `suppliers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((f) => ({ ...f, [field]: data.publicUrl }));
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const data = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      catalog_url: form.catalog_url || null,
      logo_url: form.logo_url || null,
      active: form.active,
      sort_order: form.sort_order,
    };

    if (editing) {
      await supabase.from("suppliers").update(data).eq("id", editing.id);
    } else {
      await supabase.from("suppliers").insert(data);
    }

    setModalOpen(false);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this supplier? Brands will be unlinked but not deleted.")) return;
    // Unlink brands first
    await supabase.from("brands").update({ supplier_id: null }).eq("supplier_id", id);
    await supabase.from("suppliers").delete().eq("id", id);
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{suppliers.length} suppliers</p>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      <div className="space-y-4">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {supplier.logo_url ? (
                  <img src={supplier.logo_url} alt={supplier.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                    {supplier.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-xs text-gray-400">/{supplier.slug} · {supplier.brands?.length || 0} brands</p>
                </div>
                {!supplier.active && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(supplier)} className="p-2 text-gray-400 hover:text-primary-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Brands in this supplier */}
            {supplier.brands && supplier.brands.length > 0 && (
              <div className="border-t border-gray-50 px-5 py-3 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {supplier.brands.map((brand) => (
                    <span key={brand.id} className="inline-flex items-center gap-1 bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                      <Package className="w-3 h-3 text-gray-400" />
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Unlinked brands warning */}
            {(!supplier.brands || supplier.brands.length === 0) && (
              <div className="border-t border-gray-50 px-5 py-3 bg-yellow-50">
                <p className="text-xs text-yellow-700">No brands assigned. Go to Brands to link them to this supplier.</p>
              </div>
            )}
          </div>
        ))}

        {/* Unassigned brands */}
        {brands.filter((b) => !b.supplier_id).length > 0 && (
          <div className="bg-yellow-50 rounded-xl border border-yellow-100 px-5 py-4">
            <h3 className="font-semibold text-yellow-800 text-sm mb-2">Unassigned Brands</h3>
            <p className="text-xs text-yellow-700 mb-2">These brands are not linked to any supplier. Edit them in the Brands page to assign a supplier.</p>
            <div className="flex flex-wrap gap-2">
              {brands.filter((b) => !b.supplier_id).map((brand) => (
                <span key={brand.id} className="bg-white text-yellow-800 text-xs px-2.5 py-1 rounded-full border border-yellow-200">
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {suppliers.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">No suppliers yet. Click &quot;Add Supplier&quot; to get started.</p>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? "Edit Supplier" : "Add Supplier"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: editing ? f.slug : generateSlug(e.target.value),
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                {form.logo_url && (
                  <div className="mb-2">
                    <img src={form.logo_url} alt="Logo" className="h-16 rounded-lg border border-gray-100" />
                  </div>
                )}
                <label className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "logo_url")} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catalog PDF</label>
                {form.catalog_url && (
                  <p className="text-xs text-green-600 mb-2 truncate">Uploaded: {form.catalog_url.split("/").pop()}</p>
                )}
                <label className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Catalog PDF"}
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleUpload(e, "catalog_url")} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving || !form.name}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Supplier" : "Add Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
