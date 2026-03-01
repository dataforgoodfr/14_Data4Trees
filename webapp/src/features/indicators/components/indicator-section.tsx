import type { FC, PropsWithChildren } from "react";

type IndicatorSectionProps = PropsWithChildren<{
  title: string;
}>;

export const IndicatorSection: FC<IndicatorSectionProps> = ({
  title,
  children,
}) => {
  return (
    <section className="flex flex-col w-full gap-xs">
      <h5 className="text-xs">{title}</h5>
      <div className="text-foreground/75">{children}</div>
    </section>
  );
};
