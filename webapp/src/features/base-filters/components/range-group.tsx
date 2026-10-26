import { cx } from "class-variance-authority";
import type { FC, ReactNode } from "react";

import { Slider } from "@ui/slider";

type RangeGroupProps = {
  title: string;
  /** Labels of the ordered options, one stop each. */
  labels: string[];
  /** Indices of the first and last selected options. */
  value: [number, number];
  onValueChange: (value: number[]) => void;
  disabled?: boolean;
  /** Rendered below the slider (e.g. a "not provided" checkbox). */
  children?: ReactNode;
};

/**
 * A two-thumb slider over ordered options, with every option's label below its
 * stop. Both ends are inclusive and can meet on a single option.
 *
 * The labels sit in equal columns, and the slider is inset by half a column on
 * each side, so stop `i` lands above the centre of column `i`.
 */
export const RangeGroup: FC<RangeGroupProps> = ({
  title,
  labels,
  value,
  onValueChange,
  disabled,
  children,
}) => {
  const [minIndex, maxIndex] = value;
  const halfColumn = `${50 / Math.max(labels.length, 1)}%`;

  return (
    <section className="flex flex-col gap-3">
      <p className="font-medium text-sm">{title}</p>

      <div className="flex flex-col gap-2">
        <div style={{ paddingInline: halfColumn }}>
          <Slider
            disabled={disabled}
            max={Math.max(labels.length - 1, 0)}
            min={0}
            minStepsBetweenThumbs={0}
            onValueChange={onValueChange}
            step={1}
            value={value}
          />
        </div>

        <ol
          className="grid text-xs text-center"
          style={{
            gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
          }}
        >
          {labels.map((label, index) => (
            <li
              className={cx(
                "px-0.5",
                index >= minIndex && index <= maxIndex
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
              key={label}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>

      {children}
    </section>
  );
};
