## 2024-05-22 - AuthInput Accessibility
**Aprendizado:** O componente `AuthInput` requer que um `id` seja passado via props para associar corretamente o label ao input (via `htmlFor`). Além disso, botões interativos dentro de inputs (como toggle de senha) não devem ter `tabIndex={-1}` para garantir acesso via teclado.
**Ação:** Ao usar ou criar inputs customizados, sempre verificar a associação label-input e a navegabilidade via teclado de elementos auxiliares.

## 2026-02-12 - Navegação por teclado em tabs de autenticação
**Aprendizado:** Em navegação tipo "pills" para trocar telas, tratar o grupo como `tablist` com `aria-selected`, `tabIndex` em roving e atalhos `ArrowLeft/ArrowRight/Home/End` melhora bastante a usabilidade sem alterar layout.
**Ação:** Reutilizar esse padrão em qualquer seletor horizontal de telas/etapas para manter experiência consistente entre mouse, teclado e leitor de tela.

## 2026-02-14 - IDs em Componentes de Formulário

**Aprendizado:** Depender de `props.id` para associar labels a inputs (via `htmlFor`) cria riscos de acessibilidade se o desenvolvedor esquecer o atributo.
**Ação:** Usar `useId()` do React para gerar IDs padrão garante que a associação label-input e `aria-describedby` para erros funcionem sempre, mesmo sem configuração manual.
