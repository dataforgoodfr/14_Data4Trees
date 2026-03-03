import type { UseIndicatorReturnType } from "../components/types";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import { useTranslation } from "@i18n";
import { HeartPulseIcon, InfoIcon } from "lucide-react";
import { ICON_SIZE } from "../components/constants";
import type { FormattedData } from "./format-data";

export const useBiodiversityIndicatorElements = (
  data: FormattedData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");

  return [
    { type: "date", date: data.date },
    { type: "divider" },
    {
      type: "section",
      title: t("indicators.biodiversity.sections.biomass.title"),
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.biodiversity.sections.biomass.volume")}
            value={data.biomass.volume}
          />
          <IndicatorRawValue
            dataName={t("indicators.biodiversity.sections.biomass.density")}
            value={data.biomass.density}
            iconStart={<InfoIcon size={ICON_SIZE} />}
          />
        </>
      ),
    },
    { type: "divider" },
    {
      type: "section",
      title: t("indicators.biodiversity.sections.treeDiversity.title"),
      children: (
        <>
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.treeDiversity.specificWealth",
            )}
            value={data.treeDiversity.specificWealth}
            iconStart={<HeartPulseIcon size={ICON_SIZE} />}
          />
          <div>TODO: Add the sector graph</div>
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.treeDiversity.shannon",
            )}
            value={data.treeDiversity.shannon}
          />
        </>
      ),
    },
    { type: "divider" },
    {
      type: "section",
      children: <p>Hello world</p>,
      title: t("indicators.biodiversity.sections.indicatorSpecies.title"),
    },
    { type: "divider" },
    {
      type: "section",
      children: <p>Hello world</p>,
      title: t("indicators.biodiversity.sections.forestPotentialLevel.title"),
    },
  ];
};
