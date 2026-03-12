import { BinocularsIcon, HeartPulseIcon, InfoIcon } from "lucide-react";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { ChartForestPotential } from "./chart-forest-potential";
import type { FormattedData } from "./format-data";

export const useBiodiversityIndicatorElements = (
  data: FormattedData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");

  return [
    { date: data.date, type: "date" },
    { type: "divider" },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.biodiversity.sections.biomass.volume")}
            value={data.biomass.volume}
          />
          <IndicatorRawValue
            dataName={t("indicators.biodiversity.sections.biomass.density")}
            iconStart={<InfoIcon size={ICON_SIZE} />}
            value={data.biomass.density}
          />
        </>
      ),
      title: t("indicators.biodiversity.sections.biomass.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.treeDiversity.speciesRichness",
            )}
            iconStart={<HeartPulseIcon size={ICON_SIZE} />}
            value={data.treeDiversity.speciesRichness}
          />
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.treeDiversity.shannon",
            )}
            value={data.treeDiversity.shannon}
          />
        </>
      ),
      title: t("indicators.biodiversity.sections.treeDiversity.title"),
      type: "section",
    },
    { type: "divider" },
    {
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
      iconStart: <BinocularsIcon size={ICON_SIZE} />,
      title: t("indicators.biodiversity.sections.indicatorSpecies.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <ChartForestPotential
          data={{
            benef: data.forestPotentialLevel.benef,
            temoin: data.forestPotentialLevel.temoin,
          }}
        />
      ),
      title: t("indicators.biodiversity.sections.forestPotentialLevel.title"),
      type: "section",
    },
  ];
};
