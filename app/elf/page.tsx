import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function ElfPage() {
  const title = "Elf Name Generator";
  const description = "Generate elegant elven names for D&D characters and NPCs.";
  const path = "/elf";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is an elf name generator?",
        a: "An elf name generator creates fantasy elven-style names you can use for D&D characters, NPCs, and stories.",
      },
      {
        q: "How do I use this elf name generator?",
        a: "Click Generate to create a fresh list of elf names, then use Copy to copy your favorites for your character sheet or notes.",
      },
      {
        q: "Can I customize the elf names?",
        a: "Yes. Use the generated names as a base and tweak spelling, syllables, or add a surname to match your setting and character background.",
      },
      {
        q: "Are these names official D&D names?",
        a: "They are randomly generated fantasy-style names. They are intended for inspiration and are not official D&D canon.",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <NameGenerator
        title={title}
        description={description}
        parts={{
          first: ["Ae", "Eli", "Lia", "Syl", "Fa", "Tha", "Ari", "Ili", "Ely", "Nae"],
          second: ["rin", "lith", "syl", "vyr", "thas", "riel", "nor", "wen", "lian", "mir"],
          lastA: ["Moon", "Star", "Silver", "Dawn", "Night", "Sun", "Leaf", "Wind", "Mist", "Song"],
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
          ],
        }}
        initialCount={10}
        examples={[
          "Aerin Moonwhisper",
          "Elywen Starbloom",
          "Sylmir Silverweaver",
          "Thariel Dawnrunner",
          "Ilinor Nightshade",
        ]}
      />
    </>
  );
}
