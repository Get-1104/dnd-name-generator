import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function TieflingPage() {
  const title = "Tiefling Name Generator";
  const description = "Generate infernal tiefling names for D&D characters and NPCs.";
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

      {/* ✅ Visible Intro + internal links */}
      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

          <p className="text-zinc-700 leading-7">
            Use this tiefling name generator to create dark, infernal names for tieflings in
            D&amp;D. Tiefling names often reflect fiendish heritage, personal rebellion, or
            ominous symbolism rather than traditional family lines. Generate multiple options,
            then tweak spelling or tone to fit your character’s backstory.
          </p>

          <p className="text-zinc-700 leading-7">
            Want to compare naming styles? Explore the full{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            collection, or try a different ancestry like{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf names
            </Link>{" "}
            or{" "}
            <Link href="/dwarf" className="underline underline-offset-4">
              dwarf names
            </Link>
            .
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/dragonborn" className="underline underline-offset-4">
                Dragonborn Name Generator
              </Link>{" "}
              — powerful draconic names inspired by honor and lineage.
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
          first: ["Az", "Bel", "Mal", "Zar", "Vor", "Xan", "Lil", "Rak", "Sar", "Kor"],
          second: ["reth", "zeth", "morn", "vash", "riel", "thrax", "gorn", "zair", "lek", "mos"],
          lastA: ["Ash", "Dark", "Hell", "Blood", "Shadow", "Flame", "Void", "Night", "Inferno", "Dread"],
          lastB: ["born", "brand", "caller", "spawn", "binder", "flame", "whisper", "reaver", "fiend", "mark"],
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
