import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/AuthModules/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    headers: {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://use.typekit.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.typekit.net; font-src 'self' data: https://fonts.gstatic.com https://use.typekit.net; img-src 'self' data: https://p.typekit.net; connect-src 'self' wss://*.supabase.co wss://*.supabase.in; object-src 'none'; base-uri 'self';"
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          // framer-motion and lucide-react are intentionally excluded from manualChunks
          // to allow the bundler to correctly split them into separate lazy-loaded chunks
          // via dynamic import (e.g. signup/forgot-password forms, motion-features).
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
