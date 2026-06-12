import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/app-all4trees";

// biome-ignore lint/style/noNonNullAssertion: <Common Vite way>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
