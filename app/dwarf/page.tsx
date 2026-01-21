import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elf Name Generator for D&D | Fantasy Character Names",
  description:
    "Generate elegant elf names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
};

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

      {/* ✅ Visible Intro + internal links */}
      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        {/* ✅ Back (always to /en) */}
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

          <p className="text-zinc-700 leading-7">
            Use this dwarf name generator to create strong, sturdy names for dwarves in D&amp;D.
            Dwarf names often reflect clan heritage, craftsmanship, and a deep connection to stone,
            forge, and tradition. Generate a shortlist for player characters, NPCs, or entire
            family lineages, then adjust syllables to match your campaign’s culture.
          </p>

          <p className="text-zinc-700 leading-7">
            You can explore all available tools on the{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            page, or compare styles with the more melodic{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf name generator
            </Link>
            .
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — elegant, melodic names for ancient fantasy races.
            </li>
            <li>
              <Link href="/tiefling" className="underline underline-offset-4">
                Tiefling Name Generator
              </Link>{" "}
              — infernal-flavored names with a mysterious edge.
            </li>
            <li>
              <Link href="/dragonborn" className="underline underline-offset-4">
                Dragonborn Name Generator
              </Link>{" "}
              — powerful draconic names inspired by honor and lineage.
            </li>
            <li>
              <Link href="/eastern" className="underline underline-offset-4">
                Eastern Fantasy Name Generator
              </Link>{" "}
              — wuxia/xianxia-style Chinese name inspiration.
            </li>
          </ul>
        </div>
      </section>

      <NameGenerator
        hideHeader
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
      />
    </>
  );
}
