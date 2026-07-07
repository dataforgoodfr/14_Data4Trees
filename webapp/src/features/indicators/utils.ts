import type {
  ExternalData,
  LabelData,
} from "@features/popup/forest-inventory/types";

import { useTranslation } from "@shared/i18n";
import type { LayerMetadata } from "@shared/lib/coordo";
import { precise } from "@shared/lib/utils";
import type { NumericKeys } from "@shared/types";

export const UNITS = {
  essenceCount: "essenceCount",
  individualPerCubicMeter: "individualPerCubicMeter",
  individualPerHectare: "individualPerHectare",
  individualPerTrap: "individualPerTrap",
  m3PerHabPerYear: "m3PerHabPerYear",
  minPerHouseholdPerDay: "minPerHouseholdPerDay",
  monthPerYear: "monthPerYear",
  percentFoodRequirements: "percentFoodRequirements",
  speciesCount: "speciesCount",
  tonPerHectare: "tonPerHectare",
} as const;

export type Unit = keyof typeof UNITS;

/**
 * Return a function that appends the correct internationalized unit based on the `unit` input.
 */
export const useFormatterWithUnit = () => {
  const { t } = useTranslation(["common", "all4trees"]);

  function formatWithUnit(
    value: number | string | null | undefined,
    unit: Unit,
  ): string | null {
    const noDataStr = t("dataManagement.noData", { ns: "common" });
    if (value == null || value === noDataStr) {
      return noDataStr;
    }

    const formattedValue = typeof value === "number" ? precise(value) : value;

    switch (unit) {
      case UNITS.individualPerCubicMeter:
        return t("indicators.units.individualPerCubicMeter", {
          ns: "all4trees",
          value,
        });
      case UNITS.individualPerHectare:
        return t("indicators.units.individualPerHectare", {
          ns: "all4trees",
          value,
        });
      case UNITS.individualPerTrap:
        return t("indicators.units.individualPerTrap", {
          ns: "all4trees",
          value,
        });
      case UNITS.speciesCount:
        return t("indicators.units.speciesCount", {
          count: parseInt(formattedValue, 10),
          ns: "all4trees",
        });
      case UNITS.essenceCount:
        return t("indicators.units.essenceCount", {
          count: parseInt(formattedValue, 10),
          ns: "all4trees",
        });
      case UNITS.tonPerHectare:
        return t("indicators.units.tonPerHectare", { ns: "all4trees", value });
      case UNITS.m3PerHabPerYear:
        return t("indicators.units.m3PerHabPerYear", {
          ns: "all4trees",
          value,
        });
      case UNITS.monthPerYear:
        return t("indicators.units.monthPerYear", { ns: "all4trees", value });
      case UNITS.percentFoodRequirements:
        return t("indicators.units.percentFoodRequirements", {
          ns: "all4trees",
          value,
        });
      case UNITS.minPerHouseholdPerDay:
        return t("indicators.units.minPerHhPerDay", { ns: "all4trees", value });
      default:
        return noDataStr;
    }
  }

  return { formatWithUnit };
};

export function preciseNumericIndicators<T extends Record<string, any>>(
  data: T,
  indicatorKeys: NumericKeys<T>[],
  defaultValue?: string,
): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      indicatorKeys.includes(key as (typeof indicatorKeys)[number])
        ? precise(value, defaultValue)
        : value, // Keep the original value if it's not in the list of indicator keys
    ]),
  ) as T;
}

export function convertDictToPercentage(
  data: Record<string, number>,
  total: number,
  defaultValue: string,
): Record<string, number> {
  if (!data) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      Number(precise(Number((value * 100) / total), defaultValue)),
    ]),
  );
}

/*
  Compute score based on the scale define in for_score external data (see backed/catalog/inventaire_for)
  Ideally should be conmputed in the config.json but for now we can't do it.
*/
export function computeScore(value: number): number {
  if (value >= 10) return 0;

  if (value >= 8 && value < 10) return 1;

  if (value >= 6 && value < 8) return 2;

  if (value >= 4 && value < 6) return 3;

  if (value === 0) return 10;

  return 4 - Math.floor(Math.log10(value));
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

  // Find the record matching all criteria: project, list_name, and name
  const record = resourceData.find(
    (item: LabelData) =>
      item?.proj?.trim() === project.trim() &&
      item?.list_name?.trim() === fieldName.trim() &&
      item?.name === fieldValue,
  );

  return record?.label;
}
