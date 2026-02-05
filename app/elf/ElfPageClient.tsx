"use client";

import GeneratorTemplatePage from "@/components/GeneratorTemplatePage";

export default function ElfPageClient() {
  const title = "Elf Name Generator";
  const description = "Generate elegant elven names for D&D characters and NPCs.";
  const path = "/elf";

  const faq = [
    {
      q: "What is an elf name generator?",
      a: "An elf name generator creates lore-friendly elven names for D&D characters and NPCs.",
    },
    {
      q: "Can I generate elf names with surnames?",
      a: "Yes. You can include a surname or enter a custom surname in Advanced options.",
    },
    {
      q: "How do I get more variety?",
      a: "Open Advanced options and select fewer tags for broader mixing, or reset to defaults.",
    },
  ];

  return (
    <GeneratorTemplatePage
      race="elf"
      title={title}
      description={description}
      path={path}
      faq={faq}
      nameGenerator={{
        hideHeader: true,
        parts: {
          first: ["Ae", "Eli", "Lia", "Syl", "Fa", "Tha", "Ari", "Ili", "Ely", "Nae"],
          										second: [
          											"rin",
          											"lith",
          											"syl",
          											"vyr",
          											"thas",
          											"riel",
          											"nor",
          											"wen",
          											"lian",
          											"mir",
          										],
          										lastA: [
          											"Moon",
          											"Star",
          											"Silver",
          											"Dawn",
          											"Night",
          											"Sun",
          											"Leaf",
          											"Wind",
          											"Mist",
          											"Song",
          										],
          										lastB: [
          											"whisper",
          											"bloom",
          											"runner",
          											"shade",
          											"weaver",
          											"song",
          											"glade",
          											"dancer",
          											"brook",
          											"watcher",
          										]
        },
        initialCount: 10,
      }}
    />
  );
}
