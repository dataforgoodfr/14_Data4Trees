import {
  type Location,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "@features/auth/useAuth";
import { ChartForestPotential } from "@features/charts/biodiversity/chart-forest-potential";

import { useApi } from "@shared/hooks/useApi";
import type { ApiClient } from "@shared/api/client";

/**
 * Initial source target before redirecting to Login
 */
type LocationState = { from?: Location };

async function request(api:ApiClient) {
  const data = await api.getDashboardData();
  return data
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = usestate({})

  const api = useApi();

  useEffect (() => {
    setData(request(api))
    console.log(testing)
  }, [])

  return (

    <ChartForestPotential benef={data.forestPotentialLevel.benef} />
  );
}
