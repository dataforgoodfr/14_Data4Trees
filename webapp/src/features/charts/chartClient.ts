import { fetchJSONWithAuth } from "@shared/api/client";

export const fetchChartData = async (authToken: string | null) => {
  try {
    const data = await fetchJSONWithAuth("/chart-data", {}, authToken);
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du graphique:",
      error,
    );
    throw error;
  }
};

export const getChartData = async (name: string) => {
  const response = await fetch(`/src/features/charts/${name}.json`);
  return response.json();
};
