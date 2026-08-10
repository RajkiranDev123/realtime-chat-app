import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

// vite.config.ts is the settings file for Vite.

// This file tells Vite : 1. Use React , 2. Use Tailwind , 3. Treat @ as the src folder

// Vite = development/build tool and Vite handles the environment around React.

// HMR = Hot Module Replacement : when you change code,
// the browser updates that part without doing a full page reload / without a full browser refresh.

// You write React code -> Vite -> Develpment Server -> Browser

// Change React code -> Vite -> HMR -> Browser updates

// When deploy React code -> Vite build -> Rollup (bundling) -> Optimized files  -> Production server
