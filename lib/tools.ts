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
    href: "/half-elf",
    title: "Half-Elf Name Generator",
    description:
      "Generate memorable half-elf names for D&D characters and NPCs by blending elven elegance with human simplicity.",
    tags: ["dnd", "half elf", "half-elf", "elf", "human", "fantasy"],
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

  // ✅ New pages
  {
    href: "/orc",
    title: "Orc Name Generator",
    description: "Generate fierce orc names for D&D characters and NPCs.",
    tags: ["dnd", "orc", "fantasy"],
  },
  {
    href: "/half-orc",
    title: "Half-Orc Name Generator",
    description:
      "Generate tough half-orc names for D&D characters and NPCs. Mix human readability with orcish grit.",
    tags: ["dnd", "half orc", "half-orc", "orc", "human", "fantasy"],
  },
  {
    href: "/goblin",
    title: "Goblin Name Generator",
    description: "Generate mischievous goblin names for D&D characters and NPCs.",
    tags: ["dnd", "goblin", "fantasy"],
  },
  {
    href: "/halfling",
    title: "Halfling Name Generator",
    description: "Generate charming halfling names for D&D characters and NPCs.",
    tags: ["dnd", "halfling", "fantasy"],
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
    description:
      "Generate celestial angel names for D&D campaigns and fantasy worlds.",
    tags: ["dnd", "angel", "celestial", "fantasy"],
  },
  {
    href: "/demon",
    title: "Demon Name Generator",
    description:
      "Generate sinister demon names for D&D villains and dark fantasy settings.",
    tags: ["dnd", "demon", "fiend", "fantasy"],
  },

  {
    href: "/eastern",
    title: "东方国风名字生成器",
    // ✅ SEO 强化：描述里放英文关键词（OK）
    description:
      "生成仙侠/武侠/古风风格的中文名字灵感。Also supports xianxia / wuxia / chinese fantasy name generator searches.",
    // ✅ tags 只放“主题关键词”，别放过泛的意图词（避免 /en 看起来故意指向它）
    tags: [
      "东方",
      "国风",
      "仙侠",
      "武侠",
      "xianxia",
      "wuxia",
      "eastern fantasy",
      "chinese fantasy",
    ],
  },

  // Guides hub（保留在 TOOLS 里没问题；后面 /en 我们会单独展示/标注）
  {
    href: "/guides",
    title: "D&D Naming Guides",
    description:
      "Practical guides on naming conventions and character naming in D&D.",
    tags: ["guides", "guide", "naming", "dnd", "fantasy"],
  },
];
