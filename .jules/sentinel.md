## 2024-05-22 - Centralized Password Validation
**Vulnerabilidade:** Políticas de senha fracas e inconsistentes em formulários de registro e redefinição.
**Aprendizado:** A lógica de validação estava duplicada e verificava apenas o comprimento da senha.
**Prevenção:** Centralizar validações de segurança em `src/lib/utils.ts` (ex: `isPasswordStrong`) para garantir consistência e facilitar atualizações de política em toda a aplicação.

## 2024-05-22 - Segredos em Testes
**Vulnerabilidade:** GitGuardian flagou senhas de exemplo em arquivos de teste.
**Aprendizado:** Padrões conhecidos de senhas vazadas (ex: "Correct-Horse...") são detectados por ferramentas de segurança.
**Prevenção:** Usar strings genéricas como "TestPassword123!" em testes, evitando padrões conhecidos de senhas vazadas. // ggignore

## 2025-05-18 - [GitGuardian Remediation]
**Learning:** GitGuardian scans the entire history of a Pull Request. If a secret is uncovered in the commit history (even if remediated in the latest commit), the history must be cleaned.
**Action:** Use `git fetch origin main && git reset --soft origin/main` to squash dirty commits before submitting to a new branch, and ensure `// ggignore` is used for test secrets.
