// components/EnSeoIntro.tsx
import Link from "next/link";
import { TOOLS } from "@/lib/tools";

type ToolLike = {
  name?: string;
  title?: string;
  path?: string;
  href?: string;
  slug?: string;
  description?: string;
};

function getToolPath(t: ToolLike) {
  const p = t.path || t.href || t.slug || "";
  if (!p) return "";
  return p.startsWith("/") ? p : `/${p}`;
}

function getToolName(t: ToolLike) {
  return t.name || t.title || "Name Generator";
}

function getToolDesc(t: ToolLike) {
  return t.description || "";
}

export default function EnSeoIntro() {
  // SSOT: TOOLS
  const tools = (TOOLS as ToolLike[])
    .map((t) => ({
      path: getToolPath(t),
      name: getToolName(t),
      description: getToolDesc(t),
    }))
    .filter((t) => Boolean(t.path)); // ✅ 防止空 path

  /**
   * Featured internal links
   * ✅ 保持 /en 主主题：D&D generators
   * ❌ 不把 /eastern 抬到 featured（避免“刻意指向”）
   */
  const featured = [
    "/dwarf",
    "/elf",
    "/tiefling",
    "/dragonborn",
    "/orc", // ✅ 你现在也有 orc 了，更自然
  ];

  const featuredTools = featured
    .map((p) => tools.find((t) => t.path === p))
    .filter(Boolean) as { path: string; name: string; description: string }[];

  // 其余工具（稳定顺序）
  const restTools = tools
    .filter((t) => t.path && !featured.includes(t.path))
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, 24);

  return (
    <section className="mt-10 space-y-10">
      {/* What is */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">
          What is a D&amp;D Name Generator?
        </h2>
        <div className="mt-3 space-y-3 text-base leading-7 text-gray-700">
          <p>
            A D&amp;D name generator helps you create character names that fit
            your campaign setting—fast. Whether you&apos;re building a new hero,
            rolling up an NPC on the fly, or writing lore for your world, the
            goal is the same: find names that sound right, feel consistent, and
            are easy to reuse.
          </p>
          <p>
            This site focuses on popular fantasy ancestries and styles (like{" "}
            <Link className="underline underline-offset-4" href="/elf">
              elf names
            </Link>
            ,{" "}
            <Link className="underline underline-offset-4" href="/dwarf">
              dwarf names
            </Link>
            , and{" "}
            <Link className="underline underline-offset-4" href="/tiefling">
              tiefling names
            </Link>
            ). Each generator gives you multiple options, so you can pick a name
            that matches your character&apos;s vibe—noble, gritty, mysterious,
            or downright chaotic.
          </p>
        </div>
      </div>

      {/* How to use */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">
          How to use these generators
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7 text-gray-700">
          <li>
            Pick a generator that matches your character concept (ancestry,
            culture, or vibe).
          </li>
          <li>
            Click generate until you find something you like, then tweak spelling
            or syllables if you want a unique feel.
          </li>
          <li>
            Copy your favorites and save them for future PCs, NPCs, towns, or
            factions.
          </li>
        </ol>
        <p className="mt-4 text-base leading-7 text-gray-700">
          Tip: As a DM, keep a short list of names ready for tavern owners,
          guards, merchants, and random travelers—your table will never notice
          the prep, but they’ll feel the world is alive.
        </p>
      </div>

      {/* Featured internal links */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">
          Popular D&amp;D name generators
        </h2>
        <p className="mt-3 text-base leading-7 text-gray-700">
          Start with these fan-favorite options. They cover common campaign
          needs and give you names that feel “table-ready”.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((t) => (
            <Link
              key={t.path}
              href={t.path}
              className="group rounded-xl border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
            >
              <div className="text-lg font-semibold text-gray-900 group-hover:underline group-hover:underline-offset-4">
                {t.name}
              </div>
              <div className="mt-1 text-sm leading-6 text-gray-600">
                {t.description ||
                  "Generate names, copy favorites, and keep a shortlist for your campaign."}
              </div>
              <div className="mt-3 text-sm font-medium text-gray-900">
                Try it →
              </div>
            </Link>
          ))}
        </div>

        {restTools.length > 0 && (
          <>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">
              More generators
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {restTools.map((t) => (
                <li key={t.path}>
                  <Link
                    href={t.path}
                    className="underline underline-offset-4 text-gray-700 hover:text-gray-900"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Lightweight E-E-A-T style block */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Who is this for?</h2>
        <div className="mt-3 space-y-3 text-base leading-7 text-gray-700">
          <p>
            <strong>Players</strong> who want names that match a character&apos;s
            ancestry and tone. <strong>Dungeon Masters</strong> who need
            consistent NPC names on demand. <strong>Writers</strong> and world
            builders who want quick inspiration without breaking immersion.
          </p>
          <p>
            If you have feedback or want a new generator added (orc, human,
            gnome, demon, angel…), you can expand the site quickly—each tool is a
            dedicated SEO landing page designed to be understood by Google.
          </p>
        </div>
      </div>
    </section>
  );
}
