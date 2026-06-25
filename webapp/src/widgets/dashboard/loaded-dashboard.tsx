import { useState } from "react";

import { DashboardHeader } from "@widgets/dashboard/dashboard-header";

import {
  ChartForestPotential,
  type ChartForestPotentialData,
} from "@features/charts/biodiversity/chart-forest-potential";

export type DataField = { value: number | null; error: number | null };

export type DashboardData = Record<
  number,
  { beneficiary: Record<string, DataField>; control: Record<string, DataField> }
>;

function twoDecimals(data: Record<string, DataField>) {
  return Object.fromEntries(
    Object.entries(data).map(([key, { value, error }]) => [
      key,
      {
        error: error == null ? 0 : Number(error.toFixed(2)),
        value: value == null ? 0 : Number(value.toFixed(2)),
      },
    ]),
  ) as Record<string, DataField>;
}

function formatBeneficiaryData(
  beneficiary: Record<string, DataField>,
): ChartForestPotentialData {
  return {
    deadWood: beneficiary.epf_deadWood.value ?? 0,
    density: beneficiary.epf_tree_density.value ?? 0,
    diameterDistribution: beneficiary.epf_diameter_distribution.value ?? 0,
    diversity: beneficiary.epf_tree_diversity.value ?? 0,
    dominantHeight: beneficiary.epf_dominant_height.value ?? 0,
    microHabitat: beneficiary.epf_microhabitats.value ?? 0,
    spatialDistribution: beneficiary.epf_spatial_distribution.value ?? 0,
    verticalDistribution: beneficiary.epf_vertical_distribution.value ?? 0,
  };
}

export default function LoadedDashboard({ data }: { data: DashboardData }) {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const chartData = (data[selectedYear]?.beneficiary ?? {}) as Record<
    string,
    DataField
  >;

  const handleYearChange = (year: string) => {
    const numericYear = Number(year);
    if (!Number.isNaN(numericYear)) {
      setSelectedYear(numericYear);
    } else {
      console.warn("Année sélectionnée invalide:", year);
    }
  };

  return (
    <div
      className="px-7 overflow-y-scroll h-full pb-4 custom-scrollbar"
      style={{
        "--scrollbar-thumb": "var(--info-foreground)",
        "--scrollbar-track": "var(--background)",
      }}
    >
      <DashboardHeader
        onValueChange={handleYearChange}
        selectedYear={selectedYear}
        years={Object.keys(data).map(Number)}
      />
      <div className="mt-4 space-y-4">
        <ChartForestPotential
          benef={formatBeneficiaryData(twoDecimals(chartData))}
        />
      </div>
    </div>
  );
}
