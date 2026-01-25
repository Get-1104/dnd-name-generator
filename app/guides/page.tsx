import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageUrl } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";
import { GUIDES, type GuideLink } from "@/lib/guides";

export const metadata = createPageMetadata({
  title: "D&D Naming Guides | Conventions, Tips & Examples",
  description:
    "Step-by-step D&D naming guides with race conventions, naming formulas, and examples for building memorable characters and NPCs.",
  path: "/guides",
});

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
    <div className="space-y-10">
      <JsonLd data={jsonLd} />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">D&D Naming Guides</h1>
        <p className="text-zinc-700 leading-7 max-w-3xl">
          Practical, SEO-friendly guides that explain naming conventions and help
          you create believable D&D character and NPC names.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
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
        <Link className="underline" href="/">
          home
        </Link>{" "}
        and check{" "}
        <code className="rounded bg-zinc-100 px-1">/admin/search-logs</code>{" "}
        for new opportunities.
      </footer>
    </div>
  );
}