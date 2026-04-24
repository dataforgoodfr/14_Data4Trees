import { DashboardPopover } from "@widgets/DashboardPopover";

import { UserMenu } from "./user-menu";
import { Button } from "@shared/ui/button";
import { URLS } from "@shared/urls";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@shared/i18n";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { t } = useTranslation("translations");

  function navDashboard() {
    if (path === "/") {
      navigate(URLS.DASHBOARD);
    } else if (path === "/dashboard") {
      navigate(URLS.HOME)
    }
  }
  return (
    <header className="bg-background border-b border-border p-3 relative z-40 flex-0">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between gap-md">
          <img
            alt="Logo"
            className="h-12"
            src="/logo_all4trees.png"
          />

          <div className="flex items-center gap-3">
             <Button variant="default" onClick={navDashboard}>
              {(path === "/") ?
                <p>{t("buttonHeader.toDashboard")}</p> :
                <p>{t("buttonHeader.toHome")}</p>}
             </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
