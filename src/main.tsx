import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App, { PageProvider } from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PageProvider>
      <App />
    </PageProvider>
  </StrictMode>,
);
