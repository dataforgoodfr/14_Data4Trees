import { useTranslation } from "react-i18next";

import type { NumericKeys } from "@shared/types";

import {
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "../utils";
import type { SocialData } from "./types";

const indicatorKeys: NumericKeys<SocialData>[] = [
  "collectedWoodEnergy",
  "boughtWoodEnergy",
  "coalEnergy",
  "organicWasteEnergy",
  "animalWasteEnergy",
  "gasEnergy",
  "otherEnergy",
  "woodEnergyConsumption",
  "woodCollectionTime",
  "timberNeeds",
  "foodDiversity",
  "autoConsumtionNeeds",
  "leanPeriod",
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSocialData = (data: SocialData) => {
  const { t } = useTranslation("translations");
  const { formatWithUnit } = useFormatterWithUnit();

  const safeData = preciseNumericIndicators<SocialData>(
    data,
    indicatorKeys,
    t("indicators.common.noData"),
  );

  return {
    food: {
      autoConsumptionNeeds: `${formatWithUnit(34, UNITS.percentFoodRequirements)} (±${4})`,
      foodDiversity: {
        cereals: 99,
        eggs: 4,
        fish: 23,
        fruits: 24,
        meat: 14,
        roots: 92,
        seeds: 50,
        vegetables: 87,
      },
      foodDiversityScore: `${7.6}/10`,
      leanPeriod: formatWithUnit(3, UNITS.monthPerYear),
    },
    wood: {
      collectionTime: formatWithUnit(
        safeData.woodCollectionTime,
        UNITS.minPerHouseholdPerDay,
      ),
      energyConsumption: formatWithUnit(0, UNITS.m3PerHabPerYear),
      energyNeeds: {
        difficultToMeet: 48,
        dontKnow: 4,
        easyToMeet: 10,
        moderateToMeet: 38,
      },
      energySources: {
        animalWaste: 14,
        boughtWood: 14,
        coal: 57,
        collectedWood: 100,
        gas: 71,
        organicWaste: 86,
        other: 57,
      },
      timberNeeds: {
        difficultToMeet: 38,
        dontKnow: 6,
        easyToMeet: 16,
        moderateToMeet: 40,
      },
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatSocialData>;
