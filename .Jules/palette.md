## 2024-05-22 - AuthInput Accessibility
**Aprendizado:** O componente `AuthInput` requer que um `id` seja passado via props para associar corretamente o label ao input (via `htmlFor`). Além disso, botões interativos dentro de inputs (como toggle de senha) não devem ter `tabIndex={-1}` para garantir acesso via teclado.
**Ação:** Ao usar ou criar inputs customizados, sempre verificar a associação label-input e a navegabilidade via teclado de elementos auxiliares.

## 2026-02-12 - Navegação por teclado em tabs de autenticação
**Aprendizado:** Em navegação tipo "pills" para trocar telas, tratar o grupo como `tablist` com `aria-selected`, `tabIndex` em roving e atalhos `ArrowLeft/ArrowRight/Home/End` melhora bastante a usabilidade sem alterar layout.
**Ação:** Reutilizar esse padrão em qualquer seletor horizontal de telas/etapas para manter experiência consistente entre mouse, teclado e leitor de tela.

## 2026-02-13 - Substituição de Checkbox Nativo por Shadcn
**Aprendizado:** O componente `Checkbox` (Radix UI) do Shadcn requer associação explícita com `htmlFor` no label para garantir interatividade e acessibilidade. Diferente do input nativo que pode ser aninhado no label, o componente customizado funciona melhor com separação de elementos e associação por ID.
**Ação:** Ao substituir `<input type="checkbox">` por `<Checkbox />`, usar estrutura com `id` e `label htmlFor` e garantir estilos `cursor-pointer` no label.
