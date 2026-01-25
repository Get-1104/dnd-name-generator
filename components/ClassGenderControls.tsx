"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildUrl } from "@/lib/url";

const CLASSES = [
  { value: "", label: "Any Class" },
  { value: "fighter", label: "Fighter" },
  { value: "wizard", label: "Wizard" },
  { value: "rogue", label: "Rogue" },
  { value: "cleric", label: "Cleric" },
];

const GENDERS = [
  { value: "", label: "Any Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "neutral", label: "Neutral" },
];

export default function ClassGenderControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentClass = searchParams.get("class") ?? "";
  const currentGender = searchParams.get("gender") ?? "";

  const setParam = (patch: { class?: string; gender?: string }) => {
    const url = buildUrl(pathname, searchParams, {
      ...(patch.class !== undefined ? { class: patch.class } : {}),
      ...(patch.gender !== undefined ? { gender: patch.gender } : {}),
    });

    router.push(url, { scroll: false });
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-medium opacity-80 w-16">Class</div>
        {CLASSES.map((o) => {
          const active = o.value === currentClass;
          return (
            <button
              key={o.value || "any"}
              type="button"
              onClick={() => setParam({ class: o.value })}
              className={[
                "px-3 py-1.5 rounded-full text-sm transition",
                active
                  ? "bg-white/15 ring-1 ring-white/25"
                  : "bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-medium opacity-80 w-16">Gender</div>
        {GENDERS.map((o) => {
          const active = o.value === currentGender;
          return (
            <button
              key={o.value || "any"}
              type="button"
              onClick={() => setParam({ gender: o.value })}
              className={[
                "px-3 py-1.5 rounded-full text-sm transition",
                active
                  ? "bg-white/15 ring-1 ring-white/25"
                  : "bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
