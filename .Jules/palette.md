## 2024-05-22 - AuthInput Accessibility
**Aprendizado:** O componente `AuthInput` requer que um `id` seja passado via props para associar corretamente o label ao input (via `htmlFor`). Além disso, botões interativos dentro de inputs (como toggle de senha) não devem ter `tabIndex={-1}` para garantir acesso via teclado.
**Ação:** Ao usar ou criar inputs customizados, sempre verificar a associação label-input e a navegabilidade via teclado de elementos auxiliares.

## 2026-02-12 - Navegação por teclado em tabs de autenticação
**Aprendizado:** Em navegação tipo "pills" para trocar telas, tratar o grupo como `tablist` com `aria-selected`, `tabIndex` em roving e atalhos `ArrowLeft/ArrowRight/Home/End` melhora bastante a usabilidade sem alterar layout.
**Ação:** Reutilizar esse padrão em qualquer seletor horizontal de telas/etapas para manter experiência consistente entre mouse, teclado e leitor de tela.

## 2026-02-14 - IDs em Componentes de Formulário

**Aprendizado:** Depender de `props.id` para associar labels a inputs (via `htmlFor`) cria riscos de acessibilidade se o desenvolvedor esquecer o atributo.
**Ação:** Usar `useId()` do React para gerar IDs padrão garante que a associação label-input e `aria-describedby` para erros funcionem sempre, mesmo sem configuração manual.

## 2026-02-17 - Feedback de Caps Lock em Inputs
**Aprendizado:** Detectar o estado do Caps Lock via `KeyboardEvent.getModifierState("CapsLock")` é uma melhoria simples mas de alto impacto UX para campos de senha, prevenindo erros frustrantes.
**Ação:** Implementar este padrão em todos os inputs do tipo `password`, usando um aviso visual não-intrusivo (role="alert") que não conflite com erros de validação.

## 2026-03-05 - Status acessível em listas de requisitos
**Aprendizado:** Listas de requisitos (como força de senha) visíveis apenas por cor/ícone são inacessíveis para leitores de tela. Usar `role="listitem"` e texto oculto (`sr-only`) indicando explicitamente o estado ("Atendido"/"Pendente") resolve isso sem poluição visual.
**Ação:** Aplicar texto auxiliar oculto em qualquer checklist ou indicador de status que dependa puramente de visual.

## 2026-02-19 - Acessibilidade em Checkboxes Customizados
**Aprendizado:** Ao substituir inputs nativos aninhados (`<label><input /></label>`) por componentes de UI desacoplados (Checkbox + Label), a associação explícita via `id` e `htmlFor` é obrigatória para garantir navegação por teclado e leitura correta por tecnologias assistivas.
**Ação:** Sempre definir IDs únicos ao usar o componente `Checkbox` e garantir que o `Label` correspondente aponte para ele.
