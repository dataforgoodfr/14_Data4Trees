import { useEffect, useState } from "react";
import { useApi } from "@shared/hooks/useApi";
import type { ApiClient } from "@shared/api/client";

import { Header } from "@widgets/header";
import { DashBoardHead } from "@widgets/dashboard/head";
import { ChartForestPotential } from "@features/charts/biodiversity/chart-forest-potential";

import {
  preciseNumericIndicators,
} from "@features/indicators/utils";

import type { NumericKeys } from "@shared/types";

// request API pour récupérer les données du back, utilisée dans useEffect [window.onload] à terme
async function request(api:ApiClient) {
  const data = await api.getDashboardData();
  return data
}

type DataField = { value: number | null; error: number | null };

type RawData = {
  biomass_volume: DataField;
  tree_density: DataField;
  richness: DataField;
  epf_tree_density: DataField;
  epf_necromass_pied: DataField;
  epf_necromass_sol: DataField;
  epf_necro_biomass_ratio: DataField;
  epf_tree_diversity: DataField;
  epf_spatial_distribution: DataField;
  epf_diameter_distribution: DataField;
  epf_vertical_distribution: DataField;
  epf_dominant_height: DataField;
  epf_microhabitats: DataField;
  soil_structure: DataField;
  soil_composition: DataField;
  ero_rainfall_and_wind: DataField;
  ero_couv_slope_and_cover: DataField;
  ero_soil_stability: DataField;
  ero_water_seepage: DataField;
  soil_fauna_density: DataField;
  soil_fauna_diversity: DataField;
  soil_fauna_abundance_tax1: DataField;
  soil_fauna_abundance_tax2: DataField;
  soil_fauna_abundance_tax3: DataField;
  surface_fauna_density: DataField;
  surface_fauna_diversity: DataField;
  surface_fauna_abundance_tax1: DataField;
  surface_fauna_abundance_tax2: DataField;
  surface_fauna_abundance_tax3: DataField;
};

const emptyField: DataField = { value: 0, error: 0 };

type ChartPotential = {
  density: number;
  diversity: number;
  diameterDistribution: number;
  dominantHeight: number;
  microHabitat: number;
  ratioDeathmassBiomass: number;
  spatialDistribution: number;
  verticalDistribution: number;
};


export function DashboardPage() {
  const [data, setData] = useState<RawData>({
  biomass_volume: emptyField,
  tree_density: emptyField,
  richness: emptyField,
  epf_tree_density: emptyField,
  epf_necromass_pied: emptyField,
  epf_necromass_sol: emptyField,
  epf_necro_biomass_ratio: emptyField,
  epf_tree_diversity: emptyField,
  epf_spatial_distribution: emptyField,
  epf_diameter_distribution: emptyField,
  epf_vertical_distribution: emptyField,
  epf_dominant_height: emptyField,
  epf_microhabitats: emptyField,
  soil_structure: emptyField,
  soil_composition: emptyField,
  ero_rainfall_and_wind: emptyField,
  ero_couv_slope_and_cover: emptyField,
  ero_soil_stability: emptyField,
  ero_water_seepage: emptyField,
  soil_fauna_density: emptyField,
  soil_fauna_diversity: emptyField,
  soil_fauna_abundance_tax1: emptyField,
  soil_fauna_abundance_tax2: emptyField,
  soil_fauna_abundance_tax3: emptyField,
  surface_fauna_density: emptyField,
  surface_fauna_diversity: emptyField,
  surface_fauna_abundance_tax1: emptyField,
  surface_fauna_abundance_tax2: emptyField,
  surface_fauna_abundance_tax3: emptyField,
});

  const [benefChartPotential, setBenefChartPotential] = useState<ChartPotential>({
    density: 0,
    diversity: 0,
    diameterDistribution: 0,
    dominantHeight: 0,
    microHabitat: 0,
    ratioDeathmassBiomass: 0,
    spatialDistribution: 0,
    verticalDistribution: 0
  });

  const indicatorKeys = Object.keys(data) as (keyof typeof data)[] as NumericKeys<RawData>;

  const api = useApi();

  useEffect (() => {
    request(api).then((res) => setData(preciseNumericIndicators<RawData>(res, indicatorKeys, "N/A")))
  }, [api, request])

  useEffect (() => {
    console.log("Data:", data);
    setBenefChartPotential({
      density: data.epf_tree_density.value || 0,
      diversity: data.epf_tree_diversity.value || 0,
      diameterDistribution: data.epf_diameter_distribution.value || 0,
      dominantHeight: data.epf_dominant_height.value || 0,
      microHabitat: data.epf_microhabitats.value || 0,
      ratioDeathmassBiomass: data.epf_necro_biomass_ratio.value || 0,
      spatialDistribution: data.epf_spatial_distribution.value || 0,
      verticalDistribution: data.epf_vertical_distribution.value || 0
    })
  }, [data])

  return (
    <div>
      <Header />
      <div className="px-7">
        <DashBoardHead />
        <div className="mt-4 space-y-4">
          <ChartForestPotential benef={benefChartPotential} />
        </div>
      </div>

    </div>
  );
}
