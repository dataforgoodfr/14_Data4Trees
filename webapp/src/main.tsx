import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import GlobalRouter from "./app/global-router";

// biome-ignore lint/style/noNonNullAssertion: <Common Vite way>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalRouter />
  </StrictMode>,
);
