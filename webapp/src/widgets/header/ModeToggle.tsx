import { cx } from "class-variance-authority";
import { MonitorCog, Moon, Sun } from "lucide-react";
import type { FC, ReactNode } from "react";

import type { Theme } from "@shared/contexts/ThemeContext";
import { useTheme } from "@shared/hooks/useTheme";
import { useTranslation } from "@i18n";

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
          className={className ?? ""}
          key="icon-light"
        />
      ),
      identifier: "light",
      label: t("header.colorModeSelector.light"),
    },
    {
      icon: (className) => (
        <Moon
          className={className ?? ""}
          key="icon-dark"
        />
      ),
      identifier: "dark",
      label: t("header.colorModeSelector.dark"),
    },
    {
      icon: (className) => (
        <MonitorCog
          className={className ?? ""}
          key="icon-system"
        />
      ),
      identifier: "system",
      label: t("header.colorModeSelector.system"),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <DropdownMenuItem className="gap-sm">
          <div className="h-[16px] w-[16px] relative">
            {colorModes.map((config) =>
              config.icon(
                cx("transition-all absolute h-[16px] w-[16px]", {
                  "scale-0 rotate-90": config.identifier !== theme,
                  "scale-100 rotate-0": config.identifier === theme,
                }),
              ),
            )}
          </div>
          {t("header.button.mode")}
        </DropdownMenuItem>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-background"
      >
        {colorModes.map((config) => (
          <DropdownMenuItem
            className="gap-sm"
            key={config.identifier}
            onClick={() => setTheme(config.identifier)}
          >
            {config.icon()}
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
