export type DataField = { value: number | null; error: number | null };

export type DashboardData = Record<
  number,
  { beneficiary: Record<string, DataField>; control: Record<string, DataField> }
>;
