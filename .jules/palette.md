# Palette UX/A11y Learnings

## 2024-05-24 - Interactive Elements Accessibility
**Aprendizado:** Elementos interativos como botões de alternância de senha devem ser acessíveis via teclado. Remover `tabIndex={-1}` e garantir estados de foco visíveis é crucial.
**Ação:** Sempre verificar se botões secundários dentro de inputs são alcançáveis via Tab e têm `focus-visible` definido.

## 2024-05-24 - Label Association
**Aprendizado:** Labels devem estar explicitamente associados aos inputs via `htmlFor` (matching `id`) para garantir que leitores de tela anunciem o nome do campo corretamente ao focar.
**Ação:** Usar `htmlFor={id}` em todos os componentes de input customizados.
