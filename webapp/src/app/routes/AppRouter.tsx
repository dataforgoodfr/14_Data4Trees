import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RootLayout } from "@app/layouts/RootLayout";

import { MainPage } from "@pages/MainPage";

import { AdminRoute } from "./lib/AdminRoute";

const AdminPage = lazy(() => import("@pages/admin"));
const LoginPage = lazy(() => import("@pages/login"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="login"
          element={<LoginPage />}
        />
        <Route
          path="/"
          element={<RootLayout />}
        >
          <Route
            index
            element={<MainPage />}
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
            path="admin"
            element={<AdminPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
