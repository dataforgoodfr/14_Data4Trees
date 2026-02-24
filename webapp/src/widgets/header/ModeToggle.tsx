import { cx } from "class-variance-authority";
import { MonitorCog, Moon, Sun } from "lucide-react";
import type { FC, ReactNode } from "react";

import type { Theme } from "@shared/contexts/ThemeContext";
import { useTheme } from "@shared/hooks/useTheme";

import { useTranslation } from "@i18n";

import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

export const ModeToggle: FC = () => {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation("translations");

  const colorModes: Array<{
    identifier: Theme;
    icon: (className?: string) => ReactNode;
    label: string;
  }> = [
    {
      icon: (className) => (
        <Sun
          key="icon-light"
          className={className ?? ""}
        />
      ),
      identifier: "light",
      label: t("header.colorModeSelector.light"),
    },
    {
      icon: (className) => (
        <Moon
          key="icon-dark"
          className={className ?? ""}
        />
      ),
      identifier: "dark",
      label: t("header.colorModeSelector.dark"),
    },
    {
      icon: (className) => (
        <MonitorCog
          key="icon-system"
          className={className ?? ""}
        />
      ),
      identifier: "system",
      label: t("header.colorModeSelector.system"),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button
          variant="outline"
          size="icon"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        >
          <div className="h-[16px] w-[16px] relative">
            {colorModes.map((config) =>
              config.icon(
                cx("transition-all absolute", {
                  "scale-0 rotate-90": config.identifier !== theme,
                  "scale-100 rotate-0": config.identifier === theme,
                }),
              ),
            )}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-background "
        align="end"
      >
        {colorModes.map((config) => (
          <DropdownMenuItem
            key={config.identifier}
            onClick={() => setTheme(config.identifier)}
            className="gap-sm"
          >
            {config.icon()}
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
