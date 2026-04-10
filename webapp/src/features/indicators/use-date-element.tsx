import { i18nInstance } from "@shared/i18n";

import type { IndicatorDate, IndicatorDivider } from "./components/types";

type UseDateElementProps = {
  withDivider?: boolean;
  dateStr?: string;
};

// @TODO: to be removed later if still unused
export const useDateElement = ({
  withDivider,
  dateStr,
}: UseDateElementProps):
  | [IndicatorDate]
  | [IndicatorDate, IndicatorDivider] => {
  /** @todo Replace with date from backend data */
  const date = Intl.DateTimeFormat(i18nInstance.language, {
    dateStyle: "short",
  }).format(dateStr ? new Date(dateStr) : new Date());

  const dateElement = { date: date, type: "date" } as const;

  if (withDivider) {
    return [dateElement, { type: "divider" }];
  }

  return [dateElement];
};
