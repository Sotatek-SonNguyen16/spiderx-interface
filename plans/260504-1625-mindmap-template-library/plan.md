# Mindmap Template Library - Implementation Plan

## Overview
Add 17 diverse templates (Work/Education/Creative), 9 structure types, role-based views, and AI content suggestion panel.

## Current State
- 8 templates, 8 structure types
- Simple toolbar with basic operations

## Implementation Phases

### Phase 1: Template Expansion
- Create `lib/mindmap/templates/work-templates.ts` (6 templates)
- Create `lib/mindmap/templates/education-templates.ts` (5 templates)
- Create `lib/mindmap/templates/creative-templates.ts` (6 templates)
- Update `lib/mindmap/templates.ts` to export all templates with categories

### Phase 2: Structure Types
- Update `lib/mindmap/types.ts` with new StructureType variants
- Update `lib/mindmap/templates.ts` to reference new structure types

### Phase 3: Role Switcher
- Create `components/mindmap/role-switcher.tsx`
- Integrate into toolbar

### Phase 4: AI Suggestion Panel
- Create `components/mindmap/ai-suggestion-panel.tsx`
- Connect to existing AI API

### Phase 5: Template Selector Gallery
- Create `components/mindmap/template-selector.tsx`
- Grid view with category tabs

## Files

### Create
- `lib/mindmap/templates/work-templates.ts`
- `lib/mindmap/templates/education-templates.ts`
- `lib/mindmap/templates/creative-templates.ts`
- `components/mindmap/role-switcher.tsx`
- `components/mindmap/ai-suggestion-panel.tsx`
- `components/mindmap/template-selector.tsx`

### Modify
- `lib/mindmap/templates.ts` - Import from sub-modules
- `lib/mindmap/types.ts` - Add StructureType
- `components/mindmap/mind-map-editor.tsx` - Integrate all components
- `components/mindmap/toolbar.tsx` - Add role switcher

## Effort
- Templates: 2h
- Structures: 1h
- Role Switcher: 1h
- AI Panel: 1h
- Template Selector: 2h
- **Total: ~7h**
