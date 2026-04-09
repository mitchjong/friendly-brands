"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Package, Users, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Stats {
  brands: number;
  customers: number;
  leads: number;
  newLeads: number;
}

interface Lead {
  id: string;
  name: string;
  business_name: string;
  email: string;
  island: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ brands: 0, customers: 0, leads: 0, newLeads: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowser();

      const [brandsRes, customersRes, leadsRes, newLeadsRes, recentRes] =
        await Promise.all([
          supabase.from("brands").select("id", { count: "exact", head: true }),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("leads").select("id", { count: "exact", head: true }),
          supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
        ]);

      setStats({
        brands: brandsRes.count || 0,
        customers: customersRes.count || 0,
        leads: leadsRes.count || 0,
        newLeads: newLeadsRes.count || 0,
      });
      setRecentLeads(recentRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Brands", value: stats.brands, icon: Package, href: "/admin/brands", color: "bg-blue-50 text-blue-600" },
    { label: "Customers", value: stats.customers, icon: Users, href: "/admin/customers", color: "bg-green-50 text-green-600" },
    { label: "Total Leads", value: stats.leads, icon: FileText, href: "/admin/leads", color: "bg-purple-50 text-purple-600" },
    { label: "New Leads", value: stats.newLeads, icon: TrendingUp, href: "/admin/leads", color: "bg-orange-50 text-orange-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-gray-500 px-5 py-8 text-center">
            No leads yet. They&apos;ll appear here when someone submits the contact form.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">
                    {lead.business_name && `${lead.business_name} · `}
                    {lead.island || lead.email}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    lead.status === "new"
                      ? "bg-blue-50 text-blue-700"
                      : lead.status === "contacted"
                      ? "bg-yellow-50 text-yellow-700"
                      : lead.status === "converted"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
