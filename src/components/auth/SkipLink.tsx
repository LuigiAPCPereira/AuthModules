/**
 * Componente de link para pular conteúdo repetitivo
 * Ajuda usuários de teclado e screen readers a navegar efficientemente
 */

import { ArrowDown } from "lucide-react";

interface SkipLinkProps {
  href: string;
  className?: string;
}

export const SkipLink = ({ href, className = "" }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1 text-sm text-auth-subtle focus:outline-none focus:ring-2 focus:ring-primary hover:underline ${className}`}
    >
      <ArrowDown size={16} className="shrink-0" aria-hidden="true" />
      <span>Pular para o conteúdo</span>
    </a>
  );
};

export default SkipLink;
