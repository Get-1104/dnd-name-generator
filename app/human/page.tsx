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
  title: "Human Name Generator for D&D | Fantasy Character Names",
  description: "Generate flexible human names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/human",
});

export default function HumanPage() {
  const title = "Human Name Generator";
  const description = "Generate flexible human names for D&D characters and NPCs.";
  const path = "/human";

  

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
const faq = [
    {
      q: "What is a human name generator?",
      a: "A human name generator creates human-style names you can use for D&D characters, NPCs, townsfolk, and fantasy stories.",
    },
    {
      q: "How do I use this human name generator?",
      a: "Click Generate to create a fresh list of human names, then use Copy to copy your favorites for your character sheet or notes.",
    },
    {
      q: "How do I make human names feel like they belong in my setting?",
      a: "Pick a consistent naming vibe (short and punchy, medieval, or regional), then reuse a few recurring sounds or surname themes across your NPCs.",
    },
    {
      q: "Are these names official D&D names?",
      a: "They are randomly generated fantasy-style names intended for inspiration and are not official D&D canon content.",
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
          Use this human name generator to create believable names for D&amp;D
          characters and NPCs—perfect for guards, merchants, nobles, explorers,
          and everyday townsfolk. Human names are versatile, so the key is keeping
          your choices consistent with region, culture, and tone.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more styles? Browse the full{" "}
          <Link href="/" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or try ancestry flavors like{" "}
          <Link href="/elf" className="underline underline-offset-4">
            elf names
          </Link>{" "}
          and{" "}
          <Link href="/dwarf" className="underline underline-offset-4">
            dwarf names
          </Link>
          .
        </p>
      </header>

      {/* Naming rules */}
      <NamingRules race="human" />

      {/* Generator */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <Suspense fallback={<div className="h-40" />}>
          <NameGenerator
            hideHeader
            title={title}
            description={description}
            parts={{
              first: ["Al", "Mar", "Jon", "Ka", "El", "Ben", "Sar", "Ros", "Da", "Li"],
              second: ["en", "a", "ric", "ara", "ia", "ton", "win", "elle", "mund", "ssa"],
              lastA: [
                "Stone",
                "Raven",
                "Oak",
                "Hill",
                "River",
                "Ash",
                "Bright",
                "Wright",
                "Black",
                "Grey",
              ],
              lastB: [
                "ford",
                "wood",
                "field",
                "son",
                "maker",
                "water",
                "well",
                "hart",
                "more",
                "vale",
              ],
            }}
            initialCount={10}
            examples={[
              "Alen Stoneford",
              "Mara Ravenwood",
              "Jonric Hillson",
              "Kara Brightwell",
              "Elia Greyvale",
            ]}
          />
          </Suspense>
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Human names feel believable when you keep them readable and reuse
          a few consistent surname themes (places, crafts, animals, colors).
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make names easy at the table</h2>
        <p className="text-zinc-700 leading-7">
          Human names work best when they’re clear, memorable, and consistent with
          your world’s regions. These guides help you create names that players will
          actually say—and remember.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
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
          <Link
            href="/guides/elf-naming-conventions"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Elf Naming Conventions (Guide)
          </Link>
        </div>
      </section>

      {/* ✅ Related generators (统一组件) */}
      <RelatedGenerators
        hrefs={relatedHrefs}
        title="Try related name generators"
        note="Tip: For half-elf characters, try a human given name with an elven family name (or the reverse) to show mixed heritage."
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
        <Link className="underline" href="/half-elf">
          Half-Elf
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/elf">
          Elf
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/halfling">
          Halfling
        </Link>
      </footer>
    </div>
  );
}