import Link from "next/link";
import SmartSearch from "@/components/SmartSearch";
import JsonLd from "@/components/JsonLd";
import { TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { getPageUrl, SITE } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "D&D Name Generators | Fantasy Character Name Generator Tools",
  description: "Free D&D name generators for fantasy characters and NPCs. Generate elf, dwarf, orc, dragonborn, and more names for your campaign.",
  path: "/en",
});

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
      a: "Start with a generator that matches your character’s ancestry or concept, then generate several options. Tweak spelling, add titles, or combine elements until the name fits your character’s story.",
    },
    {
      q: "Do different fantasy races have different naming styles?",
      a: "Yes. Elf names are often melodic, dwarf names emphasize clan heritage, and orc names tend to sound harsher and more direct. Race-specific generators help keep names believable.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "D&D Name Generators",
      url: enUrl,
      description: "Pick a generator, generate names, and copy your favorites.",
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
      },
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
      "@type": "ItemList",
      name: "D&D Naming Guides (English)",
      itemListElement: GUIDES.map((g, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: g.title,
        url: getPageUrl(g.href),
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

      <div className="space-y-12">
        {/* HERO */}
        <header className="card p-8 space-y-5">
          <h1 className="text-5xl font-semibold tracking-tight">
            D&amp;D Name Generators
          </h1>
          <p className="text-zinc-700 leading-7">
            Pick a generator, generate names, and copy your favorites.
          </p>

          <div className="relative">
            <div className="card p-4">
            <SmartSearch />
          </div>
          </div>

          <p className="text-sm text-zinc-500">
            Try: <span className="font-medium text-zinc-700">elf</span>,{" "}
            <span className="font-medium text-zinc-700">dwarf clan</span>,{" "}
            <span className="font-medium text-zinc-700">tiefling</span>,{" "}
            <span className="font-medium text-zinc-700">dragonborn</span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/"
              className="text-sm text-blue-600 underline underline-offset-4"
            >
              Prefer the main homepage?
            </Link>
            <span className="text-sm text-zinc-400">·</span>
            <Link
              href="/guides"
              className="text-sm text-blue-600 underline underline-offset-4"
            >
              Read naming guides
            </Link>
            <span className="text-sm text-zinc-400">·</span>
            <Link href="#guides" className="text-sm text-blue-600 underline underline-offset-4">
              Jump to guides
            </Link>
          </div>
        </header>

        {/* Main hub content */}
        <section className="mt-10 space-y-10">
          {/* Generators */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <h2 className="text-2xl font-semibold">Name generators</h2>
              <Link
                href="/"
                className="text-sm text-blue-600 underline underline-offset-4"
              >
                See the main homepage
              </Link>
            </div>
            <p className="text-zinc-700 leading-7 max-w-3xl">
              Choose a fantasy race (or style), generate a list of names, then copy the ones you like.
              For deeper lore and naming rules, jump to the guides section below.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-zinc-900">
                      {t.title}
                    </div>
                    {t.description && (
                      <p className="text-zinc-700 leading-7">{t.description}</p>
                    )}
                  </div>

                  {Array.isArray((t as any).tags) && (t as any).tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(t as any).tags.slice(0, 6).map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div className="space-y-4" id="guides">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <h2 className="text-2xl font-semibold">Naming guides</h2>
              <Link
                href="/guides"
                className="text-sm text-blue-600 underline underline-offset-4"
              >
                Browse all guides
              </Link>
            </div>
            <p className="text-zinc-700 leading-7 max-w-3xl">
              Learn race-specific conventions (elf, dwarf, dragonborn) plus a practical framework you can use
              for any character concept.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {GUIDES.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-zinc-900">
                      {g.title}
                    </div>
                    <p className="text-zinc-700 leading-7">{g.description}</p>
                  </div>

                  {g.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {g.tags.slice(0, 6).map((tag) => (
                        <span
                          key={`${g.href}:${tag}`}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO body */}
        <section className="mt-14 space-y-10 max-w-3xl">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">
              What is a D&amp;D Name Generator?
            </h2>
            <p className="text-zinc-700 leading-7">
              A D&amp;D name generator helps you create fantasy names that fit your character,
              NPC, or campaign setting—fast. Whether you’re rolling up a new hero,
              improvising an NPC, or building world lore, the goal is the same: names that
              sound right and stay consistent at the table.
            </p>
            <p className="text-zinc-700 leading-7">
              Start with popular options like{" "}
              <Link href="/elf" className="underline underline-offset-4">
                elf names
              </Link>
              ,{" "}
              <Link href="/dwarf" className="underline underline-offset-4">
                dwarf names
              </Link>
              ,{" "}
              <Link href="/tiefling" className="underline underline-offset-4">
                tiefling names
              </Link>
              , and{" "}
              <Link href="/dragonborn" className="underline underline-offset-4">
                dragonborn names
              </Link>
              —then tweak spelling or syllables to make the result uniquely yours.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">How to use these generators</h2>
            <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                Pick a generator that matches your character concept (ancestry, culture, or vibe).
              </li>
              <li>Click Generate until you find a name you like.</li>
              <li>
                Copy your favorites and save them for future characters, NPCs, towns, or factions.
              </li>
            </ol>
            <p className="text-zinc-700 leading-7">
              DM tip: keep a short list ready for merchants, guards, tavern owners, and travelers—your
              world will feel more alive with zero extra prep.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Popular generators</h2>
            <ul className="space-y-3 text-zinc-700 leading-7">
              <li>
                <Link href="/elf" className="underline underline-offset-4 font-medium">
                  Elf Name Generator
                </Link>{" "}
                — elegant, melodic names for ancient fantasy races.
              </li>
              <li>
                <Link href="/dwarf" className="underline underline-offset-4 font-medium">
                  Dwarf Name Generator
                </Link>{" "}
                — sturdy, clan-based names for warriors and smiths.
              </li>
              <li>
                <Link href="/tiefling" className="underline underline-offset-4 font-medium">
                  Tiefling Name Generator
                </Link>{" "}
                — infernal-flavored names with a mysterious edge.
              </li>
              <li>
                <Link href="/dragonborn" className="underline underline-offset-4 font-medium">
                  Dragonborn Name Generator
                </Link>{" "}
                — powerful draconic names inspired by honor and lineage.
              </li>
            </ul>

            <p className="text-sm text-zinc-500">
              Want more? Browse the full list above, or head to{" "}
              <Link href="/guides" className="underline underline-offset-4">
                naming guides
              </Link>{" "}
              for conventions and tips.
            </p>
          </div>
        </section>

        {/* Visible FAQ */}
        <section className="mt-16 space-y-6 max-w-3xl pb-16">
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
      </div>
    </>
  );
}