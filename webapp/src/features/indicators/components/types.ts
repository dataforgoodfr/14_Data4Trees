import type { ReactNode } from "react";

export type IndicatorDivider = { type: "divider" };

export type IndicatorDate = { type: "date"; date: string };

type IndicatorSection = {
  type: "section";
  title: string;
  iconStart?: ReactNode;
  children: ReactNode;
  identifier: string;
};

type IndicatorCustomNode = { type: "customNode"; children: ReactNode };

export type UseIndicatorReturnType = Array<
  IndicatorDivider | IndicatorDate | IndicatorSection | IndicatorCustomNode
>;
