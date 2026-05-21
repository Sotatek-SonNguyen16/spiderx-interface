# Feature Spec: MindMap UX Overhaul

## Overview
Full UX overhaul of mindmap demo: zoom/nav controls, node editing, mini-map, motion polish, and data visualization.

## User Stories
- As a user, I want zoom controls so I can navigate large mind maps
- As a user, I want mini-map overview so I know where I am in the map
- As a user, I want node editing so I can modify the mind map
- As a user, I want smooth animations so the experience feels polished
- As a user, I want visual cues so I understand node importance at a glance

## Architecture

```
MindMapProvider (context)
  ↓
MindMapService (vendor wrapper)
  ↓
MindMapEditor (wrapper component)
  ├── Toolbar (zoom, fit, add/remove node, edit mode toggle)
  ├── MiniMap (corner thumbnail with viewport indicator)
  └── MindMapCanvas (mount point + visual overlay)
```

### Components

| Component | File | Purpose |
|-----------|------|---------|
| `MindMapEditor` | `components/mindmap/mind-map-editor.tsx` | Main wrapper |
| `Toolbar` | `components/mindmap/toolbar.tsx` | Control bar with buttons |
| `MiniMap` | `components/mindmap/mini-map.tsx` | Overview thumbnail |
| `ZoomControls` | `components/mindmap/zoom-controls.tsx` | Zoom in/out/reset |
| `NodeEditingState` | `lib/mindmap/node-editing.ts` | Editing state management |

### Files to Create
- `components/mindmap/mind-map-editor.tsx`
- `components/mindmap/toolbar.tsx`
- `components/mindmap/mini-map.tsx`
- `components/mindmap/zoom-controls.tsx`
- `lib/mindmap/node-editing.ts`

### Files to Modify
- `components/mindmap/MindMapDemoClient.tsx` → use MindMapEditor
- `app/(default)/mindmap/page.tsx` → update if needed

## UI Layout

```
┌─────────────────────────────────────────────────┐
│  Mind Map Demo        [Edit Mode] [Fit] [+ Node] │
├─────────────────────────────────────────────────┤
│                                              ┌─┐│
│                                              │M││
│            Mind Map Canvas                   │i││
│                                              │n││
│                                              │i││
│                                              └─┘│
├─────────────────────────────────────────────────┤
│  [Zoom -] [100%] [Zoom +]  [Reset] [Export]    │
└─────────────────────────────────────────────────┘
```

## Features

### 1. Zoom/Nav Controls
- Zoom in/out buttons with percentage display
- Fit-to-view button
- Reset view button
- Keyboard shortcuts: `+`/`-` zoom, `0` reset, `F` fit

### 2. Node Editing UI
- Edit mode toggle (locks/unlocks editing)
- Add child node button
- Delete node button (when node selected)
- Inline text editing (double-click node)

### 3. Mini-map Overview
- Corner thumbnail (150x100px) showing full map
- Viewport rectangle indicating current view area
- Click mini-map to jump to location
- Toggle mini-map visibility

### 4. Motion & Polish
- Node expand/collapse: 200ms ease-out transition
- Zoom: smooth CSS transform with spring easing
- Mini-map viewport: animated rectangle
- Button hover: scale(1.05) + shadow lift
- Node hover: subtle glow + scale(1.02)
- Loading skeleton while library initializes

### 5. Data Visualization
- Root node: larger, distinct color
- Depth gradient: root → leaves color transition
- Icon badges: node type indicators (task, idea, note)
- Connection lines: thickness by hierarchy level

## Data Flow

```
User Action → Toolbar/MiniMap → MindMapContext → MindMapService → simple-mind-map
                ↑                              ↓
                ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
                        React state update
```

## Edge Cases
- Empty mind map: show placeholder message
- Single node: disable delete, show root only
- Deep nesting (>10 levels): collapse by default, show expand button
- Failed library load: error state with retry button

## Testing Strategy
- Unit: MindMapService methods, node-editing state
- Integration: MindMapProvider + MindMapEditor interaction
- Visual: motion/animation snapshots (if available)

## Implementation Phases

| Phase | Description | Complexity |
|-------|-------------|------------|
| 1 | Zoom controls + toolbar UI | Low |
| 2 | Mini-map overview | Medium |
| 3 | Node editing state | Medium |
| 4 | Motion polish | Low |
| 5 | Data visualization | Low |

## Success Criteria
- All 5 features implemented
- Smooth 60fps animations
- Mini-map accurately reflects viewport
- Node editing works without errors
- Tests pass
