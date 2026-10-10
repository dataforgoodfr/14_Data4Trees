import { Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";

import { cn } from "@shared/lib/utils";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shared/ui/alert";
import { Button } from "@shared/ui/button";

export type IndicatorPopupHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onClose: () => void;
  toggleShiftSize: () => void;
};

export const AdaptPopupSizeButton = ({
  toggleShiftSize,
}: Pick<IndicatorPopupHeaderProps, "toggleShiftSize">) => {
  return (
    <Button
      aria-label="shift-popup-size"
      className="text-muted-foreground hover:text-info-foreground gap-0"
      onClick={toggleShiftSize}
      size="icon"
      variant="ghost"
    >
      <Minimize2Icon
        size={ICON_SIZE_HEADER}
        style={{ width: "var(--popup-minimize-size-button-width)" }}
      />
      <Maximize2Icon
        size={ICON_SIZE_HEADER}
        style={{
          width: "var(--popup-maximize-size-button-width)",
        }}
      />
    </Button>
  );
};

export const IndicatorPopupHeader: FC<IndicatorPopupHeaderProps> = ({
  icon,
  title,
  subtitle,
  children,
  onClose,
  toggleShiftSize,
}) => {
  return (
    <Alert
      className="w-full rounded-t-md rounded-b-none border-none text-xl py-4"
      variant="info"
    >
      {icon}
      <AlertTitle className={cn("text-foreground")}>{title}</AlertTitle>

      {(subtitle || children) && (
        <AlertDescription
          className={cn("text-muted-foreground text-sm", {
            "flex flex-col gap-2": subtitle && children,
          })}
        >
          {subtitle && <span>{subtitle}</span>}

          {children}
        </AlertDescription>
      )}

      <AlertAction>
        <Button
          aria-label="close-popover"
          className="text-muted-foreground hover:text-info-foreground"
          onClick={onClose}
          size="icon"
          variant="ghost"
        >
          <XIcon size={ICON_SIZE_HEADER} />
        </Button>

        <AdaptPopupSizeButton toggleShiftSize={toggleShiftSize} />
      </AlertAction>
    </Alert>
  );
};
