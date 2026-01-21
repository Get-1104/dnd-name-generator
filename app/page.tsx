import HomeSearch from "@/components/HomeSearch";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      inLanguage: SITE.language,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE.url}/?q={search_term_string}`,
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
        url: `${SITE.url}${t.href}`,
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
