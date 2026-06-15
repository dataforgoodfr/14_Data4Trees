import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "@shared/i18n";
import { Button } from "@shared/ui/button";
import { URLS } from "@shared/urls";

import { UserMenu } from "./user-menu";

export type HeaderProps = {
  logoSrc: string;
};

export const Header: FC<HeaderProps> = ({ logoSrc }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname === URLS.DASHBOARD;

  const { t } = useTranslation("common");

  function onNavigationClick() {
    navigate(isDashboardPage ? URLS.HOME : URLS.DASHBOARD);
  }

  return (
    <header className="bg-background border-b border-border md:p-3 p-2 relative z-40 flex-0">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between gap-md">
          <img
            alt="Logo"
            className="md:h-12 h-8"
            src={logoSrc}
          />

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              onClick={onNavigationClick}
              variant="default"
            >
              {isDashboardPage
                ? t("header.navigationButton.toHome")
                : t("header.navigationButton.toDashboard")}
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
