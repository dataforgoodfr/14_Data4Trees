import type { createMap } from "coordo";
import { type ReactNode, useRef, useState } from "react";

import { type Category, MapContext } from "@shared/contexts/MapContext";

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);
  const [forests, setForests] = useState<Category[]>([]);

  return (
    <MapContext value={{ forests, isReady, mapApiRef, setForests, setIsReady }}>
      {children}
    </MapContext>
  );
}
