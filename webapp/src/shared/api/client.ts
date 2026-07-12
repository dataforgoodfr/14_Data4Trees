import type { APIError } from "../lib/types";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  authToken: string | null,
) => {
  const headers = new Headers(options.headers);
  headers.set("Authorization", authToken ? `Bearer ${authToken}` : "");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({
      details: [res.statusText],
      error: "Erreur de communication",
    }));

    const message = `Erreur API: ${res.status} ${res.statusText}`;
    const cause = JSON.stringify(errorData, null, 2);

    console.error(message);
    console.error("Détails de l'erreur:", cause);

    const error: APIError = { cause, message, status: res.status };

    throw error;
  }

  return res;
};

export const fetchJSONWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  authToken: string | null,
) => (await fetchWithAuth(endpoint, options, authToken)).json();

export const createApiClient = (authToken: string | null) => ({
  addData: (formData: FormData) =>
    fetchWithAuth(
      `/maps/add-data/`,
      { body: formData, method: "POST" },
      authToken,
    ),
  getCatalogResource: (layerId: string, resourceName: string) =>
    fetchJSONWithAuth(`/catalog/${layerId}/${resourceName}`, {}, authToken),
  getCatalogResourceList: (layerId: string, resourceList: string[]) =>
    fetchJSONWithAuth(
      `/catalog/${layerId}`,
      {
        body: JSON.stringify({ resources: resourceList }),
        method: "POST",
      },
      authToken,
    ),
  getDashboardData: (layerId: string) =>
    fetchJSONWithAuth(`/maps/dashboard/${layerId}`, {}, authToken),
});

export type ApiClient = ReturnType<typeof createApiClient>;
