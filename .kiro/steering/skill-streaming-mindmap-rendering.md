---
inclusion: manual
---
# Skill: Streaming Mindmap Rendering

Guide for implementing real-time streaming mindmap rendering with `mind-elixir` in React.

## Core Pattern

Stream text → accumulate → throttle → parse plaintext → `mind.refresh(data)`

## MindmapRenderer Component

```tsx
import MindElixir, { type MindElixirData, type MindElixirInstance } from 'mind-elixir'
import { useEffect, useRef } from 'react'

export function MindmapRenderer({ data }: { data: MindElixirData | null }) {
  const elRef = useRef<HTMLDivElement>(null)
  const meRef = useRef<MindElixirInstance | null>(null)

  // Mount once
  useEffect(() => {
    if (!elRef.current) return
    meRef.current = new MindElixir({
      el: elRef.current,
      direction: MindElixir.RIGHT,
    })
    meRef.current.init(data || { nodeData: { topic: 'Loading...', id: 'root' } })
  }, [])

  // Update on data change
  useEffect(() => {
    if (meRef.current && data) {
      meRef.current.refresh(data)
    }
  }, [data])

  return <div ref={elRef} style={{ height: '500px', width: '100%' }} />
}
```

## Streaming Logic (Parent Component)

```typescript
import { useState, useRef } from 'react'
import { plaintextToMindElixir } from 'mind-elixir/plaintextConverter'
import type { MindElixirData } from 'mind-elixir'

function cleanStreamContent(content: string): string {
  return content
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/```$/gm, '')
    .trim()
}

export function useStreamingMindmap() {
  const [mindmapData, setMindmapData] = useState<MindElixirData | null>(null)
  const accumulatedText = useRef('')
  const lastRenderTime = useRef(0)

  function updateMindmap() {
    try {
      const clean = cleanStreamContent(accumulatedText.current)
      const data = plaintextToMindElixir(clean)
      setMindmapData(data)
    } catch {
      // Ignore parse errors from incomplete chunks — expected during streaming
    }
  }

  async function startStreaming(url: string) {
    const response = await fetch(url)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      accumulatedText.current += decoder.decode(value)

      // Throttle: re-render at most every 500ms
      const now = Date.now()
      if (now - lastRenderTime.current > 500) {
        updateMindmap()
        lastRenderTime.current = now
      }
    }

    // Final render after stream ends
    updateMindmap()
  }

  return { mindmapData, startStreaming }
}
```

## Usage

```tsx
export default function MindmapPage() {
  const { mindmapData, startStreaming } = useStreamingMindmap()

  return (
    <>
      <button onClick={() => startStreaming('/api/v1/ai/mindmap')}>
        Generate
      </button>
      <MindmapRenderer data={mindmapData} />
    </>
  )
}
```

## Optimization Rules

1. **Throttle at 200–500ms** — never re-render on every byte
2. **Ignore parse errors** — partial chunks produce invalid plaintext; this is expected
3. **Stable root ID** — prevents full graph flash on each update
4. **Scroll to last node** — follow generation in real-time:

```typescript
// Inside MindmapRenderer update effect, after refresh:
function findLastNode(node: NodeObj): NodeObj {
  if (!node.children?.length) return node
  return findLastNode(node.children[node.children.length - 1])
}

const last = findLastNode(data.nodeData)
const el = meRef.current.findEle(last.id)
if (el) meRef.current.scrollIntoView(el)
```

## Existing Implementation in This Project

- `lib/mindmap-elixir/markdown-to-mind-elixir.ts` — markdown/plaintext converter
- `components/mindmap-elixir/markdown-mindmap-page.tsx` — streaming page component
- `app/(default)/mindmap-elixir/page.tsx` — route

Always check these files before implementing new streaming logic to avoid duplication.
