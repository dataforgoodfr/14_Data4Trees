import { useTranslation } from "react-i18next";

import type { NumericKeys } from "@shared/types";

import {
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "../utils";
import type { SocioEcoData } from "./types";

const indicatorKeys: NumericKeys<SocioEcoData>[] = [
  "population",
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
  "hungryGap",
  "incomeSources",
  "incomeEvolution",
  "estateIndex",
  "livingConditionsPercreption",
  "conflictIndex",
  "beneficialPractices",
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSocioEcoData = (data: SocioEcoData) => {
  const { t } = useTranslation("translations");
  const { formatWithUnit } = useFormatterWithUnit();

  const safeData = preciseNumericIndicators<SocioEcoData>(
    data,
    indicatorKeys,
    t("indicators.undefined"),
  );

  return {
    economy: {
      estateIndex: 13,
      incomeEvolution: [],
      incomeNbOfSources: 1,
      livingConditionsPerception: {
        dontKnow: 2,
        gotBetter: 1,
        gotWorse: 5,
        stayedTheSame: 3,
      },
      nbAdditionalIncomes: 1,
      sectorBenefits: 1000,
      sectorEcoParticipation: 300,
    },
    food: {
      autoConsumptionNeeds: 0,
      foodDiversityScore: safeData.foodDiversity,
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
      hungryGab: 0,
    },
    governance: {
      beneficialPractices: {
        defense: 0,
        improvedHousehold: 0,
        rna: 0,
        treePlanting: 0,
      },
      conflictIndex: 0,
    },
    wood: {
      collectionTime: 0,
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

export type FormattedData = ReturnType<typeof useFormatSocioEcoData>;
