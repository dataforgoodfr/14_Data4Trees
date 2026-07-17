import { useCallback } from "react";

import LoadedDashboard, {} from "@widgets/dashboard/loaded-dashboard";

import { SuspenseBoundary } from "@features/fallback/suspense-boundary";

import { LAYERS } from "@shared/api/layers";
import { useSuspenseData } from "@shared/api/suspense-fetch";
import { useApi } from "@shared/hooks/useApi";

export default function Dashboard() {
  const { getDashboardData } = useApi();

  // Stable per API client (auth token) so the promise cache stays scoped to
  // the current session — see suspense-fetch.ts.
  const fetcher = useCallback(
    () => getDashboardData(LAYERS.INVENTARY),
    [getDashboardData],
  );
  const { dataPromise, retry } = useSuspenseData({ fetcher });

  return (
    <SuspenseBoundary
      onError={(error, info) => {
        // Log the error to your error reporting service
        console.error("Error in Dashboard:", error, info);
      }}
      resource={dataPromise}
      retry={retry}
    >
      <LoadedDashboard dataPromise={dataPromise} />
    </SuspenseBoundary>
  );
}
