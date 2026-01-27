import type { PoolsByLayer, ToggleKey } from "./types";

type CropInput = {
  enabled: Partial<Record<ToggleKey, boolean>>;
  selected: Partial<Record<ToggleKey, string>>;
};

export function cropPools<T>(pools: PoolsByLayer<T>, input: CropInput) {
  const trace: Array<{ key: ToggleKey; option?: string; size: number; mode: "used" | "skipped" | "missing" }> = [];
  const keys = Object.keys(pools) as ToggleKey[];
  const activeArrays: T[][] = [];

  for (const key of keys) {
    const isOn = input.enabled[key];
    if (!isOn) {
      trace.push({ key, size: 0, mode: "skipped" });
      continue;
    }

    const option = input.selected[key];
    const layer = option ? pools[key]?.[option] : undefined;

    if (!option || !layer || layer.length === 0) {
      trace.push({ key, option, size: 0, mode: "missing" });
      continue;
    }

    activeArrays.push([...layer]);
    trace.push({ key, option, size: layer.length, mode: "used" });
  }

  return { activeArrays, trace };
}
