import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function DragonbornPage() {
  const title = "Dragonborn Name Generator";
  const description =
    "Generate powerful dragonborn names for D&D characters and NPCs.";
  const path = "/dragonborn";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a dragonborn name generator?",
        a: "A dragonborn name generator creates strong, draconic fantasy-style names you can use for dragonborn characters in D&D, including PCs and NPCs.",
      },
      {
        q: "How do I use this dragonborn name generator?",
        a: "Click Generate to create a fresh list of names, then use Copy to copy the results into your character sheet or notes.",
      },
      {
        q: "What kind of names does this generator make?",
        a: "It combines bold syllables with clan-style surnames inspired by draconic themes, creating names that feel powerful and heroic.",
      },
      {
        q: "Are these dragonborn names official D&D canon?",
        a: "No. These names are randomly generated for inspiration and are not official D&D names.",
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
          first: ["Arj", "Bal", "Dar", "Fen", "Gor", "Har", "Jar", "Kor", "Mor", "Vor"],
          second: ["han", "rax", "dun", "mir", "thor", "vyr", "zhan", "drak", "gor", "mir"],
          lastA: [
            "Flame",
            "Scale",
            "Storm",
            "Iron",
            "Sky",
            "Ember",
            "Stone",
            "Frost",
            "Thunder",
            "Gold",
          ],
          lastB: [
            "fang",
            "claw",
            "heart",
            "wing",
            "spire",
            "breath",
            "shield",
            "binder",
            "song",
            "hide",
          ],
        }}
        initialCount={10}
        examples={[
          "Arjhan Flamefang",
          "Darthor Stormclaw",
          "Kormir Ironscale",
          "Vordrak Thunderwing",
          "Fenmir Goldbreath",
        ]}
      />
    </>
  );
}
