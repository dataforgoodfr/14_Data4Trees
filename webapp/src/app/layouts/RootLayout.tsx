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
    <div className="h-svh flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-hidden">
        <Outlet />
      </main>
    </div>
  );
};
