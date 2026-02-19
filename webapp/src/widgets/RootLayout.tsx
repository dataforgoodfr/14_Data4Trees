import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@app/providers";

import { Header } from "@widgets/header";

export const RootLayout: React.FC = () => {
  const { isAuthenticated, isAuthLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        onLogin={() => navigate("/login")}
        onLogout={() => logout()}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  );
};
