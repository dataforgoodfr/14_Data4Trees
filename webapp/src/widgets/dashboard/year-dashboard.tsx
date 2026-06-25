import {
  ChartForestPotential,
  fromEpfData,
} from "@features/charts/biodiversity/chart-forest-potential";

import { EpfDataSchema } from "@entities/dashboard/epf";
import type { YearData } from "@entities/dashboard/generic";

// TODO: don't do that! Pass the original values, and truncate only when displaying them,
// because otherwise we might still use them as numbers and get unexpected results (e.g. 0.1 + 0.2 = 0.30000000000000004)
// function twoDecimals(data: DictionaryData): DictionaryData {
//   return Object.fromEntries(
//     Object.entries(data).map(([key, { value, error }]) => [
//       key,
//       {
//         error: error == null ? 0 : Number(error.toFixed(2)),
//         value: value == null ? 0 : Number(value.toFixed(2)),
//       },
//     ]),
//   );
// }

export default function YearDashboard({ data }: { data: YearData }) {
  // TODO: what to do if the data is not valid? Should we throw an error, or just display a message?
  // Note: it should not happen anyway, thanks to the defaults
  const benefEpfData = EpfDataSchema.parse(data.beneficiary);

  // TODO: ensure we have no need for calling twoDecimals here
  // const benefEpfData = twoDecimals(EpfDataSchema.safeParse(data.beneficiary))
  // See item.value.toLocaleString() and following TODOs in shared/ui/chart.tsx for formatting details
  // pass a prop to format the item value? (e.g. d => d.toFixed(2).toLocaleString() to get the same result as before)

  return (
    <div className="mt-4 space-y-4">
      <ChartForestPotential benef={fromEpfData(benefEpfData)} />
    </div>
  );
}
