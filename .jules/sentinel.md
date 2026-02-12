## 2024-05-22 - Centralized Password Validation
**Vulnerabilidade:** Políticas de senha fracas e inconsistentes em formulários de registro e redefinição.
**Aprendizado:** A lógica de validação estava duplicada e verificava apenas o comprimento da senha.
**Prevenção:** Centralizar validações de segurança em `src/lib/utils.ts` (ex: `isPasswordStrong`) para garantir consistência e facilitar atualizações de política em toda a aplicação.
