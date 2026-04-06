import { useTranslation } from "@shared/i18n";
import { precise } from "@shared/lib/utils";

export const UNITS = {
  individualPerCubicMeter: "individualPerCubicMeter",
  individualPerHectare: "individualPerHectare",
  individualPerTrap: "individualPerTrap",
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
      default:
        return null;
    }
  }

  return { formatWithUnit };
};
