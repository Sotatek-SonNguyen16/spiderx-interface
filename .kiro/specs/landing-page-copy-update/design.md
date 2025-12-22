# Design Document: Landing Page Copy Update

## Overview

This design document outlines the implementation of comprehensive copy updates for the SpiderX v2 landing page. The update transforms all text content to better communicate the multi-platform task capture value proposition, improve user comprehension within 5-10 seconds, and follow SaaS/B2C best practices.

The implementation focuses on updating existing React components with new copy while maintaining the current visual design and component structure. No new components are needed - only text content updates across seven key sections.

---

## Architecture

### Component Structure (No Changes)

The existing landing page architecture remains unchanged:

```
app/(default)/versions/v2/page.tsx
├── HeroSection
├── ProblemStatement  
├── DemoSection
├── IntegrationSection
├── RoadmapSection
├── CTASection
└── Footer
```

### Copy Update Strategy

Each component will receive targeted text updates while preserving:
- Visual layouts and styling
- Interactive functionality
- Component props and interfaces
- Image assets and visual elements

---

## Components and Interfaces

### 1. HeroSection Component Updates

**Current Interface** (unchanged):
```typescript
interface HeroSectionProps {
  onEmailSubmit: (email: string) => void;
}
```

**Copy Changes**:
- **H1**: "Never miss a task — from any platform"
- **H2**: "SpiderX uses AI to capture tasks from emails, chats, and messages and organizes them across all your projects — automatically."
- **Supporting text**: "Gmail, Google Chat, Slack (soon), WhatsApp (soon), and more."
- **CTA helper text**: "Free for early adopters. No credit card required."

### 2. ProblemStatement Component Updates

**Current Interface** (unchanged):
```typescript
// No props interface - static content component
```

**Copy Changes**:
- **Section title**: "Managing multiple projects across tools?"
- **Section subtitle**: "Tasks don't get missed because you forget — they get missed because they're scattered everywhere."

**Problem Cards Updates**:
1. **Time Wasted Card**:
   - Badge: "Daily Task Capture"
   - Title: "Time wasted copying tasks"
   - Description: "Manually moving tasks from emails and chats into your todo app steals time — every single day."

2. **Missing Tasks Card**:
   - Badge: "AI Prioritization"
   - Title: "Important tasks slip through"
   - Description: "Non-urgent but critical tasks get lost when you're juggling multiple projects at once."

3. **Context Chaos Card**:
   - Badge: "Context Awareness"
   - Title: "No single source of truth"
   - Description: "Tasks are scattered across Gmail, Slack, WhatsApp — with no clear ownership or context."

### 3. DemoSection Component Updates

**Current Interface** (unchanged):
```typescript
// No props interface - static content component
```

**Copy Changes**:
- **Section title**: "Works quietly while you work"
- **Subtitle**: "SpiderX runs in the background, spotting tasks as they appear — so you don't have to stop and organize."

**Value Bullets** (new addition to layout):
- "Detects tasks from emails and chat messages"
- "Understands context, deadlines, and responsibility"
- "Organizes tasks by project automatically"
- "Keeps everything in one clean task system"

### 4. IntegrationSection Component Updates

**Current Interface** (unchanged):
```typescript
interface IntegrationSectionProps {
  onRequestIntegrationAction: () => void;
}
```

**Copy Changes**:
- **Section title**: "One task inbox for all your tools"
- **Subtitle**: "SpiderX captures tasks from the platforms you already use and turns them into a single, reliable task system."
- **Connected label**: "Already connected"
- **Coming soon label**: "More platforms coming — driven by user requests"
- **Helper text** (new): "Tasks from different tools are normalized into the same structure — no matter where they come from."

### 5. RoadmapSection Component Updates

**Current Interface** (unchanged):
```typescript
interface RoadmapSectionProps {
  onRequestFeature: () => void;
}
```

**Copy Changes**:
- **Section title**: "Built in public, improved with feedback"
- **Subtitle**: "We're focused on making task capture accurate, reliable, and effortless — across more platforms every month."

**Visual Enhancement**:
- Highlight "Complete" column more prominently (enhanced styling)
- Maintain existing three-column structure

### 6. CTASection Component Updates

**Current Interface** (unchanged):
```typescript
interface CTASectionProps {
  onEmailSubmit: (email: string) => void;
}
```

**Copy Changes**:
- **Title**: "Ready to capture every task — from everywhere?"
- **Subtitle**: "Join professionals who manage multiple projects without missing tasks across email and chat."
- **Helper text**: "Free for early adopters. No credit card required."

### 7. Footer Component Updates

**Current Interface** (unchanged):
```typescript
// No props interface - static content component
```

