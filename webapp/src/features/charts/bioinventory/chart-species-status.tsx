import { findStatus } from "@features/indicators/labels";

import type { BioSpeciesData } from "@entities/data";

import { i18nInstance, useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

import type { ChartComponentType } from "../components/chart-component";
import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  data: Record<string, number>;
  metadata: BioSpeciesData[];
  project: string;
};

export const ChartSpeciesStatus: ChartComponentType<PieChartProps> = ({
  data,
  metadata,
  project,
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;

  // Replace taxon string like 1-2-3 by corresponding status label in external data
  const labeledData = Object.entries(data).map<[string, number]>(
    ([name, value]) => {
      const tax3 = name.split("-")[2];
      const tax3status = (
        tax3
          ? findStatus(metadata, project, lang, Number(tax3))
          : t("common:dataManagement.other")
      ) as string;
      return [tax3status, value];
    },
  );

  // Sum pop values grouped by labels then map into chartData
  const chartData = Object.entries(
    labeledData.reduce(
      (acc, [tax3status, value]) => {
        if (!acc[tax3status]) {
          acc[tax3status] = 0;
        }
        acc[tax3status] += value;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  ).map(([tax3status, value], index) => ({
    fill: `var(--chart-${(index % 5) + 1})`,
    name: tax3status,
    value,
  }));

  // Generate chart config from chart Data
  const chartConfig = chartData.reduce((acc, element) => {
    return {
      ...acc,
      [element.name]: { label: element.name },
    };
  }, {} as ChartConfig);

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t("all4trees:indicators.bioinventory.status_abundance")}
      unit="%"
      withLabel
    />
  );
};

ChartSpeciesStatus.isChartComponent = true;
