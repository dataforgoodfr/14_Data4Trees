import { useTranslation } from "react-i18next";

import type { NumericKeys } from "@shared/types";

import { preciseNumericIndicators } from "../utils";
import type { EconomicData } from "./types";

const indicatorKeys: NumericKeys<EconomicData>[] = [
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
export const useFormatEconomicData = (data: EconomicData) => {
  const { t } = useTranslation("translations");

  const safeData = preciseNumericIndicators<EconomicData>(
    data,
    indicatorKeys,
    t("indicators.undefined"),
  );

  return {
    economy: {
      assetsIndex: `${safeData.estateIndex}/10 (±${1})`,
      incomeSourceNb: `${1} (±${1})`,
      livingConditionsPerception: {
        dontKnow: 2,
        improvement: 1,
        refuse: 1,
        regression: 5,
        stable: 3,
      },
      nbAdditionalIncomes: 1,
      revenueChange: `${-5} % (±${1})`,
      sectorBenefits: 1000,
      sectorEcoParticipation: 300,
    },
    governance: {
      beneficialPractices: {
        defense: 4,
        improvedHousehold: 6,
        rna: 3,
        treePlanting: 8,
      },
      conflictIndex: `${6}/10 (±${1})`,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatEconomicData>;
