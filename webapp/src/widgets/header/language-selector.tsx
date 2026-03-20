import { LanguagesIcon } from "lucide-react";
import type { FC } from "react";

import { i18nInstance, LANGUAGES, useTranslation } from "@shared/i18n";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <LanguagesIcon />
        {t("header.button.language")}
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent className="bg-background">
          {LANGUAGES_CONFIGS.map((config) => (
            <DropdownMenuItem
              key={config.identifier}
              onClick={() => i18nInstance.changeLanguage(config.identifier)}
            >
              {`${config.flag} - ${config.fullString}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
