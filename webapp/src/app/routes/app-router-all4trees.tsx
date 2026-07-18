import { lazy } from "react";

import { MapProviderAll4Trees } from "@app/providers/map-provider-all4trees";

import { LAYERS } from "@shared/api/layers";
import { useTranslation } from "@shared/i18n";

import { AppRouterBase } from "./app-router-base";

const MainPage = lazy(() => import("@pages/all4trees/main"));
const DashboardPage = lazy(() => import("@pages/all4trees/dashboard"));

export const AppRouterAll4Trees = () => {
  const { t } = useTranslation("all4trees");

  return (
    <AppRouterBase
      DashboardPage={DashboardPage}
      MainPage={MainPage}
      MapProvider={MapProviderAll4Trees}
      rootLayoutProps={{
        hasDashboard: true,
        layerOptions: [
          {
            translation: t("filters.categories.actions.forestInventary"),
            value: LAYERS.INVENTARY,
          },
          {
            translation: t("filters.categories.actions.socioEco"),
            value: LAYERS.ENQUETE,
          },
        ],
        logoSrc: "/logo_all4trees.png",
      }}
    />
  );
};
