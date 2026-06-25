import { use, useCallback, useState } from "react";

import Header from "@widgets/dashboard/header";
import YearDashboard from "@widgets/dashboard/year-dashboard";

import type { DashboardData } from "@entities/dashboard/generic";

const INITIAL_YEAR = 2024;

export default function LoadedDashboard({
  dataPromise,
}: {
  dataPromise: Promise<DashboardData>;
}) {
  const data = use(dataPromise);
  const sortedYears = Object.keys(data)
    .map(Number)
    .filter((year) => !Number.isNaN(year))
    .sort((a, b) => a - b);
  const initialYear = sortedYears.includes(INITIAL_YEAR)
    ? INITIAL_YEAR
    : sortedYears[0];
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    initialYear,
  );

  const handleYearChange = useCallback(
    (year: number) => {
      if (data[year]) {
        setSelectedYear(year);
      } else {
        console.warn("Année sélectionnée non disponible:", year);
      }
    },
    [data],
  );

  if (selectedYear === undefined || !data[selectedYear]) {
    // TODO: maybe we could ensure this never occurs by validating the data structure and using types (such as  [T, ...T[]] for the years array)
    return <div>No dashboard data available.</div>;
  }

  return (
    <div
      className="px-7 overflow-y-scroll h-full pb-4 custom-scrollbar"
      style={{
        "--scrollbar-thumb": "var(--info-foreground)",
        "--scrollbar-track": "var(--background)",
      }}
    >
      <Header
        onYearChange={handleYearChange}
        selectedYear={selectedYear}
        years={Object.keys(data).map(Number)}
      />
      <YearDashboard data={data[selectedYear]} />
    </div>
  );
}
