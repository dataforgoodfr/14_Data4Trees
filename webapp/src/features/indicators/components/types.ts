import type { ReactNode } from "react";

type IndicatorDivider = { type: "divider" };

type IndicatorDate = { type: "date"; date: string };

type IndicatorSection = { type: "section"; title: string; children: ReactNode };

type IndicatorCustomNode = { type: "customNode"; children: ReactNode };

export type UseIndicatorReturnType = Array<
  IndicatorDivider | IndicatorDate | IndicatorSection | IndicatorCustomNode
>;
