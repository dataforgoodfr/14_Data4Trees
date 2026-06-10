import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "@shared/i18n";
import { Button } from "@shared/ui/button";
import { URLS } from "@shared/urls";

import { UserMenu } from "./user-menu";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname === URLS.DASHBOARD;

  const { t } = useTranslation("translations");

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
            src="/logo_all4trees.png"
          />

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              onClick={onNavigationClick}
              variant="default"
            >
              {isDashboardPage
                ? t("buttonHeader.toHome")
                : t("buttonHeader.toDashboard")}
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
