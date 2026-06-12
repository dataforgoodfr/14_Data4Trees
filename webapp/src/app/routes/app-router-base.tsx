import {
  type JSX,
  type LazyExoticComponent,
  lazy,
  type ReactNode,
} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RootLayout } from "@app/layouts/RootLayout";

import { URLS } from "@shared/urls";

import { AdminRoute } from "./admin-route";

const AdminPage = lazy(() => import("@pages/admin"));
const LoginPage = lazy(() => import("@pages/login"));

export function AppRouterBase({
  DashboardPage,
  MainPage,
  MapProvider,
}: {
  DashboardPage?: LazyExoticComponent<() => JSX.Element>;
  MainPage: LazyExoticComponent<() => JSX.Element>;
  MapProvider: (props: { children: ReactNode }) => ReactNode;
}) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<LoginPage />}
          path={URLS.LOGIN}
        />
        <Route
          element={
            <MapProvider>
              <RootLayout />
            </MapProvider>
          }
          path={URLS.HOME}
        >
          <Route
            element={<MainPage />}
            index
          />
        </Route>
        <Route
          element={
            <AdminRoute>
              <RootLayout />
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
    </BrowserRouter>
  );
}
