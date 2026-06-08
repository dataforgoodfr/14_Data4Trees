import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import { DashboardHeader } from "@widgets/dashboard/dashboard-header";

import {
  ChartForestPotential,
  type ChartForestPotentialData,
} from "@features/charts/biodiversity/chart-forest-potential";

import { LAYERS } from "@shared/api/layers";
import { useApi } from "@shared/hooks/useApi";

import type { DashboardData, DataField } from "./types";

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

export function DashboardPage() {
  const api = useApi();
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [data, setData] = useState<DashboardData>({});
  const [chartData, setChartData] = useState<Record<string, DataField>>({});
  const [loading, setLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies : <no need to add dependency>
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardData = await api.getDashboardData(LAYERS.INVENTARY);
      setData(dashboardData);
      setChartData(dashboardData[selectedYear]?.beneficiary ?? {});
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year: string) => {
    const numericYear = Number(year);
    if (!isNaN(numericYear)) {
      setSelectedYear(numericYear);
      setChartData(data[numericYear]?.beneficiary ?? {});
    } else {
      console.warn("Année sélectionnée invalide:", year);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader
          color="#4A90E2"
          loading={loading}
          size={50}
        />
      </div>
    );
  }

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
