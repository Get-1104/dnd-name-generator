import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import { getRelatedGeneratorHrefs } from "@/lib/related";

export const metadata = createPageMetadata({
  title: "Goblin Name Generator for D&D | Fantasy Character Names",
  description: "Generate mischievous goblin names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/goblin",
});

export default function GoblinPage() {
  const title = "Goblin Name Generator";
  const description =
    "Generate mischievous goblin names for D&D characters and NPCs.";
  const path = "/goblin";

  

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
const faq = [
    {
      q: "What is a goblin name generator?",
      a: "A goblin name generator creates short, punchy fantasy names you can use for goblin characters, NPCs, and creatures in D&D.",
    },
    {
      q: "How do I use this goblin name generator?",
      a: "Click Generate to get a new list of goblin names. Use Copy to save your favorites for characters, enemies, or quick NPCs.",
    },
    {
      q: "What makes a name feel goblin?",
      a: "Goblin names are often sharp, short, and aggressive-sounding. They commonly use harsh consonants and simple syllables that are easy to shout at the table.",
    },
    {
      q: "Are these names official D&D names?",
      a: "They are randomly generated fantasy-style names for inspiration and are not official D&D canon content.",
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
          Use this goblin name generator to create short, punchy names for goblin
          characters and NPCs in D&amp;D. Goblin names often sound crude, sharp,
          and easy to yell during combat—perfect for raiders, sneaks, tinkers,
          and chaotic creatures. Generate a batch and keep a few ready for fast
          DM improvisation.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more naming styles? Browse the full{" "}
          <Link href="/en" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or compare with{" "}
          <Link href="/orc" className="underline underline-offset-4">
            orc names
          </Link>{" "}
          and{" "}
          <Link href="/gnome" className="underline underline-offset-4">
            gnome names
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
              first: ["Gr", "Sn", "Kr", "Zik", "Rak", "Gob", "Tik", "Vra", "Muk", "Sk"],
              second: ["it", "ak", "og", "za", "sn", "rik", "gut", "mok", "tak", "z"],
              lastA: [
                "Mud",
                "Rot",
                "Scrap",
                "Rust",
                "Dark",
                "Bone",
                "Grim",
                "Fang",
                "Rat",
                "Smoke",
              ],
              lastB: [
                "snout",
                "picker",
                "biter",
                "tooth",
                "claw",
                "ear",
                "lurker",
                "chewer",
                "stabber",
                "skulk",
              ],
            }}
            initialCount={10}
            examples={[
              "Grik Mudsnoot",
              "Snak Rustpicker",
              "Zikrot Fangclaw",
              "Rakgut Bonechewer",
              "Tikza Darklurker",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Goblin names work best when they’re short and harsh. One or two
          syllables is usually enough for table play.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make goblin names fast and usable</h2>
        <p className="text-zinc-700 leading-7">
          Goblin encounters often happen fast. These guides help you create names
          that are quick to say, easy to remember, and consistent with your world.
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
        note="Tip: For goblin leaders or bosses, try adding a longer title or clan name to make them stand out."
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
        <Link className="underline" href="/orc">
          Orc
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/gnome">
          Gnome
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/halfling">
          Halfling
        </Link>
      </footer>
    </main>
  );
}