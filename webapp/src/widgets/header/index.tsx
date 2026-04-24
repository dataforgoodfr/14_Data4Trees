import { DashboardPopover } from "@widgets/DashboardPopover";

import { UserMenu } from "./user-menu";
import { Button } from "@shared/ui/button";
import { URLS } from "@shared/urls";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const navDashboard = () => navigate(URLS.DASHBOARD);
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
             <Button variant="default" onClick={navDashboard}>Montrer Dashboard</Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
