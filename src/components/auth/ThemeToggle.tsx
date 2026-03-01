import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
          aria-label="Alternar tema"
        >
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Alternar tema</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
