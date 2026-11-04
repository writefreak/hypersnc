// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: { allowedHosts: [".devtunnels.ms"] },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa"; // NEW

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // NEW: saves the app's files on the phone so it loads with no internet
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Offline Share",
        short_name: "Offline Share",
        start_url: "/app",
        display: "standalone",
        background_color: "#f6f7f2",
        theme_color: "#a3e635",
      },
      workbox: {
        navigateFallback: "/index.html", // /app also loads from the saved copy
        globPatterns: ["**/*.{js,css,html,woff2,png,svg}"],
      },
    }),
  ],
  server: { allowedHosts: [".devtunnels.ms"] },
  preview: { allowedHosts: [".devtunnels.ms"] }, // NEW: lets the built version run through your tunnel too
});