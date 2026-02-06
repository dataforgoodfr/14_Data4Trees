import { MainPage } from "@/pages";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./lib/ProtectedRoute";

const AdminPage = lazy(() => import("@/pages/admin"));
const LoginPage = lazy(() => import("@/pages/login"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
