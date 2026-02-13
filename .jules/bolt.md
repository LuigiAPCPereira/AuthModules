## 2025-02-12 - [Single-Page Component Routing]
**Learning:** The `Index` page handles routing for multiple auth screens (`login`, `signup`, `forgot`, etc.) using internal state instead of React Router.
**Action:** Use `React.lazy` and `Suspense` for these secondary screens to split the bundle, as they are not needed for the initial render.

## 2025-02-13 - [Manual Form State Performance]
**Learning:** Auth forms (`LoginForm`, `SignupForm`) use controlled inputs with local `useState` for every field, causing full component re-renders on every keystroke.
**Action:** Refactor to `react-hook-form` with `zod` to use uncontrolled inputs, significantly reducing re-renders and improving input latency.

## 2025-02-13 - [Eliminando Re-renders em Formulários]
**Aprendizado:** `watch()` do `react-hook-form` é poderoso, mas perigoso. Usá-lo no corpo do componente para renderizar uma mensagem de sucesso (que só aparece DEPOIS do submit) causa re-renders desnecessários a cada tecla digitada.
**Ação:** Mover dados estáticos pós-submit (como o e-mail enviado) para um estado local (`useState`) que é preenchido apenas no `onSubmit`. Isso isola a renderização do formulário da renderização do resultado, eliminando N re-renders (onde N é o tamanho do input).

## 2026-02-13 - [Coverage Dependency Mismatch]
**Learning:** Running mixed versions of `vitest` and `@vitest/coverage-v8` causes runtime errors. They must match exactly.
**Action:** Always ensure the major and minor versions of these two packages are synchronized in `package.json`.

## 2026-02-13 - [Syncing package-lock.json with Bun]
**Learning:** `bun install` updates `bun.lockb` but may not update `package-lock.json` correctly for `npm ci` usage in CI pipelines.
**Action:** When adding dependencies with `bun` that are required by CI running `npm`, run `npm install` (or ensure `package-lock.json` is updated) to keep lockfiles in sync.
