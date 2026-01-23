export type GuideLink = {
  href: string;
  title: string;
  description: string;
  tags?: string[];
};

/**
 * Single Source of Truth (SSOT) for all Guide pages.
 *
 * - Used by /guides hub page
 * - Used by sitemap generation
 *
 * When adding a new guide, add it here only.
 */
export const GUIDES: GuideLink[] = [
  {
    href: "/guides/dnd-name-generator-guide",
    title: "D&D Name Generator Guide",
    description:
      "How to use name generators effectively for characters, NPCs, and campaign prep.",
    tags: ["guide", "dnd", "basics"],
  },
  {
    href: "/guides/how-to-name-a-dnd-character",
    title: "How to Name a D&D Character",
    description:
      "A practical framework for naming characters: theme, culture, sound, and readability.",
    tags: ["guide", "character", "naming"],
  },
  {
    href: "/guides/elf-naming-conventions",
    title: "Elf Naming Conventions in D&D",
    description:
      "Learn common elf naming patterns, sounds, and cultural conventions to create believable elven names.",
    tags: ["elf", "conventions", "guide"],
  },
  {
    href: "/guides/dwarf-clan-names-and-traditions",
    title: "Dwarf Clan Names and Traditions",
    description:
      "How dwarf clan names work, common themes, and how to create strong dwarf surnames for D&D.",
    tags: ["dwarf", "clan", "guide"],
  },
  {
    href: "/guides/dragonborn-naming-conventions",
    title: "Dragonborn Naming Conventions in D&D",
    description:
      "How dragonborn names work, including clan names, traditions, and roleplay-friendly tips.",
    tags: ["dragonborn", "conventions", "guide"],
  },
];

export const GUIDE_PATHS = GUIDES.map((g) => g.href);
