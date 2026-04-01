import { i18nInstance, useTranslation } from "@shared/i18n";
import { precise } from "@shared/lib/utils";

import { UNITS, useFormatterWithUnit } from "../utils";

export type SocioEcoData = {
    admi2: string;
        population: number,
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
    wood: {
          energySources: {
            collectedWood: safeData.collectedWoodEnergy,
            boughtWood: safeData.boughtWoodEnergy,
            coal: safeData.coalEnergy,
            organicWaste: safeData.organicWasteEnergy,
            animalWaste: safeData.animalWasteEnergy,
            gas: safeData.gasEnergy,
            other: safeData.otherEnergy,
          },
          woodEnergyConsumption: formatWithUnit(0, UNITS.m3PerHabPerYear),
          woodEnergyNeeds: {
              easyToMeet: safeData.woodEnergyNeeds[0],
              moderateToMeet: 0,
              difficultToMeet: 0,
              dontKnow: 0,
          },
          woodCollectionTime: 0,
          lumberNeeds: {
              easyToMeet: 0,
              moderateToMeet: 0,
              difficultToMeet: 0,
              dontKnow: 0,
          }
      },
    food: {
          foodDiversity: {
              cereals: 0,
              roots: 0,
              vegetables: 0,
              fruits: 0,
              meat: 0,
              eggs: 0,
              fish: 0,
              seeds: 0                
          },
          autoConsumptionNeeds: 0,
          hungryGab: 0,
        },
    economy: {
        incomeNbOfSources: 0,
        incomeEvolution: 0,
        estateIndex: 0,
        livingConditionsPerception: {
            dontKnow: 0,
            gotWorse: 0,
            gotBetter: 0,
            stayedTheSame: 0,
        }
      },
      governance: {
          conflictIndex: 0,
          beneficialPractices: {
              treePlanting: 0,
              rna: 0,
              defense: 0,
              improvedHousehold: 0,
          }
      },
    date: Intl.DateTimeFormat(i18nInstance.language, {
      dateStyle: "short",
    }).format(new Date()), // to replace
    title: t("popup.socio-eco.title", {
      village: data.admi2,
    }),
  };
};

export type FormattedData = ReturnType<typeof useFormatSocioEcoData>;
