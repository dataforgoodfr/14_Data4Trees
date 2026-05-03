import { Calendar, XIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { cn } from "@shared/lib/utils";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shared/ui/alert";
import { Button } from "@shared/ui/button";

import {
  ICON_SIZE,
  ICON_SIZE_HEADER,
} from "../../indicators/components/constants";

type IndicatorPopupHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  date?: string;
  onCrossClick: () => void;
};

export const IndicatorPopupHeader: FC<IndicatorPopupHeaderProps> = ({
  icon,
  title,
  subtitle,
  date,
  onCrossClick,
}) => {
  return (
    <Alert
      className="w-full rounded-t-md rounded-b-none border-none text-xl py-lg"
      variant="info"
    >
      {icon}
      <AlertTitle className={cn("text-foreground")}>{title}</AlertTitle>

      {(subtitle || date) && (
        <AlertDescription className={cn("text-muted-foreground text-sm")}>
          <div>
            {subtitle && (
              <>
                <span>{subtitle}</span>
                <br />
              </>
            )}
            {date && (
              <div className="flex flex-row items-center gap-xs text-muted-foreground">
                <Calendar size={ICON_SIZE} />
                <p className="pt-0.5">{date}</p>
              </div>
            )}
          </div>
        </AlertDescription>
      )}

      <AlertAction>
        <Button
          aria-label="close-popover"
          className="text-muted-foreground hover:text-info-foreground"
          onClick={onCrossClick}
          size="icon"
          variant="ghost"
        >
          <XIcon size={ICON_SIZE_HEADER} />
        </Button>
      </AlertAction>
    </Alert>
  );
};
