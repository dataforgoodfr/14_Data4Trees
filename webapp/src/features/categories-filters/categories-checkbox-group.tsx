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
      <p className="font-medium text-sm mb-3">{title}</p>
      <FieldGroup className="mx-auto gap-2">
        {items.map((item) => (
          <Field
            className="border border-border rounded-md p-2 align-start gap-2"
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
              className="font-normal cursor-pointer gap-2 items-center"
              // Ensures that the label is correctly associated with the checkbox input field
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
