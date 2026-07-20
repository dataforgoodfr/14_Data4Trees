import { ChartLine, HandCoins, Scroll } from "lucide-react";

import {
  ChartBeneficialPractices,
  ChartLivingCondition,
} from "@features/charts/socio-eco";
import type { SocioEcoData } from "@features/popup/socio-eco";

import type { ExternalData } from "@entities/data";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { useFormatEconomicData } from "./format-data";

export const useEconomicIndicatorElements = (
  rawData: SocioEcoData,
  externalData: ExternalData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");
  const data = useFormatEconomicData(rawData);

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.economy.incomeSourceNb")}
            iconStart={<HandCoins size={ICON_SIZE} />}
            value={data.economy.incomeSourceNb}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.economy.revenueChange")}
            iconStart={<ChartLine size={ICON_SIZE} />}
            value={data.economy.revenueChange}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.economy.assetsIndex")}
            iconStart={<Scroll size={ICON_SIZE} />}
            value={data.economy.assetsIndex}
          />
          <ChartLivingCondition
            data={data.economy.livingConditionsPerception}
            metadata={externalData.hh_label}
            project={rawData.project}
          />
        </>
      ),
      identifier: "indicator-economy",
      title: t("indicators.socioEco.sections.economy.title"),
      type: "section",
    },
    {
      children: (
        <>
          {/* Not implemented yet, waiting for All4Trees to better define this indicator.
          <IndicatorRawValue
            dataName={t(
              "indicators.socioEco.sections.governance.conflictIndex",
            )}
            value={data.governance.conflictIndex}
          /> */}
          <ChartBeneficialPractices
            benef={data.governance.beneficialPractices}
          />
        </>
      ),
      identifier: "indicator-governance",
      title: t("indicators.socioEco.sections.governance.title"),
      type: "section",
    },
  ];
};
