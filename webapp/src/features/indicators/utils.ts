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
  speciesCount: "speciesCount",
  tonPerHectare: "tonPerHectare",
} as const;

export type Unit = keyof typeof UNITS;

/**
 * Return a function that appends the correct internationalized unit based on the `unit` input.
 */
export const useFormatterWithUnit = () => {
  const { t } = useTranslation("all4trees");

  function formatWithUnit(
    value: number | string | null | undefined,
    unit: Unit,
  ): string | null {
    if (value == null) {
      return null;
    }

    const formattedValue = typeof value === "number" ? precise(value) : value;

    switch (unit) {
      case UNITS.individualPerCubicMeter:
        return t("indicators.units.individualPerCubicMeter", { value });
      case UNITS.individualPerHectare:
        return t("indicators.units.individualPerHectare", { value });
      case UNITS.individualPerTrap:
        return t("indicators.units.individualPerTrap", { value });
      case UNITS.speciesCount:
        return t("indicators.units.speciesCount", {
          count: parseInt(formattedValue, 10),
        });
      case UNITS.essenceCount:
        return t("indicators.units.essenceCount", {
          count: parseInt(formattedValue, 10),
        });
      case UNITS.tonPerHectare:
        return t("indicators.units.tonPerHectare", { value });
      case UNITS.m3PerHabPerYear:
        return t("indicators.units.m3PerHabPerYear", { value });
      case UNITS.monthPerYear:
        return t("indicators.units.monthPerYear", { value });
      case UNITS.percentFoodRequirements:
        return t("indicators.units.percentFoodRequirements", { value });
      case UNITS.minPerHouseholdPerDay:
        return t("indicators.units.minPerHhPerDay", { value });
      default:
        return null;
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
        ? precise(Number(value))
        : (value ?? defaultValue),
    ]),
  ) as T;
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
