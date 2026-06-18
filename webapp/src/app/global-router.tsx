import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const AppAll4Trees = lazy(() => import("./app-all4trees"));
// const AppSeed = lazy(() => import("./app-seed")); #uncomment next PR

export default function GlobalRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<AppAll4Trees />}
          path="/all4trees/*"
        />
        {/* <Route #uncomment next PR
          element={<AppSeed />}
          path="/seed/*"
        /> */}
        <Route
          element={<Navigate to="/all4trees" />}
          index
        />
        <Route
          element={<Navigate to="/all4trees" />}
          path="*"
        />
      </Routes>
    </BrowserRouter>
  );
}
