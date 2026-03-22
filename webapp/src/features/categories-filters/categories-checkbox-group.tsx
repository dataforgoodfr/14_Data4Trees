import type { FC } from "react";

import { Checkbox } from "@ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@ui/field";
import type { CategoryGroupItem } from "./types";

type CategoriesCheckboxGroupProps = {
  title: string;
  items: CategoryGroupItem[];
  isUpdating: boolean;
};

const FIELD_HTML_ID = (identifier: string) =>
  `categories-checkbox-group-${identifier}`;

export const CategoriesCheckboxGroup: FC<CategoriesCheckboxGroupProps> = ({
  title,
  items,
  isUpdating,
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
              checked={true}
              disabled={isUpdating}
              id={FIELD_HTML_ID(item.identifier)}
              onCheckedChange={console.log}
            />

            {item.icon}

            <FieldLabel
              className="font-normal"
              htmlFor={FIELD_HTML_ID(item.identifier)}
            >
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </section>
  );
};
