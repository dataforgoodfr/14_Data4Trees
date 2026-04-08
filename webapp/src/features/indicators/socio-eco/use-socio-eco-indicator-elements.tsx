import { BinocularsIcon } from "lucide-react";

import {
  ChartEnergySources,
  ChartWoodEnergyNeeds,
} from "@features/charts/socio-eco";
import { ChartLumberNeeds } from "@features/charts/socio-eco/chart-lumber-needs";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import type { FormattedData } from "./format-data";

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
          <ChartEnergySources data={data.wood.energySources} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.wood.energyConsumption")}
            value={data.wood.energyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.energyNeeds} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.wood.collectionTime")}
            value={data.wood.collectionTime}
          />
          <ChartLumberNeeds data={data.wood.lumberNeeds} />
        </>
      ),
      iconStart: <BinocularsIcon size={ICON_SIZE} />,
      identifier: "indicator-wood",
      title: t("indicators.socio-eco.sections.wood.title"),
      type: "section",
    },
    { type: "divider" },
  ];
};
