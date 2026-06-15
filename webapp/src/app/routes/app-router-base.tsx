import {
  type JSX,
  type LazyExoticComponent,
  lazy,
  type ReactNode,
} from "react";
import { Route, Routes } from "react-router-dom";

import { RootLayout, type RootLayoutProps } from "@app/layouts/RootLayout";

import { URLS } from "@shared/urls";

import { AdminRoute } from "./admin-route";

const AdminPage = lazy(() => import("@pages/common/admin"));
const LoginPage = lazy(() => import("@pages/common/login"));

export function AppRouterBase({
  DashboardPage,
  MainPage,
  MapProvider,
  rootLayoutProps,
}: {
  DashboardPage?: LazyExoticComponent<() => JSX.Element>;
  MainPage: LazyExoticComponent<() => JSX.Element>;
  MapProvider: (props: { children: ReactNode }) => ReactNode;
  rootLayoutProps: RootLayoutProps;
}) {
  return (
    <Routes>
      <Route
        element={<LoginPage />}
        path={URLS.LOGIN}
      />
      <Route
        element={
          <MapProvider>
            <RootLayout {...rootLayoutProps} />
          </MapProvider>
        }
        path="/"
      >
        <Route
          element={<MainPage />}
          index
        />
      </Route>
      <Route
        element={
          <AdminRoute>
            <RootLayout {...rootLayoutProps} />
          </AdminRoute>
        }
      >
        <Route
          element={<AdminPage />}
          path={URLS.ADMIN}
        />

        {DashboardPage && (
          <Route
            element={<DashboardPage />}
            path={URLS.DASHBOARD}
          />
        )}
      </Route>
    </Routes>
  );
}
