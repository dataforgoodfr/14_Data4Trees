import { createContext } from "react";

import type { createApiClient } from "@shared/api/client";

export const ApiContext = createContext<
  ReturnType<typeof createApiClient> | undefined
>(undefined);
