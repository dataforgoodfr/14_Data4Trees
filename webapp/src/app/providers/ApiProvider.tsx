import { type ReactNode, useMemo } from "react";

import { createApiClient } from "@shared/api/client";
import { ApiContext } from "@shared/contexts/ApiContext";

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const api = useMemo(() => createApiClient(), []);

  return <ApiContext value={api}>{children}</ApiContext>;
}
