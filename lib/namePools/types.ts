export type ToggleKey =
  | "nation"
  | "origin"
  | "era"
  | "gender"
  | "context"
  | "form"
  | "style"
  | "length";

export type OptionKey = string;

export type PoolLayer<T> = {
  key: ToggleKey;
  option: OptionKey;
  items: readonly T[];
  tags?: readonly string[];
};

export type PoolsByLayer<T> = Partial<Record<ToggleKey, Record<OptionKey, readonly T[]>>>;
