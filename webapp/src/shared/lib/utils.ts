import { type ClassValue, clsx } from "clsx";
import type { LayerMetadata } from "coordo";
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

export function findCategoricalLabel(
  metadata: LayerMetadata,
  fieldName: string,
  fieldValue: any,
): string | undefined {

  // Search field category in main resource schema
  const resourceLabel = metadata?.resource?.schema?.fields
    .find((f) => f.name === fieldName)
    ?.categories?.find((c) => c.value === fieldValue)?.label;

  if (resourceLabel) {
    return resourceLabel;
  }

  // Search field category in main resource's references' schemas
  return metadata?.references
    ?.find((ref) =>
      ref.schema.fields
        .find((f) => f.name === fieldName)
        ?.categories?.some((c) => c.value === fieldValue),
    )
    ?.schema.fields.find((f) => f.name === fieldName)
    ?.categories?.find((c) => c.value === fieldValue)?.label;
}
