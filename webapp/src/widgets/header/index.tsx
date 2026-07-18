import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "@shared/i18n";
import { Button } from "@shared/ui/button";
import { URLS, useAbsoluteUrls } from "@shared/urls";

import { UserMenu, type UserMenuProps } from "./user-menu";

export type HeaderProps = {
  logoSrc: string;
  hasDashboard?: boolean;
} & UserMenuProps;

export const Header: FC<HeaderProps> = ({
  logoSrc,
  hasDashboard,
  layerOptions,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage =
    hasDashboard && location.pathname.endsWith(URLS.DASHBOARD);

  const absoluteUrls = useAbsoluteUrls();

  const { t } = useTranslation("common");

  function onNavigationClick() {
    navigate(isDashboardPage ? absoluteUrls.HOME : absoluteUrls.DASHBOARD);
  }

  return (
    <header className="bg-background border-b border-border md:p-3 p-2 relative z-40 flex-0">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between gap-3">
          <img
            alt="Logo"
            className="md:h-12 h-8"
            src={logoSrc}
          />

          <div className="flex items-center gap-2 md:gap-3">
            {hasDashboard && (
              <Button
                onClick={onNavigationClick}
                variant="default"
              >
                {isDashboardPage
                  ? t("header.navigationButton.toHome")
                  : t("header.navigationButton.toDashboard")}
              </Button>
            )}
            <UserMenu layerOptions={layerOptions} />
          </div>
        </div>
      </div>
    </header>
  );
};
