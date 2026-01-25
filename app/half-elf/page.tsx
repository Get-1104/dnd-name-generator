import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Suspense } from "react";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

import RaceSwitcher from "@/components/RaceSwitcher";
import ClassGenderControls from "@/components/ClassGenderControls";
export const metadata = createPageMetadata({
  title: "Half-Elf Name Generator for D&D | Fantasy Character Names",
  description: "Generate memorable half-elf names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
  path: "/half-elf",
});

export default function HalfElfPage() {
  const title = "Half-Elf Name Generator";
  const description =
    "Generate memorable half-elf names for D&D characters and NPCs. Mix elven elegance with human simplicity in seconds.";
  const path = "/half-elf";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a half-elf name generator?",
        a: "A half-elf name generator creates name ideas that blend elven-sounding style with human-readable simplicity, perfect for D&D characters and NPCs.",
      },
      {
        q: "How do I use this half-elf name generator?",
        a: "Click Generate to get a new list of half-elf names. Use Copy to save your favorites for your character sheet or campaign notes.",
      },
      {
        q: "Should half-elf names be more elf or more human?",
        a: "Either works. Many half-elves choose a human first name with an elven family name (or the reverse). Pick what fits your character’s culture and backstory.",
      },
      {
        q: "Can I make the names fit a specific vibe?",
        a: "Yes. Use the generated names as a base, then tweak spelling, add or remove syllables, or combine parts of two names until it feels right for your setting.",
      },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
<header className="space-y-3">
                    <Suspense fallback={<div className="h-12" />}>
                      <RaceSwitcher current="half-elf" />
                      <ClassGenderControls />
                    </Suspense>

<h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-zinc-700 leading-7">{description}</p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Related</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                <Link href="/elf" className="underline underline-offset-4">
                  Elf Name Generator
                </Link>{" "}
                — more melodic, elegant style.
              </li>
              <li>
                <Link href="/human" className="underline underline-offset-4">
                  Human Name Generator
                </Link>{" "}
                — simple, flexible names.
              </li>
              <li>
                <Link
                  href="/guides/elf-naming-conventions"
                  className="underline underline-offset-4"
                >
                  Elf Naming Conventions (Guide)
                </Link>{" "}
                — lore + naming tips.
              </li>
            </ul>
          </div>
        </header>
      </section>

      <section className="mx-auto max-w-3xl px-4 mt-8 space-y-4">
        <Suspense fallback={<div className="h-40" />}>
        <NameGenerator
          hideHeader
          title={title}
          description={description}
          initialCount={10}
          parts={{
            // 人类感 + 精灵感混合（你之后可继续扩充词库）
            first: [
              "Al",
              "El",
              "Ka",
              "Li",
              "Ma",
              "Na",
              "Se",
              "Ta",
              "Va",
              "Ri",
              "Jo",
              "Da",
            ],
            second: [
              "ren",
              "wyn",
              "riel",
              "lin",
              "dor",
              "mir",
              "thas",
              "wen",
              "ric",
              "van",
              "son",
              "lia",
            ],
            lastA: [
              "Moon",
              "Silver",
              "Star",
              "Dawn",
              "Night",
              "Wind",
              "Leaf",
              "River",
              "Stone",
              "Bright",
            ],
            lastB: [
              "weaver",
              "song",
              "runner",
              "whisper",
              "watcher",
              "bloom",
              "brook",
              "glade",
              "borne",
              "ward",
            ],
          }}
          examples={[
            "Elwyn Starweaver",
            "Alric Dawnrunner",
            "Seren Moonwhisper",
            "Varen Brightward",
            "Nalia Silverglade",
          ]}
        />
        </Suspense>

        <p className="text-xs text-zinc-500">
          Tip: Half-elf names often sound believable when you keep one part
          simple (human) and one part lyrical (elf).
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 mt-12 space-y-3">
        <h2 className="text-xl font-semibold">Half-elf naming tips</h2>
        <ul className="list-disc pl-5 text-zinc-700 space-y-2 leading-7">
          <li>
            Try a human first name + elven family name (or the reverse) to show
            mixed heritage.
          </li>
          <li>
            Use softer consonants and flowing syllables for a more elven feel;
            shorten names for a more human feel.
          </li>
          <li>
            Give your character a “public” name and a more traditional name used
            by family or close friends.
          </li>
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-3">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <div className="space-y-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="font-medium">What makes a name feel half-elf?</div>
            <p className="text-zinc-700 leading-7 mt-1">
              A half-elf name usually balances readability with a touch of
              elegance—often by mixing a straightforward human-style name with a
              softer, more lyrical elven element.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="font-medium">Do half-elves have clan names?</div>
            <p className="text-zinc-700 leading-7 mt-1">
              Sometimes. Depending on your setting, a half-elf may inherit a
              human family surname, adopt an elven family name, or choose a new
              name entirely.
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-4 pt-10 pb-12">
        <div className="text-sm text-zinc-600">
          Explore more:{" "}
          <Link className="underline" href="/elf">
            Elf
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/human">
            Human
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/orc">
            Orc
          </Link>
        </div>
      </footer>
    </>
  );
}