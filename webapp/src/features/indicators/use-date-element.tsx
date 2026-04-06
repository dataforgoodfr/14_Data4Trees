import { i18nInstance } from "@shared/i18n";

import type { IndicatorDate, IndicatorDivider } from "./components/types";

type UseDateElementProps = {
  withDivider?: boolean;
};

export const useDateElement = ({
  withDivider,
}: UseDateElementProps):
  | [IndicatorDate]
  | [IndicatorDate, IndicatorDivider] => {
  /** @todo Replace with date from backend data */
  const date = Intl.DateTimeFormat(i18nInstance.language, {
    dateStyle: "short",
  }).format(new Date());

  const dateElement = { date: date, type: "date" } as const;

  if (withDivider) {
    return [dateElement, { type: "divider" }];
  }

  return [dateElement];
};
