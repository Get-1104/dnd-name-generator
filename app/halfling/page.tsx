import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Halfling Name Generator for D&D | Fantasy Character Names",
  description: "Generate charming halfling names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/halfling",
});

export default function HalflingPage() {
  const title = "Halfling Name Generator";
  const description =
    "Generate charming halfling names for D&D characters and NPCs.";
  const path = "/halfling";

  const faq = [
    {
      q: "What is a halfling name generator?",
      a: "A halfling name generator creates halfling-style fantasy names you can use for D&D characters, NPCs, and stories.",
    },
    {
      q: "How do I use this halfling name generator?",
      a: "Click Generate to create a fresh list of halfling names, then use Copy to copy your favorites for your character sheet or notes.",
    },
    {
      q: "What makes a name feel halfling?",
      a: "Halfling names often sound warm, friendly, and easy to say at the table. They tend to use softer sounds and simple, memorable rhythms—often paired with cozy surnames.",
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
          Use this halfling name generator to create friendly, memorable names for
          halfling characters and NPCs in D&amp;D. Halfling names often feel warm
          and approachable—great for adventurers, innkeepers, traders, and community
          heroes. Generate a shortlist, then tweak spelling or add a cozy surname
          to match your setting.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more naming styles? Browse the full{" "}
          <Link href="/en" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or compare with{" "}
          <Link href="/gnome" className="underline underline-offset-4">
            gnome names
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
              first: ["Pip", "Ros", "Mil", "Tob", "Bel", "Nim", "Lily", "Mara", "Finn", "Daisy"],
              second: ["pin", "ie", "lo", "by", "la", "mo", "ett", "rin", "wick", "bell"],
              lastA: ["Under", "Green", "Hill", "Honey", "Good", "Apple", "Bramble", "Clover", "Oak", "Sunny"],
              lastB: ["bough", "field", "whistle", "foot", "barrel", "brook", "top", "meadow", "kettle", "vale"],
            }}
            initialCount={10}
            examples={[
              "Pippin Underbough",
              "Rosie Greenfield",
              "Tobby Hillwhistle",
              "Mara Clovermeadow",
              "Finn Applebrook",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Halfling names feel best when they’re short and cheerful—then pair
          them with a surname tied to home, food, fields, or family.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make halfling names table-friendly</h2>
        <p className="text-zinc-700 leading-7">
          Halfling names shine when they’re easy to pronounce and instantly memorable.
          These guides help you build names that fit your world and your character concept.
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
        hrefs={["/gnome", "/human", "/elf", "/goblin"]}
        title="Try related name generators"
        note="Tip: If your halfling grew up in a different culture, try pairing a halfling given name with a human-style surname for a subtle twist."
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
        <Link className="underline" href="/gnome">
          Gnome
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