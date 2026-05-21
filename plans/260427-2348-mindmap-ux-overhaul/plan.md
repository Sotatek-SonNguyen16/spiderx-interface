# Plan: MindMap UX Overhaul

## Overview
Full UX overhaul: zoom/nav controls, node editing, mini-map, motion polish, data visualization.

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | pending | Zoom controls + toolbar UI |
| 2 | pending | Mini-map overview |
| 3 | pending | Node editing state |
| 4 | pending | Motion polish |
| 5 | pending | Data visualization |

## Files to Create

- `components/mindmap/mind-map-editor.tsx` — editor wrapper
- `components/mindmap/toolbar.tsx` — control bar
- `components/mindmap/mini-map.tsx` — overview thumbnail
- `components/mindmap/zoom-controls.tsx` — zoom in/out/reset
- `lib/mindmap/node-editing.ts` — editing state management

## Files to Modify

- `components/mindmap/MindMapDemoClient.tsx` — use MindMapEditor

## Success Criteria
- Zoom/nav controls work smoothly
- Mini-map shows viewport position
- Node editing (add/delete/edit text) functional
- Animations at 60fps
- Tests pass

## Reports
- [brainstorm report](../../plans/reports/brainstorm-260424-1606-mindmap-ux-overhaul.md)
