import {
  type DashboardData,
  DashboardDataSchema,
} from "@entities/dashboard/generic";

import { fetchJSONWithAuth } from "@shared/api/client";

export const createApiClient = (authToken: string | null) => ({
  // Bases
  fetchDashboardData: async (layerId: string): Promise<DashboardData> => {
    const json = await fetchJSONWithAuth(
      `/maps/dashboard/${layerId}`,
      {},
      authToken,
    );
    return DashboardDataSchema.parse(json);
  },
});

export type ApiClient = ReturnType<typeof createApiClient>;
