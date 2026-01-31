export type RaceDef = {
  slug: string;
  label: string;
  title: string;
  description: string;
};

export const RACES: RaceDef[] = [
  { slug: "human", label: "Human", title: "Human Name Generator", description: "Generate believable human names for D&D characters and NPCs." },
  { slug: "elf", label: "Elf", title: "Elf Name Generator", description: "Generate elegant elven names for D&D characters and NPCs." },
  { slug: "dwarf", label: "Dwarf", title: "Dwarf Name Generator", description: "Generate strong dwarf names for D&D characters and NPCs." },
  { slug: "halfling", label: "Halfling", title: "Halfling Name Generator", description: "Generate cheerful halfling names for D&D characters and NPCs." },
  { slug: "gnome", label: "Gnome", title: "Gnome Name Generator", description: "Generate clever gnome names for D&D characters and NPCs." },
  { slug: "dragonborn", label: "Dragonborn", title: "Dragonborn Name Generator", description: "Generate proud dragonborn names for D&D characters and NPCs." },
  { slug: "tiefling", label: "Tiefling", title: "Tiefling Name Generator", description: "Generate infernal tiefling names for D&D characters and NPCs." },
  { slug: "orc", label: "Orc", title: "Orc Name Generator", description: "Generate fierce orc names for D&D characters and NPCs." },

  { slug: "goblin", label: "Goblin", title: "Goblin Name Generator", description: "Generate tricky goblin names for D&D characters and NPCs." },
  { slug: "half-elf", label: "Half-Elf", title: "Half-Elf Name Generator", description: "Generate memorable half-elf names for D&D characters and NPCs." },
  { slug: "half-orc", label: "Half-Orc", title: "Half-Orc Name Generator", description: "Generate tough half-orc names for D&D characters and NPCs." },
  { slug: "aasimar", label: "Aasimar", title: "Aasimar Name Generator", description: "Generate celestial aasimar names for D&D characters and NPCs." },
  { slug: "goliath", label: "Goliath", title: "Goliath Name Generator", description: "Generate bold goliath names for D&D characters and NPCs." },
  { slug: "angel", label: "Angel", title: "Angel Name Generator", description: "Generate angelic names for D&D characters and NPCs." },
  { slug: "demon", label: "Demon", title: "Demon Name Generator", description: "Generate demonic names for D&D characters and NPCs." },
  { slug: "eastern", label: "Eastern", title: "Eastern Name Generator", description: "Generate eastern-inspired names for D&D characters and NPCs." },
];

export function getRaceBySlug(slug: string) {
  return RACES.find((r) => r.slug === slug);
}
