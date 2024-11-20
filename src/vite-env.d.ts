/// <reference types="vite/client" />

interface Window {
  __INITIAL_ROUTE__: string;
  renderUnveelsApp(containerId: string, skus?: string[]): void;
}
