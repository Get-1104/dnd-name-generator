import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Elf Name Generator for D&D | Fantasy Character Names",
  description: "Generate elegant elf names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/elf",
});

export default function ElfPage() {
  const title = "Elf Name Generator";
  const description = "Generate elegant elven names for D&D characters and NPCs.";
  const path = "/elf";

  const faq = [
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
  ];

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <JsonLd data={jsonLd} />

      {/* Top intro */}
      <header className="space-y-3">
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

        <p className="text-zinc-700 leading-7">
          Use this elf name generator to quickly create elegant, melodic names for
          elves in D&amp;D. Whether you&apos;re naming a new player character,
          improvising an NPC, or drafting ancient family lineages, generate a
          shortlist and tweak spelling or syllables to match your setting’s tone.
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

      {/* Generator */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <NameGenerator
            hideHeader
            title={title}
            description={description}
            parts={{
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
        </div>

        <p className="text-xs text-zinc-500">
          Tip: For elf names, try softer consonants, flowing syllables, and a
          nature-themed surname.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Learn elf naming rules</h2>
        <p className="text-zinc-700 leading-7">
          Want names that feel consistent with your world’s lore? Use these guides
          to learn common elf naming patterns, family-name styles, and practical
          tips for creating names your table will actually use.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/guides/elf-naming-conventions"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Elf Naming Conventions (Guide)
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
        hrefs={["/dwarf", "/tiefling", "/dragonborn", "/eastern"]}
        title="Try related name generators"
        note="Tip: If you like an elf first name, try pairing it with a sturdier dwarf-style surname—or the reverse—for mixed-heritage characters."
      />

      {/* Visible FAQ (optional but good) */}
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
        <Link className="underline" href="/dwarf">
          Dwarf
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
    </main>
  );
}