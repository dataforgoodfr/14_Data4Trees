import { LanguagesIcon } from "lucide-react";
import type { FC } from "react";

import { i18nInstance, LANGUAGES, useTranslation } from "@shared/i18n";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

const LANGUAGES_CONFIGS = [
  {
    flag: "🇫🇷",
    fullString: "Français",
    identifier: LANGUAGES.FRENCH,
  },
  {
    flag: "🇬🇧",
    fullString: "English",
    identifier: LANGUAGES.ENGLISH,
  },
] as const;

export const LanguageSelector: FC = () => {
  const { t } = useTranslation("translations");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <DropdownMenuItem className="gap-sm">
          <LanguagesIcon />
          {t("header.button.language")}
        </DropdownMenuItem>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-background"
      >
        {LANGUAGES_CONFIGS.map((config) => (
          <DropdownMenuItem
            key={config.identifier}
            onClick={() => i18nInstance.changeLanguage(config.identifier)}
          >
            {`${config.flag} - ${config.fullString}`}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
