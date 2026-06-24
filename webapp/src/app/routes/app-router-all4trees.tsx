import { lazy } from "react";

import { MapProviderAll4Trees } from "@app/providers/map-provider-all4trees";

import { AppRouterBase } from "./app-router-base";

const MainPage = lazy(() => import("@pages/all4trees/main"));
const DashboardPage = lazy(() => import("@pages/all4trees/dashboard"));

export const AppRouterAll4Trees = () => {
  return (
    <AppRouterBase
      DashboardPage={DashboardPage}
      MainPage={MainPage}
      MapProvider={MapProviderAll4Trees}
      rootLayoutProps={{
        hasDashboard: true,
        logoSrc: "/logo_all4trees.png",
      }}
    />
  );
};
