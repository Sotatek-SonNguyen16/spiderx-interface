---
status: completed
created: 2026-05-20
---

# Mindmap Elixir Template System

## Goal
Expand `/mindmap-elixir` with more reusable mind map templates across three independent layers:
- Skeleton: content structure.
- Theme: map-level colors and spacing.
- Style: object-level node and branch treatment.

## Approach
Keep the layers composable instead of creating combined variants like `roadmap-dark-handdrawn`.

## Tasks
- [x] Add plan.
- [x] Add skeleton, theme, and style preset model.
- [x] Add pure `applyMindmapStylePreset` transform.
- [x] Add UI controls for skeleton/theme/style.
- [x] Add focused tests for style application.
- [x] Verify route and focused tests.

## Validation
- Focused Jest tests for converter and preset transform.
- `GET /mindmap-elixir` returns 200 in dev server.
- Existing `/mindmap` route remains untouched.
