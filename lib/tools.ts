// lib/tools.ts
import type { ToolLink } from "@/components/HomeSearch";

/**
 * 站点工具入口（单一数据源）
 * 首页卡片 + 首页 ItemList（结构化数据）都从这里生成
 */
export const TOOLS: ToolLink[] = [
  {
    href: "/dwarf",
    title: "Dwarf Name Generator",
    description: "Generate sturdy dwarf names for D&D characters and NPCs.",
    tags: ["dnd", "dwarf", "fantasy"],
  },
  {
    href: "/elf",
    title: "Elf Name Generator",
    description: "Generate elegant elven names for D&D characters and NPCs.",
    tags: ["dnd", "elf", "fantasy"],
  },
  {
    href: "/tiefling",
    title: "Tiefling Name Generator",
    description: "Generate infernal tiefling names for D&D characters and NPCs.",
    tags: ["dnd", "tiefling", "fantasy"],
  },
  {
    href: "/dragonborn",
    title: "Dragonborn Name Generator",
    description: "Generate powerful dragonborn names for D&D characters and NPCs.",
    tags: ["dnd", "dragonborn", "fantasy"],
  },

  // ✅ New pages (fast expansion, still human-looking)
  {
    href: "/orc",
    title: "Orc Name Generator",
    description: "Generate fierce orc names for D&D characters and NPCs.",
    tags: ["dnd", "orc", "fantasy"],
  },
  {
    href: "/human",
    title: "Human Name Generator",
    description: "Generate flexible human names for D&D characters and NPCs.",
    tags: ["dnd", "human", "fantasy"],
  },
  {
    href: "/gnome",
    title: "Gnome Name Generator",
    description: "Generate clever gnome names for D&D characters and NPCs.",
    tags: ["dnd", "gnome", "fantasy"],
  },
  {
    href: "/angel",
    title: "Angel Name Generator",
    description: "Generate celestial angel names for D&D campaigns and fantasy worlds.",
    tags: ["dnd", "angel", "celestial", "fantasy"],
  },
  {
    href: "/demon",
    title: "Demon Name Generator",
    description: "Generate sinister demon names for D&D villains and dark fantasy settings.",
    tags: ["dnd", "demon", "fiend", "fantasy"],
  },

  {
    href: "/eastern",
    title: "东方国风名字生成器",
    description: "生成仙侠/武侠/古风风格的中文名字灵感（拼音/可改汉字）。",
    tags: ["东方", "国风", "仙侠", "武侠", "xianxia", "wuxia"],
  },
];
