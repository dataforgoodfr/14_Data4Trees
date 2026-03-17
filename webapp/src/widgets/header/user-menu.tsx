import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateAdminSession } from "@features/admin/use-create-admin-session";
import { useAuth } from "@features/auth";

import { URLS } from "@shared/urls";
import { useTranslation } from "@i18n";

import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

export const UserMenu: FC = () => {
  const { t } = useTranslation("translations");

  const navigate = useNavigate();
  const { isAuthenticated, logout, token } = useAuth();
  const { isLoading, createAdminSession } = useCreateAdminSession(token);

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => navigate(URLS.LOGIN)}
        variant="default"
      >
        <UserIcon className="h-[1.2rem] w-[1.2rem]" />
        <span>{t("header.button.login")}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button
          className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          variant="default"
        >
          <UserIcon className="h-[1.2rem] w-[1.2rem]" />
          <span>John Doe</span>
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-background "
      >
        <DropdownMenuItem
          className="gap-sm"
          disabled={isLoading}
          onClick={createAdminSession}
        >
          <SettingsIcon />
          {t("header.button.goToAdmin")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="gap-sm"
          onClick={logout}
        >
          <LogOutIcon />
          {t("header.button.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
