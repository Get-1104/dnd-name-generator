export type SearchLogEvent =
  | {
      type: "search_open";
      ts: number;
      query: string;
      /** 归并后的 query（用于统计） */
      canonicalQuery?: string;
    }
  | {
      type: "search_select";
      ts: number;
      query: string;
      /** 归并后的 query（用于统计） */
      canonicalQuery?: string;

      href: string;
      title: string;
      itemType: "guide" | "generator";
      position: number; // 第几个结果（从1开始）
      method: "click" | "enter";
    };

const KEY = "dndng_search_logs_v1";
const MAX_DEFAULT = 300;

/**
 * =========
 * Query 归并（canonicalize）
 * =========
 * 目标：把各种写法统一成同一类 query，便于统计：
 * - 大小写/多空格/标点 → 统一
 * - 去掉噪声词（name, generator, dnd 等）
 * - 常见别名（elven -> elf, draconic -> dragonborn, xianxia/wuxia -> eastern）
 */
export function canonicalizeQuery(input: string): string {
  if (!input) return "";

  let q = input
    .toLowerCase()
    .trim()
    // 常见标点当空格
    .replace(/[`"'’“”,.，/\\(){}\[\]:;!?]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!q) return "";

  // 整句别名（用户可能直接搜这些）
  const aliasWhole: Record<string, string> = {
    "d&d": "dnd",
    "d and d": "dnd",
    "dungeons and dragons": "dnd",
    "dungeons dragons": "dnd",
    "xianxia": "eastern",
    "wuxia": "eastern",
    "chinese": "eastern",
    "asian fantasy": "eastern",
  };
  if (aliasWhole[q]) q = aliasWhole[q];

  // token 级别别名
  const aliasToken: Record<string, string> = {
    elven: "elf",
    elves: "elf",
    dwarven: "dwarf",
    dwarves: "dwarf",
    orcs: "orc",
    goblins: "goblin",
    tieflings: "tiefling",
    halflings: "halfling",
    draconic: "dragonborn",
    dragon: "dragonborn",
    dragonborns: "dragonborn",
    "d&d": "dnd",
  };

  // 噪声词：不参与统计
  const STOP = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "with",
    "is",
    "are",
    "how",
    "what",
    "best",
    "free",
    // 站内噪声
    "name",
    "names",
    "generator",
    "generators",
    "tool",
    "tools",
    // 语境词（太泛）
    "dnd",
    "dungeons",
    "dragons",
    "dungeon",
  ]);

  const tokens = q
    .split(" ")
    .filter(Boolean)
    .map((t) => aliasToken[t] ?? t)
    .filter((t) => !STOP.has(t));

  const joined = tokens.join(" ").trim();
  if (!joined) return "";

  // 太短的输入不计入统计（避免 “e” 这种污染）
  if (joined.length < 2) return "";

  // 短语归并（可按你站继续加）
  const aliasPhrase: Record<string, string> = {
    "elf naming": "elf conventions",
    "elf name": "elf",
    "dwarf clan": "dwarf clan",
    "dwarf surname": "dwarf clan",
    "dragonborn name": "dragonborn",
    "tiefling name": "tiefling",
  };

  return aliasPhrase[joined] ?? joined;
}

function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export function readSearchLogs(): SearchLogEvent[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  return safeParse<SearchLogEvent[]>(raw) ?? [];
}

export function writeSearchLogs(logs: SearchLogEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(logs));
}

/**
 * ✅ 写入时补 canonicalQuery
 * - 这样 admin 页 / 导出 / 统计都统一
 */
export function appendSearchLog(evt: SearchLogEvent, max = MAX_DEFAULT) {
  if (typeof window === "undefined") return;

  const logs = readSearchLogs();
  const canonicalQuery = canonicalizeQuery(evt.query);

  logs.unshift({
    ...evt,
    canonicalQuery,
  });

  if (logs.length > max) logs.length = max;
  writeSearchLogs(logs);
}

/** 统计：top queries（按选择次数）——使用 canonicalQuery 归并 */
export function getTopQueries(limit = 20) {
  const logs = readSearchLogs();
  const counts = new Map<string, number>();

  for (const e of logs) {
    if (e.type !== "search_select") continue;

    const q = (e.canonicalQuery ?? canonicalizeQuery(e.query)).trim();
    if (!q) continue;

    counts.set(q, (counts.get(q) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([query, count]) => ({ query, count }));
}
