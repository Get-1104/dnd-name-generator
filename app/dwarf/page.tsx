import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Suspense } from "react";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import { getRelatedGeneratorHrefs } from "@/lib/related";
import NamingRules from "@/components/NamingRules";

import ClassGenderControls from "@/components/ClassGenderControls";
export const metadata = createPageMetadata({
  title: "Dwarf Name Generator for D&D | Fantasy Character Names",
  description: "Generate sturdy dwarf names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/dwarf",
});

export default function DwarfPage() {
  const title = "Dwarf Name Generator";
  const description = "Generate sturdy dwarf names for D&D characters and NPCs.";
  const path = "/dwarf";

  

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
const faq = [
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
  ];

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq,
  });

  return (
    <div className="space-y-10">
      <JsonLd data={jsonLd} />

      {/* Top intro */}
      <header className="space-y-3">
        <Suspense fallback={<div className="h-4" />}>
          <ClassGenderControls />
        </Suspense>

        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

        <p className="text-zinc-700 leading-7">
          Use this dwarf name generator to create strong, sturdy names for dwarves
          in D&amp;D. Dwarf names often reflect clan heritage, craftsmanship, and a
          deep connection to stone, forge, and tradition. Generate a shortlist for
          player characters, NPCs, or entire family lineages, then adjust syllables
          to match your campaign’s culture.
        </p>

        <p className="text-zinc-700 leading-7">
          You can explore all available tools on the{" "}
          <Link href="/" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          page, or compare styles with the more melodic{" "}
          <Link href="/elf" className="underline underline-offset-4">
            elf name generator
          </Link>
          .
        </p>
      </header>

      {/* Naming rules */}
      <NamingRules race="dwarf" />

      {/* Generator */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <Suspense fallback={<div className="h-40" />}>
          <NameGenerator
            hideHeader
            title={title}
            description={description}
            parts={{
              first: ["Bor", "Dur", "Thra", "Kaz", "Mor", "Gim", "Bram", "Rurik", "Hildi", "Dagna"],
              second: ["in", "ar", "grim", "dor", "li", "rak", "bek", "mund", "gran", "drum"],
              lastA: [
                "Iron",
                "Stone",
                "Forge",
                "Gold",
                "Deep",
                "Steel",
                "Oak",
                "Granite",
                "Battle",
                "Rune",
              ],
              lastB: [
                "beard",
                "hammer",
                "shield",
                "delve",
                "fist",
                "anvil",
                "brow",
                "brand",
                "heart",
                "axe",
              ],
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
          </Suspense>
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Dwarf names feel “right” when you keep the given name short and punchy,
          then use a clan-style surname tied to craft, stone, or war.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Learn dwarf naming rules</h2>
        <p className="text-zinc-700 leading-7">
          Want clan names and traditions that feel consistent at the table? These guides
          explain dwarf naming patterns and give practical tips for building believable
          surnames and titles.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/guides/dwarf-clan-names-and-traditions"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Dwarf Clan Names &amp; Traditions (Guide)
          </Link>
          <Link
            href="/guides/how-to-name-a-dnd-character"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            How to Name a D&amp;D Character (Guide)
          </Link>
          <Link
            href="/guides/dnd-name-generator-guide"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            What Is a D&amp;D Name Generator? (Guide)
          </Link>
        </div>
      </section>

      {/* ✅ Related generators (统一组件) */}
      <RelatedGenerators
        hrefs={relatedHrefs}
        title="Try related name generators"
        note="Tip: Pair a sturdy dwarf surname with a softer elf given name for mixed-heritage characters—or do the reverse for contrast."
        extraLinks={[{ href: "/guides/dwarf-clan-names-and-traditions", title: "Dwarf clan names & traditions (guide)", description: "How dwarf surnames and clan names work in D&D." }]}
      />

      {/* Visible FAQ */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <div className="space-y-3">
          {faq.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="font-medium">{f.q}</div>
              <p className="text-zinc-700 leading-7 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-2 text-sm text-zinc-600">
        Explore more:{" "}
        <Link className="underline" href="/elf">
          Elf
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/tiefling">
          Tiefling
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/dragonborn">
          Dragonborn
        </Link>
      </footer>
    </div>
  );
}