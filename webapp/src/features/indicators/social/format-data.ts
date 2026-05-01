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
      collectionTime: formatWithUnit(safeData.woodCollectionTime, UNITS.minPerHouseholdPerDay),
      energyConsumption: formatWithUnit(0, UNITS.m3PerHabPerYear),
      energyNeeds: {
        difficultToMeet: 3,
        dontKnow: 2,
        easyToMeet: 4,
        moderateToMeet: 7,
      },
      energySources: {
        animalWaste: 4,
        boughtWood: 10,
        coal: 5,
        collectedWood: 18,
        gas: 14,
        organicWaste: 3,
        other: 1,
      },
      timberNeeds: {
        difficultToMeet: 2,
        dontKnow: 1,
        easyToMeet: 4,
        moderateToMeet: 8,
      },
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatSocialData>;
