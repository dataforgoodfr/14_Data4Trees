import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RootLayout } from "@app/layouts/RootLayout";
import { MapProvider } from "@app/providers";

import { MainPage } from "@pages/MainPage";

import { AdminRoute } from "./lib/AdminRoute";

const AdminPage = lazy(() => import("@pages/admin"));
const LoginPage = lazy(() => import("@pages/login"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<LoginPage />}
          path="login"
        />
        <Route
          element={
            <MapProvider>
              <RootLayout />
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
              <RootLayout />
            </AdminRoute>
          }
        >
          <Route
            element={<AdminPage />}
            path="admin"
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
