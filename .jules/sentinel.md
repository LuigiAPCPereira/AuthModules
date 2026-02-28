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

## 2024-05-24 - Armazenamento Inseguro de Tokens de Autenticação
**Vulnerabilidade:** Tokens de acesso e refresh do Supabase estavam sendo armazenados manualmente em cookies do lado do cliente sem a flag `HttpOnly`.
**Aprendizado:** Armazenar tokens de sessão em cookies acessíveis via JavaScript (`document.cookie`) expõe a aplicação a sequestro de sessão em caso de vulnerabilidades XSS.
**Prevenção:** Não armazenar tokens sensíveis em cookies acessíveis por JavaScript. Utilize a persistência de sessão padrão do Supabase ou cookies `HttpOnly` seguros configurados pelo servidor.
