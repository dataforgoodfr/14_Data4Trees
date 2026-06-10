import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RootLayout } from "@app/layouts/RootLayout";
import { MapProvider } from "@app/providers";

import { DashboardPage } from "@pages/dashboard/DashboardPage";
import { MainPage } from "@pages/MainPage";

import { URLS } from "@shared/urls";

import { AdminRoute } from "./admin-route";

const AdminPage = lazy(() => import("@pages/admin"));
const LoginPage = lazy(() => import("@pages/login"));

export function AppRouter() {
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

          <Route
            element={<DashboardPage />}
            path={URLS.DASHBOARD}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
