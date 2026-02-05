import { WESTERN } from "./western";
import { NORTHERN } from "./northern";
import { EASTERN } from "./eastern";
import { FRONTIER } from "./frontier";

export type HumanCultureKey =
  | "western-kingdoms"
  | "northern-realms"
  | "eastern-empires"
  | "desert-realms"
  | "highland-tribal"
  | "southern-city-states"
  | "frontier-mixed";

export const HUMAN_POOLS = {
  "western-kingdoms": WESTERN,
  "northern-realms": NORTHERN,
  "eastern-empires": EASTERN,
  "frontier-mixed": FRONTIER,
} as const;

export const HUMAN_CULTURE_LABELS: Record<HumanCultureKey, string> = {
  "western-kingdoms": "Western Kingdoms",
  "northern-realms": "Northern Realms",
  "eastern-empires": "Eastern Empires",
  "desert-realms": "Desert Realms",
  "highland-tribal": "Highland / Tribal",
  "southern-city-states": "Southern City-States",
  "frontier-mixed": "Frontier / Mixed",
};

export const HUMAN_CULTURE_KEYS: HumanCultureKey[] = [
  "western-kingdoms",
  "northern-realms",
  "eastern-empires",
  "desert-realms",
  "highland-tribal",
  "southern-city-states",
  "frontier-mixed",
];
