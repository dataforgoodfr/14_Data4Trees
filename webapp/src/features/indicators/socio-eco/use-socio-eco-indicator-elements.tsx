import { useTranslation } from "@i18n";

import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import type { FormattedData } from "./format-data";
import { ChartEnergySources, ChartWoodEnergyNeeds } from "@features/charts/socio-eco";

export const useSocioEcoIndicatorElements = (
  data: FormattedData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");

  return [
    { date: data.date, type: "date" },
    { type: "divider" },
    {
      children: (
        <>
          <ChartEnergySources
            data={data.wood.energySources}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.socio-eco.sections.wood.energyConsumption",
            )}
            value={data.wood.woodEnergyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.woodEnergyNeeds} />
          <IndicatorRawValue
            dataName={t(
              "indicators.socio-eco.sections.wood.collectionTime",
            )}
            value={data.wood.woodCollectionTime}
          />
          <ChartWoodEnergyNeeds
            data={data.wood.lumberNeeds}
          />
        </>
        
      ),
      title: t("indicators.socio-eco.sections.wood.title"),
      type: "section",
    },
    { type: "divider" }
  ];
};
