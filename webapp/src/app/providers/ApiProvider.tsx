import { type ReactNode, useMemo } from "react";

import { createApiClient } from "@features/api/client";
import { useAuth } from "@features/auth/useAuth";
import { ApiContext } from "@features/contexts/ApiContext";

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { token } = useAuth();
  const api = useMemo(() => createApiClient(token), [token]);

  return <ApiContext value={api}>{children}</ApiContext>;
}
