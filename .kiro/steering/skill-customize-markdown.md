---
inclusion: manual
---
# Skill: Customize Markdown in Mind Elixir

Guide for enabling and customizing markdown rendering inside Mind Elixir nodes.

## Default Behavior

Mind Elixir does **not** parse markdown by default. You must pass a `markdown` function in the options.

## Option 1: Simple Regex Parser (no extra deps)

Good for basic bold, italic, inline code only.

```typescript
const mind = new MindElixir({
  el: containerRef.current,
  // ... other options
  markdown: (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>'),
})
```

## Option 2: Full Markdown with `marked` (recommended)

```bash
npm i marked
```

```typescript
import { marked } from 'marked'
import MindElixir from 'mind-elixir'

const mind = new MindElixir({
  el: containerRef.current,
  markdown: (text) => marked(text) as string,
})
```

## Option 3: `markdown-it` (more configurable)

```bash
npm i markdown-it
```

```typescript
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

const mind = new MindElixir({
  el: containerRef.current,
  markdown: (text) => md.renderInline(text),  // renderInline for node content
})
```

## Notes for This Project

- This project already has `mdast-util-from-markdown` installed — can be used for AST-based parsing if needed
- KaTeX is also available (`katex`) for math rendering in nodes
- Check `lib/mindmap-elixir/` for any existing markdown handling before adding new logic
- The `markdown` option receives raw node topic text and must return an HTML string
