# Research: simple-mind-map Customization API

## Library Info
- **Version:** 0.14.0-fix.2
- **Repository:** https://github.com/wanglin2/mind-map
- **Types:** `./types/index.d.ts`

## Customization Hooks

| Option | Type | Purpose |
|--------|------|---------|
| `theme` | `string` | Theme name |
| `themeConfig` | `{}` | Theme-specific config |
| `isUseCustomNodeContent` | `boolean` | Enable custom node content |
| `customCreateNodeContent` | `any` | Factory function for custom node DOM |
| `customInnerElsAppendTo` | `any` | Append custom elements to node |
| `iconList` | `any[]` | Available node icons |
| `noteIcon` | `{icon, style}` | Note icon config |
| `hyperlinkIcon` | `{icon, style}` | Hyperlink icon config |
| `tagsColorMap` | `{}` | Tag-to-color mapping |

## Key Findings

1. **Theme system:** Library has built-in themes + `themeConfig` for customization
2. **Custom node content:** `isUseCustomNodeContent` + `customCreateNodeContent` allow DOM injection
3. **Icons/notes:** Pre-built support via `iconList`, `noteIcon`, `hyperlinkIcon`
4. **Node badges:** Tags via `tagsColorMap`

## Implementation Paths

### Phase 1: themeConfig
```typescript
new MindMap({
  theme: 'custom',
  themeConfig: {
    // per-node styling
  }
})
```

### Phase 2: customCreateNodeContent
```typescript
customCreateNodeContent: (node) => {
  // Return DOM element appended to node
}
```

### Phase 3: React Portal Bridge
```typescript
customCreateNodeContent: (node) => {
  const container = document.createElement('div');
  ReactDOM.createPortal(<MyComponent />, container);
  return container;
}
```
