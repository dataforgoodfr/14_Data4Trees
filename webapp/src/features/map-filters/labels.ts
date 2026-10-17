import { LANGUAGES } from "@shared/i18n";

import type { FilterOption } from "./types";

type LabelKey = keyof Omit<FilterOption, "value">;

const isLabelKey = (key: string): key is LabelKey =>
  Object.values(LANGUAGES).some((language) => key === `label::${language}`);

/**
 * Label of an option in `language`, as computed by the backend.
 *
 * Falls back to French (the app's `fallbackLng`) and then to the raw value, so
 * an unexpected language code shows something rather than an empty checkbox.
 */
export const getOptionLabel = (
  option: FilterOption,
  language: string,
): string => {
  const key = `label::${language}`;
  const label = isLabelKey(key)
    ? option[key]
    : option[`label::${LANGUAGES.FRENCH}`];

  return String(label ?? option.value);
};

/** Checkbox items for a group; identifiers are the stringified raw values. */
export const toCheckboxItems = (options: FilterOption[], language: string) =>
  options.map((option) => ({
    identifier: String(option.value),
    label: getOptionLabel(option, language),
  }));
