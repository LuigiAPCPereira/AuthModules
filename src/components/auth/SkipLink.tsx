/**
 * Componente de link para pular conteúdo repetitivo
 * Ajuda usuários de teclado e screen readers a navegar efficientemente
 */

import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href: string;
  className?: string;
}

const SkipLink = ({ href, className }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:shadow-md focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary inline-flex items-center gap-2 font-medium transition-colors",
        className
      )}
    >
      <ArrowDown size={16} className="shrink-0" aria-hidden="true" />
      <span>Pular para o conteúdo</span>
    </a>
  );
};

export default SkipLink;
