## 2024-05-22 - Centralized Password Validation
**Vulnerabilidade:** Políticas de senha fracas e inconsistentes em formulários de registro e redefinição.
**Aprendizado:** A lógica de validação estava duplicada e verificava apenas o comprimento da senha.
**Prevenção:** Centralizar validações de segurança em `src/lib/utils.ts` (ex: `isPasswordStrong`) para garantir consistência e facilitar atualizações de política em toda a aplicação.

## 2024-05-22 - Segredos em Testes
**Vulnerabilidade:** GitGuardian flagou senhas de exemplo em arquivos de teste.
**Aprendizado:** Padrões conhecidos de senhas vazadas (ex: "Correct-Horse...") são detectados por ferramentas de segurança.
**Prevenção:** Usar strings genéricas como "TestPassword123!" em testes, evitando padrões conhecidos de senhas vazadas.

## 2024-05-23 - CSS Injection via Unsanitized ID in Chart Component
**Vulnerabilidade:** A prop `id` era usada diretamente em seletores CSS dentro de uma tag `<style>`, permitindo injeção de CSS (UI Redress) se o ID fosse controlado pelo usuário.
**Aprendizado:** Mesmo em componentes React, a geração dinâmica de strings CSS deve tratar inputs como não confiáveis.
**Prevenção:** Sanitizar identificadores usados em seletores CSS (ex: remover caracteres não alfanuméricos) para garantir que não escapem do contexto do seletor.
