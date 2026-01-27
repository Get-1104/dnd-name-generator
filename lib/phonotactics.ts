export type PronounceableResult = { ok: boolean; reason?: string };

const VOWELS = "aeiou";
const HALF_VOWEL = "y";
const COMMON_ALLOW = ["th", "sh", "ch", "ph", "wh", "qu", "st", "nd", "rn", "rl", "ll", "ss", "ie", "ea", "ai", "oi", "ou", "au"];
const COMMON_BLOCK = ["yy", "thth", "hth", "wv", "vv", "jq", "qj", "qh", "qx", "ql"];
const TRIPLE_CONSONANT_ALLOW = ["str", "spr", "spl", "chr", "shr", "thr"];
const SOFT_BIGRAMS = ["ii", "aa", "uu"]; // allowed but should be downweighted by caller

export function normalizeNamePart(value: string) {
  return value.replace(/\s+/g, "").replace(/[^A-Za-z']/g, "").toLowerCase();
}

export function toTitleCase(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function hasRealVowel(lower: string) {
  return new RegExp(`[${VOWELS}]`, "i").test(lower);
}

function onlyY(lower: string) {
  return /y/i.test(lower) && !hasRealVowel(lower);
}

function hasIllegalTripleConsonant(lower: string) {
  for (let i = 0; i < lower.length - 2; i += 1) {
    const triplet = lower.slice(i, i + 3);
    if (TRIPLE_CONSONANT_ALLOW.includes(triplet)) continue;
    if (/^[bcdfghjklmnpqrstvwxyz]{3}$/.test(triplet)) return true;
  }
  return false;
}

function hasInvalidQ(lower: string) {
  if (/qq/.test(lower)) return true;
  if (/q(?!u)/.test(lower)) return true;
  return false;
}

function hasInvalidJStart(lower: string) {
  if (lower.startsWith("j")) {
    const next = lower.charAt(1);
    if (!next || !(`${VOWELS}${HALF_VOWEL}`.includes(next))) return true;
  }
  return false;
}

function hasInvalidH(lower: string) {
  for (let i = 0; i < lower.length - 1; i += 1) {
    if (lower[i] === "h") {
      const next = lower[i + 1] ?? "";
      if (!`${VOWELS}${HALF_VOWEL}`.includes(next)) return true;
    }
  }
  return false;
}

function containsBlacklistedBigrams(lower: string) {
  if (COMMON_BLOCK.some((bg) => lower.includes(bg))) return true;
  if (/yl$/.test(lower)) return true;
  return false;
}

function hasCommonBigram(lower: string) {
  return COMMON_ALLOW.some((bg) => lower.includes(bg));
}

export function isPronounceableEN(raw: string): PronounceableResult {
  const lower = normalizeNamePart(raw);
  if (!lower) return { ok: false, reason: "empty" };
  if (!/^[a-z']+$/.test(lower)) return { ok: false, reason: "charset" };

  if (onlyY(lower)) return { ok: false, reason: "only-y" };
  if (!hasRealVowel(lower)) return { ok: false, reason: "no-vowel" };

  if (hasIllegalTripleConsonant(lower)) return { ok: false, reason: "triple-consonant" };
  if (hasInvalidQ(lower)) return { ok: false, reason: "bad-q" };
  if (hasInvalidJStart(lower)) return { ok: false, reason: "bad-j" };
  if (hasInvalidH(lower)) return { ok: false, reason: "bad-h" };

  if (containsBlacklistedBigrams(lower)) return { ok: false, reason: "bad-bigram" };

  if (lower.length >= 5 && !hasCommonBigram(lower)) {
    return { ok: false, reason: "no-common-bigram" };
  }

  return { ok: true };
}

export function hasSoftBigrams(raw: string) {
  const lower = normalizeNamePart(raw);
  return SOFT_BIGRAMS.some((bg) => lower.includes(bg)) || /yy/.test(lower) || /yl$/.test(lower);
}
