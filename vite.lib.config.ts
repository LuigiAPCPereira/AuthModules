/**
 * Configuração do Vite para build da biblioteca
 * Gera pacote npm pronto para publicação
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "AuthModules",
      fileName: (format) => `auth-modules.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-hook-form",
        "@hookform/resolvers",
        "zod",
        "framer-motion",
        "lucide-react",
        "next-themes",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-label",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-hook-form": "ReactHookForm",
          zod: "z",
          "framer-motion": "motion",
          "lucide-react": "LucideReact",
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
