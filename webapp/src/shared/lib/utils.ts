import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { i18nInstance } from "@shared/i18n";

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

export function formatDate(date: Date | string) {
  return Intl.DateTimeFormat(i18nInstance.language, {
    dateStyle: "short",
  }).format(typeof date === "string" ? new Date(date) : (date as Date));
}
