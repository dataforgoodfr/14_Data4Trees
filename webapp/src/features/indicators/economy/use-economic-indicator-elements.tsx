import { useTranslation } from "@i18n";

import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { ChartLivingPerception } from "@features/charts/socio-eco/chart-living-perception";
import type { EconomicData } from "./types";
import { useFormatEconomicData } from "./format-data";
import { ChartBeneficialPractices } from "@features/charts/socio-eco/chart-beneficial-practices";

export const useEconomicIndicatorElements = (
  rawData: EconomicData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");
  const data = useFormatEconomicData(rawData);

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.economy.incomeSourceNb")}
            value={data.economy.incomeSourceNb}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.economy.revenueChange")}
            value={data.economy.revenueChange}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.economy.assetsIndex")}
            value={data.economy.assetsIndex}
          />
          <ChartLivingPerception data={data.economy.livingConditionsPerception} />
        </>
      ),
      identifier: "indicator-economy",
      title: t("indicators.socioEco.sections.economy.title"),
      type: "section",
    },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.governance.conflictIndex")}
            value={data.governance.conflictIndex}
          />
        <ChartBeneficialPractices benef={data.governance.beneficialPractices} />
        </>
      ),
      identifier: "indicator-governance",
      title: t("indicators.socioEco.sections.governance.title"),
      type: "section",
    }
  ];
};
