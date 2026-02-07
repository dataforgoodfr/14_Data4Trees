// frontend/src/shared/ui/Header/Header.tsx
import "@app/styles/all4trees.css";

import { Button } from "@ui/button";

import logo from "@assets/logo_all4trees.png";

import { ModeToggle } from "./ModeToggle";

interface HeaderProps {
  onLogout: () => void;
  onLogin: () => void;
  isLogin: boolean;
}

export function Header({ onLogout, onLogin, isLogin }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border px-6 py-4 relative z-40">
      <div className="mx-auto max-w-screen-2xl px-6 py-4">
        <div className="flex items-center justify-between pr-10">
          <img
            src={logo}
            alt="Logo"
            className="h-24 w-60 mr-1"
          />

          <div className="flex items-center gap-4">
            {isLogin ? (
              <Button
                onClick={onLogout}
                className="px-4 py-2 bg-primary text rounded hover:bg-red-700"
              >
                Déconnexion
              </Button>
            ) : (
              <Button
                onClick={onLogin}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700"
              >
                Connexion
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
