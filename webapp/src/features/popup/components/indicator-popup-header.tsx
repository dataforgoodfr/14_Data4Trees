import { XIcon } from "lucide-react";
import type { FC, ReactElement, ReactNode } from "react";

import { cn } from "@shared/lib/utils";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shared/ui/alert";
import { Button } from "@shared/ui/button";

import { ICON_SIZE_HEADER } from "../../indicators/components/constants";

type IndicatorPopupHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string | ReactElement;
  onCrossClick: () => void;
};

export const IndicatorPopupHeader: FC<IndicatorPopupHeaderProps> = ({
  icon,
  title,
  subtitle,
  onCrossClick,
}) => {
  return (
    <Alert
      className="w-full rounded-t-md rounded-b-none border-none text-sm py-lg"
      variant="info"
    >
      {icon}
      <AlertTitle className={cn("text-foreground")}>{title}</AlertTitle>

      {subtitle && (
        <AlertDescription className={cn("text-muted-foreground text-xs")}>
          {subtitle}
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
