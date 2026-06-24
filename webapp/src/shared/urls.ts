import { useLocation } from "react-router-dom";

export const URLS = {
  ADMIN: "admin",
  DASHBOARD: "dashboard",
  HOME: "/",
  LOGIN: "login",
} as const;

/**
 * Returns the corrected URLs with the application prefix segment
 */
export const useAbsoluteUrls = () => {
  const location = useLocation();
  const pathnameWithoutLeadingSlash = location.pathname.replace(/^\/+/, "");
  const appSegment = pathnameWithoutLeadingSlash.split("/")[0];

  const getAbsolutePath = (path: string) => `/${appSegment}/${path}`;

  return {
    ADMIN: getAbsolutePath(URLS.ADMIN),
    DASHBOARD: getAbsolutePath(URLS.DASHBOARD),
    HOME: getAbsolutePath(""),
    LOGIN: getAbsolutePath(URLS.LOGIN),
  };
};
