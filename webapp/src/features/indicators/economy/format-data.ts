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
    t("indicators.common.noData"),
  );

  return {
    economy: {
      assetsIndex: `${safeData.estateIndex}/10 (±${1})`,
      incomeSourceNb: `${1} (±${1})`,
      livingConditionsPerception: {
        dontKnow: 4,
        improvement: 28,
        refuse: 3,
        regression: 38,
        stable: 27,
      },
      nbAdditionalIncomes: 1,
      revenueChange: `${-5} % (±${1})`,
      sectorBenefits: 1000,
      sectorEcoParticipation: 300,
    },
    governance: {
      beneficialPractices: {
        defense: 71,
        improvedHousehold: 57,
        rna: 100,
        treePlanting: 100,
      },
      conflictIndex: `${6}/10 (±${1})`,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatEconomicData>;
