import { createContext, useContext } from "react";

import type { ExternalData } from "@entities/data";

export const ExternalDataContext = createContext<ExternalData | null>(null);

/**
 * Read the external data published by the closest `<ExternalDataBoundary>` /
 * `<ExternalDataFetcherBoundary>`. The boundary has already suspended on the
 * fetch, so the value is always resolved here — never a promise, never null.
 */
export function useExternalData(): ExternalData {
  const externalData = useContext(ExternalDataContext);

  if (!externalData) {
    throw new Error(
      "useExternalData must be used within an <ExternalDataBoundary>",
    );
  }

  return externalData;
}
