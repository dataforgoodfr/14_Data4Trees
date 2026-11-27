import { cx } from "class-variance-authority";
import type { FC, ReactNode } from "react";

import { Checkbox, type CheckedState } from "@ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@ui/field";

type CheckboxGroupItem = {
  icon?: ReactNode;
  identifier: string;
  label: string;
};

type CheckboxGroupProps = {
  /**
   * Scopes this group's DOM ids. Required, because item identifiers are only
   * unique *within* a group: `loc1`, `loc2` and `ecos` all start at 1, and every
   * layer repeats the same codes.
   *
   * Callers pass `<layerId>-<groupKey>` (or `global-<groupKey>`).
   */
  namespace: string;
  /** Omit to render the boxes alone, e.g. below another widget of the group. */
  title?: string;
  items: CheckboxGroupItem[];
  disabled?: boolean;
  getIsChecked: (identifier: string) => boolean;
  getOnCheckedChange: (identifier: string) => (nextValue: CheckedState) => void;
};

/**
 * A duplicate id makes every `htmlFor` resolve to the *first* match in the
 * document, so a click on a commune would toggle a department, and a bio
 * checkbox would toggle a forest one — hence the namespace.
 *
 * Non-alphanumeric runs are collapsed because ids must not contain whitespace
 * and project names do ("A Kob Ale").
 */
const getFieldHtmlId = (namespace: string, identifier: string) =>
  `filter-checkbox-group-${namespace}-${identifier}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

/** Beyond this many items, the list scrolls instead of growing the card. */
const MAX_VISIBLE_ITEMS = 3;

/**
 * 3.5 rows: a single-line row is 2.375rem (`p-2`, a 1.25rem line, the border)
 * plus the 0.5rem gap. The half row left visible hints there is more below.
 */
const SCROLLABLE_LIST_CLASS_NAME =
  "max-h-[calc(3.5*2.875rem)] overflow-y-auto custom-scrollbar p-0.5 pr-2";

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  namespace,
  title,
  items,
  disabled,
  getIsChecked,
  getOnCheckedChange,
}) => {
  return (
    <section>
      {title && <p className="font-medium text-sm mb-3">{title}</p>}
      <FieldGroup
        className={cx(
          "mx-auto gap-2",
          // The padding keeps the focus rings inside the scroll box.
          items.length > MAX_VISIBLE_ITEMS && SCROLLABLE_LIST_CLASS_NAME,
        )}
      >
        {items.map((item) => {
          const fieldHtmlId = getFieldHtmlId(namespace, item.identifier);

          return (
            <Field
              className="border border-border rounded-md p-2 align-start gap-2"
              key={item.identifier}
              orientation="horizontal"
            >
              <Checkbox
                checked={getIsChecked(item.identifier)}
                className="cursor-pointer"
                disabled={disabled}
                id={fieldHtmlId}
                onCheckedChange={getOnCheckedChange(item.identifier)}
              />

              <FieldLabel
                className="font-normal cursor-pointer gap-2 items-center"
                // Ensures that the label is correctly associated with the checkbox input field
                htmlFor={fieldHtmlId}
              >
                {item.icon}
                {item.label}
              </FieldLabel>
            </Field>
          );
        })}
      </FieldGroup>
    </section>
  );
};
