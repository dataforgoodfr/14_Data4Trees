import { AdminLink } from "@features/admin/AdminLink";

import { useTranslation } from "@shared/i18n";

import { Button } from "@ui/button";

import { LanguageSelecor } from "./LanguageSelector";
import { ModeToggle } from "./ModeToggle";

interface HeaderProps {
  onLogout: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
}

export function Header({ onLogout, onLogin, isAuthenticated }: HeaderProps) {
  const { t } = useTranslation("translations");

  return (
    <header className="bg-background border-b border-border p-3 relative z-40">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between gap-md">
          <img
            src="/logo_all4trees.png"
            alt="Logo"
            className="h-12"
          />

          <div className="flex items-center gap-4">
            <AdminLink />
            {isAuthenticated ? (
              <Button
                onClick={onLogout}
                variant="default"
                size="default"
              >
                {t("header.button.logout")}
              </Button>
            ) : (
              <Button
                onClick={onLogin}
                variant="default"
                size="default"
              >
                {t("header.button.login")}
              </Button>
            )}
            <ModeToggle />
            <LanguageSelecor />
          </div>
        </div>
      </div>
    </header>
  );
}
