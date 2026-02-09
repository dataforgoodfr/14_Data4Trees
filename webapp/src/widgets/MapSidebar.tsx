import { useEffect, useState } from "react";
import type { MapInstance } from "./Map";
import { Filter, Check, Globe, House, Building2, MapPin, TreePine, type LucideIcon } from "lucide-react";
import "./MapSidebar.css";

const LAYER_META: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  satellite: { label: "Satellite", color: "#3b82f6", icon: Globe },
  villages: { label: "Villages", color: "#a78bfa", icon: House },
  towns: { label: "Villes", color: "#f59e0b", icon: Building2 },
  boundaries: { label: "Frontieres", color: "#6b7280", icon: MapPin },
  placettes: { label: "Placettes", color: "#ef4444", icon: TreePine },
};

interface MapSidebarProps {
  map?: MapInstance;
}

export function MapSidebar({ map }: MapSidebarProps) {
  const [layers, setLayers] = useState<{ id: string }[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!map) return;
    const styleLayers = map.getStyle().layers ?? [];
    setLayers(styleLayers);
    setVisibility(Object.fromEntries(styleLayers.map((l: { id: string }) => [l.id, true])));
  }, [map]);

  const toggleLayer = (layerId: string) => {
    if (!map) return;
    const newVisible = !visibility[layerId];
    setVisibility((prev) => ({ ...prev, [layerId]: newVisible }));
    map.setLayoutProperty(layerId, "visibility", newVisible ? "visible" : "none");
  };

  const setAll = (visible: boolean) => {
    if (!map) return;
    const next: Record<string, boolean> = {};
    for (const layer of layers) {
      next[layer.id] = visible;
      map.setLayoutProperty(layer.id, "visibility", visible ? "visible" : "none");
    }
    setVisibility(next);
  };

  const activeCount = Object.values(visibility).filter(Boolean).length;

  return (
    <div className="map-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <Filter />
          <span>Filtres</span>
        </div>

        <div className="tabs">
          <div className={`tab ${activeCount === layers.length ? "tab--active" : "tab--muted"}`} onClick={() => setAll(true)}>Tout</div>
          <div className={`tab ${activeCount === 0 ? "tab--active" : "tab--muted"}`} onClick={() => setAll(false)}>Aucun</div>
        </div>

        <p className="section-label">Categories de donnees</p>

        <div className="layer-list">
          {layers.map((layer) => {
            const meta = LAYER_META[layer.id];
            const isVisible = visibility[layer.id] ?? true;

            return (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`layer-btn ${!isVisible ? "layer-btn--hidden" : ""}`}
              >
                <div className={`checkbox ${!isVisible ? "checkbox--unchecked" : ""}`}>
                  {isVisible && <Check strokeWidth={3} />}
                </div>
                {meta?.icon
                  ? <meta.icon className="layer-icon" style={{ color: meta.color }} />
                  : <div className="color-dot" style={{ backgroundColor: "#71717a" }} />
                }
                <span className={`layer-label ${!isVisible ? "layer-label--hidden" : ""}`}>
                  {meta?.label ?? layer.id}
                </span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <p>Donnees affichees</p>
          <p>
            {activeCount === layers.length
              ? "Toutes les categories"
              : `${activeCount} / ${layers.length} categories`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
