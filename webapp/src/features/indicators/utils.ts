import { useTranslation } from "@shared/i18n";
import { precise } from "@shared/lib/utils";
import type { NumericKeys } from "@shared/types";

export const UNITS = {
  individualPerCubicMeter: "individualPerCubicMeter",
  individualPerHectare: "individualPerHectare",
  individualPerTrap: "individualPerTrap",
  m3PerHabPerYear: "m3PerHabPerYear",
  speciesCount: "speciesCount",
  tonPerHectare: "tonPerHectare",
} as const;

export type Unit = keyof typeof UNITS;

/**
 * Return a function that appends the correct internationalized unit based on the `unit` input.
 */
export const useFormatterWithUnit = () => {
  const { t } = useTranslation("translations");

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
        return t("indicators.units.individualPerHectare", { value });
      case UNITS.individualPerHectare:
        return t("indicators.units.individualPerHectare", { value });
      case UNITS.individualPerTrap:
        return t("indicators.units.individualPerHectare", { value });
      case UNITS.speciesCount:
        return t("indicators.units.speciesCount", {
          count: parseInt(formattedValue, 10),
        });
      case UNITS.tonPerHectare:
        return t("indicators.units.tonPerHectare", { value });
      case UNITS.m3PerHabPerYear:
        return t("indicators.units.m3PerHabPerYear", { value });
      default:
        return null;
    }
  }

  return { formatWithUnit };
};

export function preciseNumericIndicators<T extends Record<string, any>>(
  data: T,
  indicatorKeys: NumericKeys<T>[],
  defaultValue: string,
): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      indicatorKeys.includes(key as (typeof indicatorKeys)[number])
        ? precise(Number(value))
        : value || defaultValue,
    ]),
  ) as T;
}
