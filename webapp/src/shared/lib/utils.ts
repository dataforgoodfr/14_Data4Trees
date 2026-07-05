import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ExternalData } from "@features/popup/forest-inventory/types";

import { i18nInstance } from "@shared/i18n";
import type { LayerMetadata } from "@shared/lib/coordo";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function precise(value?: number | null, defaultValue: string = "0") {
  if (!value || Number.isNaN(value)) {
    return defaultValue;
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
  // Searching field category in main resource schema
  const resourceLabel = metadata?.resource?.schema?.fields
    .find((f) => f.name === fieldName)
    ?.categories?.find((c) => c.value === fieldValue)?.label;

  if (resourceLabel) {
    return resourceLabel;
  }

  // Searching field category in main resource's references' schemas
  return metadata?.references
    ?.find((ref) =>
      ref.schema.fields
        .find((f) => f.name === fieldName)
        ?.categories?.some((c) => c.value === fieldValue),
    )
    ?.schema.fields.find((f) => f.name === fieldName)
    ?.categories?.find((c) => c.value === fieldValue)?.label;
}

export function findLabelInExternalData(
  externalData: ExternalData,
  resourceName: string,
  project: string,
  fieldName: string,
  fieldValue: any,
): string | undefined {
  // Get the data array for the resource (e.g., for_label, for_mf_tax1, etc.)
  const resourceData = externalData[resourceName];

  if (!resourceData || !Array.isArray(resourceData)) {
    return undefined;
  }

  // Find the record matching all criteria: proj, list_name, and name
  const record = resourceData.find((item) => {
    return (
      item?.proj?.trim() === project.trim() &&
      item?.list_name?.trim() === fieldName.trim() &&
      item?.name === fieldValue
    );
  });

  return record?.label;
}
