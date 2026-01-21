import JsonLd from "@/components/JsonLd";
import HomeSearch from "@/components/HomeSearch";
import { TOOLS } from "@/lib/tools";
import { getBaseUrl } from "@/lib/site";

export default function EnHomePage() {
  const base = getBaseUrl();

  const faq = [
    {
      q: "What is a D&D name generator?",
      a: "A D&D name generator is an online tool that helps you create fantasy character names for tabletop role-playing games like Dungeons & Dragons."
    },
    {
      q: "How do I use these name generators?",
      a: "Choose a generator, click Generate, and copy the names you like for characters, NPCs, or stories."
    },
    {
      q: "Are these names official D&D names?",
      a: "No. The names are generated for inspiration and are not official D&D canon."
    },
    {
      q: "Can I use these names in my campaign or game?",
      a: "Yes. You can freely use the generated names in personal campaigns, games, or creative projects."
    },
    {
      q: "Do you support different fantasy races?",
      a: "Yes. We support elves, dwarves, tieflings, dragonborn, and Eastern fantasy name styles."
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "D&D Name Generators",
      url: `${base}/en`,
      description: "Pick a generator, generate names, and copy your favorites.",
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${base}/en?q={search_term_string}`,
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
        url: `${base}${t.href}`,
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

      <HomeSearch
        tools={TOOLS}
        headline="D&D Name Generators"
        subhead="Pick a generator, generate names, and copy your favorites."
        searchPlaceholder="Search: dwarf, elf, tiefling, dragonborn, xianxia..."
      />

      {/* 👇 页面可见 FAQ（非常重要） */}
      <section className="mt-12 space-y-4 max-w-3xl">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <ul className="space-y-3">
          {faq.map((f) => (
            <li key={f.q}>
              <h3 className="font-medium">{f.q}</h3>
              <p className="text-zinc-700">{f.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
