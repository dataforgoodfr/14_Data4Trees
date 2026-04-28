import { type ReactNode, useMemo } from "react";

import { createApiClient } from "@shared/api/client";
import { ApiContext } from "@shared/contexts/ApiContext";
import { useAuth } from "@features/auth/useAuth";

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const {token} = useAuth()
  const api = useMemo(() => createApiClient(token), []);

  return <ApiContext value={api}>{children}</ApiContext>;
}
