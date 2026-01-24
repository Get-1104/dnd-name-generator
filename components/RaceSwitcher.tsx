"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

const RACES: { slug: string; label: string }[] = [
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
  { slug: "goblin", label: "Goblin" },
  { slug: "angel", label: "Angel" },
  { slug: "demon", label: "Demon" },
  { slug: "eastern", label: "Eastern" },
];

export default function RaceSwitcher({ current }: { current: string }) {
  const cur = (current || "").replace(/^\//, "").toLowerCase();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  const [thumbStyle, setThumbStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updateThumb = useCallback(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    const { scrollWidth, clientWidth, scrollLeft } = scroller;
    const trackWidth = track.clientWidth;
    if (scrollWidth <= clientWidth) {
      setThumbStyle({ left: 0, width: 0, opacity: 0 });
      return;
    }
    const ratio = clientWidth / scrollWidth;
    const thumbWidth = Math.max(24, trackWidth * ratio);
    const maxScroll = scrollWidth - clientWidth;
    const maxThumbOffset = trackWidth - thumbWidth;
    const left = (scrollLeft / (maxScroll || 1)) * maxThumbOffset;
    setThumbStyle({ left, width: thumbWidth, opacity: 0 });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateThumb();
    const onScroll = () => updateThumb();
    const onResize = () => updateThumb();
    scroller.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateThumb]);

  // Pointer drag handlers for thumb
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const scroller = scrollerRef.current;
      const track = trackRef.current;
      if (!scroller || !track) return;
      const deltaX = e.clientX - startXRef.current;
      const trackWidth = track.clientWidth;
      const scrollWidth = scroller.scrollWidth;
      const clientWidth = scroller.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      const ratio = maxScroll / Math.max(1, trackWidth - (thumbStyle.width || 0));
      scroller.scrollLeft = Math.min(maxScroll, Math.max(0, startScrollRef.current + deltaX * ratio));
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [thumbStyle.width]);

  const onThumbPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = scrollerRef.current ? scrollerRef.current.scrollLeft : 0;
    document.body.style.userSelect = "none";
  };

  return (
    <div className="relative group mx-auto max-w-4xl">
      <nav aria-label="Races" className="bg-transparent py-2">
        <div
          ref={scrollerRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth px-6 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="list"
        >
          <div className="inline-flex items-center gap-2">
            {RACES.map((r) => {
              const href = `/${r.slug}`;
              const isCurrent = r.slug.toLowerCase() === cur;
              if (isCurrent) {
                return (
                  <span
                    key={r.slug}
                    aria-current="page"
                    role="listitem"
                    className="inline-flex items-center h-8 px-3 rounded-full bg-zinc-900 text-white text-sm font-medium transition-colors duration-200"
                    style={{ pointerEvents: "none" }}
                  >
                    {r.label}
                  </span>
                );
              }
              return (
                <Link
                  key={r.slug}
                  href={href}
                  role="listitem"
                  className="inline-flex items-center h-8 px-3 rounded-full text-sm text-zinc-600 bg-transparent hover:bg-zinc-200/40 hover:text-zinc-800 transition-colors duration-200"
                >
                  {r.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* slim track + thumb that appears on hover — behavior unchanged */}
      <div
        ref={trackRef}
        className="absolute left-0 right-0 bottom-0 h-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden
      >
        <div className="relative mx-6 h-2 bg-zinc-200/20 rounded-full">
          <div
            onPointerDown={onThumbPointerDown}
            style={{
              left: `${thumbStyle.left}px`,
              width: `${thumbStyle.width}px`,
            }}
            className="absolute top-0 h-2 bg-zinc-500 rounded-full pointer-events-auto"
          />
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
