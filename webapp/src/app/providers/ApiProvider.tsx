import { type ReactNode, useMemo } from "react";

import { useAuth } from "@features/auth/useAuth";

import { createApiClient } from "@shared/api/client";
import { ApiContext } from "@shared/contexts/ApiContext";

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { token } = useAuth();
  const api = useMemo(() => createApiClient(token), [token]);

  return <ApiContext value={api}>{children}</ApiContext>;
}
