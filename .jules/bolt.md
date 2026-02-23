## 2025-02-12 - [Single-Page Component Routing]
**Learning:** The `Index` page handles routing for multiple auth screens (`login`, `signup`, `forgot`, etc.) using internal state instead of React Router.
**Action:** Use `React.lazy` and `Suspense` for these secondary screens to split the bundle, as they are not needed for the initial render.

## 2025-02-13 - [Manual Form State Performance]
**Learning:** Auth forms (`LoginForm`, `SignupForm`) use controlled inputs with local `useState` for every field, causing full component re-renders on every keystroke.
**Action:** Refactor to `react-hook-form` with `zod` to use uncontrolled inputs, significantly reducing re-renders and improving input latency.
