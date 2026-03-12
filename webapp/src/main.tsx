import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App.tsx";

// biome-ignore lint/style/noNonNullAssertion: <Common Vite way>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
