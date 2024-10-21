import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PageProvider } from "./hooks/usePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PageProvider>
      <App />
    </PageProvider>
  </StrictMode>,
);
