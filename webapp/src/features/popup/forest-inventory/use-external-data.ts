import type { ApiClient } from "@shared/api/client";

export const fetchExternalData = (
  api: ApiClient,
  externalResources: string[],
) => {
  const { getCatalogResourceList } = api;
};

export type UseExternalDataReturnType = ReturnType<typeof fetchExternalData>;
