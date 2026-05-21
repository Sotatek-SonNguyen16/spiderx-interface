# Mindmap UI/UX Overhaul - Design Spec

## Context
Improve mindmap editor UI/UX with better toolbar layout, smart floating panels, keyboard shortcuts, mobile responsiveness, and full accessibility.

## Current State
- Single crowded toolbar (~15 buttons centered at top)
- Static floating panels (zoom, export) in corners
- No keyboard shortcuts
- Not mobile responsive
- Basic accessibility only

## User Stories

1. **As a power user**, I want keyboard shortcuts so I can edit mindmaps faster
2. **As a mobile user**, I want a clean full-screen canvas with essential actions in a hamburger menu
3. **As a user with accessibility needs**, I want skip links, reduced motion, and configurable font size
4. **As a cluttered-screen user**, I want auto-hiding panels that appear when needed

## Design

### 1. Toolbar Layout - Compact Groups

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] │ Edit │ ↶↷🖌️ │ ↕↘🗑️ │ 📋⬜🤖 │ 📑Template │ 🗺️Structure │ ⊞Fit │
└─────────────────────────────────────────────────────────────┘
```

**Groups:**
| Group | Buttons | Collapsible |
|-------|---------|-------------|
| Mode | Edit Toggle | No |
| History | Undo, Redo, Painter | Yes |
| Node Ops | Insert Sibling, Insert Child, Delete | Yes |
| Advanced | Summary, Outer Frame, AI | Yes |
| Content | Template, Structure | No |
| View | Fit | No |

**"More" Menu:** When toolbar overflows, third group collapses into "⋯" menu.

### 2. Floating Panels - Smart Position

**Panel Behavior:**
| Panel | Default | Auto-hide | Show Trigger |
|-------|---------|-----------|-------------|
| Zoom | Bottom-right | After 5s idle | Click, scroll, zoom keys |
| Export | Bottom-left | Always visible | - |
| AI Suggestion | Bottom-right (above zoom) | After action | Select node + AI button |
| Context Menu | At cursor | On click outside | Right-click |

**Minimizable:** Each panel has − button to minimize to icon. Click icon to expand.

### 3. Keyboard Shortcuts

**Essential Set:**
| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| Enter | Insert Sibling Node |
| Tab | Insert Child Node |
| Delete / Backspace | Delete Node |
| Ctrl+S | Save (export JSON) |
| Ctrl++ / Ctrl+- | Zoom In/Out |
| Ctrl+0 | Reset Zoom |

**Hints:** Shortcut hints shown in tooltip on hover.

### 4. Mobile Responsive

**Breakpoints:**
| Device | Width | Layout |
|--------|-------|--------|
| Mobile | <768px | Hamburger menu + bottom sheet |
| Tablet | 768-1024px | Compact horizontal toolbar |
| Desktop | >1024px | Full toolbar |

**Mobile UI:**
```
┌────────────────────┐
│                    │
│    Full Canvas     │
│                    │
│                    │
├────────────────────┤
│ [☰]  [⊞] [🤖] [📤] │
└────────────────────┘
     ↑ Bottom bar (swipe up for more)
```

**Hamburger Menu:** Slide-out drawer with all actions organized in sections.

### 5. Accessibility - Full

**Features:**
- Skip link to main canvas
- Focus visible outlines (3px solid #0066cc)
- ARIA labels on all buttons
- Screen reader announcements for actions
- Reduced motion mode (respects prefers-reduced-motion)
- Configurable font size (12px, 14px, 16px, 18px)
- High contrast mode toggle
- Keyboard navigation: Tab through all controls, Escape to close menus

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## Architecture

```
components/mindmap/
├── mind-map-editor.tsx      # Main editor - orchestrates all
├── toolbar/
│   ├── toolbar-container.tsx    # Responsive container
│   ├── toolbar-group.tsx       # Collapsible button group
│   ├── toolbar-more-menu.tsx   # Overflow menu
│   └── toolbar-button.tsx      # Consistent button component
├── panels/
│   ├── floating-panel.tsx      # Base panel with minimize
│   ├── zoom-panel.tsx          # Zoom controls
│   ├── export-panel.tsx        # Export button
│   └── ai-suggestion-panel.tsx # AI floating panel
├── mobile/
│   ├── mobile-bottom-bar.tsx   # Bottom action bar
│   └── hamburger-menu.tsx      # Slide-out drawer
├── accessibility/
│   ├── skip-link.tsx            # Skip to canvas
│   ├── reduced-motion.tsx       # Motion preferences
│   └── font-size-control.tsx    # Font size settings
└── keyboard/
    └── use-keyboard-shortcuts.ts # Keyboard hook
```

## Files to Create

### New
- `components/mindmap/toolbar/toolbar-container.tsx`
- `components/mindmap/toolbar/toolbar-group.tsx`
- `components/mindmap/toolbar/toolbar-more-menu.tsx`
- `components/mindmap/panels/floating-panel.tsx`
- `components/mindmap/mobile/mobile-bottom-bar.tsx`
- `components/mindmap/mobile/hamburger-menu.tsx`
- `components/mindmap/accessibility/skip-link.tsx`
- `components/mindmap/accessibility/font-size-control.tsx`
- `components/mindmap/keyboard/use-keyboard-shortcuts.ts`

### Modify
- `components/mindmap/mind-map-editor.tsx` - Integrate new components
- `components/mindmap/zoom-controls.tsx` - Add minimize
- `components/mindmap/export-import-dialogs.tsx` - Add minimize
- `components/mindmap/ai-suggestion-panel.tsx` - Add minimize

## Implementation Order

1. Keyboard shortcuts hook
2. Toolbar container with groups
3. Floating panel base component
4. Mobile bottom bar + hamburger menu
5. Accessibility components (skip link, font size)
6. Integrate all into mind-map-editor
7. Test on all breakpoints

## Success Metrics

- [ ] Toolbar collapses groups on narrow screens
- [ ] All keyboard shortcuts work
- [ ] Panels auto-hide after idle
- [ ] Mobile shows hamburger + bottom bar
- [ ] Skip link works
- [ ] Reduced motion respects system preference
- [ ] Font size adjustable
- [ ] Focus states visible on all interactive elements
