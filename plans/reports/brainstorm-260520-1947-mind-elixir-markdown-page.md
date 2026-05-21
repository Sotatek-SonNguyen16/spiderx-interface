# Mind Elixir Markdown Mindmap Page - Brainstorm

## Problem Statement
Create a page that renders a mind map from Markdown input using `mind-elixir`.

Current repo already has:
- `mind-elixir@5.11.0` installed, unused in app code.
- Existing `/mindmap` page uses `simple-mind-map`, not Mind Elixir.
- Existing markdown parser at `lib/mindmap/markdown-converter.ts` only supports heading-style markdown and outputs `simple-mind-map` data shape.
- Existing `/mindmap` feature already has templates, themes, AI, export/import UI, drag-drop.

## Requirements
- User can paste/edit Markdown.
- Mind map updates from input.
- Use `mind-elixir` as render engine.
- Keep Next.js App Router SSR safe by isolating Mind Elixir in a client component.
- Support at least heading markdown and Markdown list/plaintext mindmap format.
- Leave current `simple-mind-map` editor stable unless replacement is intentional.

## Evaluated Approaches

### Option A - Add Mind Elixir renderer inside current `/mindmap`
Pros:
- Reuses current route and mindmap UI surface.
- Less navigation duplication.

Cons:
- Current provider and editor are tightly coupled to `simple-mind-map` data shape and commands.
- Mixing two render engines in one context will increase branching and type ambiguity.
- Current toolbar commands (`INSERT_NODE`, `REMOVE_NODE`, exports) do not map cleanly to Mind Elixir.

Verdict: Not recommended for first iteration. Too much integration risk.

### Option B - Create a dedicated Mind Elixir Markdown page
Example route: `app/(default)/mindmap-elixir/page.tsx` or `app/(default)/mindmap/markdown/page.tsx`.

Pros:
- Directly satisfies "Markdown input -> Mind Elixir render".
- Avoids breaking existing `simple-mind-map` feature.
- Cleaner lifecycle: one client component owns one `MindElixir` instance.
- Easier to add streaming later using `plaintextToMindElixir`.

Cons:
- New UI path duplicates some mindmap controls.
- Future consolidation needed if both editors must share templates/export/theming.

Verdict: Recommended.

### Option C - Replace current `/mindmap` engine with Mind Elixir
Pros:
- One mindmap engine long term.
- Mind Elixir plaintext converter and markdown node rendering are strong fit.

Cons:
- High regression risk. Current feature depends on `simple-mind-map` plugins and command behavior.
- Existing tests and docs assume `simple-mind-map`.
- Need rebuild export/import, templates, AI insertion, role modes, accessibility wrappers.

Verdict: Not recommended unless product goal is a full engine migration.

## Recommended Solution
Build a dedicated Mind Elixir markdown demo page first.

Architecture:

```text
app/(default)/mindmap-elixir/page.tsx
└── components/mindmap-elixir/markdown-mindmap-page.tsx
    ├── textarea markdown input
    ├── format selector: heading markdown | plaintext list
    ├── renderer panel
    └── parse status/errors

lib/mindmap-elixir/markdown-to-mind-elixir.ts
├── markdown headings/list parser using mdast-util-from-markdown
├── plaintext converter wrapper using mind-elixir/plaintextConverter
└── fallback sample input
```

Data flow:

```text
Markdown input
-> normalize/parse
-> MindElixirData
-> mind.init(data) once
-> mind.refresh(data) on input changes
```

Use Mind Elixir APIs:
- `import MindElixir from "mind-elixir"`
- `import "mind-elixir/style.css"`
- `import { plaintextToMindElixir } from "mind-elixir/plaintextConverter"`
- `new MindElixir({ el, direction: MindElixir.RIGHT, toolBar: true, keypress: true, markdown })`
- `mind.init(data)` initially, `mind.refresh(data)` for updates.

## Markdown Strategy

Support two formats:

1. Heading Markdown:

```md
# Product Plan
## Discovery
### Users
### Competitors
## Delivery
### Frontend
### Backend
```

2. Mind Elixir plaintext / markdown-list format:

```md
- Product Plan
  - Discovery
    - Users
    - Competitors
  - Delivery
    - Frontend
    - Backend
```

Plaintext format is better for streaming and AI output because it stays parseable while content grows.

## Markdown Rendering Inside Nodes
Mind Elixir only renders markdown when the `markdown` option is provided.

Recommendation:
- First iteration: limited safe parser for bold, italic, inline code, line breaks.
- Later: add `marked` plus sanitizer if full markdown inside node labels is required.

Reason: `markdown` returns HTML, so full markdown parsing without sanitization creates XSS risk for pasted user content.

## Streaming Considerations
For AI streaming:
- Accumulate text chunks in a ref.
- Parse at 300-500ms throttle.
- Prefer plaintext list format.
- Ignore parse errors for partial chunks.
- Final parse after stream ends.

Do not stream heading markdown first. It is less stable during partial generation and more ambiguous for nested bullets.

## Implementation Risks
- Mind Elixir data shape is `{ nodeData: { topic, id, children } }`; current repo type is `{ data: { text }, children }`.
- Existing context cannot be reused directly.
- `mind-elixir/style.css` must be imported in a client boundary or global CSS-compatible place.
- `markdown` option injects HTML; sanitize or limit parser.
- `mind.refresh(data)` can reset viewport often; throttle updates and avoid parsing every keystroke.
- Existing files contain mojibake characters in UI labels; avoid copying those strings into new UI.

## Success Metrics
- Page loads without SSR errors.
- Pasted heading markdown renders a mind map.
- Pasted plaintext list renders a mind map.
- Invalid input shows parse status without crashing.
- Edits update within 300-500ms and remain responsive.
- Existing `/mindmap` page and tests still pass unchanged.

## Next Steps
1. Create implementation plan for Option B.
2. Add focused converter tests for heading markdown and plaintext list markdown.
3. Implement client-only Mind Elixir renderer.
4. Add route and verify in browser at desktop and mobile widths.
5. Decide later whether to merge Mind Elixir into current `/mindmap` editor or keep it as separate page.
