# Tech Stack

## Core Framework
- **Next.js 16** (App Router, React Server Components, Turbopack in dev)
- **React 19**
- **TypeScript 5** — strict mode enabled, path alias `@/*` maps to project root

## Styling
- **Tailwind CSS v4** with `@tailwindcss/postcss` and `@tailwindcss/forms`
- CSS Modules for component-scoped styles (e.g. `*.module.css`)
- Global styles in `app/css/style.css`, design tokens in `app/css/tokens.css`

## State Management
- **Zustand 5** with `devtools` middleware — one store per feature, split into `State` and `Actions` interfaces

## HTTP / API
- **Axios** via a singleton `ApiClient` class (`lib/api/client.ts`)
  - Auto-attaches JWT Bearer token from `localStorage` / `sessionStorage`
  - Handles 401/403 redirects to `/signin`
  - Wraps responses in `ApiResponse<T>` shape

## Key Libraries
| Library | Purpose |
|---|---|
| `zustand` | Global state management |
| `framer-motion` | Animations |
| `mind-elixir` + `simple-mind-map` | Mind map rendering |
| `yjs` + `y-webrtc` | Real-time collaborative editing |
| `quill` + `quill-delta` | Rich text editing |
| `lucide-react` | Icons |
| `date-fns` | Date utilities |
| `uuid` | ID generation |
| `axios` | HTTP client |
| `three` | 3D/WebGL effects |
| `katex` | Math rendering |
| `pdf-lib` + `jszip` | Export (PDF/ZIP) |
| `@headlessui/react` | Accessible UI primitives |

## Testing
- **Jest 30** + **jest-environment-jsdom**
- **@testing-library/react** for component tests
- **fast-check** for property-based testing (PBT) — used extensively in `__tests__/*.property.test.ts` files

## Common Commands

```bash
# Development (Turbopack, port 3002)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Run all tests (single pass)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests in CI mode
pnpm test:ci
```

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` — backend API base URL (required, set in `.env.local`)
