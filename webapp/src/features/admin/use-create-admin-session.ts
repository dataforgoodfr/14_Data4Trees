import { useState } from "react";

import { API_URL } from "@shared/api/client";

export const useCreateAdminSession = (token: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const createAdminSession = async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await fetch(`${API_URL}/admin-session/`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });

      window.open(API_URL.replace("/api", "/admin"));
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAdminSession,
    error,
    isLoading,
  };
};
