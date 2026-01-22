// app/page.tsx
import HomeSearch from "@/components/HomeSearch";
import JsonLd from "@/components/JsonLd";
import { SITE, getPageUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: getPageUrl("/"),
      description: SITE.description,
      inLanguage: SITE.language,
      potentialAction: {
        "@type": "SearchAction",
        target: `${getPageUrl("/")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "D&D Name Generators",
      itemListElement: TOOLS.map((t, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: t.title,
        url: getPageUrl(t.href),
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeSearch tools={TOOLS} />
    </>
  );
}
