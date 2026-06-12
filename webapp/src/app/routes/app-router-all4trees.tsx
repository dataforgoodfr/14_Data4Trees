import { lazy } from "react";

import { MapProviderAll4Trees } from "@app/providers/map-provider-all4trees";

import { AppRouterBase } from "./app-router-base";

const MainPage = lazy(() => import("@pages/MainPage"));
const DashboardPage = lazy(() => import("@pages/dashboard"));

export const AppRouterAll4Trees = () => {
  return (
    <AppRouterBase
      DashboardPage={DashboardPage}
      MainPage={MainPage}
      MapProvider={MapProviderAll4Trees}
    />
  );
};
