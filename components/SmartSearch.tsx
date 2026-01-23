"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_ITEMS, POPULAR_ITEMS, type SearchItem } from "@/lib/searchIndex";
import { appendSearchLog } from "@/lib/searchAnalytics";

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function scoreItem(q: string, item: SearchItem) {
  const query = normalize(q);
  if (!query) return 0;

  const title = normalize(item.title);
  const desc = normalize(item.description ?? "");
  const keywords = (item.keywords ?? []).map(normalize);

  if (title.startsWith(query)) return 100;
  if (title.includes(query)) return 80;
  if (normalize(item.href).includes(query)) return 70;

  for (const k of keywords) {
    if (k === query) return 75;
    if (k.startsWith(query)) return 68;
    if (k.includes(query)) return 60;
  }

  if (desc.includes(query)) return 45;

  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    let hit = 0;
    for (const t of tokens) {
      if (title.includes(t)) hit += 1;
      else if (desc.includes(t)) hit += 0.5;
      else if (keywords.some((k) => k.includes(t))) hit += 0.75;
    }
    if (hit > 0) return 30 + hit * 10;
  }

  return 0;
}

function highlight(text: string, q: string) {
  const query = normalize(q);
  if (!query) return text;

  const idx = normalize(text).indexOf(query);
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const mid = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <span className="font-semibold text-zinc-900">{mid}</span>
      {after}
    </>
  );
}

export default function SmartSearch() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ 必须在组件内部
  const lastOpenAtRef = useRef(0);

  // ✅ 清洗 query：太短就记空
  const cleanedQuery = value.trim();
  const qForLog = cleanedQuery.length >= 2 ? cleanedQuery : "";

  const results = useMemo(() => {
    const q = value.trim();
    if (!q) return POPULAR_ITEMS.slice(0, 8);

    return SEARCH_ITEMS.map((item) => ({ item, score: scoreItem(q, item) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.item);
  }, [value]);

  // Reset active item when the box opens or the query changes.
  // Do it in event handlers (instead of an effect) to satisfy strict hook lint rules.

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function logOpen(q: string) {
    const now = Date.now();
    if (now - lastOpenAtRef.current < 800) return;
    lastOpenAtRef.current = now;

    const qq = q.trim();
    appendSearchLog({
      type: "search_open",
      ts: now,
      query: qq.length >= 2 ? qq : "",
    });
  }

  function logSelect(item: SearchItem, position: number, method: "click" | "enter") {
    appendSearchLog({
      type: "search_select",
      ts: Date.now(),
      query: qForLog,
      href: item.href,
      title: item.title,
      itemType: item.type,
      position,
      method,
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      logOpen(value);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = results[active];
      if (target) {
        logSelect(target, active + 1, "enter");
        window.location.href = target.href;
      }
    }
  }

  const show = open && results.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-zinc-500">🔎</span>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => {
            setOpen(true);
            setActive(0);
            logOpen(value);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search generators or guides…"
          className="w-full bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400"
          aria-label="Search generators and guides"
        />

        {value.length > 0 && (
          <button
            type="button"
            className="text-sm text-zinc-500 hover:text-zinc-700"
            onClick={() => {
              setValue("");
              setOpen(true);
              setActive(0);
              inputRef.current?.focus();
              logOpen("");
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {show && (
        <div className="absolute z-[9999] mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-2 text-xs text-zinc-500">
            {value.trim()
              ? "Suggestions (↑↓ to navigate, Enter to open)"
              : "Popular (↑↓ to navigate, Enter to open)"}
          </div>

          <ul className="max-h-80 overflow-auto">
            {results.map((r, idx) => {
              const isActive = idx === active;

              return (
                <li key={`${r.type}:${r.href}`}>
                  <Link
                    href={r.href}
                    className={[
                      "block px-4 py-3 transition",
                      isActive ? "bg-zinc-50" : "bg-white",
                      "hover:bg-zinc-50",
                    ].join(" ")}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => {
                      logSelect(r, idx + 1, "click");
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-zinc-900">
                        {value.trim() ? highlight(r.title, value) : r.title}
                      </div>
                      <span className="shrink-0 rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600">
                        {r.type === "guide" ? "Guide" : "Generator"}
                      </span>
                    </div>

                    {r.description && (
                      <div className="mt-1 text-xs text-zinc-600 line-clamp-2">
                        {r.description}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-500">
            Tip: try a race (e.g. elf, dwarf) or a topic (e.g. naming conventions).
          </div>
        </div>
      )}
    </div>
  );
}
