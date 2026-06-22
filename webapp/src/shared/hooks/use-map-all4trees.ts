import { useContext } from "react";

import { MapContext } from "@shared/contexts/map-context-all4trees";

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error(
      "useMap must be used within an all4tress MapContext Provider",
    );
  }
  return context;
}
