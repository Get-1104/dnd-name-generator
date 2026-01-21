import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function DwarfPage() {
  const title = "Dwarf Name Generator";
  const description = "Generate sturdy dwarf names for D&D characters and NPCs.";
  const path = "/dwarf";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a dwarf name generator?",
        a: "A dwarf name generator creates fantasy dwarf-style names you can use for D&D characters, NPCs, and stories.",
      },
      {
        q: "How do I use this dwarf name generator?",
        a: "Click Generate to create a fresh list of dwarf names, then use Copy to copy your favorites for your character sheet or notes.",
      },
      {
        q: "Can I customize the dwarf names?",
        a: "Yes. Use the generated names as a base and tweak spelling, syllables, or swap parts to fit your setting and character background.",
      },
      {
        q: "Are these names official D&D names?",
        a: "They are randomly generated fantasy-style names for inspiration and are not official D&D canon.",
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
          first: ["Bor", "Dur", "Thra", "Kaz", "Mor", "Gim", "Bram", "Rurik", "Hildi", "Dagna"],
          second: ["in", "ar", "grim", "dor", "li", "rak", "bek", "mund", "gran", "drum"],
          lastA: ["Iron", "Stone", "Forge", "Gold", "Deep", "Steel", "Oak", "Granite", "Battle", "Rune"],
          lastB: ["beard", "hammer", "shield", "delve", "fist", "anvil", "brow", "brand", "heart", "axe"],
        }}
        initialCount={10}
        examples={[
          "Borin Ironbeard",
          "Durgrim Stonehammer",
          "Thrak Goldfist",
          "Kazdor Deepdelve",
          "Morli Forgebeard",
        ]}
        // 中文按钮想用就打开：
        // generateLabel="生成"
        // copyLabel="复制"
      />
    </>
  );
}
