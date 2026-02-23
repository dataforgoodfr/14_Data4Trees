import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainPage } from "@pages/MainPage";

import { RootLayout } from "@widgets/RootLayout";

import { AdminRoute } from "./lib/ProtectedRoute";

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

          <Route element={<AdminRoute />}>
            <Route
              path="admin"
              element={<AdminPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
