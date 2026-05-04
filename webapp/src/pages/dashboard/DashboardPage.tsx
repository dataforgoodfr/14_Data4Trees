import { useEffect, useState } from "react";
import { useApi } from "@shared/hooks/useApi";
import type { ApiClient } from "@shared/api/client";
import type { NumericKeys } from "@shared/types";

import { Header } from "@widgets/header";
import { DashBoardHead } from "@widgets/dashboard/head";
import { ChartForestPotential } from "@features/charts/biodiversity/chart-forest-potential";
import { ChartRelativeAbundance } from "@features/charts/biodiversity/chart-relative-abundance";
import { ChartBeneficialPractices } from "@features/charts/socio-eco/chart-beneficial-practices";

import {
  preciseNumericIndicators,
} from "@features/indicators/utils";

// request API pour récupérer les données du back, utilisée dans useEffect [window.onload] à terme
async function request(api:ApiClient) {
  const data = await api.getDashboardData();
  return data
}

type DataField = { [key: string]: number | null; };

type RawData = {
  biomass_volume: DataField;
  tree_density: DataField;
  tree_pop: DataField;
  richness: DataField;
  relative_abundance: DataField;
  epf_deadWood: DataField;
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
  soil_fauna_abundance: DataField;
  soil_fauna_abundance_tax1: DataField;
  soil_fauna_abundance_tax2: DataField;
  soil_fauna_abundance_tax3: DataField;
  surface_fauna_density: DataField;
  surface_fauna_diversity: DataField;
  surface_fauna_abundance: DataField;
  surface_fauna_abundance_tax1: DataField;
  surface_fauna_abundance_tax2: DataField;
  surface_fauna_abundance_tax3: DataField;
};

type ChartPotential = {
  density: number;
  diversity: number;
  diameterDistribution: number;
  dominantHeight: number;
  microHabitat: number;
  deadWood: number;
  spatialDistribution: number;
  verticalDistribution: number;
};

export function DashboardPage() {
  const [valuesArray, setValuesArray]= useState([]);
  const [errorsArray, setErrorsArray]=useState([]);
  const [preciseValues, setPreciseValues] = useState({});
  const [preciseErrors, setPreciseErrors] = useState({});

  const [benefChartPotential, setBenefChartPotential] = useState<ChartPotential>({
  density: 0,
  diversity: 0,
  diameterDistribution: 0,
  dominantHeight: 0,
  microHabitat: 0,
  deadWood: 0,
  spatialDistribution: 0,
  verticalDistribution: 0
});

const api = useApi();
const indicatorKeys = Object.keys(valuesArray) as (keyof typeof valuesArray)[] as NumericKeys<RawData>;

  useEffect (() => {
    request(api).then((res) => {
      console.log("Rawdata:",res);
      const valuesObj = Object.fromEntries(
        Object.entries(res).map(([key, v]) => [key, v.value])
      );
      const errorsObj = Object.fromEntries(
        Object.entries(res).map(([key, v]) => [key, v.error])
      );
      const precVal = preciseNumericIndicators(valuesObj, indicatorKeys, "N/A");
      const precErr = preciseNumericIndicators(errorsObj, indicatorKeys, "N/A");
      console.log("ici:",precVal)
      setPreciseValues(precVal);
      setPreciseErrors(precErr);
    });
  }, [])

  useEffect (() => {
    if (Object.keys(preciseValues).length > 0) {
      const values: [string, number][] = Object.entries(preciseValues)
        .filter(([_, v]) => v !== null)
        .map(([key, v]) => [key, Number(v)]);

      const errors: [string, number][] = Object.entries(preciseErrors)
        .filter(([_, v]) => v !== null)
        .map(([key, v]) => [key, Number(v)]);
      setValuesArray(values);
      setBenefChartPotential({
        density: preciseValues.epf_tree_density || 0,
        diversity: preciseValues.epf_tree_diversity || 0,
        diameterDistribution: preciseValues.epf_diameter_distribution || 0,
        dominantHeight: preciseValues.epf_dominant_height || 0,
        microHabitat: preciseValues.epf_microhabitats || 0,
        deadWood: preciseValues.epf_deadWood || 0,
        spatialDistribution: preciseValues.epf_spatial_distribution || 0,
        verticalDistribution: preciseValues.epf_vertical_distribution || 0
      })
    }

  }, [preciseValues])

  useEffect(() => {
    console.log("Values Array:", valuesArray);
    console.log('benef:', benefChartPotential)
    console.log('preciseValues:', preciseValues)
  }, [preciseValues])

  return (
    <div>
      <Header />
      <div className="px-7 pb-10">
        <DashBoardHead />
        <div className="mt-4 space-y-8 w-full">
          <ChartRelativeAbundance data={valuesArray.slice(0,6)} metadata={valuesArray.slice(0,6)} />
          <ChartForestPotential benef={benefChartPotential} />
          <ChartBeneficialPractices benef={benefChartPotential} />
        </div>
      </div>

    </div>
  );
}
