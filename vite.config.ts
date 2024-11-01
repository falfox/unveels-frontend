import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/rest": {
        target: "https://magento-1231949-4398885.cloudwaysapps.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rest/, "/en/rest"),
      },
    },
  },
});
