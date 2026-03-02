import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion } from "framer-motion";

import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

// ⚡ Bolt: Otimização de bundle do framer-motion.
// Ao invés de importar `motion` diretamente nos componentes (o que embute as
// funcionalidades de animação pesadas no bundle principal), usamos `m` nos componentes
// e carregamos dinamicamente as funcionalidades através do `LazyMotion`.
// Impacto: Redução do JavaScript inicial (economiza de 20 a 30kb gzipped) por isolar o framer-motion.
const loadFeatures = () => import("@/lib/motion-features").then(res => res.default);

const queryClient = new QueryClient();

// In the standard Vite demo app, read the environment variables explicitly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LazyMotion strict features={loadFeatures}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BrowserRouter
            basename={import.meta.env.BASE_URL}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AuthProvider supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey}>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LazyMotion>
  </QueryClientProvider>
);

export default App;
