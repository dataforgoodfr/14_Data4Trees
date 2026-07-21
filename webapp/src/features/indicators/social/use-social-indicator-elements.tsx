import { Calendar, Hourglass, Soup, Wheat, Zap } from "lucide-react";

import { LabeledBarChart, LabeledPieChart } from "@features/charts";
import { SATISFACTION_COLOR_MAP } from "@features/charts/socio-eco/constants";
import { IndicatorRawValue } from "@features/indicators/components/indicator-raw-value";
import type { UseIndicatorReturnType } from "@features/indicators/components/types";
import type { SocioEcoData } from "@features/popup/socio-eco";

import type { ExternalData } from "@entities/data";
import { SOCIO_LABEL_FIELDS } from "@entities/socio-eco";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { useFormatSocialData } from "./format-data";

export const useSocialIndicatorElements = (
  rawData: SocioEcoData,
  externalData: ExternalData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");
  const data = useFormatSocialData(rawData);

  return [
    {
      children: (
        <>
          <LabeledBarChart
            benef={data.wood.fuelSources}
            labelField={SOCIO_LABEL_FIELDS.ENERGY_SOURCES}
            legendLabel={t(
              "indicators.socioEco.sections.wood.energySources.legend",
            )}
            metadata={externalData.hh_label}
            project={rawData.project}
            title={t("indicators.socioEco.sections.wood.energySources.title")}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.wood.energyConsumption")}
            iconStart={<Zap size={ICON_SIZE} />}
            value={data.wood.energyConsumption}
          />
          <LabeledPieChart
            colorMap={SATISFACTION_COLOR_MAP}
            data={data.wood.firewoodNeeds}
            labelField={SOCIO_LABEL_FIELDS.SATISFACTION}
            metadata={externalData.hh_label}
            project={rawData.project}
            title={t("indicators.socioEco.sections.wood.energyNeeds.title")}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.wood.collectionTime")}
            iconStart={<Hourglass size={ICON_SIZE} />}
            value={data.wood.collectionTime}
          />
          <LabeledPieChart
            colorMap={SATISFACTION_COLOR_MAP}
            data={data.wood.timberNeeds}
            labelField={SOCIO_LABEL_FIELDS.SATISFACTION}
            metadata={externalData.hh_label}
            project={rawData.project}
            title={t("indicators.socioEco.sections.wood.timberNeeds.title")}
          />
        </>
      ),
      identifier: "indicator-wood",
      title: t("indicators.socioEco.sections.wood.title"),
      type: "section",
    },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.diversityScore")}
            iconStart={<Soup size={ICON_SIZE} />}
            value={data.food.foodDiversityScore}
          />
          <LabeledBarChart
            benef={data.food.foodDiversity}
            labelField={SOCIO_LABEL_FIELDS.FOOD_CONS}
            legendLabel={t(
              "indicators.socioEco.sections.food.diversity.legend",
            )}
            metadata={externalData.hh_label}
            project={rawData.project}
            title={t("indicators.socioEco.sections.food.diversity.title")}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.autoConso")}
            iconStart={<Wheat size={ICON_SIZE} />}
            value={data.food.foodSelfSufficiency}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.leanPeriod")}
            iconStart={<Calendar size={ICON_SIZE} />}
            value={data.food.leanPeriod}
          />
        </>
      ),
      identifier: "indicator-food",
      title: t("indicators.socioEco.sections.food.title"),
      type: "section",
    },
  ];
};