**Copy Changes**:
- **Tagline**: "AI-powered task capture across your work tools"
- Maintain existing contact and copyright information

---

## Data Models

### Copy Content Structure

```typescript
interface SectionCopy {
  title: string;
  subtitle?: string;
  description?: string;
  helperText?: string;
  bullets?: string[];
}

interface ProblemCard {
  badge: string;
  title: string;
  description: string;
  // visual component unchanged
}

interface LandingPageCopy {
  hero: SectionCopy & {
    supportingText: string;
    ctaHelperText: string;
  };
  problemStatement: SectionCopy & {
    cards: ProblemCard[];
  };
  demo: SectionCopy & {
    valueBullets: string[];
  };
  integrations: SectionCopy & {
    connectedLabel: string;
    comingSoonLabel: string;
    helperText: string;
  };
  roadmap: SectionCopy;
  cta: SectionCopy & {
    ctaHelperText: string;
  };
  footer: {
    tagline: string;
  };
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Multi-platform Messaging Consistency
*For any* landing page section that mentions platforms, the copy SHALL include references to multiple platforms (Gmail, Google Chat, Slack, WhatsApp) to reinforce the multi-platform value proposition.
**Validates: Requirements 1.3, 4.5, 8.2**

### Property 2: Value Proposition Clarity
*For any* primary headline or title text, the copy SHALL communicate the core benefit within the first 10 words to enable 5-10 second comprehension.
**Validates: Requirements 1.1, 8.1**

### Property 3: CTA Consistency
*For any* call-to-action section, the helper text SHALL include "Free for early adopters. No credit card required." to maintain consistent messaging.
**Validates: Requirements 1.5, 6.4**

### Property 4: Problem Recognition Language
*For any* problem statement copy, the language SHALL use recognition-based phrasing that users can immediately relate to their own experience.
**Validates: Requirements 2.5, 8.1**

### Property 5: AI Trust Building
*For any* section that mentions AI capabilities, the copy SHALL emphasize accuracy, reliability, and understanding to build trust in the AI task extraction.
**Validates: Requirements 3.4, 8.4**

---

## Error Handling

### Copy Validation
- **Missing required text**: Ensure all sections have required title and subtitle content
- **Inconsistent messaging**: Verify multi-platform messaging appears throughout
- **Length validation**: Ensure headlines can be comprehended within 5-10 seconds
- **Brand consistency**: Maintain consistent tone and terminology across sections

### Fallback Content
- If any copy update fails to load, maintain existing copy as fallback
- Ensure no sections display empty or undefined text
- Validate all text content is properly escaped for HTML rendering

---

## Testing Strategy

### Dual Testing Approach

This implementation uses both unit tests and property-based tests:

**Unit Tests**: Verify specific copy content appears correctly in rendered components
**Property-Based Tests**: Verify universal properties about copy quality and consistency

### Property-Based Testing Library

**Library**: `fast-check` (JavaScript/TypeScript PBT library)

### Test Configuration
- Minimum iterations per property test: 100
- Focus on copy content validation and consistency

### Test Categories

#### 1. Copy Content Tests
- Unit: Test each section renders updated copy correctly
- Unit: Test all required text elements are present
- Property: Verify multi-platform messaging consistency (Property 1)
- Property: Verify value proposition clarity (Property 2)

#### 2. CTA Consistency Tests
- Unit: Test CTA helper text appears in both hero and final CTA sections
- Property: Verify CTA consistency across sections (Property 3)

#### 3. Problem Statement Tests
- Unit: Test all three problem cards render with updated copy
- Property: Verify problem recognition language (Property 4)

#### 4. AI Trust Tests
- Unit: Test AI-related copy emphasizes accuracy and reliability
- Property: Verify AI trust building language (Property 5)

### Test File Structure

```
components/landing-v2/__tests__/
├── copy-consistency.property.test.ts
├── hero-section-copy.test.ts
├── problem-statement-copy.test.ts
├── demo-section-copy.test.ts
├── integration-section-copy.test.ts
├── roadmap-section-copy.test.ts
├── cta-section-copy.test.ts
└── footer-copy.test.ts
```

### Testing Approach

**Copy Validation Tests**:
- Verify exact text content matches requirements
- Test responsive text rendering across screen sizes
- Validate HTML escaping and special characters
- Ensure accessibility attributes remain intact

**Consistency Tests**:
- Verify multi-platform messaging appears in multiple sections
- Test CTA helper text consistency
- Validate brand terminology usage
- Check tone and voice consistency

**Integration Tests**:
- Test complete landing page renders with all updated copy
- Verify no broken layouts due to text length changes
- Test email submission functionality remains intact
- Validate modal interactions still work correctly