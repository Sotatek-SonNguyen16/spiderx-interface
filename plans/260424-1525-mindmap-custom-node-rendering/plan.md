# Plan: MindMap Custom Node Rendering

## Overview
Extend mindmap domain with custom node rendering — simple styling, rich content, and React portal bridge.

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | pending | Library Theming API — colors, shapes, fonts |
| 2 | pending | Rich Node Content — icons, images, badges |
| 3 | future | React Portal Bridge — full React components |

## Files to Create
- `lib/mindmap/use-mind-map-theme.ts` — theme hook
- `lib/mindmap/theme-presets.ts` — pre-built themes

## Files to Modify
- `lib/mindmap/types.ts` — add theme types, rich node fields
- `lib/mindmap/service.ts` — support theme options
- `lib/mindmap/context.tsx` — expose theme API
- `lib/mindmap/sample-data.ts` — add rich demo data
- `components/mindmap/MindMapDemoClient.tsx` — theme switcher UI

## Success Criteria
- Theme switcher changes node colors live
- Icons/images render in node content slots
- React components render inside mindmap nodes via portal
- All tests pass

## Reports
- [research/mindmap-research.md](./research/mindmap-research.md)
