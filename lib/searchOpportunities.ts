// lib/searchOpportunities.ts

type SearchEvent =
  | {
      type: "search_open";
      ts: number;
      query?: string;
    }
  | {
      type: "search_select";
      ts: number;
      query: string;
      targetLabel?: string;
      targetHref?: string;
      position?: number;
      method?: "click" | "enter";
    };

export type Opportunity = {
  query: string;
  count: number;
  suggestedType: "generator" | "guide";
  suggestedPath: string;
  confidence: "high" | "medium" | "low";
  reason: string;
};

type Confidence = "high" | "medium" | "low";

type Suggestion = {
  suggestedType: "generator" | "guide";
  suggestedPath: string;
  confidence: Confidence;
  reason: string;
};

/** 统一 query：小写、空格归一、去标点（保留连字符） */
function normalizeQuery(q: string) {
  return (q || "")
    .trim()
    .toLowerCase()
    .replace(/[`"'’“”,.，/\\(){}\[\]:;!?]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 统一 path：确保是 /xxx 形式（忽略绝对 url） */
function normalizePath(p: string) {
  const s = (p || "").trim();
  if (!s) return "";
  // 如果是绝对 URL，只取 pathname
  if (s.startsWith("http://") || s.startsWith("https://")) {
    try {
      const u = new URL(s);
      return u.pathname || "";
    } catch {
      return "";
    }
  }
  return s.startsWith("/") ? s : `/${s}`;
}

/**
 * 站内“已有页面”的路径集合
 * - generators: /elf /dwarf ...
 * - guides: /guides/xxx ...
 */
export function buildExistingPathSet(input: {
  generatorPaths: string[];
  guidePaths: string[];
}) {
  const set = new Set<string>();

  for (const raw of [...(input.generatorPaths || []), ...(input.guidePaths || [])]) {
    const p = normalizePath(raw);
    if (p) set.add(p);
  }

  return set;
}

/**
 * 从搜索事件里提取：被选择的 query 统计
 */
export function extractTopQueries(events: SearchEvent[]) {
  const counter = new Map<string, number>();

  for (const e of events) {
    if (e.type !== "search_select") continue;
    const q = normalizeQuery(e.query || "");
    if (!q) continue;
    counter.set(q, (counter.get(q) || 0) + 1);
  }

  return Array.from(counter.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 核心：给 query 做“是否已有页面”判断 + 给出新增建议
 */
export function buildOpportunities(args: {
  events: SearchEvent[];
  existingPaths: Set<string>;
  raceToGeneratorSlug?: Record<string, string>;
}) {
  const { events, existingPaths } = args;

  // ✅ 默认 race 映射（按你站点现状）
  const defaultRaceMap: Record<string, string> = {
    elf: "/elf",
    dwarf: "/dwarf",
    dragonborn: "/dragonborn",
    tiefling: "/tiefling",
    halfling: "/halfling",
    gnome: "/gnome",
    orc: "/orc",
    goblin: "/goblin",
    human: "/human",
    "half elf": "/half-elf",
    "half-elf": "/half-elf",
    "half orc": "/half-orc",
    "half-orc": "/half-orc",

    // 东方：你现在是 /eastern
    xianxia: "/eastern",
    wuxia: "/eastern",
    "chinese fantasy": "/eastern",
    eastern: "/eastern",
  };

  const finalRaceMap = {
    ...defaultRaceMap,
    ...(args.raceToGeneratorSlug || {}),
  };

  const top = extractTopQueries(events);

  const opportunities: Opportunity[] = [];

  for (const item of top) {
    const q = item.query;

    // 1) 覆盖判断（已存在就跳过）
    const alreadyCovered = isQueryCoveredByExisting(q, existingPaths, finalRaceMap);
    if (alreadyCovered) continue;

    // 2) 建议
    const suggestion = suggestFromQuery(q, finalRaceMap);

    // 3) 建议路径如果已存在，也跳过
    if (existingPaths.has(normalizePath(suggestion.suggestedPath))) continue;

    opportunities.push({
      query: q,
      count: item.count,
      ...suggestion,
    });
  }

  return opportunities.sort((a, b) => b.count - a.count);
}

/** query 是否已被现有页面覆盖（更稳的粗略规则） */
function isQueryCoveredByExisting(
  qRaw: string,
  existingPaths: Set<string>,
  raceMap: Record<string, string>
) {
  const q = normalizeQuery(qRaw);
  if (!q) return true;

  // ① 如果 query 命中某 race 关键词，且对应 generator 存在 → 覆盖
  for (const race of Object.keys(raceMap)) {
    if (!race) continue;
    if (q.includes(race)) {
      const p = normalizePath(raceMap[race]);
      if (p && existingPaths.has(p)) return true;
    }
  }

  // ② 如果 query 很像是在搜某个已存在 slug（更宽松：token 包含）
  //    例如已有 /guides/how-to-name-a-dnd-character
  //    query: "how to name a dnd character" / "how to name dnd character"
  const qTokens = new Set(q.split(" ").filter(Boolean));

  for (const p of existingPaths) {
    const slug = (p.split("/").filter(Boolean).pop() || "").trim();
    if (!slug) continue;

    const slugTokens = slug.replace(/-/g, " ").split(" ").filter(Boolean);
    if (slugTokens.length === 0) continue;

    // 只要 slug 里大部分 token 出现在 query 里，就认为覆盖
    let hit = 0;
    for (const t of slugTokens) if (qTokens.has(t)) hit++;
    if (hit >= Math.max(2, Math.ceil(slugTokens.length * 0.6))) return true;
  }

  return false;
}

/** 给 query 做类型和路径建议（偏保守：建议你真的会去建的页） */
function suggestFromQuery(qRaw: string, raceMap: Record<string, string>): Suggestion {
  const q = normalizeQuery(qRaw);

  const hasHowTo = /\bhow to\b/.test(q);
  const hasConvention =
    /\b(convention|conventions|naming|naming rules|rules|tradition|traditions)\b/.test(q);
  const hasLastName = /\b(last name|surname|family name|clan)\b/.test(q);
  const hasGeneratorIntent = /\b(generator|name generator|random name|generate)\b/.test(q);

  // race 匹配（先匹配更长的 key，避免 half elf 被 elf 抢走）
  const raceKeys = Object.keys(raceMap).sort((a, b) => b.length - a.length);
  let matchedRace: string | null = null;
  for (const race of raceKeys) {
    if (race && q.includes(race)) {
      matchedRace = race;
      break;
    }
  }

  // ✅ Guide 意图（教程/规则/姓氏/家族/传统）
  if (hasHowTo || hasConvention || hasLastName) {
    // 我们建议一个“你能直接创建的 guide slug”，不假装你已有模板页
    const suggestedPath = `/guides/${slugify(q)}`;
    return {
      suggestedType: "guide",
      suggestedPath,
      confidence: matchedRace ? "high" : "medium",
      reason: `包含教程/规则类意图（${pickReasonWord(q)}），更适合用 Guide 承接并做内容覆盖。`,
    };
  }

  // ✅ Generator 意图：若匹配到 race
  if (matchedRace) {
    const gen = normalizePath(raceMap[matchedRace]);
    return {
      suggestedType: "generator",
      suggestedPath: gen || `/${slugifyRace(matchedRace)}`,
      confidence: hasGeneratorIntent ? "high" : "medium",
      reason: `包含种族/主题词（${matchedRace}），优先补齐对应 Generator 更能承接“想要名字”的需求。`,
    };
  }

  // ✅ 都不明确：默认 Guide（更稳）
  return {
    suggestedType: "guide",
    suggestedPath: `/guides/${slugify(q)}`,
    confidence: "low",
    reason: "意图不够明确，先用 Guide 承接并观察后续搜索与点击行为。",
  };
}

function pickReasonWord(q: string) {
  const candidates = ["how to", "convention", "naming", "rules", "tradition", "last name", "clan"];
  return candidates.find((w) => q.includes(w)) || "规则/教程";
}

function slugifyRace(race: string) {
  return normalizeQuery(race).replace(/\s+/g, "-");
}

function slugify(s: string) {
  return normalizeQuery(s)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
