import { type ReactNode, createContext, useContext, useMemo } from "react";

import { createApiClient } from "../api/client";

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiContext = createContext<
  ReturnType<typeof createApiClient> | undefined
>(undefined);

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const api = useMemo(() => createApiClient(), []);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
