import { ChartLine, HandCoins, Scroll } from "lucide-react";

import { LabeledBarChart, LabeledPieChart } from "@features/charts";
import { EVOLUTION_COLOR_MAP } from "@features/charts/socio-eco/constants";
import type { SocioEcoData } from "@features/popup/socio-eco";

import type { ExternalData } from "@entities/data";
import { SOCIO_LABEL_FIELDS } from "@entities/socio-eco";

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
          <LabeledPieChart
            colorMap={EVOLUTION_COLOR_MAP}
            data={data.economy.livingConditionsPerception}
            labelField={SOCIO_LABEL_FIELDS.EVOLUTION}
            metadata={externalData.hh_label}
            project={rawData.project}
            title={t(
              "indicators.socioEco.sections.economy.livingPerception.title",
            )}
          />
        </>
      ),
      identifier: "indicator-economy",
      title: t("indicators.socioEco.sections.economy.title"),
      type: "section",
    },
    {
      children: (
        <LabeledBarChart
          benef={data.governance.beneficialPractices}
          labelField={SOCIO_LABEL_FIELDS.BENEFICIAL_PRACTICES}
          legendLabel={t(
            "indicators.socioEco.sections.governance.beneficialPractices.legend",
          )}
          metadata={externalData.hh_label}
          project={rawData.project}
          title={t(
            "indicators.socioEco.sections.governance.beneficialPractices.title",
          )}
        />
      ),
      identifier: "indicator-governance",
      title: t("indicators.socioEco.sections.governance.title"),
      type: "section",
    },
  ];
};
