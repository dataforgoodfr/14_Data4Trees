import type { FC, PropsWithChildren, ReactNode } from "react";

type IndicatorSectionProps = PropsWithChildren<{
  title: string;
  iconStart?: ReactNode;
}>;

export const IndicatorSection: FC<IndicatorSectionProps> = ({
  title,
  iconStart,
  children,
}) => {
  return (
    <section className="flex flex-col w-full gap-sm">
      <div className="flex flex-row items-center gap-xs">
        {iconStart}
        <h5 className="text-xs">{title}</h5>
      </div>
      {children}
    </section>
  );
};
