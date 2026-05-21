# Mindmap Template Library - Feature Spec

## Context
Enhance mindmap with diverse templates and structures for multiple use cases and roles.

## Current State
- 8 structure types: logicalStructure, mindMap, catalogOrganization, organizationStructure, timeline, fishbone, verticalTimeline, logicalStructureLeft
- 8 templates: blank, brainstorm, project-plan, decision-tree, org-structure, cause-effect, timeline-project, study-notes

## Problem Statement
Users need pre-built templates for different domains (work, education, creative) with role-based views and AI content suggestion.

## User Stories

### Templates & Structures
1. **As a project manager**, I want templates for meeting notes, sprint planning, and OKRs so I can quickly start common planning sessions
2. **As a student**, I want templates for study notes, book summaries, and course outlines so I can organize learning materials
3. **As a product owner**, I want templates for feature specs, user stories, and SWOT analysis so I can do product brainstorming
4. **As a team lead**, I want role-based views (edit/view/present) so I can collaborate effectively

### AI Enhancement
5. **As a user**, I want AI to suggest content for selected nodes so I can quickly expand my mindmap

## Design

### Category 1: Template Library

#### Work Templates (6)
| ID | Name | Structure | Nodes |
|----|------|-----------|-------|
| meeting-notes | Meeting Notes | logicalStructure | Attendees, Agenda, Discussion, Action Items |
| sprint-planning | Sprint Planning | logicalStructure | Sprint Goal, Stories, Tasks, Capacity |
| okr | OKRs | logicalStructure | Objective, Key Results, Initiatives |
| retrospective | Retrospective | fishbone | What Went Well, What Didn't, Actions |
| weekly-planner | Weekly Planner | timeline | Mon-Fri columns with tasks |
| decision-log | Decision Log | logicalStructure | Decision, Pros, Cons, Outcome |

#### Education Templates (5)
| ID | Name | Structure | Nodes |
|----|------|-----------|-------|
| book-summary | Book Summary | catalogOrganization | Chapters, Main Ideas, Quotes, Reflections |
| course-outline | Course Outline | logicalStructure | Modules, Lessons, Exercises, Quizzes |
| research-paper | Research Paper | logicalStructure | Abstract, Intro, Methods, Results, Discussion |
| mcq-quiz | MCQ Quiz | logicalStructure | Questions, Options, Correct Answer |
| glossary | Glossary | catalogOrganization | Term, Definition, Examples |

#### Creative Templates (6)
| ID | Name | Structure | Nodes |
|----|------|-----------|-------|
| swot-analysis | SWOT Analysis | matrix | Strengths, Weaknesses, Opportunities, Threats |
| 6w2h | 6W2H Analysis | fishbone | Why, What, Who, When, Where, How, How Much |
| a3-problem | A3 Problem Solving | fishbone | Problem, Root Cause, Analysis, Solutions |
| feature-spec | Feature Spec | logicalStructure | Overview, User Story, Acceptance Criteria, Technical |
| user-story-map | User Story Map | timeline | Activities, Tasks, Stories, Releases |
| roadmap | Product Roadmap | timeline | Q1-Q4 with milestones |

### Category 2: Structure Types

| Structure | Description | Best For |
|-----------|-------------|----------|
| kanban | 3-4 column board | Task boards |
| matrix | 2x2 grid | SWOT, decisions |
| sprintBoard | Scrum board | Sprint planning |
| decisionMatrix | Weighted options | Decision making |
| weeklyView | 7-day columns | Weekly planning |
| mcqView | Question layout | Quizzes |
| agendaView | Time-based | Meeting agenda |
| prosCons | Two columns | Decision权衡 |

### Category 3: Role-Based Views

| Role | Capabilities |
|------|--------------|
| Edit | Full editing, all commands enabled |
| View | Read-only, pan/zoom only |
| Present | Fullscreen, clean UI, keyboard navigation |

### Category 4: AI Content Suggestion

| Feature | Description |
|---------|-------------|
| Context | Sends selected node text to AI |
| Prompt Template | "Generate 5 subtopics about [node text]" |
| Output | Replaces or appends suggested nodes |
| UI | Floating suggestion panel with Accept/Reject |

## Architecture

```
components/mindmap/
├── template-selector.tsx      # Template gallery UI
├── structure-picker.tsx       # Structure type dropdown
├── role-switcher.tsx         # Edit/View/Present toggle
├── ai-suggestion-panel.tsx    # AI suggestion floating panel
└── templates/
    ├── work-templates.ts      # Work category templates
    ├── education-templates.ts # Education templates
    └── creative-templates.ts  # Creative templates
```

## Files to Create/Modify

### New Files
- `lib/mindmap/templates/work-templates.ts`
- `lib/mindmap/templates/education-templates.ts`
- `lib/mindmap/templates/creative-templates.ts`
- `components/mindmap/template-selector.tsx`
- `components/mindmap/structure-picker.tsx`
- `components/mindmap/role-switcher.tsx`
- `components/mindmap/ai-suggestion-panel.tsx`

### Modify
- `lib/mindmap/templates.ts` - Import from sub-modules, update exports
- `lib/mindmap/types.ts` - Add StructureType variants
- `components/mindmap/mind-map-editor.tsx` - Integrate role switcher, AI panel
- `components/mindmap/toolbar.tsx` - Add structure picker

## Implementation Order

1. Expand templates (add 17 new templates)
2. Add structure types (kanban, matrix, etc.)
3. Create role switcher component
4. Integrate AI suggestion panel
5. Create template selector gallery UI

## Success Metrics

- [ ] 17 new templates added across 3 categories
- [ ] 10+ new structure types available
- [ ] Role switcher toggles edit/view/present modes
- [ ] AI suggestion generates relevant child nodes
- [ ] Template gallery shows categorized preview

## Notes

- Built-in templates only (no custom template creation)
- AI content suggestion (not auto-complete)
- Use existing simple-mind-map structure types where available
- Leverage existing theme system for visual consistency
