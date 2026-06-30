import * as z from "zod";

export const ValueAndErrorSchema = z
  .object({
    error: z.number().nullable(),
    value: z.number().nullable(),
  })
  .default(() => ({
    error: null,
    value: null,
  }));

const DictionaryDataSchema = z.record(z.string(), ValueAndErrorSchema);

export type DictionaryData = z.infer<typeof DictionaryDataSchema>;

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const YearSchema = z.coerce.number().int().min(MIN_YEAR).max(MAX_YEAR);

const YearDataSchema = z.object({
  beneficiary: DictionaryDataSchema,
  control: DictionaryDataSchema,
});

export type YearData = z.infer<typeof YearDataSchema>;

export const DashboardDataSchema = z.record(YearSchema, YearDataSchema);

export type DashboardData = z.infer<typeof DashboardDataSchema>;
