import type { FC } from "react";

import type { FormattedData } from "@features/indicators/biodiversity/format-data";

import { useTranslation } from "@i18n";

import { ChartRadarWithBenefAndControl } from "../components/radar-benef-control";

type ChartForestPotentialProps = {
  data: FormattedData["forestPotentialLevel"];
};

export const ChartForestPotential: FC<ChartForestPotentialProps> = ({
  data,
}) => {
  const { t } = useTranslation("translations");
  const { benef, temoin } = data;

  const chartData: Array<{ indicator: string; benef: number; temoin: number }> =
    [
      {
        benef: benef.density,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.density",
        ),
        temoin: temoin.density,
      },
      {
        benef: benef.diversity,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.diversity",
        ),
        temoin: temoin.diversity,
      },
      {
        benef: benef.diameterDistribution,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.diameterDistribution",
        ),
        temoin: temoin.diameterDistribution,
      },
      {
        benef: benef.dominantHeight,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.dominantHeight",
        ),
        temoin: temoin.dominantHeight,
      },
      {
        benef: benef.microhabitat,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.microhabitat",
        ),
        temoin: temoin.microhabitat,
      },
      {
        benef: benef.ratioDeathmassBiomass,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.ratioDeathmassBiomass",
        ),
        temoin: temoin.ratioDeathmassBiomass,
      },
      {
        benef: benef.spatialDistribution,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.spatialDistribution",
        ),
        temoin: temoin.spatialDistribution,
      },
      {
        benef: benef.verticalDistribution,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.verticalDistribution",
        ),
        temoin: temoin.verticalDistribution,
      },
    ];

  return (
    <ChartRadarWithBenefAndControl
      chartData={chartData}
      title={t(
        "indicators.biodiversity.sections.forestPotentialLevel.chart-title",
      )}
      withTemoin={!!temoin}
    />
  );
};
