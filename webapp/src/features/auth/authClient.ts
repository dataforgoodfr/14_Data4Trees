import { API_URL } from "@shared/api/client";

export const fetchToken = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/token/`, {
    body: JSON.stringify({ password, username }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
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
    body: JSON.stringify({ token }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!res.ok) {
    console.error(`Token invalide: ${res.status} ${res.statusText}`);
    return false;
  }
  console.log("Token vérifié avec succès");
  return true;
};
