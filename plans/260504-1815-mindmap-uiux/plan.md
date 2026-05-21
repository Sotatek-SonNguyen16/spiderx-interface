# Mind Map UI/UX Overhaul - Implementation Plan

## Context
Improve mindmap editor UI/UX with better toolbar layout, smart floating panels, keyboard shortcuts, mobile responsiveness, and full accessibility.

## Current State
- Single crowded toolbar (~15 buttons centered at top)
- Static floating panels (zoom, export) in corners
- No keyboard shortcuts
- Not mobile responsive
- Basic accessibility only

## User Stories
1. **Power user** - keyboard shortcuts for faster editing
2. **Mobile user** - clean full-screen canvas with hamburger menu
3. **Accessibility needs** - skip links, reduced motion, configurable font size
4. **Cluttered-screen user** - auto-hiding panels

## Design Summary

### Toolbar Groups (from spec)
| Group | Buttons | Collapsible |
|-------|---------|-------------|
| Mode | Edit Toggle | No |
| History | Undo, Redo, Painter | Yes |
| Node Ops | Insert Sibling, Insert Child, Delete | Yes |
| Advanced | Summary, Outer Frame, AI | Yes |
| Content | Template, Structure | No |
| View | Fit | No |

### Floating Panels (from spec)
| Panel | Default | Auto-hide | Show Trigger |
|-------|---------|-----------|-------------|
| Zoom | Bottom-right | After 5s idle | Click, scroll, zoom keys |
| Export | Bottom-left | Always visible | - |
| AI Suggestion | Bottom-right (above zoom) | After action | Select node + AI button |
| Context Menu | At cursor | On click outside | Right-click |

## Files to Create

### New Files
```
components/mindmap/
├── toolbar/
│   ├── toolbar-container.tsx    # Responsive container with groups
│   ├── toolbar-button.tsx        # Consistent button component
│   └── toolbar-more-menu.tsx     # Overflow menu
├── floating-panel.tsx             # Base panel with minimize
├── mobile/
│   ├── mobile-bottom-bar.tsx      # Bottom action bar
│   └── hamburger-menu.tsx         # Slide-out drawer
├── accessibility/
│   ├── skip-link.tsx              # Skip to canvas
│   └── font-size-control.tsx      # Font size settings
└── keyboard/
    └── use-keyboard-shortcuts.ts  # Keyboard hook
```

### Files to Modify
- `components/mindmap/mind-map-editor.tsx` - Integrate new components
- `components/mindmap/zoom-controls.tsx` - Add minimize, auto-hide
- `components/mindmap/export-import-dialogs.tsx` - Add minimize
- `components/mindmap/ai-suggestion-panel.tsx` - Add minimize, auto-hide

## Implementation Phases

### Phase 1: Keyboard Shortcuts Hook
- [ ] Create `use-keyboard-shortcuts.ts`
- [ ] Implement essential shortcuts: Ctrl+Z, Ctrl+Y, Enter, Tab, Delete, Ctrl+S, Ctrl++/-, Ctrl+0
- [ ] Add tooltip hints on hover

### Phase 2: Floating Panel Base
- [ ] Create `floating-panel.tsx` with minimize/expand
- [ ] Auto-hide after idle timeout
- [ ] Show trigger on interaction

### Phase 3: Toolbar Container with Groups
- [ ] Create `toolbar/toolbar-container.tsx`
- [ ] Create `toolbar/toolbar-button.tsx`
- [ ] Create `toolbar/toolbar-more-menu.tsx`
- [ ] Implement collapsible groups
- [ ] Responsive behavior (collapse to "More" menu)

### Phase 4: Mobile Bottom Bar + Hamburger Menu
- [ ] Create `mobile/mobile-bottom-bar.tsx`
- [ ] Create `mobile/hamburger-menu.tsx`
- [ ] Breakpoint detection (< 768px)
- [ ] Slide-out drawer with all actions

### Phase 5: Accessibility Components
- [ ] Create `accessibility/skip-link.tsx`
- [ ] Create `accessibility/font-size-control.tsx`
- [ ] Reduced motion support
- [ ] Focus visible outlines

### Phase 6: Integration
- [ ] Wire keyboard shortcuts hook into mind-map-editor
- [ ] Replace current toolbar with new toolbar container
- [ ] Add floating panels with auto-hide
- [ ] Add mobile bottom bar and hamburger menu
- [ ] Add accessibility components

### Phase 7: Update Existing Panels
- [ ] Update zoom-controls.tsx with minimize/auto-hide
- [ ] Update export-import-dialogs.tsx with minimize
- [ ] Update ai-suggestion-panel.tsx with minimize/auto-hide

## Success Metrics
- [ ] Toolbar collapses groups on narrow screens
- [ ] All keyboard shortcuts work
- [ ] Panels auto-hide after idle
- [ ] Mobile shows hamburger + bottom bar
- [ ] Skip link works
- [ ] Reduced motion respects system preference
- [ ] Font size adjustable
- [ ] Focus states visible on all interactive elements

## Priority
HIGH - Core UX improvement for power users and mobile users