# Plan: MindMap React Context Service

## Overview
Extract vendor-wrapped `simple-mind-map` into a React Context service layer for clean component consumption.

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | pending | Create `MindMapService` class wrapping vendor library |
| 2 | pending | Create `MindMapContext` + `MindMapProvider` |
| 3 | pending | Create `useMindMap` hook |
| 4 | pending | Refactor `MindMapDemoClient` to use context |
| 5 | pending | Refactor `mindmap/page.tsx` to mount provider |
| 6 | pending | Update tests and verify |

## Key Design Decisions

- **Service pattern:** Class-based, lazy-init via factory function
- **Context:** Single provider wraps entire mindmap feature
- **Hook:** Returns service instance, throws if used outside provider
- **Vendor:** Stays in `vendor/simple-mind-map/`, imported via service
- **Types:** Shared `MindMapNodeData` exported from `lib/mindmap/types.ts`

## Files to Create

- `lib/mindmap/types.ts` - shared type definitions
- `lib/mindmap/service.ts` - MindMapService class
- `lib/mindmap/context.tsx` - React context + provider
- `lib/mindmap/use-mind-map.ts` - hook

## Files to Modify

- `lib/mindmap/load-simple-mind-map.ts` - absorbed into service
- `components/mindmap/MindMapDemoClient.tsx` - use context
- `app/(default)/mindmap/page.tsx` - mount provider

## Success Criteria
- `MindMapDemoClient` consumes service via `useMindMap()` hook
- No direct vendor imports outside `lib/mindmap/service.ts`
- All existing tests pass
- Vendor library still loads dynamically as before

## Reports
- [research/mindmap-research.md](./research/mindmap-research.md)
