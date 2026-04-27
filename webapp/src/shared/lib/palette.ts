const getCssVarColor = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
};

export const getChartPalette = () => [
  getCssVarColor("--chart-1", "#091c2d"),
  getCssVarColor("--chart-2", "#f8f8f8"),
  getCssVarColor("--chart-3", "#26a65d"),
  getCssVarColor("--chart-4", "#f5911f"),
  getCssVarColor("--chart-5", "#f5f27b"),
];
