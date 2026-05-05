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



// Build = preparing your app for real users (production)
// Build = converting your project into optimized, deployable files for users

// Vite is not just a bundler — it’s a fast dev server + bundler (only during build).
// A bundler is a tool that combines many files into a few optimized files.

// It’s the configuration (settings) file for Vite

// In simple words :  “This file tells Vite how to run and build your project.”

// In dev mode, vite.config.js configures how Vite serves and processes your code — not how it bundles it.

