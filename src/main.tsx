import "regenerator-runtime/runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { VirtualTryOnProductProvider } from "./context/virtual-try-on-product-context.tsx";

const queryClient = new QueryClient();

function renderApp(containerId: string, skus: string[]) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <VirtualTryOnProductProvider initialSkus={skus}>
          <App />
        </VirtualTryOnProductProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// Delegated event listener
document.addEventListener("click", (e) => {
  const target = e.target as Element;
  const tryOnButton = target.closest(".tryon-button");

  if (tryOnButton) {
    e.preventDefault();
    const skus = tryOnButton.getAttribute("data-sku")?.split(",") || [];
    if (skus.length > 0) {
      // Create new container
      const container = document.createElement("div");
      container.id = "virtual-try-on-root";
      container.style.zIndex = "9999"; // Set z-index to be the most top element
      container.style.position = "fixed";
      container.classList.add("w-full", "h-full", "inset-0");
      document.body.appendChild(container);

      window.__INITIAL_ROUTE__ = "/virtual-try-on-product";
      renderApp("virtual-try-on-root", skus);
    }
  }
});

if (window.__INITIAL_ROUTE__) {
  console.log("Initial route", window.__INITIAL_ROUTE__);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <VirtualTryOnProductProvider>
          <App />
        </VirtualTryOnProductProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
} else {
  if (import.meta.env.DEV) {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <VirtualTryOnProductProvider>
            <App />
          </VirtualTryOnProductProvider>
        </QueryClientProvider>
      </StrictMode>,
    );

    console.error("Rendered default route");
  } else {
    console.error("No initial route found");
  }
}
