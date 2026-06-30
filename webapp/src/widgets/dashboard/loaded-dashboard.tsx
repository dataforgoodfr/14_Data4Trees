import { use, useState } from "react";

import { DashboardHeader } from "@widgets/dashboard/dashboard-header";

import {
  ChartForestPotential,
  type ChartForestPotentialData,
} from "@features/charts/biodiversity/chart-forest-potential";

export type DataField = { value: number | null; error: number | null };

const clientType = {
  BENEF1: 1,
  BENEF2: 2,
  TEMOIN: 0,
} as const;

export type DashboardData = Record<
  number,
  [
    Record<string, DataField>, // temoin
    Record<string, DataField>, // benef (?)
    Record<string, DataField>, // benef (?)
  ]
>;

function getValue({ value }: DataField) {
  // only keep two decimals, and return 0 if value is null
  return value == null ? 0 : Number(value.toFixed(2));
}

function formatBeneficiaryData(
  beneficiary: Record<string, DataField>,
): ChartForestPotentialData {
  return {
    deadWood: getValue(beneficiary.bio_idx_deadWood),
    density: getValue(beneficiary.bio_idx_tree_density),
    diameterDistribution: getValue(beneficiary.bio_idx_diametric_distribution),
    diversity: getValue(beneficiary.bio_idx_tree_diversity),
    dominantHeight: getValue(beneficiary.bio_idx_dominant_height),
    microHabitat: getValue(beneficiary.bio_idx_microhabitats),
    spatialDistribution: getValue(beneficiary.bio_idx_spatial_distribution),
    verticalDistribution: getValue(beneficiary.bio_idx_vertical_distribution),
  };
}

export default function LoadedDashboard({
  dataPromise,
}: {
  dataPromise: Promise<DashboardData>;
}) {
  const data = use(dataPromise);

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const chartData = data[selectedYear][clientType.BENEF1];

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
        <ChartForestPotential benef={formatBeneficiaryData(chartData)} />
      </div>
    </div>
  );
}
