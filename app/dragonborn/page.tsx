import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function DragonbornPage() {
  const title = "Dragonborn Name Generator";
  const description = "Generate powerful dragonborn names for D&D characters and NPCs.";
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
            Use this dragonborn name generator to create bold, draconic names for dragonborn in
            D&amp;D. Dragonborn names often sound strong and rhythmic, and many characters use a
            clan-style surname that hints at their lineage, oath, or reputation. Generate several
            options, then tweak syllables to match your campaign’s tone.
          </p>

          <p className="text-zinc-700 leading-7">
            Want to compare naming styles? Explore the full{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            collection, or try a different ancestry like{" "}
            <Link href="/tiefling" className="underline underline-offset-4">
              tiefling names
            </Link>{" "}
            or{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf names
            </Link>
            .
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/tiefling" className="underline underline-offset-4">
                Tiefling Name Generator
              </Link>{" "}
              — infernal-flavored names with a mysterious edge.
            </li>
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — elegant, melodic names for ancient fantasy races.
            </li>
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — sturdy, clan-based names for warriors and smiths.
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
          first: ["Arj", "Bal", "Dar", "Fen", "Gor", "Har", "Jar", "Kor", "Mor", "Vor"],
          second: ["han", "rax", "dun", "mir", "thor", "vyr", "zhan", "drak", "gor", "sar"],
          lastA: ["Flame", "Scale", "Storm", "Iron", "Sky", "Ember", "Stone", "Frost", "Thunder", "Gold"],
          lastB: ["fang", "claw", "heart", "wing", "spire", "breath", "shield", "binder", "song", "hide"],
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
