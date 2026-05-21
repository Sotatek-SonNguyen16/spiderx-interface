---
inclusion: manual
---
# Skill: Mind Elixir Plaintext Format

Reference for the plaintext format used by `mind-elixir`. Ideal for AI generation, streaming, file storage, and version control.

## Format Basics

Indentation-based syntax (2 spaces per level). Each line = one node.

```text
- Root Node
  - Child Node 1
    - Child Node 1-1
    - Child Node 1-2
  - Child Node 2
```

## Feature Syntax

| Feature | Syntax | Example |
|---|---|---|
| Node | `- Topic` | `- My Node` |
| Node with ID | `- Topic [^id]` | `- Node A [^id1]` |
| Node with Style | `- Topic {"prop": "value"}` | `- Node {"color": "#ff0000"}` |
| Bidirectional Link | `> [^id1] <-Label-> [^id2]` | `> [^a] <-connects-> [^b]` |
| Forward Link | `> [^id1] >-Label-> [^id2]` | `> [^a] >-leads to-> [^b]` |
| Summary (all prev) | `} Summary text` | `} Overview` |
| Summary (N nodes) | `}:N Summary text` | `}:2 Last two` |

> Coordinates `(x,y)` on links are optional when writing/generating — Mind Elixir auto-calculates them. They appear on export to preserve manual adjustments.

## Complete Example

```text
- Project Planning
  - Phase 1: Research [^phase1]
    - Market Analysis {"color": "#3298db"}
    - Competitor Study {"color": "#3298db"}
    - }:2 Research Summary
  - Phase 2: Development [^phase2]
    - Frontend {"color": "#2ecc71"}
    - Backend {"color": "#2ecc71"}
    - Testing {"color": "#f39c12"}
    - } Development Summary
  - Phase 3: Launch [^phase3]
    - Marketing
    - Deployment
  - > [^phase1] >-Leads to-> [^phase2]
  - > [^phase2] >-Leads to-> [^phase3]
```

## Conversion API

```typescript
import { plaintextToMindElixir, mindElixirToPlaintext } from 'mind-elixir/plaintextConverter'

// Parse plaintext → MindElixirData
const data = plaintextToMindElixir(plaintext)
mind.init(data)   // or mind.refresh(data)

// Export MindElixirData → plaintext
const text = mindElixirToPlaintext(mind.getAllData())
```

## Safe Parsing (always wrap in try-catch)

```typescript
function safeParse(plaintext: string): MindElixirData | null {
  try {
    return plaintextToMindElixir(plaintext)
  } catch {
    return { nodeData: { id: 'root', topic: 'Parse Error', children: [] } }
  }
}
```

## AI Prompt Template

When asking an LLM to generate a mind map, use this format instruction:

```
Generate a mind map in plaintext format. Rules:
- Root node: `- Root Topic`
- Children indented 2 spaces, each starting with `- `
- Use `{"color": "#hex"}` for styling
- Use `[^id]` for nodes that need cross-references
- Use `> [^id1] >-Label-> [^id2]` for directional links
```

## Best Practices

- Always use exactly 2 spaces per indent level
- Unique IDs within the document when using `[^id]`
- Wrap all parsing in try-catch (especially for streaming/partial data)
- For streaming: parse incrementally, ignore errors from incomplete chunks
