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
    <header className="bg-background border-b border-border px-6 py-4 relative z-40">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between">
          <img
            src="/logo_all4trees.png"
            alt="Logo"
            className="h-24 w-60 mr-1"
          />

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                onClick={onLogout}
                className="px-4 py-2 bg-primary text rounded hover:bg-red-700"
              >
                {t("header.button.logout")}
              </Button>
            ) : (
              <Button
                onClick={onLogin}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700"
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
