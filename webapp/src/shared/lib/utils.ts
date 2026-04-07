import type { NumericKeys } from "@shared/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function precise(value?: number | null) {
  if (!value || Number.isNaN(value)) {
    return "0";
  }
  if (value > 999) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}


export function preciseNumericIndicators<T extends Record<string, number | null | undefined>>(data: T, indicatorKeys: NumericKeys<T>[]): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      indicatorKeys.includes(key as (typeof indicatorKeys)[number])
        ? precise(Number(value))
        : value,
    ]),
  ) as T;
}