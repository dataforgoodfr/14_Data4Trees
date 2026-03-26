import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function precise(value: number) {
  if (!value || Number.isNaN(value)) return 0;
  if (value > 999) return Number(value.toFixed(1));
  return Number(value.toFixed(2));
}
