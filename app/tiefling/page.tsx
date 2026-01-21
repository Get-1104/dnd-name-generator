import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function TieflingPage() {
  const title = "Tiefling Name Generator";
  const description =
    "Generate infernal tiefling names for D&D characters and NPCs.";
  const path = "/tiefling";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a tiefling name generator?",
        a: "A tiefling name generator creates infernal fantasy-style names suitable for tiefling characters in D&D, including players and NPCs.",
      },
      {
        q: "How do I use this tiefling name generator?",
        a: "Click Generate to create a new list of tiefling names. Use the Copy button to copy any name for your character sheet or notes.",
      },
      {
        q: "What kind of names does this generator create?",
        a: "It generates dark, infernal, and exotic-sounding names inspired by fiendish and abyssal themes common to tieflings.",
      },
      {
        q: "Are these tiefling names official D&D canon?",
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
          first: ["Az", "Bel", "Mal", "Zar", "Vor", "Xan", "Lil", "Rak", "Sar", "Kor"],
          second: ["reth", "zeth", "morn", "vash", "riel", "thrax", "gorn", "zair", "lek", "mos"],
          lastA: [
            "Ash",
            "Dark",
            "Hell",
            "Blood",
            "Shadow",
            "Flame",
            "Void",
            "Night",
            "Inferno",
            "Dread",
          ],
          lastB: [
            "born",
            "brand",
            "caller",
            "spawn",
            "binder",
            "flame",
            "whisper",
            "reaver",
            "fiend",
            "mark",
          ],
        }}
        initialCount={10}
        examples={[
          "Azreth Hellborn",
          "Belzair Shadowflame",
          "Malvash Bloodcaller",
          "Zareth Nightwhisper",
          "Xanmos Dreadspawn",
        ]}
      />
    </>
  );
}
