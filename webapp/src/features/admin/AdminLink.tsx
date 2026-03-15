import type { FC } from "react";

import { useAuth } from "@features/auth";

import { API_URL } from "@shared/api/client";

import { Button } from "@ui/button";

export const AdminLink: FC = () => {
  const authContext = useAuth();

  if (!authContext.isAuthenticated) {
    return null;
  }

  /** @todo Improve loading and error cases when UI is ready */
  const createAdminSession = async () => {
    try {
      await fetch(`${API_URL}/admin-session/`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authContext.token}`,
        },
        method: "POST",
      });

      window.open(API_URL.replace("/api", "/admin"));
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={createAdminSession}>Go to Admin</Button>;
};
