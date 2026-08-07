import type { ScoringData, scoreLabel } from "@entities/data";

import { useTranslation } from "@shared/i18n";
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
  speciesInventoried: "speciesInventoried",
  speciesPerTrap: "speciesPerTrap",
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
  ): string {
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
      case UNITS.speciesPerTrap:
        return t("indicators.units.speciesPerTrap", {
          count: parseInt(formattedValue, 10),
          ns: "all4trees",
        });
      case UNITS.essenceCount:
        return t("indicators.units.essenceCount", {
          count: parseInt(formattedValue, 10),
          ns: "all4trees",
        });
      case UNITS.speciesInventoried:
        return t("indicators.units.speciesInventoried", {
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
        ? precise(Number(value), defaultValue)
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
  Format taxon relative abundance by converting the sring array containing data like 'taxon:pop' by:
  1. Sum all pop corresponding to same taxon
  2. Convert the pop to percentage of total population
  3. Return a record with taxon as key and percentage as value
  Example:
  Input: ['taxon1:10', 'taxon2:20', 'taxon1:30'], totalPopulation = 60
  Output: { taxon1: 66.67, taxon2: 33.33 }
*/
export function formatTaxonAbundance(
  abundancePop: string[],
  abundanceTotal: number,
) {
  if (!abundanceTotal) {
    return {};
  }

  const abundancePopRecord: Record<string, number> = {};
  abundancePop.forEach((value) => {
    if (value) {
      const [taxon, count] = value.split(":");
      const currentCount = abundancePopRecord[taxon] || 0;
      abundancePopRecord[taxon] = currentCount + parseInt(count, 10);
    }
  });

  return convertDictToPercentage(abundancePopRecord, abundanceTotal, "0");
}

/*
  Compute score based on the scale define in for_score external data
  Ideally should be conmputed in the config.json but for now we can't do it.
  Return the found score or default if no matching range is found
*/
export function computeScore({
  project,
  dataKey,
  value,
  scoringData,
}: {
  project: string;
  dataKey: scoreLabel;
  value: number;
  scoringData: ScoringData[];
}): number {
  const infKey = `${dataKey}_inf` as keyof ScoringData;
  const supKey = `${dataKey}_sup` as keyof ScoringData;

  return (
    scoringData
      .filter((item) => item.proj.trim() === project.trim())
      .find(
        (item) =>
          value >= Number(item[infKey]) && value <= Number(item[supKey]),
      )?.score || 0
  );
}
