import type { ChartComponentType } from "@features/charts/components/chart-component";
import { PieChartCategorical } from "@features/charts/components/pie-chart-categorical";
import { findFunction } from "@features/indicators/labels";

import type { ExternalData, FuncSpeciesData } from "@entities/data";

import { i18nInstance, useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

type PieChartProps = {
  data: Record<string, number>;
  metadata: ExternalData;
  project: string;
};

function getTaxonLabels(
  length: number,
  metadata: ExternalData,
): FuncSpeciesData[] {
  switch (length) {
    case 1:
      console.log("metadata for_mf_tax1", metadata.for_mf_tax1);
      return metadata.for_mf_tax1;
    case 2:
      console.log("metadata for_mf_tax2", metadata.for_mf_tax2);
      return metadata.for_mf_tax2;
    case 3:
      console.log("metadata for_mf_tax3", metadata.for_mf_tax3);
      return metadata.for_mf_tax3;
    default:
      console.warn("Taxon length not supported for function labels:", length);
      return metadata.for_mf_tax3;
  }
}

export const ChartSpeciesFunction: ChartComponentType<PieChartProps> = ({
  data,
  metadata,
  project,
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;

  console.log("ChartSpeciesFunction data", data);
  // Replace taxon string like 1-2-3 by corresponding status label in external data
  const labeledData = Object.entries(data).map<[string, number]>(
    ([name, value]) => {
      const taxons = name.split("-");
      const lastTaxon = taxons[taxons.length - 1];
      const taxFunc = (
        lastTaxon
          ? findFunction(
              getTaxonLabels(taxons.length, metadata),
              project,
              lang,
              taxons.length,
              Number(lastTaxon),
            )
          : t("common:dataManagement.other")
      ) as string;
      return [taxFunc, value];
    },
  );

  // Sum pop values grouped by labels then map into chartData
  const chartData = Object.entries(
    labeledData.reduce(
      (acc, [label, value]) => {
        if (!acc[label]) {
          acc[label] = 0;
        }
        acc[label] += value;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  ).map(([label, value], index) => ({
    fill: `var(--chart-${(index % 5) + 1})`,
    name: label,
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
      title={t(
        "all4trees:indicators.soil.sections.soilFauna.functionAbundance",
      )}
      unit="%"
      withLabel
    />
  );
};

ChartSpeciesFunction.isChartComponent = true;
