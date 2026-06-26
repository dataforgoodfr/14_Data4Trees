import { useContext } from "react";

import { MapContext } from "@shared/contexts/map-context-seed";

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a seed MapContext Provider");
  }
  return context;
}
