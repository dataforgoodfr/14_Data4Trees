import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "@widgets/header";

import { useAuth } from "@features/auth";

export const RootLayout: FC = () => {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="flex flex-col h-svh">
      <Header />
      <main className="flex flex-col flex-1">
        <Outlet />
      </main>
    </div>
  );
};
