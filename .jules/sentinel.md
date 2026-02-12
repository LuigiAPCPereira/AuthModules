## 2024-05-22 - Centralized Password Validation
**Vulnerabilidade:** Políticas de senha fracas e inconsistentes em formulários de registro e redefinição.
**Aprendizado:** A lógica de validação estava duplicada e verificava apenas o comprimento da senha.
**Prevenção:** Centralizar validações de segurança em `src/lib/utils.ts` (ex: `isPasswordStrong`) para garantir consistência e facilitar atualizações de política em toda a aplicação.

## 2024-05-22 - Segredos em Testes
**Vulnerabilidade:** GitGuardian flagou senhas de exemplo em arquivos de teste.
**Aprendizado:** Padrões conhecidos de senhas vazadas (ex: "Correct-Horse...") são detectados por ferramentas de segurança.
**Prevenção:** Usar strings genéricas como "TestPassword123!" em testes, evitando padrões conhecidos de senhas vazadas.
