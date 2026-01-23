import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import { getRelatedGeneratorHrefs } from "@/lib/related";

export const metadata = createPageMetadata({
  title: "Orc Name Generator for D&D | Fantasy Character Names",
  description: "Generate fierce orc names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/orc",
});

export default function OrcPage() {
  const title = "Orc Name Generator";
  const description = "Generate fierce orc names for D&D characters and NPCs.";
  const path = "/orc";

  

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
const faq = [
    {
      q: "What is an orc name generator?",
      a: "An orc name generator creates strong, aggressive fantasy names you can use for orc characters and NPCs in D&D.",
    },
    {
      q: "How do I use this orc name generator?",
      a: "Click Generate to create a fresh list of orc names, then use Copy to copy your favorites for your character sheet or notes.",
    },
    {
      q: "What makes a name feel orc?",
      a: "Orc names often use harsh consonants, short syllables, and punchy endings. They should be easy to shout at the table and feel strong or intimidating.",
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
          Use this orc name generator to create fierce, punchy names for orc
          characters and NPCs in D&amp;D. Orc names often feel brutal and direct—
          perfect for warriors, raiders, clan leaders, and intimidating enemies.
          Generate a batch, keep a few favorites, then tweak spelling or add a
          clan-style surname to match your world.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more naming styles? Browse the full{" "}
          <Link href="/en" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or compare with{" "}
          <Link href="/goblin" className="underline underline-offset-4">
            goblin names
          </Link>{" "}
          and{" "}
          <Link href="/dwarf" className="underline underline-offset-4">
            dwarf names
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
              first: ["Gr", "Br", "Ur", "Thok", "Gor", "Mak", "Rag", "Dru", "Kru", "Zug"],
              second: ["ash", "ok", "ug", "nar", "mok", "ruk", "gash", "dush", "rag", "tor"],
              lastA: [
                "Blood",
                "Skull",
                "Iron",
                "War",
                "Bone",
                "Black",
                "Stone",
                "Rage",
                "Wolf",
                "Ash",
              ],
              lastB: [
                "fang",
                "crusher",
                "splitter",
                "breaker",
                "maw",
                "claw",
                "howl",
                "fist",
                "scar",
                "brand",
              ],
            }}
            initialCount={10}
            examples={[
              "Grash Bloodfang",
              "Brug Skullcrusher",
              "Thoknar Ironbreaker",
              "Gormok Rageclaw",
              "Zugtor Ashbrand",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Orc names usually work best with 1–3 strong syllables. Add a clan,
          title, or battle-earned nickname for leaders.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make orc names table-ready</h2>
        <p className="text-zinc-700 leading-7">
          Orc names are at their best when they’re quick to say, easy to remember,
          and consistent across a clan or warband. These guides help you build names
          that feel usable in real play.
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
        </div>
      </section>

      {/* ✅ Related generators */}
      <RelatedGenerators
        hrefs={relatedHrefs}
        title="Try related name generators"
        note="Tip: For orc warlords, try combining an orc given name with a dwarven-style ‘forge/stone’ surname to create a distinctive clan identity."
        extraLinks={[{ href: "/guides/how-to-name-a-dnd-character", title: "How to name a D&D character (guide)", description: "A practical framework you can use for any ancestry or concept." }]}
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
        <Link className="underline" href="/goblin">
          Goblin
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/dwarf">
          Dwarf
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/dragonborn">
          Dragonborn
        </Link>
      </footer>
    </main>
  );
}