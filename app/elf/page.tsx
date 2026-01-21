import Link from "next/link";
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

      {/* ✅ 可见 Intro + 内链（Day 2 核心） */}
      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        {/* ✅ Back（放在 Intro 顶部，替代 NameGenerator 里被 hideHeader 隐藏的 Back） */}
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-zinc-700 leading-7">
            Use this {title.toLowerCase()} to quickly create elegant, melodic names for elves in
            D&amp;D. Whether you&apos;re naming a new player character, improvising an NPC, or
            drafting ancient family lineages, generate a shortlist and tweak spelling or syllables
            to match your setting’s tone.
          </p>
          <p className="text-zinc-700 leading-7">
            Looking for more options? Browse the full{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            collection, or try a different ancestry like{" "}
            <Link href="/dwarf" className="underline underline-offset-4">
              dwarf names
            </Link>{" "}
            or{" "}
            <Link href="/tiefling" className="underline underline-offset-4">
              tiefling names
            </Link>
            .
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — sturdy, clan-based names for warriors and smiths.
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
              — strong draconic names inspired by honor and lineage.
            </li>
          </ul>
        </div>
      </section>

      <NameGenerator
        hideHeader
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
