# SyncUp

Lightweight event coordination app for planning events and syncing available time slots. Built with real-time collaboration via Yorkie CRDT.

## Tech Stack

- **Backend**: NestJS 11, Passport (GitHub OAuth + JWT), Express, SWC
- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Radix UI (shadcn/ui), Yorkie SDK
- Node 22, pnpm workspace, TypeScript
- Jest (backend), ESLint 9 (flat config), Prettier

## Development Commands

```sh
pnpm install                # Install all dependencies
pnpm dev                    # Run frontend + backend concurrently
pnpm build                  # Build both packages

# Frontend
pnpm frontend dev           # Vite dev server
pnpm frontend build         # tsc + vite build
pnpm frontend lint          # ESLint check

# Backend
pnpm backend start:dev      # NestJS watch mode
pnpm backend start:debug    # Debug mode
pnpm backend build          # nest build
pnpm backend test           # Jest unit tests
pnpm backend test:cov       # Test with coverage
pnpm backend test:e2e       # End-to-end tests (supertest)
pnpm backend lint           # ESLint with fix
pnpm backend format         # Prettier format
```

## Project Structure

```
frontend/src/
  App.tsx                   # Main app with routing
  CreateEventPage.tsx       # Event creation (react-hook-form + zod)
  EventDetailPage.tsx       # Event detail/voting page
  Layout.tsx                # Shared layout
  components/
    NavBar.tsx              # Navigation
    TimeGrid.tsx            # Time slot selection grid
    ThemeProvider.tsx        # Dark mode support (next-themes)
    ui/                     # shadcn/ui components (Radix-based)
  hooks/                    # Custom React hooks
  lib/                      # Utilities (times, utils)
  types/                    # TypeScript type definitions

backend/src/
  app.module.ts             # Root NestJS module
  main.ts                   # Bootstrap with cookie-parser + sessions
  auth/
    auth.service.ts         # JWT token creation
    auth.controller.ts      # GitHub OAuth + JWT verify endpoints
    github.strategy.ts      # Passport GitHub strategy
    jwt.strategy.ts         # Passport JWT strategy (cookie: syncup_session)
    github-auth.guard.ts    # GitHub auth guard
    jwt-auth.guard.ts       # JWT auth guard
```

## Code Conventions

- Backend Prettier: single quotes, trailing commas
- Frontend: ESLint with react-hooks + react-refresh rules
- Backend TypeScript: strict mode, ES2023 target, CommonJS modules
- Frontend TypeScript: strict mode, ES2020 target, ESNext modules
- Path alias: `@/` -> `./src/` (frontend only)
- shadcn/ui style: "new-york" variant, slate base color, lucide icons

## Architecture Notes

- **Auth flow**: GitHub OAuth -> JWT token stored in `syncup_session` cookie
- **Real-time**: Yorkie SDK (`@yorkie-js/react`) for collaborative time slot editing
- **Form validation**: Zod schemas with react-hook-form
- **UI framework**: Radix UI primitives via shadcn/ui, styled with Tailwind CSS
- **Deployment**: Frontend -> GitHub Pages, Backend -> Docker (yorkieteam/syncup)
