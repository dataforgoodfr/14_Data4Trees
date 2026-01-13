// frontend/src/shared/ui/Header/Header.tsx
import "@app/styles/all4trees.css";
import logo from '@assets/logo_all4trees.png';
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle";

interface HeaderProps {
    onLogout: () => void;
    onLogin: () => void;
    onShowDashboard: () => void;
    onHideDashboard: () => void;
    isLogin: boolean;
    isDashboardShown: boolean;
}

export function Header({
    onLogout,
    onLogin,
    onShowDashboard,
    onHideDashboard,
    isLogin,
    isDashboardShown,
}: HeaderProps) {
    return (
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 relative z-40">
            <div className="flex items-center justify-between">
                <img src={logo} alt="Logo" className="h-24 w-60 mr-1" />

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {isLogin ? (
                        <Button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Déconnexion
                        </Button>
                    ) : (
                        <Button
                            onClick={onLogin}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Connexion
                        </Button>
                    )}
                    {isDashboardShown ? (
                        <Button
                            onClick={onHideDashboard}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Masquer Dashboard
                        </Button>
                    ) : (
                        <Button
                            onClick={onShowDashboard}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Aficher Dashboard
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}