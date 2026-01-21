import type { Metadata } from "next";
import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Halfling Name Generator for D&D | Fantasy Character Names",
  description:
    "Generate charming halfling names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
};

export default function HalflingPage() {
  const title = "Halfling Name Generator";
  const description = "Generate charming halfling names for D&D characters and NPCs.";
  const path = "/halfling";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a halfling name generator?",
        a: "A halfling name generator creates fantasy halfling-style names you can use for D&D characters, NPCs, and stories.",
      },
      {
        q: "How do I use this halfling name generator?",
        a: "Click Generate to create a fresh list of halfling names, then use Copy to copy your favorites to your character sheet or notes.",
      },
      {
        q: "Do halfling names need surnames?",
        a: "Not always, but surnames can add flavor. Many halflings use family names tied to home, food, craft, or local traditions.",
      },
      {
        q: "Are these names official D&D names?",
        a: "No. They are randomly generated fantasy-style names for inspiration and are not official D&D canon.",
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
            Halflings in D&amp;D are often known for warmth, courage, and a talent for
            turning small moments into big adventures. A good halfling name can feel
            friendly and grounded—perfect for travelers, burglars with a heart of gold,
            or community heroes from a quiet village.
          </p>

          <p className="text-zinc-700 leading-7">
            Want a different style? Browse the{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            hub, or compare with{" "}
            <Link href="/human" className="underline underline-offset-4">
              human names
            </Link>{" "}
            and{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf names
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
              — flexible names for any background or region.
            </li>
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — melodic names for ancient lineages and noble houses.
            </li>
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — sturdy clan-style names with grounded tones.
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
          first: ["Bel", "Cor", "Fin", "Lil", "Mer", "Pip", "Ros", "Sam", "Tob", "Wil"],
          second: ["la", "rin", "don", "bie", "lo", "pin", "sey", "wick", "win", "ver"],
          lastA: ["Apple", "Clover", "Meadow", "Hill", "Honey", "Green", "River", "Bramble", "Sun", "Oak"],
          lastB: ["whistle", "foot", "brook", "bottle", "bough", "burrow", "dale", "kettle", "leaf", "stone"],
        }}
        initialCount={10}
        examples={[
          "Pippin Applefoot",
          "Roswin Cloverbrook",
          "Finver Meadowleaf",
          "Samdon Hillburrow",
          "Belrin Honeykettle",
        ]}
      />
    </>
  );
}
