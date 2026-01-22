import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gnome Name Generator for D&D | Fantasy Character Names",
  description:
    "Generate clever gnome names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
};

export default function GnomePage() {
  const title = "Gnome Name Generator";
  const description = "Generate clever gnome names for D&D characters and NPCs.";
  const path = "/gnome";

  const faq = [
    {
      q: "What is a gnome name generator?",
      a: "A gnome name generator creates gnome-style fantasy names you can use for D&D characters, NPCs, and stories.",
    },
    {
      q: "How do I use this gnome name generator?",
      a: "Click Generate to create a fresh list of gnome names, then use Copy to copy your favorites for your character sheet or notes.",
    },
    {
      q: "What makes a name feel gnome?",
      a: "Gnome names often feel playful and clever, with bouncy syllables and sometimes longer given names. Many gnomes also use nicknames that are easier at the table.",
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
          Use this gnome name generator to create playful, clever names for gnome
          characters and NPCs in D&amp;D. Gnome names often have bouncy syllables,
          quirky rhythms, and fun nicknames—great for inventors, illusionists, tinkerers,
          and curious explorers. Generate a shortlist, then refine spellings or pick a
          shorter nickname for table play.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more naming styles? Browse the full{" "}
          <Link href="/en" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or compare with{" "}
          <Link href="/halfling" className="underline underline-offset-4">
            halfling names
          </Link>{" "}
          and{" "}
          <Link href="/human" className="underline underline-offset-4">
            human names
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
              first: ["Fizz", "Bim", "Tink", "Nim", "Pip", "Wiz", "Gim", "Zan", "Rill", "Quin"],
              second: ["wick", "ble", "nock", "berry", "tock", "whistle", "spar", "dle", "vix", "len"],
              lastA: ["Copper", "Gear", "Bright", "Quick", "Spark", "Moss", "Glimmer", "Puddle", "Thistle", "Wind"],
              lastB: ["top", "whisk", "bender", "foot", "spinner", "glove", "branch", "button", "brook", "fizzle"],
            }}
            initialCount={10}
            examples={[
              "Fizzwick Coppertop",
              "Tinkble Gearbender",
              "Nimberry Brightbutton",
              "Quinwhistle Sparkbrook",
              "Rillnock Thistlebranch",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Gnome names often feel right when you keep the given name bouncy
          and playful—then use a surname tied to tinkering, nature, or a quirky trait.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make gnome names easy at the table</h2>
        <p className="text-zinc-700 leading-7">
          Gnome names can be longer—so nicknames help. These guides show practical
          ways to build names that are memorable, pronounceable, and consistent with
          your character’s vibe.
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

      {/* ✅ Related generators (统一组件) */}
      <RelatedGenerators
        hrefs={["/halfling", "/human", "/goblin", "/elf"]}
        title="Try related name generators"
        note="Tip: If you want a gnome name to sound more serious, keep the given name short and pair it with a grounded human-style surname."
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
        <Link className="underline" href="/halfling">
          Halfling
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/human">
          Human
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/goblin">
          Goblin
        </Link>
      </footer>
    </main>
  );
}
