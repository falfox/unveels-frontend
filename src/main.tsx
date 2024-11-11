import "regenerator-runtime/runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PageProvider } from "./hooks/usePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PageProvider>
        <App />
      </PageProvider>
    </QueryClientProvider>
  </StrictMode>,
);
