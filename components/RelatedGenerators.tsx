import Link from "next/link";
import { TOOLS } from "@/lib/tools";

type ExtraLink = {
  href: string;
  title: string;
  description?: string;
  tags?: string[];
};

type Props = {
  title?: string;

  /**
   * 推荐的 generator href 列表
   * 例如: ["/dragonborn", "/elf"]
   */
  hrefs: string[];

  /**
   * 额外链接（可选）
   * 用于补充 Guide / 其他不在 TOOLS 里的页面
   * 例如：/guides/how-to-name-a-dnd-character
   */
  extraLinks?: ExtraLink[];

  /**
   * 额外提示（可选）
   */
  note?: string;
};

const TOOLS_MAP = new Map(TOOLS.map((t) => [t.href, t]));

function pickToolsByHrefs(hrefs: string[]) {
  return hrefs
    .map((h) => TOOLS_MAP.get(h))
    .filter(Boolean) as (typeof TOOLS)[number][];
}

export default function RelatedGenerators({
  title = "Try related generators",
  hrefs,
  extraLinks = [],
  note,
}: Props) {
  const safeHrefs = hrefs?.length ? hrefs : ["/human", "/dwarf", "/orc", "/halfling"];
  const items = pickToolsByHrefs(safeHrefs);

  const merged: ExtraLink[] = [
    ...items.map((t) => ({
      href: t.href,
      title: t.title,
      description: t.description,
      tags: t.tags,
    })),
    ...extraLinks,
  ];

  if (merged.length === 0) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {merged.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow transition"
          >
            <div className="font-medium text-zinc-900">{t.title}</div>

            {t.description ? (
              <p className="text-sm text-zinc-700 leading-6 mt-1">
                {t.description}
              </p>
            ) : null}

            {t.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {t.tags.slice(0, 5).map((tag) => (
                  <span
                    key={`${t.href}:${tag}`}
                    className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      {note ? <p className="text-xs text-zinc-500">{note}</p> : null}
    </section>
  );
}
