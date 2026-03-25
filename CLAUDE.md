# SyncUp

Event coordination app with real-time collaborative time slot editing via Yorkie CRDT. React + NestJS, pnpm monorepo.

## Development Commands

```sh
pnpm install                # Install all dependencies
pnpm dev                    # Run frontend + backend concurrently

# Frontend
pnpm frontend dev           # Vite dev server
pnpm frontend build         # tsc + vite build
pnpm frontend lint          # ESLint check

# Backend
pnpm backend start:dev      # NestJS watch mode
pnpm backend build          # nest build
pnpm backend test           # Jest unit tests
pnpm backend test:e2e       # End-to-end tests
pnpm backend lint           # ESLint with fix
```

## After Making Changes

Always run before submitting:
```sh
pnpm frontend lint && pnpm backend lint && pnpm backend test
```

## Project Docs

- **Design docs**: `docs/design/` for architectural context. New docs use [TEMPLATE.md](docs/design/TEMPLATE.md).
- **Task tracking**: `docs/tasks/active/` for in-progress, `docs/tasks/archive/` for completed. Use `YYYYMMDD-<slug>-{todo,lessons}.md` pairs.
- **Setup**: Run `bash scripts/setup.sh` to enable commit message validation hook.

## Gotchas

- Auth flow: GitHub OAuth -> JWT stored in `syncup_session` cookie
- UI uses shadcn/ui ("new-york" variant, slate base color, lucide icons) — use `npx shadcn-ui@latest add` for new components
- Frontend path alias: `@/` -> `./src/`
- Backend and frontend have different TypeScript targets (ES2023/CommonJS vs ES2020/ESNext)
- ESLint 9 flat config — not the legacy `.eslintrc` format
