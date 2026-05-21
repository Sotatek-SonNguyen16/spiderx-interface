---
inclusion: manual
---
# Skill: Integrate Mind Elixir

Reference guide for integrating `mind-elixir` into this Next.js/React project.

## Installation

Already installed in this project: `mind-elixir: ^5.11.0` (see `package.json`).

## Basic Initialization (React)

```tsx
import MindElixir, { type MindElixirInstance } from 'mind-elixir'
import { useEffect, useRef } from 'react'
import 'mind-elixir/style.css'

export function MindMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const meRef = useRef<MindElixirInstance | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    meRef.current = new MindElixir({
      el: containerRef.current,
      direction: MindElixir.RIGHT,
      toolBar: true,
      keypress: true,
      contextMenu: true,
    })

    const data = MindElixir.new('Root Topic')
    meRef.current.init(data)

    return () => {
      // cleanup if needed
    }
  }, [])

  return <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
}
```

## Options Reference

```typescript
{
  el: '#map',                    // HTMLElement or selector
  direction: MindElixir.RIGHT,   // LEFT | RIGHT | SIDE
  toolBar: true,
  keypress: true,
  overflowHidden: false,
  mouseSelectionButton: 0,       // 0 = left, 2 = right
  contextMenu: {
    locale: en,                  // import { en } from 'mind-elixir/i18n'
    focus: true,
    link: true,
    extend: [{ name: 'Custom', onclick: () => {} }],
  },
  before: {
    async addChild(el, obj) { return true },   // return false to block
    insertSibling(type, obj) { return true },
  },
  markdown: (text) => customParser(text),      // optional markdown renderer
}
```

## Data Structure

```typescript
const nodeData = {
  topic: 'node topic',
  id: 'bd1c24420cd2c2f5',
  style: { fontSize: '32', color: '#3298db', background: '#ecf0f1' },
  expanded: true,
  tags: ['Tag'],
  icons: ['😀'],
  hyperLink: 'https://example.com',
  image: { url: '...', height: 90, width: 90 },
  children: [{ topic: 'child', id: 'xxxx' }],
}
```

## Core API

```typescript
mind.init(data)           // Initialize with data
mind.refresh(data)        // Re-render with new data
mind.getData()            // Get current data object
mind.getDataString()      // Get serialized data string
mind.getAllData()          // Get full data including arrows/summaries
mind.changeTheme(theme)   // Change theme dynamically
mind.findEle(id)          // Find DOM element by node ID
mind.scrollIntoView(el)   // Scroll node into view
```

## Event Handling

```typescript
mind.bus.addListener('operation', operation => {
  // operation: { name: 'action_name', obj: target_object }
})
mind.bus.addListener('selectNodes', nodes => { ... })
mind.bus.addListener('expandNode', node => { ... })
```

## Theme Customization

```typescript
mind.changeTheme({
  name: 'Dark',
  palette: ['#848FA0', '#748BE9', '#D2F9FE', ...],
  cssVar: {
    '--main-color': '#ffffff',
    '--main-bgcolor': '#4c4f69',
    '--color': '#cccccc',
    '--bgcolor': '#252526',
    '--panel-color': '255, 255, 255',
    '--panel-bgcolor': '45, 55, 72',
  },
})
```

## Existing Implementation in This Project

- `lib/mindmap-elixir/` — utilities and converters
- `components/mindmap-elixir/markdown-mindmap-page.tsx` — main page component
- `app/(default)/mindmap-elixir/page.tsx` — route page
