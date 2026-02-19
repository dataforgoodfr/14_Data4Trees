import { StrictMode } from "react";

import App from "./app/App.tsx";
import "./index.css";
import { createRoot } from "react-dom/client";

// biome-ignore lint/style/noNonNullAssertion: <Common Vite way>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
