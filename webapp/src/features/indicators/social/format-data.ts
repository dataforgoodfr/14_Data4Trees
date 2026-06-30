import { useTranslation } from "react-i18next";

import type { SocioEcoData } from "@features/popup/socio-eco";

import type { NumericKeys } from "@shared/types";

import {
  convertDictToPercentage,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "../utils";
import type { SocialData } from "./types";

const indicatorKeys: NumericKeys<SocialData>[] = [
  "wood_fuel_cons",
  "firewood_collec_time",
  "firewood_satis1",
  "firewood_satis2",
  "firewood_satis3",
  "firewood_satis98",
  "firewood_satis99",
  "timber_satis1",
  "timber_satis2",
  "timber_satis3",
  "timber_satis98",
  "timber_satis99",
  "lean_period",
  "food_diversity_score",
  "food_self_suff_score",
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSocialData = (data: SocioEcoData) => {
  const { t } = useTranslation("common");
  const { formatWithUnit } = useFormatterWithUnit();

  const safeData = preciseNumericIndicators<SocialData>(
    data,
    indicatorKeys,
    t("dataManagement.noData"),
  );

  safeData.food_diversity = convertDictToPercentage(
    safeData.food_diversity,
    data.household_nb,
    "0",
  );
  safeData.fuel_sources = convertDictToPercentage(
    safeData.fuel_sources,
    data.household_nb,
    "0",
  );

  console.log("Safe social Data", safeData);
  return {
    food: {
      foodDiversity: safeData.food_diversity,
      foodDiversityScore: `${safeData.food_diversity_score}/10`,
      foodSelfSufficiency: formatWithUnit(
        safeData.food_self_suff_score,
        UNITS.percentFoodRequirements,
      ),
      leanPeriod: formatWithUnit(safeData.lean_period, UNITS.monthPerYear),
    },
    wood: {
      collectionTime: formatWithUnit(
        safeData.firewood_collec_time,
        UNITS.minPerHouseholdPerDay,
      ),
      energyConsumption: formatWithUnit(
        safeData.wood_fuel_cons,
        UNITS.m3PerHabPerYear,
      ),
      firewoodNeeds: {
        difficultToMeet: Number(safeData.firewood_satis3),
        dontKnow: Number(safeData.firewood_satis98),
        easyToMeet: Number(safeData.firewood_satis1),
        moderateToMeet: Number(safeData.firewood_satis2),
        refuse: Number(safeData.firewood_satis99),
      },
      fuelSources: safeData.fuel_sources,
      timberNeeds: {
        difficultToMeet: Number(safeData.timber_satis3),
        dontKnow: Number(safeData.timber_satis98),
        easyToMeet: Number(safeData.timber_satis1),
        moderateToMeet: Number(safeData.timber_satis2),
        refuse: Number(safeData.timber_satis99),
      },
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatSocialData>;
