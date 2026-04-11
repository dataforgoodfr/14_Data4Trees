import { formatDate } from "@shared/lib/utils";

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
  const date = formatDate(dateStr || new Date());

  const dateElement = { date: date, type: "date" } as const;

  if (withDivider) {
    return [dateElement, { type: "divider" }];
  }

  return [dateElement];
};
