import { StrictMode } from "react";

import App from "./app/App.tsx";
import "./index.css";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
