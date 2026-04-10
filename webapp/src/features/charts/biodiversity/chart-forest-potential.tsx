import type { FC } from "react";

import { useTranslation } from "@i18n";

import { ChartRadarWithBenefAndControl } from "../components/radar-benef-control";

type Data = {
  density: number;
  diversity: number;
  diameterDistribution: number;
  dominantHeight: number;
  microHabitat: number;
  ratioDeathmassBiomass: number;
  spatialDistribution: number;
  verticalDistribution: number;
};

type ChartForestPotentialProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartForestPotential: FC<ChartForestPotentialProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("translations");

  const chartData: Array<{
    indicator: string;
    benef: number;
    temoin?: number;
  }> = [
    {
      benef: benef.density,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.density",
      ),
      temoin: temoin?.density,
    },
    {
      benef: benef.diversity,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.diversity",
      ),
      temoin: temoin?.diversity,
    },
    {
      benef: benef.diameterDistribution,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.diameterDistribution",
      ),
      temoin: temoin?.diameterDistribution,
    },
    {
      benef: benef.dominantHeight,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.dominantHeight",
      ),
      temoin: temoin?.dominantHeight,
    },
    {
      benef: benef.microHabitat,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.microhabitat",
      ),
      temoin: temoin?.microHabitat,
    },
    {
      benef: benef.ratioDeathmassBiomass,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.ratioDeathmassBiomass",
      ),
      temoin: temoin?.ratioDeathmassBiomass,
    },
    {
      benef: benef.spatialDistribution,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.spatialDistribution",
      ),
      temoin: temoin?.spatialDistribution,
    },
    {
      benef: benef.verticalDistribution,
      indicator: t(
        "indicators.biodiversity.sections.forestPotentialLevel.verticalDistribution",
      ),
      temoin: temoin?.verticalDistribution,
    },
  ];

  return (
    <ChartRadarWithBenefAndControl
      chartData={chartData}
      title={t(
        "indicators.biodiversity.sections.forestPotentialLevel.chartTitle",
      )}
      withTemoin={!!temoin}
    />
  );
};
