import { useTranslation } from "react-i18next";

import type { SocioEcoData } from "@features/popup/socio-eco";

import type { NumericKeys } from "@shared/types";

import { convertDictToPercentage, preciseNumericIndicators } from "../utils";
import type { EconomicData } from "./types";

const indicatorKeys: NumericKeys<EconomicData>[] = [
  "revenue_change",
  "assets_idx",
  "nb_income_sources",
  "nb_additional_incomes",
  "sector_benef",
  "sector_support_amount",
  "nb_improved_skills",
  "conflict_idx",
  "stak_typ",
  "benef_pract1",
  "benef_pract2",
  "benef_pract3",
  "benef_pract4",
  "benef_pract5",
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatEconomicData = (data: SocioEcoData) => {
  const { t } = useTranslation("common");

  const safeData = preciseNumericIndicators<EconomicData>(
    data,
    indicatorKeys,
    t("dataManagement.noData"),
  );

  safeData.living_cond_perception = convertDictToPercentage(
    safeData.living_cond_perception,
    data.household_nb,
    "0",
  );

  return {
    economy: {
      assetsIndex: `${safeData.assets_idx}/10`,
      incomeSourceNb: safeData.nb_income_sources,
      livingConditionsPerception: {
        dontKnow: safeData.living_cond_perception["98"],
        improvement: safeData.living_cond_perception["1"],
        refuse: safeData.living_cond_perception["99"],
        regression: safeData.living_cond_perception["3"],
        stable: safeData.living_cond_perception["2"],
      },
      revenueChange: `${safeData.revenue_change} %`,
    },
    governance: {
      beneficialPractices: {
        pract1: safeData.benef_pract1,
        pract2: safeData.benef_pract2,
        pract3: safeData.benef_pract3,
        pract4: safeData.benef_pract4,
        pract5: safeData.benef_pract5,
      },
      conflictIndex: safeData.conflict_idx,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatEconomicData>;
