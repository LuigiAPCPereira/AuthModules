## 2025-02-12 - [Single-Page Component Routing]
**Learning:** The `Index` page handles routing for multiple auth screens (`login`, `signup`, `forgot`, etc.) using internal state instead of React Router.
**Action:** Use `React.lazy` and `Suspense` for these secondary screens to split the bundle, as they are not needed for the initial render.

## 2025-02-13 - [Manual Form State Performance]
**Learning:** Auth forms (`LoginForm`, `SignupForm`) use controlled inputs with local `useState` for every field, causing full component re-renders on every keystroke.
**Action:** Refactor to `react-hook-form` with `zod` to use uncontrolled inputs, significantly reducing re-renders and improving input latency.

## 2024-05-23 - Eliminando Re-renders em Formulários

**Aprendizado:** `watch()` do `react-hook-form` é poderoso, mas perigoso. Usá-lo no corpo do componente para renderizar uma mensagem de sucesso (que só aparece DEPOIS do submit) causa re-renders desnecessários a cada tecla digitada.
**Ação:** Mover dados estáticos pós-submit (como o e-mail enviado) para um estado local (`useState`) que é preenchido apenas no `onSubmit`. Isso isola a renderização do formulário da renderização do resultado, eliminando N re-renders (onde N é o tamanho do input).

## 2026-02-13 - [Coverage Dependency Mismatch]
**Learning:** Running mixed versions of `vitest` and `@vitest/coverage-v8` causes runtime errors. They must match exactly.
**Action:** Always ensure the major and minor versions of these two packages are synchronized in `package.json`.

## 2026-02-13 - [Syncing package-lock.json with Bun]
**Learning:** bun install v1.2.14 (6a363a38)

+ @eslint/js@9.39.2
+ @tailwindcss/typography@0.5.19
+ @types/node@22.19.11
+ @types/react@18.3.28
+ autoprefixer@10.4.24
+ eslint@9.39.2
+ eslint-plugin-react-refresh@0.4.26
+ tailwindcss@3.4.19
+ typescript@5.9.3
+ typescript-eslint@8.55.0
+ vite@5.4.21
+ @radix-ui/react-accordion@1.2.12
+ @radix-ui/react-alert-dialog@1.1.15
+ @radix-ui/react-aspect-ratio@1.1.8
+ @radix-ui/react-avatar@1.1.11
+ @radix-ui/react-checkbox@1.3.3
+ @radix-ui/react-collapsible@1.1.12
+ @radix-ui/react-context-menu@2.2.16
+ @radix-ui/react-dialog@1.1.15
+ @radix-ui/react-dropdown-menu@2.1.16
+ @radix-ui/react-hover-card@1.1.15
+ @radix-ui/react-label@2.1.8
+ @radix-ui/react-menubar@1.1.16
+ @radix-ui/react-navigation-menu@1.2.14
+ @radix-ui/react-popover@1.1.15
+ @radix-ui/react-progress@1.1.8
+ @radix-ui/react-radio-group@1.3.8
+ @radix-ui/react-scroll-area@1.2.10
+ @radix-ui/react-select@2.2.6
+ @radix-ui/react-separator@1.1.8
+ @radix-ui/react-slider@1.3.6
+ @radix-ui/react-slot@1.2.4
+ @radix-ui/react-switch@1.2.6
+ @radix-ui/react-tabs@1.1.13
+ @radix-ui/react-toast@1.2.15
+ @radix-ui/react-toggle@1.1.10
+ @radix-ui/react-toggle-group@1.1.11
+ @radix-ui/react-tooltip@1.2.8
+ @tanstack/react-query@5.90.21
+ react-hook-form@7.71.1
+ react-router-dom@6.30.3
+ tailwind-merge@2.6.1

144 packages installed [1372.00ms]

Blocked 1 postinstall. Run `bun pm untrusted` for details. updates  but may not update  correctly for
added 517 packages, and audited 518 packages in 26s

100 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (4 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details. usage in CI pipelines.
**Action:** When adding dependencies with Bun is a fast JavaScript runtime, package manager, bundler, and test runner. (1.2.14+6a363a38d)

Usage: bun <command> [...flags] [...args]

Commands:
  run       ./my-script.ts       Execute a file with Bun
            lint                 Run a package.json script
  test                           Run unit tests with Bun
  x         nuxi                 Execute a package binary (CLI), installing if needed (bunx)
  repl                           Start a REPL session with Bun
  exec                           Run a shell script directly with Bun

  install                        Install dependencies for a package.json (bun i)
  add       @shumai/shumai       Add a dependency to package.json (bun a)
  remove    webpack              Remove a dependency from package.json (bun rm)
  update    hono                 Update outdated dependencies
  outdated                       Display latest versions of outdated dependencies
  link      [<package>]          Register or link a local npm package
  unlink                         Unregister a local npm package
  publish                        Publish a package to the npm registry
  patch <pkg>                    Prepare a package for patching
  pm <subcommand>                Additional package management utilities

  build     ./a.ts ./b.jsx       Bundle TypeScript & JavaScript into a single file

  init                           Start an empty Bun project from a built-in template
  create    elysia               Create a new project from a template (bun c)
  upgrade                        Upgrade to latest version of Bun.
  <command> --help               Print help text for command.

Learn more about Bun:            https://bun.sh/docs
Join our Discord community:      https://bun.sh/discord that are required by CI running npm <command>

Usage:

npm install        install all the dependencies in your project
npm install <foo>  add the <foo> dependency to your project
npm test           run this project's tests
npm run <foo>      run the script named <foo>
npm <command> -h   quick help on <command>
npm -l             display usage info for all commands
npm help <term>    search for help on <term>
npm help npm       more involved overview

All commands:

    access, adduser, audit, bugs, cache, ci, completion,
    config, dedupe, deprecate, diff, dist-tag, docs, doctor,
    edit, exec, explain, explore, find-dupes, fund, get, help,
    help-search, init, install, install-ci-test, install-test,
    link, ll, login, logout, ls, org, outdated, owner, pack,
    ping, pkg, prefix, profile, prune, publish, query, rebuild,
    repo, restart, root, run, sbom, search, set, shrinkwrap,
    star, stars, start, stop, team, test, token, undeprecate,
    uninstall, unpublish, unstar, update, version, view, whoami

Specify configs in the ini-formatted file:
    /home/jules/.npmrc
or on the command line via: npm <command> --key=value

More configuration info: npm help config
Configuration fields: npm help 7 config

npm@11.7.0 /home/jules/.nvm/versions/node/v22.22.0/lib/node_modules/npm, run
up to date, audited 518 packages in 2s

100 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (4 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details. (or ensure  is updated) to keep lockfiles in sync.

## 2026-02-13 - [Syncing package-lock.json with Bun]
**Learning:** `bun install` updates `bun.lockb` but may not update `package-lock.json` correctly for `npm ci` usage in CI pipelines.
**Action:** When adding dependencies with `bun` that are required by CI running `npm`, run `npm install` (or ensure `package-lock.json` is updated) to keep lockfiles in sync.
