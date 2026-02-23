import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@shared/lib/utils";

import { Alert, AlertDescription } from "@ui/alert";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";

import { fetchToken } from "./authClient";
import { useAuth } from "./useAuth";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess, className, ...props }: LoginFormProps) {
  const { t } = useTranslation("translations");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = await fetchToken(username, password);
      login(token);
      onSuccess();
    } catch {
      setError(t("auth.loginForm.credentialsError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("auth.loginForm.title")}
          </CardTitle>
          <CardDescription>{t("auth.loginForm.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            aria-describedby={error ? "error-login" : undefined}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">
                  {t("auth.loginForm.field.username")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">
                  {t("auth.loginForm.field.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  id="error-login"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? t("auth.loginForm.button.pendingLogin")
                  : t("auth.loginForm.button.login")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
