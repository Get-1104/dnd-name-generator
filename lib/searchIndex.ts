// lib/searchIndex.ts
import { TOOLS } from "@/lib/tools";

export type SearchItem = {
  type: "generator" | "guide";
  href: string;
  title: string;
  description?: string;
  keywords?: string[];
};

/**
 * ✅ 手动维护 Guide 列表（和 app/sitemap.ts 里的 GUIDE_PATHS 对齐）
 * 新增 guide 时：两边都加
 */
const GUIDE_ITEMS: SearchItem[] = [
  {
    type: "guide",
    href: "/guides/dnd-name-generator-guide",
    title: "What Is a D&D Name Generator? (Complete Guide)",
    description:
      "Learn what a D&D name generator is, how it works, and how to use it with examples and FAQs.",
    keywords: ["dnd name generator guide", "what is", "examples", "faq"],
  },
  {
    type: "guide",
    href: "/guides/how-to-name-a-dnd-character",
    title: "How to Name a D&D Character (7 Proven Methods)",
    description:
      "7 practical naming methods with examples and ready-to-copy formulas.",
    keywords: [
      "how to name a dnd character",
      "naming tips",
      "character name",
      "examples",
    ],
  },
  {
    type: "guide",
    href: "/guides/elf-naming-conventions",
    title: "Elf Naming Conventions (Guide)",
    description:
      "Naming patterns, traditions, and examples for elf names in fantasy and D&D.",
    keywords: ["elf naming", "naming conventions", "elf names", "traditions"],
  },
  {
    type: "guide",
    href: "/guides/dwarf-clan-names-and-traditions",
    title: "Dwarf Clan Names & Traditions (Guide)",
    description:
      "How dwarf surnames and clan naming traditions work, with examples you can copy.",
    keywords: ["dwarf clan", "dwarf surname", "clan names", "traditions"],
  },
];

function dedupe(arr: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of arr) {
    const v = String(raw ?? "").trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

/**
 * ✅ 从 TOOLS 生成 generator items
 * 并对 /eastern 做关键词增强（只影响搜索，不影响 /en 页面展示）
 */
function buildGeneratorItems(): SearchItem[] {
  const items: SearchItem[] = (TOOLS ?? [])
    .filter((t) => t?.href && t.href !== "/guides")
    .map((t) => ({
      type: "generator" as const,
      href: t.href,
      title: t.title,
      description: t.description,
      keywords: dedupe([
        ...(t.tags ?? []),
        t.title,
        t.description ?? "",
        t.href,
      ]),
    }));

  // ✅ Eastern：让 /en 能搜到 xianxia / wuxia 等英文词
  const eastern = items.find((x) => x.href === "/eastern");
  if (eastern) {
    const extra = [
      // English
      "xianxia",
      "wuxia",
      "xianxia name generator",
      "wuxia name generator",
      "chinese fantasy name generator",
      "chinese name generator",
      "eastern fantasy name generator",
      "martial arts name generator",
      "cultivation name generator",
      "jianghu name",
      "sect name generator",
      "generation character",
      "sect generation character",
      "epithet",
      "title",
      // Chinese
      "仙侠",
      "武侠",
      "国风",
      "古风",
      "江湖",
      "门派",
      "宗门",
      "辈分字",
      "称号",
      "封号",
      "道号",
      "修仙",
    ];

    eastern.keywords = dedupe([...(eastern.keywords ?? []), ...extra]);
  }

  return items;
}

export const SEARCH_ITEMS: SearchItem[] = [
  ...buildGeneratorItems(),
  ...GUIDE_ITEMS,
];

/**
 * ✅ POPULAR：只放“主流 D&D 英文入口常用项”
 * 这里不放 /eastern，避免你担心的“故意引导”
 */
export const POPULAR_ITEMS: SearchItem[] = [
  pickGenerator("/elf"),
  pickGenerator("/dwarf"),
  pickGenerator("/tiefling"),
  pickGenerator("/dragonborn"),
  pickGenerator("/human"),
  pickGenerator("/orc"),
  pickGenerator("/goblin"),
  pickGenerator("/halfling"),
  pickGuide("/guides/how-to-name-a-dnd-character"),
  pickGuide("/guides/dnd-name-generator-guide"),
].filter(Boolean) as SearchItem[];

function pickGenerator(href: string) {
  return SEARCH_ITEMS.find((x) => x.type === "generator" && x.href === href);
}

function pickGuide(href: string) {
  return SEARCH_ITEMS.find((x) => x.type === "guide" && x.href === href);
}
