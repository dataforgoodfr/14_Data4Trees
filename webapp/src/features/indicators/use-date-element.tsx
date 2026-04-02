import { i18nInstance } from "@shared/i18n";

import type { UseIndicatorReturnType } from "./components/types";

export const useDateElement = (): UseIndicatorReturnType => {
  /** @todo Replace with date from backend data */
  const date = Intl.DateTimeFormat(i18nInstance.language, {
    dateStyle: "short",
  }).format(new Date());

  return [{ date: date, type: "date" }, { type: "divider" }];
};
