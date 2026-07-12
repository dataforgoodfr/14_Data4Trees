import { cx } from "class-variance-authority";
import type { FC, ReactNode } from "react";

type IndicatorScrollContainerProps = {
  className?: string;
  children: ReactNode;
};

export const IndicatorScrollContainer: FC<IndicatorScrollContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cx(
        "p-3 flex flex-col gap-3 text-xs",
        "overflow-y-scroll custom-scrollbar",
        className ?? "",
      )}
      style={{
        "--scrollbar-thumb": "var(--info-foreground)",
        "--scrollbar-track": "var(--background)",
      }}
    >
      {children}
    </div>
  );
};
