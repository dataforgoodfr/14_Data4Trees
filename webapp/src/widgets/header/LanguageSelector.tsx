import { LanguagesIcon } from "lucide-react";
import type { FC } from "react";

import { i18nInstance, LANGUAGES } from "@shared/i18n";

import { Button } from "@ui/button";
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

export const LanguageSelecor: FC = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild={true}>
      <Button
        className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        size="icon"
        variant="outline"
      >
        <LanguagesIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{i18nInstance.language.toUpperCase()}</span>
      </Button>
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
