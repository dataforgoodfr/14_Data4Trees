const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql';

export const fetchData = async () => {
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