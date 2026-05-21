# Brainstorm Report: MindMap Custom Node Rendering

## Context
- Domain: `lib/mindmap/`, `components/mindmap/`, `app/(default)/mindmap/`
- Current: React Context service wrapping npm `simple-mind-map`
- Ask: Extend with custom node rendering (styling, rich content, React components)

## Requirements
1. **Simple styling** — per-node colors, shapes, fonts via library theming API
2. **Rich node content** — icons, images, progress indicators, badges
3. **React component nodes** — render React components inside mindmap nodes

---

## Architecture Analysis

### Current State
```
simple-mind-map (npm)
  ↓ constructor
MindMapService.init(el, data)
  ↓
MindMapProvider mounts DOM element
  ↓ React context
useMindMap() hook → component
```

### Constraint
`simple-mind-map` is a vanilla JS library — it owns the DOM. React components can't be dropped inside directly.

---

## Approach 1: Library Theming API (Simplest)

**How:** simple-mind-map supports node-level theming via data attributes or config options.

**Pros:**
- No architectural changes
- Leverages library built-ins
- Fast to implement

**Cons:**
- Limited to library's theming surface area
- Not truly "React" — still vanilla DOM

### Approach 2: Content Injection via HTML Template

**How:** Use library's node content slots (icon, badge) with HTML/img injection.

**Pros:**
- Adds rich content without breaking library encapsulation
- Supports icons, images, progress bars

**Cons:**
- Still vanilla DOM rendering
- Complex for deeply custom content

### Approach 3: React Portal Bridge (Most Powerful)

**How:** Use `ReactDOM.createPortal` + library node DOM reference to attach React nodes.

**Pros:**
- Full React rendering power inside mindmap
- Reuses existing React component ecosystem
- Works with any React component

**Cons:**
- Complex — two DOM trees interacting
- Need to sync library node positions with React portal
- Performance risk if many nodes

---

## Recommendation

**Phase 1:** Use library theming API (Approach 1) for simple styling — lowest effort.

**Phase 2:** Content injection (Approach 2) for icons/images — medium effort.

**Phase 3:** React Portal Bridge (Approach 3) for full React component nodes — highest effort, do last.

### Next Steps
1. Inspect `simple-mind-map` exported API to understand theming surface
2. Add theme config to `MindMapServiceOptions`
3. Create `useMindMapTheme` hook for per-node styling
4. For React portals — create `MindMapNodePortal` component + coordinate positioning
