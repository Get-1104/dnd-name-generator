import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Tiefling Name Generator for D&D | Fantasy Character Names",
  description: "Generate infernal tiefling names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/tiefling",
});

export default function TieflingPage() {
  const title = "Tiefling Name Generator";
  const description =
    "Generate infernal tiefling names for D&D characters and NPCs.";
  const path = "/tiefling";

  const faq = [
    {
      q: "What is a tiefling name generator?",
      a: "A tiefling name generator creates infernal-flavored fantasy names you can use for D&D characters, NPCs, and stories.",
    },
    {
      q: "How do I use this tiefling name generator?",
      a: "Click Generate to create a fresh list of tiefling names, then use Copy to copy your favorites for your character sheet or notes.",
    },
    {
      q: "Do tieflings use virtue names in D&D?",
      a: "Many do. Some tieflings choose a ‘virtue name’ like Hope, Wrath, or Mercy to represent identity, rebellion, or a personal ideal.",
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
          Use this tiefling name generator to create mysterious, infernal-flavored
          names for characters and NPCs in D&amp;D. Tiefling names often lean into
          sharp consonants, dramatic syllables, and “virtue names” that reflect
          identity and attitude. Generate a shortlist, then tweak spelling or add
          a title to match your world’s tone.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more naming styles? Browse the full{" "}
          <Link href="/en" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or compare with{" "}
          <Link href="/dragonborn" className="underline underline-offset-4">
            dragonborn names
          </Link>{" "}
          and{" "}
          <Link href="/elf" className="underline underline-offset-4">
            elf names
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
              first: ["Za", "Me", "Ka", "Lu", "Va", "Sa", "Ri", "No", "Bel", "Xan"],
              second: ["reth", "zra", "lith", "vyr", "mora", "dris", "ziah", "rion", "thas", "vex"],
              lastA: ["Ash", "Night", "Blood", "Shadow", "Ember", "Dusk", "Hell", "Void", "Iron", "Scar"],
              lastB: ["whisper", "brand", "shade", "binder", "tongue", "fire", "heart", "mark", "veil", "thorn"],
            }}
            initialCount={10}
            examples={[
              "Zareth Ashwhisper",
              "Kavyr Nightbrand",
              "Belzra Bloodveil",
              "Xanthas Shadowmark",
              "Rimora Emberthorn",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Tiefling names often feel right with sharp sounds (z, v, x) or a
          virtue-style nickname (e.g., “Mercy”, “Wrath”, “Hope”).
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Learn tiefling naming ideas</h2>
        <p className="text-zinc-700 leading-7">
          Tieflings often mix infernal aesthetics with personal identity—sometimes
          through chosen “virtue names.” These guides help you create names that are
          memorable, easy at the table, and consistent with your character concept.
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
        hrefs={["/dragonborn", "/elf", "/dwarf", "/demon"]}
        title="Try related name generators"
        note="Tip: If you want a softer vibe, pair a melodic elf given name with a darker tiefling surname—or flip it for contrast."
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
        <Link className="underline" href="/dragonborn">
          Dragonborn
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/elf">
          Elf
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/demon">
          Demon
        </Link>
      </footer>
    </main>
  );
}