import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Half-Orc Name Generator for D&D | Fantasy Character Names",
  description:
    "Generate tough half-orc names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
};

export default function HalfOrcPage() {
  const title = "Half-Orc Name Generator";
  const description =
    "Generate tough half-orc names for D&D characters and NPCs. Mix human readability with orcish grit.";
  const path = "/half-orc";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a half-orc name generator?",
        a: "A half-orc name generator creates name ideas that blend harsh orcish sounds with human-readable structure for D&D characters and NPCs.",
      },
      {
        q: "How do I use this half-orc name generator?",
        a: "Click Generate to get a fresh list of half-orc names. Use Copy to save your favorites for your character sheet or campaign notes.",
      },
      {
        q: "Should half-orc names be more orc or more human?",
        a: "Either works. Many half-orcs use a simpler human-style name in cities and a tougher orcish name among clans. Choose what fits your backstory.",
      },
      {
        q: "How can I make a half-orc name sound intimidating?",
        a: "Try short, punchy syllables, harder consonants (g, k, r, z), and a strong surname or title to match your character’s reputation.",
      },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-zinc-700 leading-7">{description}</p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Related</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                <Link href="/orc" className="underline underline-offset-4">
                  Orc Name Generator
                </Link>{" "}
                — harsher, clan-flavored names.
              </li>
              <li>
                <Link href="/human" className="underline underline-offset-4">
                  Human Name Generator
                </Link>{" "}
                — readable city names and aliases.
              </li>
            </ul>
          </div>
        </header>
      </section>

      <section className="mx-auto max-w-3xl px-4 mt-8 space-y-4">
        <NameGenerator
          hideHeader
          title={title}
          description={description}
          initialCount={10}
          parts={{
            first: ["Gar", "Brak", "Kor", "Rag", "Ur", "Dro", "Mak", "Thok", "Kaz", "Vor"],
            second: ["en", "rok", "gar", "zul", "mash", "gash", "dak", "grim", "nar", "rak"],
            lastA: ["Iron", "Blood", "Stone", "Skull", "War", "Dark", "Rage", "Ash", "Grim", "Fang"],
            lastB: ["fist", "breaker", "maw", "runner", "howl", "cleaver", "scar", "born", "blade", "brand"],
          }}
          examples={[
            "Garren Ironfist",
            "Korgrim Skullbreaker",
            "Ragnar Bloodbrand",
            "Thokzul Stonecleaver",
            "Vornarak Ashblade",
          ]}
        />

        <p className="text-xs text-zinc-500">
          Tip: Half-orc names often work best when you keep the given name short
          and strong, then add a gritty surname or title.
        </p>
      </section>

      <footer className="mx-auto max-w-3xl px-4 pt-10 pb-12">
        <div className="text-sm text-zinc-600">
          Explore more:{" "}
          <Link className="underline" href="/orc">
            Orc
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/human">
            Human
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/elf">
            Elf
          </Link>
        </div>
      </footer>
    </>
  );
}
