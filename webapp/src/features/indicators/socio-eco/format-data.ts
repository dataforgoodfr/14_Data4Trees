import { i18nInstance, useTranslation } from "@shared/i18n";
import { precise } from "@shared/lib/utils";

import { UNITS, useFormatterWithUnit } from "../utils";

export type SocioEcoData = {
  admi2: string;
  population: number;
  collectedWoodEnergy: number;
  boughtWoodEnergy: number;
  coalEnergy: number;
  organicWasteEnergy: number;
  animalWasteEnergy: number;
  gasEnergy: number;
  otherEnergy: number;
  woodEnergyConsumption: number;
  woodEnergyNeeds: number[];
  woodCollectionTime: number;
  lumberNeeds: number;
  foodDiversity: number;
  autoConsumtionNeeds: number;
  hungryGap: number;
  incomeSources: number;
  incomeEvolution: number;
  estateIndex: number;
  livingConditionsPercreption: number;
  conflictIndex: number;
  beneficialPractices: number;
};

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

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
  "lumberNeeds",
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

  const safeData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      indicatorKeys.includes(key as (typeof indicatorKeys)[number])
        ? precise(Number(value))
        : value,
    ]),
  ) as SocioEcoData;

  return {
    date: Intl.DateTimeFormat(i18nInstance.language, {
      dateStyle: "short",
    }).format(new Date()), // to replace
    economy: {
      estateIndex: 0,
      incomeEvolution: 0,
      incomeNbOfSources: 0,
      livingConditionsPerception: {
        dontKnow: 0,
        gotBetter: 0,
        gotWorse: 0,
        stayedTheSame: 0,
      },
    },
    food: {
      autoConsumptionNeeds: 0,
      foodDiversity: {
        cereals: safeData.foodDiversity,
        eggs: 0,
        fish: 0,
        fruits: 0,
        meat: 0,
        roots: 0,
        seeds: 0,
        vegetables: 0,
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
    title: t("popup.socio-eco.title", {
      village: data.admi2,
    }),
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
      lumberNeeds: {
        difficultToMeet: 2,
        dontKnow: 1,
        easyToMeet: 4,
        moderateToMeet: 8,
      },
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatSocioEcoData>;
