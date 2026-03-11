import type { UseIndicatorReturnType } from "../components/types";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import { useTranslation } from "@i18n";
import { HeartPulseIcon, InfoIcon, BinocularsIcon } from "lucide-react";
import { ICON_SIZE } from "../components/constants";
import { ChartForestPotential } from "./chart-forest-potential";
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
              "indicators.biodiversity.sections.treeDiversity.speciesRichness",
            )}
            value={data.treeDiversity.speciesRichness}
            iconStart={<HeartPulseIcon size={ICON_SIZE} />}
          />
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
      title: t("indicators.biodiversity.sections.indicatorSpecies.title"),
      iconStart: <BinocularsIcon size={ICON_SIZE} />,
      children: (
        <>
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.indicatorSpecies.abundanceTaxon1",
            )}
            value={data.indicatorSpecies.abundanceTaxon1}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.indicatorSpecies.speciesRichnessTaxon1",
            )}
            value={data.indicatorSpecies.speciesRichnessTaxon1}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.indicatorSpecies.abundanceTaxon2",
            )}
            value={data.indicatorSpecies.abundanceTaxon2}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.indicatorSpecies.speciesRichnessTaxon2",
            )}
            value={data.indicatorSpecies.speciesRichnessTaxon2}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.indicatorSpecies.abundanceTaxon3",
            )}
            value={data.indicatorSpecies.abundanceTaxon3}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.indicatorSpecies.speciesRichnessTaxon3",
            )}
            value={data.indicatorSpecies.speciesRichnessTaxon3}
          />
        </>
      ),
    },
    { type: "divider" },
    {
      type: "section",
      title: t("indicators.biodiversity.sections.forestPotentialLevel.title"),
      children: (
        <ChartForestPotential
          data={{
            benef: data.forestPotentialLevel.benef,
            temoin: data.forestPotentialLevel.temoin,
          }}
        />
      ),
    },
  ];
};
