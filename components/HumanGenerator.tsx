"use client";

// Do NOT import ElfNameGenerator here.

import { useEffect, useState } from "react";
import {
  HUMAN_CULTURE_KEYS,
  HUMAN_CULTURE_LABELS,
  HUMAN_POOLS,
  type HumanCultureKey,
} from "@/lib/namePools/human";

type SurnameCategory = "occupational" | "patronymic" | "toponymic" | "ornamental";

const formatPill =
  "inline-flex items-center justify-center h-9 min-h-0 px-3 text-sm rounded-xl border border-neutral-200 bg-white shadow-sm " +
  "hover:bg-neutral-50 active:scale-[0.99] transition " +
  "data-[active=true]:border-neutral-300 data-[active=true]:bg-neutral-300 data-[active=true]:text-neutral-900";

const optionPill =
  "h-9 px-3 text-sm leading-none rounded-xl border border-neutral-200 bg-white shadow-sm " +
  "hover:bg-neutral-50 active:scale-[0.99] transition " +
  "data-[active=true]:border-neutral-300 data-[active=true]:bg-neutral-300 data-[active=true]:text-neutral-900 " +
  "whitespace-nowrap";

function pickFromPool(list: readonly string[]) {
  if (list.length === 0) return "";
  return list[Math.floor(Math.random() * list.length)];
}

function lengthBucket(value: string) {
  const len = value.length;
  if (len <= 5) return "short";
  if (len <= 8) return "medium";
  return "long";
}

// Near-duplicate detection: check if two names are too similar
function areSimilar(name1: string, name2: string): boolean {
  const clean1 = name1.toLowerCase().replace(/\s+/g, "");
  const clean2 = name2.toLowerCase().replace(/\s+/g, "");
  
  // Exact match
  if (clean1 === clean2) return true;
  
  // Check if names share too much overlap (Levenshtein-like)
  const len1 = clean1.length;
  const len2 = clean2.length;
  
  // If one is a substring of the other
  if (clean1.includes(clean2) || clean2.includes(clean1)) return true;
  
  // Check prefix similarity (first 4 chars)
  if (len1 >= 4 && len2 >= 4) {
    const prefix1 = clean1.substring(0, 4);
    const prefix2 = clean2.substring(0, 4);
    if (prefix1 === prefix2) {
      // Also check suffix
      const suffix1 = clean1.substring(len1 - 3);
      const suffix2 = clean2.substring(len2 - 3);
      if (suffix1 === suffix2) return true;
    }
  }
  
  return false;
}

// Get phonetic signature for better duplicate detection
function getPhoneticSignature(name: string): string {
  const clean = name.toLowerCase().replace(/\s+/g, "");
  // Simple phonetic grouping
  return clean
    .replace(/[aeiou]/g, "v") // vowels
    .replace(/[bfpv]/g, "b") // labials
    .replace(/[cgjkq]/g, "k") // velars
    .replace(/[dt]/g, "t") // dentals
    .replace(/[lr]/g, "l") // liquids
    .replace(/[mn]/g, "m") // nasals
    .replace(/[sz]/g, "s"); // sibilants
}

