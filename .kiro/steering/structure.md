# Project Structure

## Top-Level Layout

```
app/          # Next.js App Router pages and API routes
components/   # Shared/reusable UI components
features/     # Feature modules (self-contained vertical slices)
hooks/        # Global React hooks
lib/          # Shared utilities, API client, configs
utils/        # Miscellaneous utility hooks
public/       # Static assets
docs/         # Architecture and project documentation
```

## App Router (`app/`)

Route groups separate concerns:

```
app/
├── (auth)/       # Authenticated routes (todos, whitelist, integrations)
├── (default)/    # Public-facing app routes (mindmap, pricing, ai-inbox, demo)
├── (public)/     # Unauthenticated routes (signin, signup)
├── api/          # API route handlers
│   └── v1/       # Versioned API routes
└── css/          # Global styles and design tokens
```

## Feature Modules (`features/`)

Each feature is a self-contained vertical slice:

```
features/{feature-name}/
├── types/        # TypeScript interfaces and types
├── api/          # API call functions (uses apiClient)
├── services/     # Business logic layer
├── stores/       # Zustand store
├── hooks/        # React hooks (consume store + services)
├── components/   # Feature-specific React components
├── __tests__/    # Property-based and unit tests
└── index.ts      # Public exports (barrel file)
```

Current features: `todos`, `aiInbox`, `auth`, `googleChat`

## Shared Components (`components/`)

Organized by domain/purpose:

```
components/
├── ui/           # Generic primitives (button, card, input, badge, header, footer)
├── marketing/    # Landing page sections (Hero, Navbar, CTA, Footer)
├── mindmap/      # Mind map editor components
├── mindmap-elixir/
├── pricing/      # Pricing page components
├── landing/      # Landing page atoms/molecules
├── landing-v2/   # Redesigned landing (atoms/molecules/organisms)
├── effects/      # Visual effect components (grain, parallax, etc.)
└── auth/         # Auth guard wrapper
```

## Library (`lib/`)

```
lib/
├── api/
│   ├── client.ts          # ApiClient class (singleton: apiClient)
│   └── backend-client.ts  # Backend-specific client variant
├── config/                # App-wide config, metadata, pricing data
├── mindmap/               # Mind map service, types, themes, hooks
├── mindmap-elixir/        # Mind Elixir-specific utilities
└── cn.ts                  # Tailwind class merging utility
```

## Conventions

- **File naming:** kebab-case for files and folders; descriptive names preferred
- **Component naming:** PascalCase for React components
- **Imports:** Use `@/` alias for all absolute imports (e.g. `@/features/todos`)
- **Barrel exports:** Each feature and component group exposes an `index.ts`
- **File size:** Keep files under ~200 lines; split into modules when exceeded
- **Tests:** Place in `__tests__/` inside the feature folder; property tests use `fast-check` and are named `*.property.test.ts`
- **Stores:** One Zustand store per feature; separate `State` and `Actions` interfaces; always use `devtools` middleware
- **API calls:** Always go through `apiClient` from `lib/api/client.ts`; raw `fetch` or direct axios usage is discouraged
