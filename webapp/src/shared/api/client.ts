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
    console.error(`Erreur API: ${res.status} ${res.statusText}`);
    const errorData = await res.json().catch(() => ({
      error: "Erreur de communication",
      details: [res.statusText],
    }));
    console.error("Détails de l'erreur:", JSON.stringify(errorData, null, 2));

    const error = new Error(`Erreur API: ${res.status}`);

    // @ts-expect-error Property 'response' does not exist on type 'Error'.
    error.response = { data: errorData };

    throw error;
  }

  return res;
};

export const fetchJSONWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  authToken: string | null,
) => (await fetchWithAuth(endpoint, options, authToken)).json();

export const createApiClient = () => ({});

export type ApiClient = ReturnType<typeof createApiClient>;
