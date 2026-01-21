import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import HomeSearch from "@/components/HomeSearch";
import { TOOLS } from "@/lib/tools";
import { getPageUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D&D Name Generators | Fantasy Character Name Generator Tools",
  description:
    "Free D&D name generators for fantasy characters and NPCs. Generate elf, dwarf, orc, dragonborn, and more names for your campaign.",
};

export default function EnHomePage() {
  const enUrl = getPageUrl("/en");

  const faq = [
    {
      q: "What is a D&D name generator?",
      a: "A D&D name generator helps you create fantasy-style names for characters, NPCs, and locations in Dungeons & Dragons campaigns. It saves time and keeps names consistent with different races and settings.",
    },
    {
      q: "Can I use these generated names in my campaign?",
      a: "Yes. All names generated on this site are intended for creative use in tabletop RPGs, writing projects, and personal campaigns. You are free to modify or adapt them as needed.",
    },
    {
      q: "Are these names official D&D canon names?",
      a: "No. The names are randomly generated fantasy-style names created for inspiration. They are not official Wizards of the Coast or D&D canon content.",
    },
    {
      q: "How do I choose the right name for my character?",
      a: "Start with a generator that matches your character’s race or background, then generate several options. You can tweak spelling, add titles, or combine elements until the name fits your character’s story.",
    },
    {
      q: "Do different fantasy races have different naming styles?",
      a: "Yes. Elf names are often melodic, dwarf names emphasize clan heritage, and orc names tend to sound harsher and more direct. Race-specific generators help keep names believable.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "D&D Name Generators",
      url: enUrl,
      description: "Pick a generator, generate names, and copy your favorites.",
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${enUrl}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "D&D Name Generators (English)",
      itemListElement: TOOLS.map((t, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: t.title,
        url: getPageUrl(t.href),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <main className="mx-auto max-w-5xl px-4">
        <HomeSearch
          tools={TOOLS}
          headline="D&D Name Generators"
          subhead="Pick a generator, generate names, and copy your favorites."
          searchPlaceholder="Search: dwarf, elf, tiefling, dragonborn, xianxia..."
        />

        {/* ✅ 可见 SEO 正文 */}
        <section className="mt-10 space-y-8 max-w-3xl">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">
              What is a D&amp;D Name Generator?
            </h2>
            <p className="text-zinc-700 leading-7">
              A D&amp;D name generator helps you create fantasy names that fit
              your character, NPC, or campaign setting—fast. Whether you&apos;re
              rolling up a new hero, improvising an NPC, or building world lore,
              the goal is the same: names that sound right and stay consistent at
              the table.
            </p>
            <p className="text-zinc-700 leading-7">
              Start with popular options like{" "}
              <Link href="/elf" className="underline underline-offset-4">
                elf name generator
              </Link>
              ,{" "}
              <Link href="/dwarf" className="underline underline-offset-4">
                dwarf name generator
              </Link>
              , or{" "}
              <Link href="/tiefling" className="underline underline-offset-4">
                tiefling name generator
              </Link>
              —then tweak spelling or syllables to make the result uniquely yours.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">
              How to use these generators
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                Pick a generator that matches your character concept (ancestry,
                culture, or vibe).
              </li>
              <li>Click Generate until you find a name you like.</li>
              <li>
                Copy your favorites and save them for future characters, NPCs,
                towns, or factions.
              </li>
            </ol>
            <p className="text-zinc-700 leading-7">
              DM tip: keep a short list ready for merchants, guards, tavern
              owners, and travelers—your world will feel more alive with zero
              extra prep.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Popular generators</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/elf"
                  className="underline underline-offset-4 font-medium"
                >
                  Elf Name Generator
                </Link>{" "}
                — elegant, melodic names for ancient fantasy races.
              </li>
              <li>
                <Link
                  href="/dwarf"
                  className="underline underline-offset-4 font-medium"
                >
                  Dwarf Name Generator
                </Link>{" "}
                — sturdy, clan-based names for warriors and smiths.
              </li>
              <li>
                <Link
                  href="/tiefling"
                  className="underline underline-offset-4 font-medium"
                >
                  Tiefling Name Generator
                </Link>{" "}
                — infernal-flavored names with a mysterious edge.
              </li>
              <li>
                <Link
                  href="/dragonborn"
                  className="underline underline-offset-4 font-medium"
                >
                  Dragonborn Name Generator
                </Link>{" "}
                — powerful draconic names inspired by honor and lineage.
              </li>
              <li>
                <Link
                  href="/eastern"
                  className="underline underline-offset-4 font-medium"
                >
                  Eastern Fantasy Name Generator
                </Link>{" "}
                — wuxia/xianxia-style Chinese name inspiration.
              </li>
            </ul>
          </div>
        </section>

        {/* ✅ 可见 FAQ（与 JSON-LD 对齐） */}
        <section className="mt-16 space-y-6 max-w-3xl">
          <h2 className="text-2xl font-semibold">
            Frequently Asked Questions about D&amp;D Name Generators
          </h2>

          <div className="space-y-5">
            {faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-medium text-lg">{f.q}</h3>
                <p className="text-zinc-700 leading-7">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
