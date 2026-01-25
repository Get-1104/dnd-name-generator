"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type RaceItem = { slug: string; label: string };

const RACES: RaceItem[] = [
  { slug: "human", label: "Human" },
  { slug: "elf", label: "Elf" },
  { slug: "dwarf", label: "Dwarf" },
  { slug: "halfling", label: "Halfling" },
  { slug: "gnome", label: "Gnome" },
  { slug: "half-elf", label: "Half-Elf" },
  { slug: "half-orc", label: "Half-Orc" },
  { slug: "dragonborn", label: "Dragonborn" },
  { slug: "tiefling", label: "Tiefling" },
  { slug: "orc", label: "Orc" },
];

function getRaceFromPathname(pathname: string) {
  const seg = pathname.split("?")[0].split("/").filter(Boolean)[0] || "";
  return seg;
}

export default function RaceSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const current = useMemo(() => getRaceFromPathname(pathname || "/"), [pathname]);
  const items = useMemo(() => RACES, []);

  const qs = searchParams ? searchParams.toString() : "";

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const el = scroller.querySelector<HTMLElement>(`[data-race="${current}"]`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  return (
    <div className="flex justify-center">
      <div
        ref={scrollerRef}
        className="w-full overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch] no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 snap-x snap-mandatory">
          {items.map((r) => {
            const isActive = r.slug === current;
            const baseClass =
              "whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 hover:bg-zinc-50";
            const activeClass = "whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1 text-sm text-white";

            return (
              <button
                key={r.slug}
                type="button"
                onClick={() =>
                  router.push(`/${r.slug}${qs ? `?${qs}` : ""}`, { scroll: false })
                }
                className={isActive ? activeClass : baseClass}
                aria-current={isActive ? "true" : undefined}
                data-race={r.slug}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
