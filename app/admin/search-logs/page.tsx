"use client";

import { useEffect, useMemo, useState } from "react";
import type { SearchLogEvent } from "@/lib/searchAnalytics";
import { getTopQueries, readSearchLogs } from "@/lib/searchAnalytics";
import { TOOLS } from "@/lib/tools";
import {
  buildExistingPathSet,
  buildOpportunities,
} from "@/lib/searchOpportunities";

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function SearchLogsAdminPage() {
  const [logs, setLogs] = useState<SearchLogEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    setError(null);
    try {
      const parsed = readSearchLogs();
      setLogs(Array.isArray(parsed) ? parsed : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to read local logs");
      setLogs([]);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const topQueries = useMemo(() => {
    try {
      return getTopQueries(20);
    } catch {
      return [];
    }
  }, [logs]);

  const selects = useMemo(
    () => logs.filter((x) => x.type === "search_select").length,
    [logs]
  );
  const opens = useMemo(
    () => logs.filter((x) => x.type === "search_open").length,
    [logs]
  );

  function exportJson() {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search-logs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearLogs() {
    if (!confirm("Clear all search logs? This cannot be undone.")) return;
    window.localStorage.removeItem("dndng_search_logs_v1");
    setLogs([]);
  }

  /**
   * =========
   * Opportunities (Missing Queries)
   * =========
   * existingPaths:
   * - generators: from TOOLS
   * - guides: collected from logs (safe fallback)
   *
   * 如果你后续有全量 guide 列表（比如 GUIDES 或 SEARCH_INDEX），
   * 把 guidePaths 换成那个数组即可（会更准确）。
   */
  const opportunities = useMemo(() => {
    try {
      // ✅ 先把 select 事件抽出来（类型缩窄，后面用 href/title/itemType 不会报错）
      const selected = logs.filter(
        (e): e is Extract<SearchLogEvent, { type: "search_select" }> =>
          e.type === "search_select"
      );

      // 已有 generators（最准确）
      const generatorPaths = (TOOLS ?? [])
        .map((t: any) => t?.href)
        .filter(Boolean);

      // 已有 guides：从 select 日志里收集（安全 fallback）
      const guidePaths = selected
        .filter((e) => e.itemType === "guide")
        .map((e) => e.href)
        .filter(Boolean);

      const existingPaths = buildExistingPathSet({
        generatorPaths,
        guidePaths,
      });

      // 把 SearchLogEvent 映射成 buildOpportunities 需要的结构
      const events = logs.map((e) => {
        if (e.type === "search_open") {
          return {
            type: "search_open" as const,
            ts: e.ts,
            query: e.query,
          };
        }

        // e.type === "search_select"
        return {
          type: "search_select" as const,
          ts: e.ts,
          query: e.canonicalQuery || e.query, // ✅ 用 canonical 归并过的 query 更稳定
          targetLabel: e.title,
          targetHref: e.href,
          position: e.position,
          method: e.method,
        };
      });

      return buildOpportunities({
        events,
        existingPaths,
      }).slice(0, 50);
    } catch {
      return [];
    }
  }, [logs]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Search Logs (Local)
        </h1>
        <p className="text-zinc-700 leading-7">
          Reads from{" "}
          <code className="rounded bg-zinc-100 px-1">dndng_search_logs_v1</code>{" "}
          in this browser&apos;s localStorage. This page is not linked anywhere
          and should be treated as a private debug view.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:shadow"
            onClick={reload}
          >
            Reload
          </button>
          <button
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:shadow"
            onClick={exportJson}
            disabled={logs.length === 0}
          >
            Export JSON
          </button>
          <button
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm text-red-700 shadow-sm hover:shadow"
            onClick={clearLogs}
            disabled={logs.length === 0}
          >
            Clear
          </button>
        </div>

        <div className="text-sm text-zinc-600 pt-2">
          Events:{" "}
          <span className="font-medium text-zinc-900">{logs.length}</span> ·
          Opens: <span className="font-medium text-zinc-900">{opens}</span> ·
          Selects: <span className="font-medium text-zinc-900">{selects}</span>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </header>

      {/* Top queries */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Top queries (by selects)</h2>
        {topQueries.length === 0 ? (
          <p className="text-zinc-600">
            No data yet. Use the search on /en first.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Canonical query
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Selects</th>
                </tr>
              </thead>
              <tbody>
                {topQueries.map((x) => (
                  <tr key={x.query} className="border-t border-zinc-100">
                    <td className="px-4 py-3">{x.query}</td>
                    <td className="px-4 py-3">{x.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-zinc-500">
          Note: This table uses <code>canonicalQuery</code> (merged/normalized).
        </p>
      </section>

      {/* Opportunities */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Opportunities (Missing queries)
        </h2>

        {opportunities.length === 0 ? (
          <p className="text-zinc-600">
            No opportunities found yet. Try searching for something your site
            doesn&apos;t have (e.g. “half elf”, “gnome clan names”), select a
            result, then Reload.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Query</th>
                  <th className="px-4 py-3 text-left font-medium">Selects</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Suggested path
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Confidence</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((x) => (
                  <tr
                    key={`${x.query}:${x.suggestedPath}`}
                    className="border-t border-zinc-100"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-zinc-900">{x.query}</span>
                    </td>
                    <td className="px-4 py-3">{x.count}</td>
                    <td className="px-4 py-3">{x.suggestedType}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-zinc-100 px-2 py-1 text-xs">
                        {x.suggestedPath}
                      </code>
                    </td>
                    <td className="px-4 py-3">{x.confidence}</td>
                    <td className="px-4 py-3 text-zinc-700">{x.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500">
              Showing up to 50 opportunities. Generators are checked against{" "}
              <code>TOOLS</code>. Guides are currently checked from
              previously-selected guide hrefs (logs).
            </div>
          </div>
        )}
      </section>

      {/* Recent events */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent events</h2>

        {logs.length === 0 ? (
          <p className="text-zinc-600">
            No logs found in this browser. Go to <code>/en</code>, use the
            SmartSearch, then come back and hit Reload.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Raw query</th>
                  <th className="px-4 py-3 text-left font-medium">Canonical</th>
                  <th className="px-4 py-3 text-left font-medium">Target</th>
                  <th className="px-4 py-3 text-left font-medium">Meta</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 200).map((e, idx) => {
                  const rawQ =
                    e.query || <span className="text-zinc-400">(empty)</span>;
                  const canonQ =
                    e.canonicalQuery ? (
                      e.canonicalQuery
                    ) : (
                      <span className="text-zinc-400">—</span>
                    );

                  if (e.type === "search_open") {
                    return (
                      <tr
                        key={`open:${e.ts}:${idx}`}
                        className="border-t border-zinc-100"
                      >
                        <td className="px-4 py-3">{formatTime(e.ts)}</td>
                        <td className="px-4 py-3">open</td>
                        <td className="px-4 py-3">{rawQ}</td>
                        <td className="px-4 py-3">{canonQ}</td>
                        <td className="px-4 py-3 text-zinc-400">—</td>
                        <td className="px-4 py-3 text-zinc-400">—</td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={`sel:${e.ts}:${idx}`}
                      className="border-t border-zinc-100"
                    >
                      <td className="px-4 py-3">{formatTime(e.ts)}</td>
                      <td className="px-4 py-3">select</td>
                      <td className="px-4 py-3">{rawQ}</td>
                      <td className="px-4 py-3">{canonQ}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900">{e.title}</div>
                        <div className="text-xs text-zinc-600">{e.href}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {e.itemType} · pos {e.position} · {e.method}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500">
              Showing up to 200 most recent events.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
