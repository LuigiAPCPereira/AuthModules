## 2024-05-22 - AuthInput Accessibility
**Aprendizado:** O componente `AuthInput` requer que um `id` seja passado via props para associar corretamente o label ao input (via `htmlFor`). Além disso, botões interativos dentro de inputs (como toggle de senha) não devem ter `tabIndex={-1}` para garantir acesso via teclado.
**Ação:** Ao usar ou criar inputs customizados, sempre verificar a associação label-input e a navegabilidade via teclado de elementos auxiliares.
