
# Sidebar com Perfil de Usuario

## Visao Geral

Criar um modulo de Sidebar completo com gerenciamento de perfil, seguindo a mesma estetica premium macOS dos componentes de autenticacao. A sidebar sera o ponto central de navegacao do app apos o login.

Antes de iniciar o novo modulo, corrigir os dois erros de build existentes.

---

## Fase 1 - Correcao de Bugs

### 1.1 Adicionar STRONG_PASSWORD_REGEX em `src/lib/constants.ts`
- Exportar a regex que ja e referenciada em `utils.ts` mas nunca foi definida

### 1.2 Corrigir tipo em `src/components/auth/LoginForm.tsx`
- Na linha 42, o `data` ja e tipado como `LoginFormData` pelo react-hook-form, entao o problema e que `onSubmit` recebe `LoginFormData` (onde os campos sao inferidos como opcionais pelo zod). Corrigir garantindo o cast correto com `as { email: string; password: string }`.

---

## Fase 2 - Novo Modulo: Sidebar + Perfil

### Arquitetura de Arquivos

```text
src/
  components/
    layout/
      AppSidebar.tsx          -- Sidebar principal com navegacao
      AppLayout.tsx            -- Layout wrapper (SidebarProvider + header + main)
      UserProfileDropdown.tsx  -- Menu dropdown do usuario no footer da sidebar
    profile/
      ProfilePage.tsx          -- Pagina de perfil completa
      ProfileAvatar.tsx        -- Upload/exibicao de avatar
      ProfileForm.tsx          -- Formulario de edicao de dados pessoais
      ChangePasswordForm.tsx   -- Formulario de troca de senha
  pages/
    Dashboard.tsx              -- Pagina dashboard (placeholder pos-login)
    Profile.tsx                -- Rota /profile
    Settings.tsx               -- Rota /settings (placeholder)
```

### 2.1 `AppLayout.tsx`
- Wrapper que usa `SidebarProvider` do shadcn
- Header fixo com `SidebarTrigger` sempre visivel
- ThemeToggle no header
- Slot para conteudo principal via `children` ou `<Outlet />`

### 2.2 `AppSidebar.tsx`
- Usa componentes `Sidebar`, `SidebarContent`, `SidebarMenu`, etc. do shadcn
- Grupos de navegacao:
  - **Principal**: Dashboard, Projetos (placeholder), Calendario (placeholder)
  - **Conta**: Perfil, Configuracoes
- Destaque da rota ativa usando `NavLink` + `useLocation`
- Footer da sidebar com `UserProfileDropdown`
- Icones via Lucide (LayoutDashboard, User, Settings, Calendar, FolderOpen)

### 2.3 `UserProfileDropdown.tsx`
- Exibe avatar + nome + email no footer da sidebar
- Dropdown (usando `DropdownMenu` do shadcn) com opcoes:
  - Ver Perfil
  - Configuracoes
  - Sair (chama fluxo de logout)

### 2.4 `ProfilePage.tsx`
- Layout em cards empilhados:
  - **Card Avatar**: Exibicao do avatar com botao de upload
  - **Card Dados Pessoais**: Nome, email, telefone (editavel)
  - **Card Seguranca**: Formulario de troca de senha com `PasswordStrengthBar`
- Todos com estados de loading, validacao e feedback via toast

### 2.5 `ProfileAvatar.tsx`
- Circulo com avatar ou iniciais como fallback
- Botao de camera/upload sobreposto
- Preview da imagem selecionada antes de salvar
- Animacao suave de transicao

### 2.6 `ProfileForm.tsx`
- Campos: Nome completo, Email (readonly), Telefone
- Validacao com zod + react-hook-form (mesmo padrao dos auth forms)
- Botao salvar com estado de loading

### 2.7 `ChangePasswordForm.tsx`
- Campos: Senha atual, Nova senha, Confirmar nova senha
- Integracao com `PasswordStrengthBar` existente
- Validacao de match entre nova senha e confirmacao

### 2.8 Paginas e Rotas
- `Dashboard.tsx`: Pagina inicial pos-login com cards de boas-vindas
- `Profile.tsx`: Renderiza `ProfilePage`
- `Settings.tsx`: Placeholder para futuras configuracoes
- Atualizar `App.tsx` com novas rotas aninhadas dentro do `AppLayout`

### 2.9 Atualizacao do `App.tsx`
- Rota `/` continua sendo o showcase de auth (Index)
- Novas rotas sob `/app`:
  - `/app` -> Dashboard
  - `/app/profile` -> Profile
  - `/app/settings` -> Settings
- Todas as rotas `/app/*` usam `AppLayout` como wrapper

---

## Detalhes Tecnicos

- **Estado do usuario**: Context simples (`UserContext`) com dados mockados (nome, email, avatar) para alimentar sidebar e perfil sem backend
- **Tema**: Reutiliza as variaveis CSS ja definidas (sidebar-background, sidebar-foreground, etc.)
- **Animacoes**: Framer Motion para transicoes de pagina e micro-interacoes
- **Responsividade**: Sidebar em sheet no mobile (comportamento nativo do shadcn sidebar), layout adaptativo no perfil
- **Acessibilidade**: Labels ARIA, navegacao por teclado, focus management
