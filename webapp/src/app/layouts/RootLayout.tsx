import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header, type HeaderProps } from "@widgets/header";

import { useAuth } from "@features/auth";

export type RootLayoutProps = HeaderProps;

export const RootLayout: FC<RootLayoutProps> = (props) => {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="h-svh flex flex-col">
      <Header {...props} />
      <main className="flex-1 overflow-y-hidden">
        <Outlet />
      </main>
    </div>
  );
};
