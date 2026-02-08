import { LanguagesIcon } from "lucide-react";
import type { FC } from "react";

import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

import { LANGUAGES, i18nInstance } from "@shared/i18n";

const LANGUAGES_CONFIGS = [
  {
    identifier: LANGUAGES.FRENCH,
    fullString: "Français",
    flag: "🇫🇷",
  },
  {
    identifier: LANGUAGES.ENGLISH,
    fullString: "English",
    flag: "🇬🇧",
  },
] as const;

export const LanguageSelecor: FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        >
          <LanguagesIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{i18nInstance.language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-background"
        align="end"
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
