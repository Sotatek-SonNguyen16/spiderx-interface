# Mind Map Feature

## Overview

Interactive mind map editor built with React/Next.js and simple-mind-map library.

## Architecture

```
app/(default)/mindmap/page.tsx
└── MindMapProvider (lib/mindmap/context.tsx)
    └── MindMapEditor (components/mindmap/mind-map-editor.tsx)
        ├── Toolbar (edit mode, template/theme selectors)
        ├── Sidebar Panels (Style, Theme, Structure)
        ├── Dialogs (Image, Hyperlink, Note, Tags, Export, Import)
        ├── Context Menu (right-click)
        ├── ZoomControls, MiniMap, TemplateSelector
        └── MindMapService (lib/mindmap/service.ts)
            └── simple-mind-map (npm package)
```

## Components

### UI Components (`components/mindmap/`)

| Component | Purpose |
|-----------|---------|
| `mind-map-editor.tsx` | Main editor orchestrating all sub-components |
| `toolbar.tsx` | Top toolbar with edit mode toggle, template/theme selectors |
| `toolbar-node-btn-list.tsx` | Reusable button list for node operations |
| `panel-components.tsx` | Sidebar panels: StylePanel, ThemePanel, StructurePanel |
| `node-dialogs.tsx` | Dialogs: NodeImage, NodeHyperlink, NodeNote, NodeTag |
| `export-import-dialogs.tsx` | ExportDialog, ImportDialog |
| `context-menu.tsx` | Right-click context menu |
| `zoom-controls.tsx` | Zoom in/out/reset controls |
| `mini-map.tsx` | Navigation minimap |
| `template-selector.tsx` | Template selection buttons |

### Service Layer (`lib/mindmap/`)

| File | Purpose |
|------|---------|
| `service.ts` | MindMapService - wraps simple-mind-map library |
| `context.tsx` | React context with MindMapProvider |
| `use-mind-map.ts` | Hook exposing mind map API |
| `load-simple-mind-map.ts` | Dynamic import of simple-mind-map constructor |
| `types.ts` | TypeScript interfaces |
| `sample-data.ts` | Demo mind map data |
| `theme-presets.ts` | Theme configurations (default, classic, minimal, etc.) |
| `templates.ts` | Layout templates (logicalStructure, mindMap, etc.) |
| `markdown-converter.ts` | Markdown to mind map data converter |

## API

### MindMapProvider Props

```typescript
type MindMapProviderProps = {
  children: ReactNode;
  initialData: MindMapNodeData;
  options?: MindMapServiceOptions;
};
```

### useMindMap Hook

```typescript
const {
  status,           // "idle" | "loading" | "ready" | "error"
  statusText,       // Human-readable status
  error,            // Error message if status === "error"
  isReady,          // boolean
  currentTemplate,  // Current MindMapTemplate | null
  currentMarkdown,  // Current markdown string
  currentTheme,     // Current theme name
  setData,          // (data: MindMapNodeData) => void
  getData,          // () => MindMapNodeData | null
  fit,              // () => void - fit canvas to view
  reset,            // (data: MindMapNodeData) => void
  applyTemplate,    // (template: MindMapTemplate) => void
  parseMarkdown,    // (markdown: string) => void
  setTheme,         // (theme: string, themeConfig?) => void
} = useMindMap();
```

### Node Data Structure

```typescript
type MindMapNodeData = {
  data: {
    text: string;
    expand?: boolean;
  };
  children?: MindMapNodeData[];
};
```

## Design System

Apple design tokens applied:
- Primary: `#0066cc`
- Ink: `#1d1d1f`
- Canvas: `#ffffff`
- Parchment: `#f5f5f7`
- Pearl: `#fafafc`
- Hairline: `#e0e0e0`

See `DESIGN-apple.md` for full design specification.

## Dependencies

- `simple-mind-map` - Core mind map library

## Status

**Implemented:**
- [x] MindMapProvider with React context
- [x] MindMapService wrapping simple-mind-map
- [x] Toolbar with edit mode, template/theme selectors
- [x] Sidebar panels (Style, Theme, Structure)
- [x] Node dialogs (Image, Hyperlink, Note, Tags)
- [x] Export/Import dialogs
- [x] Context menu
- [x] Zoom controls
- [x] Apple design system styling

**TODO:**
- [ ] Connect toolbar buttons to actual mind map commands
- [ ] Implement actual node operations (add, delete, edit)
- [ ] Connect export/import to real functionality
- [ ] Add keyboard shortcuts
- [ ] Undo/redo support