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
