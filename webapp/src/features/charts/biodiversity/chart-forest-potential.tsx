import { useTranslation } from "@i18n";

import type { ChartComponentType } from "../components/chart-component";
import { ChartRadarWithBenefAndControl } from "../components/radar-benef-control";

export type ChartForestPotentialData = {
  density: number;
  diversity: number;
  diameterDistribution: number;
  dominantHeight: number;
  microHabitat: number;
  deadWood: number;
  spatialDistribution: number;
  verticalDistribution: number;
};

type ChartForestPotentialProps = {
  benef: ChartForestPotentialData;
  temoin?: ChartForestPotentialData;
};

export const ChartForestPotential: ChartComponentType<
  ChartForestPotentialProps
> = ({ benef, temoin }) => {
  const { t } = useTranslation("all4trees");

  const chartData: Array<{
    indicator: string;
    benef: number;
    temoin?: number;
  }> = [
    {
      benef: benef.density,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.density",
      ),
      temoin: temoin?.density,
    },
    {
      benef: benef.diversity,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.diversity",
      ),
      temoin: temoin?.diversity,
    },
    {
      benef: benef.diameterDistribution,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.diameterDistribution",
      ),
      temoin: temoin?.diameterDistribution,
    },
    {
      benef: benef.dominantHeight,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.dominantHeight",
      ),
      temoin: temoin?.dominantHeight,
    },
    {
      benef: benef.microHabitat,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.microhabitat",
      ),
      temoin: temoin?.microHabitat,
    },
    {
      benef: benef.deadWood,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.deadWood",
      ),
      temoin: temoin?.deadWood,
    },
    {
      benef: benef.spatialDistribution,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.spatialDistribution",
      ),
      temoin: temoin?.spatialDistribution,
    },
    {
      benef: benef.verticalDistribution,
      indicator: t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.verticalDistribution",
      ),
      temoin: temoin?.verticalDistribution,
    },
  ];

  return (
    <ChartRadarWithBenefAndControl
      chartData={chartData}
      title={t(
        "indicators.biodiversity.sections.tropicalBiodivIndex.chartTitle",
      )}
      withTemoin={!!temoin}
    />
  );
};

ChartForestPotential.isChartComponent = true;
