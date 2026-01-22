import { TOOLS } from "@/lib/tools";

export type SearchItemType = "generator" | "guide";

export type SearchItem = {
  type: SearchItemType;
  title: string;
  href: string;
  description?: string;
  keywords?: string[]; // 同义词 / 别名 / 前缀
};

// 把 "/dragonborn" -> "Dragonborn"
function humanizeFromHref(href: string) {
  const seg = href.replace(/^\/+/, "").split("/")[0] || "tool";
  return seg
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function toolTitle(t: any) {
  // 兼容你 TOOLS 里可能叫 title / name / label
  const base = t.title ?? t.name ?? t.label ?? humanizeFromHref(t.href);
  // 统一成 “X Name Generator”
  return /generator/i.test(base) ? base : `${base} Name Generator`;
}

export const GUIDE_ITEMS: SearchItem[] = [
  {
    type: "guide",
    title: "D&D Name Generator Guide",
    href: "/guides/dnd-name-generator-guide",
    description: "What it is, how it works, and how to use generators effectively.",
    keywords: ["guide", "what is", "how it works", "dnd name generator guide"],
  },
  {
    type: "guide",
    title: "How to Name a D&D Character",
    href: "/guides/how-to-name-a-dnd-character",
    description: "7 proven methods + examples and copy-paste formulas.",
    keywords: ["how to name", "character name", "naming tips", "formulas", "examples"],
  },
  {
    type: "guide",
    title: "Elf Naming Conventions in D&D",
    href: "/guides/elf-naming-conventions",
    description: "Rules, syllables, structures, surnames, titles + examples.",
    keywords: ["elf naming", "elf names", "conventions", "surnames", "titles", "elven"],
  },
  {
    type: "guide",
    title: "Dwarf Clan Names and Traditions",
    href: "/guides/dwarf-clan-names-and-traditions",
    description: "Clan surname rules, honor titles, strong sounds + examples.",
    keywords: ["dwarf clan", "dwarf surnames", "traditions", "forge", "stone", "iron"],
  },
];

export const GENERATOR_ITEMS: SearchItem[] = TOOLS.map((t: any) => ({
  type: "generator",
  title: toolTitle(t),
  href: t.href,
  description: t.description ?? undefined,
  keywords: [
    // 通用
    "name generator",
    "dnd name generator",
    // 从 href 派生前缀 / 别名
    humanizeFromHref(t.href).toLowerCase(),
    t.href.replace("/", ""),
  ].filter(Boolean),
}));

export const SEARCH_ITEMS: SearchItem[] = [
  // 优先 guides（更“解释型”）
  ...GUIDE_ITEMS,
  ...GENERATOR_ITEMS,
];

// -------------------------
// Popular items (query empty)
// -------------------------
const pick = (href: string) => SEARCH_ITEMS.find((x) => x.href === href);

export const POPULAR_ITEMS: SearchItem[] = [
  pick("/elf"),
  pick("/dwarf"),
  pick("/tiefling"),
  pick("/dragonborn"),
  pick("/goblin"),
  pick("/guides/how-to-name-a-dnd-character"),
  pick("/guides/dnd-name-generator-guide"),
  pick("/guides/elf-naming-conventions"),
  pick("/guides/dwarf-clan-names-and-traditions"),
].filter(Boolean) as SearchItem[];
