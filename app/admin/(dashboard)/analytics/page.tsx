"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import {
  Eye,
  MessageCircle,
  FileText,
  MousePointerClick,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

interface EventCount {
  event: string;
  count: number;
}

interface TopPage {
  page: string;
  count: number;
}

interface RecentEvent {
  id: string;
  event: string;
  page: string;
  meta: string | null;
  created_at: string;
}

const eventLabels: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  page_view: { label: "Page Views", icon: Eye, color: "bg-blue-50 text-blue-600" },
  whatsapp_click: { label: "WhatsApp Clicks", icon: MessageCircle, color: "bg-green-50 text-green-600" },
  catalog_download: { label: "Catalog Downloads", icon: FileText, color: "bg-purple-50 text-purple-600" },
  exit_intent_shown: { label: "Exit Popups Shown", icon: MousePointerClick, color: "bg-orange-50 text-orange-600" },
  quote_request: { label: "Quote Requests", icon: TrendingUp, color: "bg-primary-50 text-primary-600" },
};

export default function AnalyticsPage() {
  const [totals, setTotals] = useState<EventCount[]>([]);
  const [todayTotals, setTodayTotals] = useState<EventCount[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [recent, setRecent] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "all">("7d");

  const supabase = createSupabaseBrowser();

  const load = useCallback(async () => {
    setLoading(true);

    // Calculate date range
    let fromDate: string | null = null;
    const now = new Date();
    if (period === "today") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (period === "7d") {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (period === "30d") {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    // Get all events in period
    let query = supabase.from("analytics_events").select("event, page, meta, created_at, id");
    if (fromDate) {
      query = query.gte("created_at", fromDate);
    }
    const { data: events } = await query.order("created_at", { ascending: false }).limit(1000);

    if (events) {
      // Count by event type
      const counts: Record<string, number> = {};
      const pageCounts: Record<string, number> = {};

      events.forEach((e: RecentEvent) => {
        counts[e.event] = (counts[e.event] || 0) + 1;
        if (e.event === "page_view" && e.page) {
          pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
        }
      });

      setTotals(Object.entries(counts).map(([event, count]) => ({ event, count })));
      setTopPages(
        Object.entries(pageCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([page, count]) => ({ page, count }))
      );
      setRecent(events.slice(0, 20));
    }

    // Today's totals for comparison
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const { data: todayEvents } = await supabase
      .from("analytics_events")
      .select("event")
      .gte("created_at", todayStart);

    if (todayEvents) {
      const todayCounts: Record<string, number> = {};
      todayEvents.forEach((e: { event: string }) => {
        todayCounts[e.event] = (todayCounts[e.event] || 0) + 1;
      });
      setTodayTotals(Object.entries(todayCounts).map(([event, count]) => ({ event, count })));
    }

    setLoading(false);
  }, [supabase, period]);

  useEffect(() => {
    load();
  }, [load]);

  function getCount(event: string, source: EventCount[] = totals) {
    return source.find((t) => t.event === event)?.count || 0;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Website Analytics</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["today", "7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p === "today" ? "Today" : p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(eventLabels).map(([event, config]) => (
          <div
            key={event}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${config.color}`}>
              <config.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {getCount(event)}
            </div>
            <div className="text-xs text-gray-500">{config.label}</div>
            {period !== "today" && (
              <div className="text-xs text-green-600 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {getCount(event, todayTotals)} today
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Top Pages</h3>
          </div>
          {topPages.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-8 text-center">No page views yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {topPages.map((page) => (
                <div key={page.page} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-mono">{page.page}</span>
                  <span className="text-sm font-semibold text-gray-900">{page.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-8 text-center">No activity yet.</p>
          ) : (
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {recent.map((event) => {
                const config = eventLabels[event.event];
                return (
                  <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${config?.color || "bg-gray-50 text-gray-400"}`}>
                      {config ? <config.icon className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 truncate">
                        {config?.label || event.event}
                        {event.page && (
                          <span className="text-gray-400 ml-1">{event.page}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* GA4 Link */}
      <div className="bg-gray-50 rounded-xl p-5 text-center">
        <p className="text-sm text-gray-600">
          For detailed traffic analytics, connect{" "}
          <strong>Google Analytics 4</strong> by adding your GA ID to the{" "}
          <code className="bg-gray-200 px-1 rounded text-xs">.env.local</code>{" "}
          file. The built-in analytics above track key conversion events.
        </p>
      </div>
    </div>
  );
}
