## 2024-05-22 - Centralized Password Validation
**Vulnerabilidade:** Políticas de senha fracas e inconsistentes em formulários de registro e redefinição.
**Aprendizado:** A lógica de validação estava duplicada e verificava apenas o comprimento da senha.
**Prevenção:** Centralizar validações de segurança em `src/lib/utils.ts` (ex: `isPasswordStrong`) para garantir consistência e facilitar atualizações de política em toda a aplicação.

## 2024-05-22 - Segredos em Testes
**Vulnerabilidade:** GitGuardian flagou senhas de exemplo em arquivos de teste.
**Aprendizado:** Padrões conhecidos de senhas vazadas (ex: "Correct-Horse...") são detectados por ferramentas de segurança.
**Prevenção:** Usar strings genéricas como "TestPassword123!" em testes, evitando padrões conhecidos de senhas vazadas.

## 2024-05-23 - Validação de Limite de Input (Prevenção DoS)
**Vulnerabilidade:** Falta de restrição de tamanho máximo em inputs de string (email, senha, nome) nos schemas Zod.
**Aprendizado:** Inputs sem limite podem ser explorados para ataques de negação de serviço (DoS) via regex processing ou armazenamento.
**Prevenção:** Sempre adicionar `.max()` nos schemas Zod para strings (ex: `.max(255)` para emails, `.max(100)` para senhas).
