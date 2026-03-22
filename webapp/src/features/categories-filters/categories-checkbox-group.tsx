import type { FC } from "react";

import { Checkbox, type CheckedState } from "@ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@ui/field";
import type { CategoryGroupItem, CategoryIdentifier } from "./types";

type CategoriesCheckboxGroupProps = {
  title: string;
  items: CategoryGroupItem[];
  disabled?: boolean;
  getIsChecked: (identifier: CategoryIdentifier) => boolean;
  getOnCheckedChange: (
    identifier: CategoryIdentifier,
  ) => (nextValue: CheckedState) => void;
};

const FIELD_HTML_ID = (identifier: string) =>
  `categories-checkbox-group-${identifier}`;

export const CategoriesCheckboxGroup: FC<CategoriesCheckboxGroupProps> = ({
  title,
  items,
  disabled,
  getIsChecked,
  getOnCheckedChange,
}) => {
  return (
    <section>
      <p className="font-medium text-sm mb-md">{title}</p>
      <FieldGroup className="mx-auto gap-sm">
        {items.map((item) => (
          <Field
            className="border border-border rounded-md p-sm align-start gap-sm"
            key={item.identifier}
            orientation="horizontal"
          >
            <Checkbox
              checked={getIsChecked(item.identifier)}
              className="cursor-pointer"
              disabled={disabled}
              id={FIELD_HTML_ID(item.identifier)}
              onCheckedChange={getOnCheckedChange(item.identifier)}
            />

            <FieldLabel
              className="font-normal cursor-pointer gap-sm items-center"
              htmlFor={FIELD_HTML_ID(item.identifier)}
            >
              {item.icon}
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </section>
  );
};
