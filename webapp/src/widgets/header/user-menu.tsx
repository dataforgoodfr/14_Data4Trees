import { DatabaseIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

import { LanguageSelector } from "./language-selector";
import { ModeToggle } from "./mode-toggle";

export const UserMenu: FC = () => {
  const { t } = useTranslation("common");

  const navigate = useNavigate();
  const { isAuthenticated, logout, token } = useAuth();
  const { isLoading, createAdminSession } = useCreateAdminSession(token);

  const onLogin = () => navigate(URLS.LOGIN);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button
          className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          size="icon"
          variant="outline"
        >
          <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-background"
      >
        <LanguageSelector />

        <ModeToggle />

        <DropdownMenuSeparator />

        {isAuthenticated ? (
          <>
            <DropdownMenuItem
              className="gap-sm"
              disabled={isLoading}
              onClick={createAdminSession}
            >
              <SettingsIcon />
              {t("header.menu.goToAdmin")}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-sm"
              disabled={isLoading}
              onClick={() => alert("Not implemented yet")}
            >
              <DatabaseIcon />
              {t("header.menu.seeDatabase")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-sm"
              onClick={logout}
            >
              <LogOutIcon />
              {t("header.menu.logout")}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            className="gap-sm"
            onClick={onLogin}
          >
            <UserIcon />
            {t("header.menu.login")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
