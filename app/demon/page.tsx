import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import { getRelatedGeneratorHrefs } from "@/lib/related";

export const metadata = createPageMetadata({
  title: "Demon Name Generator for D&D | Dark Fantasy Names",
  description: "Generate sinister demon names for D&D villains, fiends, and dark fantasy settings. Fast, free, and easy to use.",
  path: "/demon",
});

export default function DemonPage() {
  const title = "Demon Name Generator";
  const description =
    "Generate sinister demon names for D&D villains and dark fantasy settings.";
  const path = "/demon";

  

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
const faq = [
    {
      q: "What is a demon name generator?",
      a: "A demon name generator creates dark, infernal-style names you can use for demon villains, fiends, cult leaders, and terrifying NPCs in D&D.",
    },
    {
      q: "How do I use this demon name generator?",
      a: "Click Generate to create a fresh list of demon names, then use Copy to copy your favorites for your campaign notes or villain roster.",
    },
    {
      q: "What makes a name feel demonic?",
      a: "Demonic names often use harsh consonants, ominous syllables, and dramatic endings. Adding titles like “the Devourer” or “Lord of Ash” can make a demon feel more legendary.",
    },
    {
      q: "Are these names official D&D names?",
      a: "They are randomly generated dark fantasy names intended for inspiration and are not official D&D canon content.",
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
          Use this demon name generator to create sinister names for D&amp;D villains,
          fiends, and dark fantasy threats. Demon names often sound ancient, harsh,
          and dangerous—perfect for bosses, warlords, corrupters, and cult patrons.
          Generate a shortlist, then refine spellings or add a title to match your
          campaign’s tone.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more fiendish styles? Compare with{" "}
          <Link href="/tiefling" className="underline underline-offset-4">
            tiefling names
          </Link>{" "}
          or celestial opposites like{" "}
          <Link href="/angel" className="underline underline-offset-4">
            angel names
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
              first: ["Az", "Bel", "Mor", "Xal", "Vor", "Zar", "Mal", "Ner", "Rak", "Sha"],
              second: ["goth", "zeb", "rath", "thul", "vex", "mora", "drak", "zhar", "gorn", "ziah"],
              lastA: ["Ash", "Blood", "Void", "Dread", "Hell", "Night", "Bone", "Ruin", "Shadow", "Flame"],
              lastB: ["lord", "binder", "reaper", "maw", "caller", "brand", "veil", "devourer", "wrath", "tongue"],
            }}
            initialCount={10}
            examples={[
              "Belzeb Ashlord",
              "Azrath Bloodreaper",
              "Xalthul Voidbinder",
              "Mordrak Shadowmaw",
              "Zarvex Flamecaller",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Demon names feel more legendary when you add a title: “the Devourer”,
          “Lord of Ash”, “the Unbroken”, or a domain like “of the Ninth Pit”.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make villain names memorable</h2>
        <p className="text-zinc-700 leading-7">
          A demon villain should be easy to say, easy to remember, and distinctive
          at the table. These guides help you craft names that stick—plus quick
          workflows to generate and refine.
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
        note="Tip: For cultists and lieutenants, use shorter names; reserve longer, title-heavy names for major demons and bosses."
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
        <Link className="underline" href="/tiefling">
          Tiefling
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/angel">
          Angel
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/orc">
          Orc
        </Link>
      </footer>
    </main>
  );
}