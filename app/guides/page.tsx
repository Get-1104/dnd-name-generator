import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageUrl } from "@/lib/site";

type GuideLink = {
  href: string;
  title: string;
  description: string;
  tags?: string[];
};

const GUIDES: GuideLink[] = [
  {
    href: "/guides/dnd-name-generator-guide",
    title: "D&D Name Generator Guide",
    description:
      "How to use name generators effectively for characters, NPCs, and campaign prep.",
    tags: ["guide", "dnd", "basics"],
  },
  {
    href: "/guides/how-to-name-a-dnd-character",
    title: "How to Name a D&D Character",
    description:
      "A practical framework for naming characters: theme, culture, sound, and readability.",
    tags: ["guide", "character", "naming"],
  },
  {
    href: "/guides/elf-naming-conventions",
    title: "Elf Naming Conventions in D&D",
    description:
      "Learn common elf naming patterns, sounds, and cultural conventions to create believable elven names.",
    tags: ["elf", "conventions", "guide"],
  },
  {
    href: "/guides/dwarf-clan-names-and-traditions",
    title: "Dwarf Clan Names and Traditions",
    description:
      "How dwarf clan names work, common themes, and how to create strong dwarf surnames for D&D.",
    tags: ["dwarf", "clan", "guide"],
  },
  {
    href: "/guides/dragonborn-naming-conventions",
    title: "Dragonborn Naming Conventions in D&D",
    description:
      "How dragonborn names work, including clan names, traditions, and roleplay-friendly tips.",
    tags: ["dragonborn", "conventions", "guide"],
  },
];

function buildGuidesHubJsonLd(guides: GuideLink[]) {
  const url = getPageUrl("/guides");

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "D&D Naming Guides",
      description:
        "A curated set of practical naming guides for D&D characters, NPCs, and fantasy worlds.",
      url,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: guides.map((g, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: getPageUrl(g.href),
          name: g.title,
        })),
      },
    },
  ];
}

export default function GuidesHubPage() {
  const jsonLd = buildGuidesHubJsonLd(GUIDES);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <JsonLd data={jsonLd} />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">D&D Naming Guides</h1>
        <p className="text-zinc-700 leading-7 max-w-3xl">
          Practical, SEO-friendly guides that explain naming conventions and help
          you create believable D&D character and NPC names.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/en"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Back to /en
          </Link>
          <Link
            href="/elf"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Elf Generator
          </Link>
          <Link
            href="/dragonborn"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Dragonborn Generator
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow transition"
          >
            <div className="text-lg font-semibold text-zinc-900">{g.title}</div>
            <p className="text-zinc-700 leading-7 mt-2">{g.description}</p>

            {g.tags && g.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {g.tags.slice(0, 6).map((t) => (
                  <span
                    key={`${g.href}:${t}`}
                    className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </section>

      <footer className="pt-2 text-sm text-zinc-600">
        Tip: If you can’t find what you need, use the search on{" "}
        <Link className="underline" href="/en">
          /en
        </Link>{" "}
        and check{" "}
        <code className="rounded bg-zinc-100 px-1">/admin/search-logs</code>{" "}
        for new opportunities.
      </footer>
    </main>
  );
}
