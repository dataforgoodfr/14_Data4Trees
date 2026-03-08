import type { FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Header } from "@widgets/header";

import { useAuth } from "@features/auth";

export const RootLayout: FC = () => {
  const { isAuthenticated, isAuthLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="flex flex-col h-svh">
      <Header
        onLogin={() => navigate("/login")}
        onLogout={() => logout()}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex flex-col flex-1">
        <Outlet />
      </main>
    </div>
  );
};
