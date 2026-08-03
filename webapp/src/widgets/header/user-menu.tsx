import {
  DatabaseIcon,
  LogOutIcon,
  MapPinPlusIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AddDataDialog, type LayerOptions } from "@features/add-data";
import { useCreateAdminSession } from "@features/admin/use-create-admin-session";
import { useAuth } from "@features/auth";

import { useAbsoluteUrls } from "@shared/urls";
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

export type UserMenuProps = {
  layerOptions?: LayerOptions;
};

export const UserMenu: FC<UserMenuProps> = ({ layerOptions }) => {
  const { t } = useTranslation("common");

  const navigate = useNavigate();
  const { isAuthenticated, logout, token } = useAuth();
  const { isLoading, createAdminSession } = useCreateAdminSession(token);

  const [isAddDataOpen, setIsAddDataOpen] = useState(false);

  const absoluteUrls = useAbsoluteUrls();

  const onLogin = () => navigate(absoluteUrls.LOGIN);

  return (
    <>
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
                className="gap-2"
                onClick={() => setIsAddDataOpen(true)}
              >
                <MapPinPlusIcon />
                {t("header.menu.addData")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-2"
                disabled={isLoading}
                onClick={createAdminSession}
              >
                <SettingsIcon />
                {t("header.menu.goToAdmin")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-2"
                disabled={isLoading}
                onClick={() => alert("Not implemented yet")}
              >
                <DatabaseIcon />
                {t("header.menu.seeDatabase")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2"
                onClick={logout}
              >
                <LogOutIcon />
                {t("header.menu.logout")}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="gap-2"
              onClick={onLogin}
            >
              <UserIcon />
              {t("header.menu.login")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAuthenticated && layerOptions?.length && (
        <AddDataDialog
          layerOptions={layerOptions}
          onOpenChange={setIsAddDataOpen}
          open={isAddDataOpen}
        />
      )}
    </>
  );
};
