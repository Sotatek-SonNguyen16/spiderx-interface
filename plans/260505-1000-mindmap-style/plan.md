# Mind Map Style Options - Implementation Plan

## Context
Add comprehensive styling options for mindmap nodes including shape, border, text, shadow, and line curve styles with global + per-node control.

## User Stories
1. **As a designer**, I want to customize node appearance per-node
2. **As a business user**, I want global themes for consistent branding
3. **As a power user**, I want quick access via toolbar, context menu, and sidebar

## Style Categories

| Category | Options |
|----------|---------|
| Node Shape | roundedRect, rectangle, ellipse, diamond, star, pill |
| Border | color, width (1-5px), style (solid, dashed, dotted) |
| Shadow | none, small, medium, large |
| Text | bold, italic, color, alignment |
| Line Style | straight, curved, orthogonal, polyline |
| Line Color | color picker |
| Line Width | 1-5px |

## Data Model

```typescript
type MindMapNodeStyle = {
  shape?: "roundedRect" | "rectangle" | "ellipse" | "diamond" | "star" | "pill";
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  shadow?: "none" | "small" | "medium" | "large";
  fontBold?: boolean;
  fontItalic?: boolean;
  fontColor?: string;
  textAlign?: "left" | "center" | "right";
};

type MindMapNodeData = {
  data: { text: string; expand?: boolean; icon?: string; ... };
  style?: MindMapNodeStyle;  // per-node override
  children?: MindMapNodeData[];
};
```

## Files to Create/Modify

### New
- `components/mindmap/style-controls.tsx` - Shared style control components
- `components/mindmap/floating-style-panel.tsx` - Floating toolbar for selected node

### Modify
- `lib/mindmap/types.ts` - Add MindMapNodeStyle type
- `components/mindmap/panel-components.tsx` - Expand StylePanel with all controls
- `components/mindmap/context-menu.tsx` - Add style quick-options
- `components/mindmap/toolbar.tsx` - Add style button

## Implementation Phases

### Phase 1: Data Model & Style Controls
- [ ] Add MindMapNodeStyle to types.ts
- [ ] Create style-controls.tsx with individual control components
- [ ] Expand StylePanel with all style categories

### Phase 2: Per-Node Styling
- [ ] Add style property to MindMapNodeData
- [ ] Create floating-style-panel.tsx
- [ ] Wire up style changes to mindmap instance

### Phase 3: Integration
- [ ] Add style button to toolbar
- [ ] Add style options to context menu
- [ ] Test on mind-map-editor

## Success Metrics
- [ ] StylePanel has all 6 style categories
- [ ] Per-node style can be applied via floating panel
- [ ] Global style applies to all nodes via theme
- [ ] Context menu shows style options