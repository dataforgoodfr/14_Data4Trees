import { DashboardPopover } from "@widgets/DashboardPopover";

import { UserMenu } from "./user-menu";

export function Header() {
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
            <DashboardPopover dataType="example" />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
