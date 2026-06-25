import type { TFunction } from "i18next";
import { Suspense, use, useState } from "react";
import {
  ErrorBoundary,
  type FallbackProps,
  getErrorMessage,
} from "react-error-boundary";
import { ClipLoader } from "react-spinners";

import { DashboardHeader } from "@widgets/dashboard/dashboard-header";

import {
  ChartForestPotential,
  type ChartForestPotentialData,
} from "@features/charts/biodiversity/chart-forest-potential";

import { LAYERS } from "@shared/api/layers";
import { useApi } from "@shared/hooks/useApi";
import { useTranslation } from "@shared/i18n";

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

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader
        cssOverride={{
          // see https://github.com/davidhu2000/react-spinners/blob/main/src/ClipLoader.tsx
          borderLeftColor: "var(--accent)",
          borderRightColor: "var(--accent)",
          borderTopColor: "var(--accent)",
        }}
        loading={true}
        size={50}
      />
    </div>
  );
}

// ✅ Cache the Promise so the same one is reused across renders
// required by 'use()', see https://react.dev/reference/react/use#caching-promises-for-client-components
const cache = new Map<
  (typeof LAYERS)[keyof typeof LAYERS],
  Promise<DashboardData>
>();

// TODO: bettter typing (no "as")
export function fetchData({
  getDashboardData,
  layer,
}: {
  getDashboardData: (layerId: string) => Promise<DashboardData>;
  layer: (typeof LAYERS)[keyof typeof LAYERS];
}): Promise<DashboardData> {
  const cachedPromise = cache.get(layer);
  if (cachedPromise) {
    return cachedPromise;
  }
  const promise = getDashboardData(layer);
  cache.set(layer, promise);
  return promise;
}

function Dashboard() {
  const api = useApi();

  const data = use(
    fetchData({
      getDashboardData: api.getDashboardData,
      layer: LAYERS.INVENTARY,
    }),
  );

  return <YearDashboard data={data} />;
}

function YearDashboard({ data }: { data: DashboardData }) {
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

// t must be passed to the fallback render function because the error boundary fallback component cannot call hooks like useTranslation
function getFallbackRender({ t }: { t: TFunction<"all4trees", undefined> }) {
  function FallbackRender({ error }: FallbackProps) {
    const errorMessage =
      getErrorMessage(error) ?? t("dashboard.error.unknownMessage");

    return (
      <div className="flex flex-col items-center pt-24 gap-4">
        <h1 className="text-2xl font-bold text-destructive">
          {t("dashboard.error.title")}
        </h1>
        <p className="mt-2">{errorMessage}</p>
      </div>
    );
  }

  return FallbackRender;
}

export default function DashboardPage() {
  const { t } = useTranslation("all4trees");

  return (
    <ErrorBoundary fallbackRender={getFallbackRender({ t })}>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
