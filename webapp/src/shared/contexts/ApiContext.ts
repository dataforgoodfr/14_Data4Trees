import { createContext } from "react";

import type { ApiClient } from "@shared/api/client";

export const ApiContext = createContext<ApiClient | undefined>(undefined);
