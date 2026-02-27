import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { LazyMotion } from "framer-motion";

const queryClient = new QueryClient();

// Use dynamic import for the full feature set (domMax)
const loadFeatures = () => import("./lib/motion-features").then((res) => res.default);

// In the standard Vite demo app, read the environment variables explicitly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LazyMotion features={loadFeatures} strict>
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
