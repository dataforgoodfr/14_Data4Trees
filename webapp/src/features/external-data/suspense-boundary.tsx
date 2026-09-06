import { type FC, type ReactNode, use, useMemo } from "react";

import { SuspenseBoundary } from "@features/fallback/suspense-boundary";

import type { ExternalData } from "@entities/data";

import { useSuspenseData } from "@shared/api/suspense-fetch";
import { useApi } from "@shared/hooks/useApi";

import { ExternalDataContext } from "./context";
import {
  type ExternalDataFetcher,
  getExternalDataPromiseByLayer,
} from "./getter";

type ExternalDataProviderProps = {
  externalDataPromise: Promise<ExternalData>;
  children: ReactNode;
};

/**
 * Reads the promise — suspending until it settles — and publishes the resolved
 * value on the context, where {@link useExternalData} picks it up.
 */
const ExternalDataProvider: FC<ExternalDataProviderProps> = ({
  externalDataPromise,
  children,
}) => (
  <ExternalDataContext.Provider value={use(externalDataPromise)}>
    {children}
  </ExternalDataContext.Provider>
);

type ExternalDataFetcherBoundaryProps = {
  /** Must be stable across renders. */
  fetcher: ExternalDataFetcher;
  /** Keeps one cached promise per key for a shared fetcher. */
  cacheKey?: string;
  children: ReactNode;
};

/**
 * Fetch + error/loading boundary + context, driven by an explicit fetcher.
 *
 * Use this when there is no `ApiProvider` above you — most notably map popups,
 * which are rendered into their own detached `createRoot` and therefore cannot
 * call `useApi()`. Everywhere inside the React tree, prefer
 * {@link ExternalDataBoundary}.
 */
export const ExternalDataFetcherBoundary: FC<
  ExternalDataFetcherBoundaryProps
> = ({ fetcher, cacheKey, children }) => {
  const { dataPromise: externalDataPromise, retry } = useSuspenseData({
    fetcher,
    key: cacheKey,
  });

  return (
    <SuspenseBoundary
      resource={externalDataPromise}
      retry={retry}
    >
      <ExternalDataProvider externalDataPromise={externalDataPromise}>
        {children}
      </ExternalDataProvider>
    </SuspenseBoundary>
  );
};

type ExternalDataBoundaryProps = {
  layerId: string;
  children: ReactNode;
};

/**
 * Fetches the external data declared for `layerId` and makes it available to
 * every descendant through {@link useExternalData}, with loading and error
 * states handled by `<SuspenseBoundary>`.
 *
 * ```tsx
 * <ExternalDataBoundary layerId={LAYERS.INVENTORY_FOR}>
 *   <MyPanel filters={filters} />
 * </ExternalDataBoundary>
 * ```
 */
export const ExternalDataBoundary: FC<ExternalDataBoundaryProps> = ({
  layerId,
  children,
}) => {
  const apiClient = useApi();

  const fetcher = useMemo(
    () => getExternalDataPromiseByLayer(layerId, apiClient),
    [layerId, apiClient],
  );

  return (
    <ExternalDataFetcherBoundary
      cacheKey={layerId}
      fetcher={fetcher}
    >
      {children}
    </ExternalDataFetcherBoundary>
  );
};
