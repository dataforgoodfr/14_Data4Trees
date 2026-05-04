import { useEffect, useState } from "react";
import { useApi } from "@shared/hooks/useApi";
import type { ApiClient } from "@shared/api/client";
import type { NumericKeys } from "@shared/types";

import { Header } from "@widgets/header";
import { DashBoardHead } from "@widgets/dashboard/head";
import { ChartForestPotential } from "@features/charts/biodiversity/chart-forest-potential";

import {
  preciseNumericIndicators,
} from "@features/indicators/utils";
import { ChartRelativeAbundance } from "@features/charts/biodiversity/chart-relative-abundance";

// request API pour récupérer les données du back, utilisée dans useEffect [window.onload] à terme
async function request(api:ApiClient) {
  const data = await api.getDashboardData();
  return data
}

type DataField = { value: number | null; error: number | null };

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

const emptyField: DataField = { value: 0, error: 0 };

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

const fakeData: RawData = {
  "biomass_volume": {
    "value": null,
    "error": null
  },
  "tree_density": {
    "value": 191.095576570167,
    "error": 165.238402454365
  },
  "richness": {
    "value": 4.07712393017746,
    "error": 2.5814518750596
  },
  "epf_tree_density": {
    "value": 1.91095576570167,
    "error": 1.65238402454365
  },
  "epf_necromass_pied": {
    "value": null,
    "error": null
  },
  "epf_necromass_sol": {
    "value": 208.501348435867,
    "error": 151.298726015167
  },
  "epf_necro_biomass_ratio": {
    "value": null,
    "error": null
  },
  "epf_tree_diversity": {
    "value": 1.58786308798239,
    "error": 1.18239125654929
  },
  "epf_spatial_distribution": {
    "value": 3.79432407709241,
    "error": 1.91339763493866
  },
  "epf_diameter_distribution": {
    "value": null,
    "error": null
  },
  "epf_vertical_distribution": {
    "value": 1.87197322382213,
    "error": 0.850973739884704
  },
  "epf_dominant_height": {
    "value": 2.77146680888316,
    "error": 1.04807137228201
  },
  "epf_microhabitats": {
    "value": 2.45796262269716,
    "error": 1.2825137863247
  },
  "soil_structure": {
    "value": null,
    "error": null
  },
  "soil_composition": {
    "value": 1,
    "error": 0
  },
  "ero_rainfall_and_wind": {
    "value": null,
    "error": null
  },
  "ero_couv_slope_and_cover": {
    "value": null,
    "error": null
  },
  "ero_soil_stability": {
    "value": 3.61301785316609,
    "error": 1.03530203632118
  },
  "ero_water_seepage": {
    "value": 0.0105773064537853,
    "error": 0.0190876236808545
  },
  "soil_fauna_density": {
    "value": 35.4364475369042,
    "error": 54.1157337750946
  },
  "soil_fauna_diversity": {
    "value": 1.11305062617862,
    "error": 0.322854726031543
  },
  "soil_fauna_abundance_tax1": {
    "value": null,
    "error": null
  },
  "soil_fauna_abundance_tax2": {
    "value": null,
    "error": null
  },
  "soil_fauna_abundance_tax3": {
    "value": null,
    "error": null
  },
  "surface_fauna_density": {
    "value": 233487.710287447,
    "error": 187362.916231765
  },
  "surface_fauna_diversity": {
    "value": 2.27261737826991,
    "error": 1.84248681478387
  },
  "surface_fauna_abundance_tax1": {
    "value": null,
    "error": null
  },
  "surface_fauna_abundance_tax2": {
    "value": null,
    "error": null
  },
  "surface_fauna_abundance_tax3": {
    "value": null,
    "error": null
  }
}


export function DashboardPage() {
  const [valuesArray, setValuesArray]= useState([]);
  const [errorsArray, setErrorsArray]=useState([]);
  const [data, setData] = useState<RawData>({
  biomass_volume: emptyField,
  tree_density: emptyField,
  tree_pop: emptyField,
  richness: emptyField,
  relative_abundance: emptyField,
  epf_deadWood: emptyField,
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
  soil_fauna_abundance: emptyField,
  soil_fauna_abundance_tax1: emptyField,
  soil_fauna_abundance_tax2: emptyField,
  soil_fauna_abundance_tax3: emptyField,
  surface_fauna_density: emptyField,
  surface_fauna_diversity: emptyField,
  surface_fauna_abundance: emptyField,
  surface_fauna_abundance_tax1: emptyField,
  surface_fauna_abundance_tax2: emptyField,
  surface_fauna_abundance_tax3: emptyField
});

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
  const indicatorKeys = Object.keys(data) as (keyof typeof data)[] as NumericKeys<RawData>;

  useEffect (() => {
    // request(api).then((res) => setData(preciseNumericIndicators<RawData>(res, indicatorKeys, "N/A")))
    request(api).then((res) => {
      console.log("Rawdata:",res);
      const valuesObj = Object.fromEntries(
        Object.entries(res).map(([key, v]) => [key, v.value])
      );
      const errorsObj = Object.fromEntries(
        Object.entries(res).map(([key, v]) => [key, v.error])
      );
      const preciseValues = preciseNumericIndicators(valuesObj, indicatorKeys, "N/A");
      const preciseErrors = preciseNumericIndicators(errorsObj, indicatorKeys, "N/A");

      console.log("Données transformées :", preciseValues);
      setData(preciseValues);
    });
  }, [])

  useEffect (() => {
    console.log("Data:", data);
    const values: [string, number][] = Object.entries(fakeData)
      .filter(([_, v]) => v.value !== null)
      .map(([key, v]) => [key, v.value]);

    const errors: [string, number][] = Object.entries(fakeData)
      .filter(([_, v]) => v.error !== null)
      .map(([key, v]) => [key, v.error]);
    setValuesArray(values);
    setBenefChartPotential({
      density: data.epf_tree_density.value || 0,
      diversity: data.epf_tree_diversity.value || 0,
      diameterDistribution: data.epf_diameter_distribution.value || 0,
      dominantHeight: data.epf_dominant_height.value || 0,
      microHabitat: data.epf_microhabitats.value || 0,
      deadWood: data.epf_deadWood.value || 0,
      spatialDistribution: data.epf_spatial_distribution.value || 0,
      verticalDistribution: data.epf_vertical_distribution.value || 0
    })
  }, [data])

  useEffect(() => {
    console.log("MetaData:", valuesArray);
    console.log("Values:", errorsArray)
  }, [valuesArray, errorsArray])

  return (
    <div>
      <Header />
      <div className="px-7">
        <DashBoardHead />
        <div className="mt-4 flex flex-wrap space-y-8 w-full">
          <ChartRelativeAbundance data={valuesArray}/>
          <ChartForestPotential benef={benefChartPotential} />

        </div>
      </div>

    </div>
  );
}
