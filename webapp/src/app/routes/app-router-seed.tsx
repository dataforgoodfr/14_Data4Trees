import { lazy } from "react";

import { MapProviderSeed } from "@app/providers/map-provider-seed";

import { AppRouterBase } from "./app-router-base";

const MainPage = lazy(() => import("@pages/seed/main"));

export const AppRouterSeed = () => {
  return (
    <AppRouterBase
      MainPage={MainPage}
      MapProvider={MapProviderSeed}
      rootLayoutProps={{
        hasDashboard: false,
        logoSrc: "/seed-logo.png",
      }}
    />
  );
};