export default function HumanGenerator() {
  const defaultInclude = true;

  const [isAdvanced, setIsAdvanced] = useState(false);
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLengths, setSelectedLengths] = useState<string[]>([]);
  const [includeSurname, setIncludeSurname] = useState(defaultInclude);
  const [surnameCustom, setSurnameCustom] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const cultureOptions = (Object.keys(HUMAN_CULTURE_LABELS) as HumanCultureKey[]).map(
    (key) => ({ value: key, label: HUMAN_CULTURE_LABELS[key] })
  );
  const genderOptions = [
    { value: "masculine", label: "Masculine" },
    { value: "feminine", label: "Feminine" },
    { value: "neutral", label: "Neutral" },
  ];

  const generate = () => {
    const targetCount = 10;
    const cultureFallback: keyof typeof HUMAN_POOLS = "western-kingdoms";
    
    // Determine active filters
    const activeCultures = isAdvanced && selectedCultures.length > 0 ? selectedCultures : [];
    const activeGenders = isAdvanced && selectedGenders.length > 0 ? selectedGenders : [];
    const activeLengths = isAdvanced && selectedLengths.length > 0 ? selectedLengths : [];

    // Normalize culture selection
    const getCulturePool = (key: string): keyof typeof HUMAN_POOLS => {
      if (key in HUMAN_POOLS) return key as keyof typeof HUMAN_POOLS;
      if (key === "highland-tribal" || key === "desert-realms" || key === "southern-city-states") {
        return "frontier-mixed";
      }
      return cultureFallback;
    };

    const cultures = activeCultures.length > 0
      ? activeCultures.map(getCulturePool)
      : (Object.keys(HUMAN_POOLS) as Array<keyof typeof HUMAN_POOLS>);

    // Get filtered given name pool for a culture
    const getGivenPool = (poolKey: keyof typeof HUMAN_POOLS) => {
      const pool = HUMAN_POOLS[poolKey];
      
      // Filter by gender
      let genderPools: Array<readonly string[]> = [
        pool.given.masculine,
        pool.given.feminine,
        pool.given.neutral,
      ];
      
      if (activeGenders.length > 0) {
        genderPools = activeGenders.map((g) => 
          (pool.given as Record<string, readonly string[]>)[g] ?? []
        );
      }
      
      const combined = genderPools.flatMap((g) => Array.from(g));
      
      // Filter by length if specified
      if (activeLengths.length > 0) {
        const filtered = combined.filter((name) => 
          activeLengths.includes(lengthBucket(name))
        );
        return filtered.length > 0 ? filtered : combined;
      }
      
      return combined;
    };

    // Get surname category weights based on culture
    const getSurnameWeights = (poolKey: keyof typeof HUMAN_POOLS) => {
      if (poolKey === "northern-realms") {
        return { occupational: 30, patronymic: 45, toponymic: 20, ornamental: 5 };
      }
      if (poolKey === "eastern-empires") {
        return { occupational: 35, patronymic: 25, toponymic: 30, ornamental: 10 };
      }
      if (poolKey === "frontier-mixed") {
        return { occupational: 40, patronymic: 20, toponymic: 30, ornamental: 10 };
      }
      // western-kingdoms default
      return { occupational: 45, patronymic: 30, toponymic: 20, ornamental: 5 };
    };

    // Pick surname category using weighted random
    const pickSurnameCategory = (
      poolKey: keyof typeof HUMAN_POOLS,
      ornamentalCount: number
    ): SurnameCategory => {
      const pool = HUMAN_POOLS[poolKey];
      const weights = getSurnameWeights(poolKey);
      
      const candidates = [
        { key: "occupational" as const, weight: weights.occupational, list: pool.surnames.occupational },
        { key: "patronymic" as const, weight: weights.patronymic, list: pool.surnames.patronymic },
        { key: "toponymic" as const, weight: weights.toponymic, list: pool.surnames.toponymic },
        { key: "ornamental" as const, weight: weights.ornamental, list: pool.surnames.ornamental },
      ].filter((c) => c.list.length > 0 && (c.key !== "ornamental" || ornamentalCount < 2));

      const total = candidates.reduce((sum, c) => sum + c.weight, 0);
      if (total <= 0) return "occupational";
      
      let roll = Math.random() * total;
      for (const c of candidates) {
        roll -= c.weight;
        if (roll <= 0) return c.key;
      }
      return candidates[0]?.key ?? "occupational";
    };

    // Build a name from the pool
    const buildName = (poolKey: keyof typeof HUMAN_POOLS, ornamentalCount: number) => {
      const givenPool = getGivenPool(poolKey);
      const given = pickFromPool(givenPool);
      
      if (!given) return { name: "", category: "" as SurnameCategory };

      if (!includeSurname) return { name: given, category: "" as SurnameCategory };
      
      if (surnameCustom.trim()) {
        return { name: `${given} ${surnameCustom.trim()}`, category: "" as SurnameCategory };
      }

      const pool = HUMAN_POOLS[poolKey];
      const category = pickSurnameCategory(poolKey, ornamentalCount);
      const surnameList = pool.surnames[category];
      const surname = pickFromPool(surnameList);
      
      return {
        name: surname ? `${given} ${surname}` : given,
        category,
      };
    };

    // Advanced generation with quality control
    const generateBatch = () => {
      const results: string[] = [];
      const usedExact = new Set<string>();
      const usedPhonetic = new Set<string>();
      const categoryCount = {
        occupational: 0,
        patronymic: 0,
        toponymic: 0,
        ornamental: 0,
      };
      
      const surnameFirstLetterCount = new Map<string, number>();
      let ornamentalCount = 0;
      
      // Create culture plan to ensure variety
      const culturePlan: Array<keyof typeof HUMAN_POOLS> = [];
      if (activeCultures.length === 0 && cultures.length >= 3) {
        // Ensure each culture gets at least 2 names
        const shuffled = [...cultures].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(3, shuffled.length); i++) {
          culturePlan.push(shuffled[i], shuffled[i]);
        }
      }
      while (culturePlan.length < targetCount) {
        culturePlan.push(pickFromPool(cultures) as keyof typeof HUMAN_POOLS);
      }
      
      // Generate names with quality control
      for (let i = 0; i < targetCount; i++) {
        let attempts = 0;
        let bestName = "";
        
        while (attempts < 100 && !bestName) {
          attempts++;
          
          const culture = culturePlan[i];
          const { name, category } = buildName(culture, ornamentalCount);
          
          if (!name) continue;
          
          // Check exact duplicate
          if (usedExact.has(name.toLowerCase())) continue;
          
          // Check phonetic similarity
          const phoneticSig = getPhoneticSignature(name);
          if (usedPhonetic.has(phoneticSig)) continue;
          
          // Check if too similar to existing names
          const tooSimilar = results.some((existing) => areSimilar(name, existing));
          if (tooSimilar) continue;
          
          // If has surname, check surname distribution
          if (includeSurname && !surnameCustom.trim() && name.includes(" ")) {
            const surname = name.split(" ").slice(1).join(" ");
            const firstLetter = surname.charAt(0).toLowerCase();
            const count = surnameFirstLetterCount.get(firstLetter) ?? 0;
            
            // Limit same first letter to avoid clustering
            if (count >= 3) continue;
            
            surnameFirstLetterCount.set(firstLetter, count + 1);
            
            // Track category distribution
            if (category) {
              categoryCount[category as SurnameCategory]++;
            }
          }
          
          // Check ornamental limit
          if (category === "ornamental") {
            if (ornamentalCount >= 2) continue;
            ornamentalCount++;
          }
          
          bestName = name;
        }
        
        if (bestName) {
          results.push(bestName);
          usedExact.add(bestName.toLowerCase());
          usedPhonetic.add(getPhoneticSignature(bestName));
        } else {
          // Fallback: just generate something
          const culture = culturePlan[i];
          const { name } = buildName(culture, 10); // Ignore ornamental limit
          if (name && !usedExact.has(name.toLowerCase())) {
            results.push(name);
            usedExact.add(name.toLowerCase());
          }
        }
      }
      
      return results;
    };

    const generated = generateBatch();
    setResults(generated);
  };

  const copy = async () => {
    const text = results.join("\n");
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (results.length === 0) {
      generate();
    }
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
      {!isAdvanced && (
        <>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
              onClick={generate}
            >
              Generate
            </button>

            <button
              type="button"
              className="text-base font-medium text-zinc-600 hover:text-zinc-800"
              onClick={() => setIsAdvanced(true)}
            >
              Advanced options ›
            </button>
          </div>

          <p className="mt-2 text-sm text-zinc-600">
            Generating lore-friendly human names with cultural variety. Use Advanced options for custom filters.
          </p>
        </>
      )}

      <div
        style={{
          maxHeight: isAdvanced ? "1200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <div className="mt-3 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-zinc-900">Advanced options</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  setSelectedCultures([]);
                  setSelectedGenders([]);
                  setSelectedLengths([]);
                  setIncludeSurname(defaultInclude);
                  setSurnameCustom("");
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => setIsAdvanced(false)}
              >
                Back to Basic
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
              <div className="pt-2 text-sm text-neutral-700">Culture / Region</div>
              <div className="flex flex-wrap gap-2">
                {cultureOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setSelectedCultures((prev) =>
                        prev[0] === opt.value ? [] : [opt.value]
                      )
                    }
                    data-active={selectedCultures.includes(opt.value)}
                    className={optionPill}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
              <div className="pt-2 text-sm text-neutral-700">Gender</div>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setSelectedGenders((prev) =>
                        prev[0] === opt.value ? [] : [opt.value]
                      )
                    }
                    data-active={selectedGenders.includes(opt.value)}
                    className={optionPill}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <div className="text-sm text-neutral-700">Length</div>
                <div className="flex flex-wrap gap-3 ml-4">
                  <button
                    type="button"
                    data-active={selectedLengths.includes("short")}
                    className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                    onClick={() =>
                      setSelectedLengths((prev) =>
                        prev[0] === "short" ? [] : ["short"]
                      )
                    }
                  >
                    Short
                  </button>
                  <button
                    type="button"
                    data-active={selectedLengths.includes("medium")}
                    className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                    onClick={() =>
                      setSelectedLengths((prev) =>
                        prev[0] === "medium" ? [] : ["medium"]
                      )
                    }
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    data-active={selectedLengths.includes("long")}
                    className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                    onClick={() =>
                      setSelectedLengths((prev) =>
                        prev[0] === "long" ? [] : ["long"]
                      )
                    }
                  >
                    Long / Formal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <div className="text-sm text-neutral-700"> </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={includeSurname}
                      onChange={(e) => setIncludeSurname(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Include surname</span>
                  </label>
                  <input
                    type="text"
                    value={surnameCustom}
                    onChange={(e) => setSurnameCustom(e.target.value)}
                    placeholder="Custom surname (optional)"
                    disabled={!includeSurname}
                    className={`h-9 w-full max-w-sm rounded-lg border px-3 text-sm placeholder:text-zinc-400 ${
                      includeSurname
                        ? "border-zinc-200 bg-white text-zinc-900"
                        : "border-zinc-200 bg-zinc-100 text-zinc-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isAdvanced && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
              onClick={generate}
            >
              Generate
            </button>

            <button
              type="button"
              className="btn-secondary px-4 py-2"
              onClick={copy}
            >
              Copy
            </button>
          </div>
          <div className="text-xs text-zinc-500">
            {selectedCultures.length > 0 || selectedGenders.length > 0 || selectedLengths.length > 0
              ? "Filtered results — clear filters for more variety"
              : "No filters selected — showing all cultures"}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        {results.map((name, i) => (
          <div key={`${name}-${i}`} className="w-full rounded-xl bg-zinc-50 px-3 py-2 font-medium">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
