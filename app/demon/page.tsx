import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function DemonPage() {
  const title = "Demon Name Generator";
  const description = "Generate sinister demon names for D&D villains and dark fantasy settings.";
  const path = "/demon";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a demon name generator?",
        a: "A demon name generator creates dark, fantasy-style names suitable for fiends, demon lords, and villains in D&D settings.",
      },
      {
        q: "How do I use this demon name generator?",
        a: "Click Generate to get a new list of demon names, then Copy your favorites for your notes, stat blocks, or story outlines.",
      },
      {
        q: "Can I customize demon names for my setting?",
        a: "Yes. Adjust spelling, add titles, or combine parts to match your world’s infernal hierarchy and tone.",
      },
      {
        q: "Are these names official or from existing lore?",
        a: "No. The names are original fantasy-style outputs intended for inspiration rather than official canon.",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            Demons embody chaos, corruption, and dark power in many fantasy worlds.
            From cunning manipulators to monstrous warlords, demonic characters
            benefit from names that feel threatening, unnatural, and memorable.
          </p>

          <p className="text-zinc-700 leading-7">
            Prefer something celestial instead? Try{" "}
            <Link href="/angel" className="underline underline-offset-4">
              angel names
            </Link>{" "}
            — or browse the{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            hub for more options.
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/angel" className="underline underline-offset-4">
                Angel Name Generator
              </Link>{" "}
              — celestial names for divine messengers and holy guardians.
            </li>
            <li>
              <Link href="/tiefling" className="underline underline-offset-4">
                Tiefling Name Generator
              </Link>{" "}
              — infernal-flavored names with a mysterious edge.
            </li>
            <li>
              <Link href="/orc" className="underline underline-offset-4">
                Orc Name Generator
              </Link>{" "}
              — harsh, powerful names for warbands and raiders.
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
          first: ["Mal", "Vor", "Zar", "Kha", "Bel", "Xel", "Ner", "Gor", "Sath", "Rav"],
          second: ["zeth", "gath", "mora", "thul", "rax", "vyr", "nox", "draz", "shar", "krim"],
          lastA: ["Night", "Void", "Blood", "Ash", "Dread", "Hell", "Shadow", "Grave", "Ruin", "Chaos"],
          lastB: ["caller", "binder", "reaper", "lord", "spawn", "stalker", "brand", "maw", "whisper", "blade"],
        }}
        initialCount={10}
        examples={[
          "Vorrax Nightcaller",
          "Zarmora Voidbinder",
          "Belthul Dreadreaper",
          "Xelnox Shadowwhisper",
          "Sathkrim Chaosblade",
        ]}
      />
    </>
  );
}
