import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dragonborn Name Generator for D&D | Fantasy Character Names",
  description: "Generate powerful dragonborn names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/dragonborn",
});

export default function DragonbornPage() {
  const title = "Dragonborn Name Generator";
  const description =
    "Generate powerful dragonborn names for D&D characters and NPCs.";
  const path = "/dragonborn";

  const faq = [
    {
      q: "What is a dragonborn name generator?",
      a: "A dragonborn name generator creates draconic-style names you can use for D&D characters, NPCs, and fantasy stories.",
    },
    {
      q: "How do I use this dragonborn name generator?",
      a: "Click Generate to create a fresh list of dragonborn names, then use Copy to copy your favorites for your character sheet or notes.",
    },
    {
      q: "Do dragonborn use clan names in D&D?",
      a: "Often, yes. Many dragonborn characters use a personal name plus a clan name, and the clan name may carry strong cultural meaning.",
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
          Use this dragonborn name generator to create strong, draconic names for
          characters and NPCs in D&amp;D. Dragonborn names often feel bold and
          honor-driven—perfect for warriors, paladins, and proud adventurers.
          Generate a shortlist, then refine spellings or add a clan name to fit
          your setting.
        </p>

        <p className="text-zinc-700 leading-7">
          Want more naming styles? Browse the full{" "}
          <Link href="/en" className="underline underline-offset-4">
            D&amp;D name generators
          </Link>{" "}
          collection, or compare with{" "}
          <Link href="/tiefling" className="underline underline-offset-4">
            tiefling names
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
              first: ["Ar", "Rho", "Bal", "Vor", "Ker", "Thar", "Mir", "Zor", "Dar", "Sha"],
              second: ["jhan", "gar", "ak", "rax", "dor", "mir", "vash", "gorn", "thar", "shan"],
              lastA: [
                "Flame",
                "Sky",
                "Iron",
                "Storm",
                "Ash",
                "Scale",
                "Stone",
                "Gold",
                "Dusk",
                "Rune",
              ],
              lastB: [
                "heart",
                "watcher",
                "fang",
                "binder",
                "shield",
                "born",
                "singer",
                "speaker",
                "breaker",
                "claw",
              ],
            }}
            initialCount={10}
            examples={[
              "Arjhan Flameheart",
              "Rhogar Skywatcher",
              "Vordor Stormclaw",
              "Kerdor Ironspeaker",
              "Tharvash Ashbinder",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Dragonborn names often sound best with sharp consonants and strong
          endings. Add a clan name (or an honor title) for extra flavor.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Learn dragonborn naming rules</h2>
        <p className="text-zinc-700 leading-7">
          Want names that match dragonborn culture, clan traditions, and the tone
          of your world? These guides explain naming patterns and give practical
          tips you can apply immediately.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/guides/dragonborn-naming-conventions"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Dragonborn Naming Conventions (Guide)
          </Link>
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
        hrefs={["/tiefling", "/elf", "/dwarf", "/human"]}
        title="Try related name generators"
        note="Tip: If your dragonborn has a mixed background, try pairing a draconic given name with a more human-style surname—or the reverse for contrast."
        extraLinks={[{ href: "/guides/dragonborn-naming-conventions", title: "Dragonborn naming conventions (guide)", description: "Clan names, traditions, and roleplay-friendly naming tips." }]}
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
        <Link className="underline" href="/elf">
          Elf
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/dwarf">
          Dwarf
        </Link>
      </footer>
    </main>
  );
}