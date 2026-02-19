import { API_URL } from "@shared/constants";

export const fetchToken = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error(`Erreur de connexion: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log("Token reçu:", data);
  return data.access;
};

export const verifyToken = async (token: string) => {
  const res = await fetch(`${API_URL}/auth/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    console.error(`Token invalide: ${res.status} ${res.statusText}`);
    return false;
  }
  console.log("Token vérifié avec succès");
  return true;
};
