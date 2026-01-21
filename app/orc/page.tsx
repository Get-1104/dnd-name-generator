import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function OrcPage() {
  const title = "Orc Name Generator";
  const description = "Generate fierce orc names for D&D characters and NPCs.";
  const path = "/orc";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is an orc name generator?",
        a: "An orc name generator creates fantasy orc-style names you can use for D&D characters, NPCs, and worldbuilding.",
      },
      {
        q: "How do I use this orc name generator?",
        a: "Click Generate to create a new list of orc names, then use Copy to paste your favorites into notes or character sheets.",
      },
      {
        q: "Can I use these names for NPC clans and tribes?",
        a: "Yes. You can quickly generate many names to populate clans, warbands, or tribes and then tweak them for consistency.",
      },
      {
        q: "Are these names official D&D names?",
        a: "No. They are original fantasy-style names designed for inspiration, not official D&D canon.",
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
            Orc characters are known for strength, ferocity, and raw presence in
            D&amp;D. Whether you&apos;re making a brutal warrior, a tribal
            chieftain, or an outcast seeking redemption, a strong orc name helps
            define your character from the start.
          </p>

          <p className="text-zinc-700 leading-7">
            Want more inspiration? Browse the full{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            collection, or try a different ancestry like{" "}
            <Link href="/human" className="underline underline-offset-4">
              human names
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
              <Link href="/human" className="underline underline-offset-4">
                Human Name Generator
              </Link>{" "}
              — flexible names for adventurers, townsfolk, and nobles.
            </li>
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
          first: ["Gor", "Mak", "Thr", "Urg", "Krag", "Brak", "Drog", "Zug", "Ruk", "Harg"],
          second: ["mok", "nash", "gash", "thok", "zug", "rak", "dun", "grim", "mokh", "gar"],
          lastA: ["Skull", "Iron", "Blood", "Bone", "War", "Stone", "Black", "Rage", "Ash", "Fang"],
          lastB: ["crusher", "tusk", "binder", "howl", "render", "breaker", "maw", "scar", "cleaver", "stalker"],
        }}
        initialCount={10}
        examples={[
          "Gornash Skullcrusher",
          "Urthok Ironbreaker",
          "Kragzug Bloodhowl",
          "Brakgrim Bonerender",
          "Zuggash Fangscar",
        ]}
      />
    </>
  );
}
