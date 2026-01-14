const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql';

export const fetchGraphQLData = async () => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
    query {
  clientByName(name: "Sharon Kelly") {
    id
    fullName
    consumptionSet {
      id
      kwhConsumed
      year
      month
    }
  }
}`
    }),
  });
  const data = await res.json();
  return data;
}

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  authToken: string | null
) => {
  const headers = new Headers(options.headers);
  headers.set('Authorization', authToken ? `Bearer ${authToken}` : '');

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    console.error(`Erreur API: ${res.status} ${res.statusText}`);
    const errorData = await res.json().catch(() => ({
      error: 'Erreur de communication',
      details: [res.statusText],
    }));
    console.error('Détails de l\'erreur:', JSON.stringify(errorData, null, 2));

    const error = new Error(`Erreur API: ${res.status}`);

    // @ts-ignore
    error.response = { data: errorData };

    throw error;
  }

  return res;
};

export const fetchJSONWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  authToken: string | null
) => (await fetchWithAuth(endpoint, options, authToken)).json();

export const createApiClient = () => ({
  getData() {
    return fetchGraphQLData();
  }
});

export type ApiClient = ReturnType<typeof createApiClient>;
