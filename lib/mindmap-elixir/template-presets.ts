import type { MindElixirData, NodeObj, Theme } from "mind-elixir";

import type { MindElixirMarkdownFormat } from "./markdown-to-mind-elixir";

export type MindmapSkeletonTemplate = {
  id: string;
  name: string;
  category:
    | "Work"
    | "Product"
    | "Study"
    | "Creative"
    | "Sales"
    | "Marketing"
    | "Engineering"
    | "HR"
    | "Finance"
    | "Healthcare"
    | "Legal"
    | "Real Estate"
    | "Hospitality"
    | "Operations";
  format: Exclude<MindElixirMarkdownFormat, "auto">;
  source: string;
  recommendedThemeId: string;
  recommendedStyleId: string;
  recommendedDirection: MindmapDirection;
};

export type MindmapDirection = 0 | 1 | 2;

export type MindmapLayoutPreset = {
  id: string;
  name: string;
  category: "Tree" | "Map" | "Orbit";
  direction: MindmapDirection;
  description: string;
  shapeId?: string;
  densityId?: string;
  connectorId?: string;
  geometryId?: string;
  maxExpandedDepth?: number;
};

export type MindmapViewPreset = {
  id: string;
  name: string;
  category: "Explore" | "Read" | "Present";
  description: string;
  format?: Exclude<MindElixirMarkdownFormat, "auto">;
  source?: string;
  themeId: string;
  styleId: string;
  direction: MindmapDirection;
  shapeId: string;
  densityId: string;
  typographyId: string;
  branchPaletteId: string;
  connectorId: string;
  geometryId: string;
  finishId: string;
  maxExpandedDepth?: number;
};

export type MindmapStructurePreset = {
  id: string;
  name: string;
  category: "Core" | "Organization" | "Sequence" | "Analysis" | "System";
  format: Exclude<MindElixirMarkdownFormat, "auto">;
  source: string;
  themeId: string;
  styleId: string;
  direction: MindmapDirection;
  shapeId: string;
  densityId: string;
  typographyId: string;
  branchPaletteId: string;
  connectorId: string;
  geometryId: string;
  finishId: string;
};

export type MindmapVisualTheme = {
  id: string;
  name: string;
  theme: Theme;
};

export type MindmapStylePreset = {
  id: string;
  name: string;
  description: string;
  mainLinkStyle: number;
  branchColors: string[];
  rootStyle: NonNullable<NodeObj["style"]>;
  mainStyle: NonNullable<NodeObj["style"]>;
  leafStyle: NonNullable<NodeObj["style"]>;
};

type NodeStylePatch = NonNullable<NodeObj["style"]>;
type MindmapArrowStyle = NonNullable<NonNullable<MindElixirData["arrows"]>[number]["style"]>;

export type MindmapDiagramPreset = {
  id: string;
  name: string;
  category: "Study" | "Family" | "Engineering" | "Operations" | "Strategy" | "Process";
  format: Exclude<MindElixirMarkdownFormat, "auto">;
  source: string;
  themeId: string;
  styleId: string;
  direction: MindmapDirection;
  shapeId: string;
  densityId: string;
  typographyId: string;
  branchPaletteId: string;
  connectorId: string;
  geometryId: string;
  finishId: string;
};

export type MindmapShapePreset = {
  id: string;
  name: string;
  themeVars: Partial<Theme["cssVar"]>;
  rootStyle: NodeStylePatch;
  mainStyle: NodeStylePatch;
  leafStyle: NodeStylePatch;
};

export type MindmapDensityPreset = {
  id: string;
  name: string;
  themeVars: Partial<Theme["cssVar"]>;
  nodeWidth?: string;
  fontScale: "compact" | "normal" | "large";
};

export type MindmapTypographyPreset = {
  id: string;
  name: string;
  fontFamily?: string;
  rootWeight?: string;
  nodeWeight?: string;
};

export type MindmapBranchPalettePreset = {
  id: string;
  name: string;
  colors: string[];
};

export type MindmapConnectorPreset = {
  id: string;
  name: string;
  mainLinkStyle: number;
  branchColors?: string[];
  arrowMode?: "none" | "primary" | "sequence" | "bidirectional";
  arrowStyle?: MindmapArrowStyle;
};

export type MindmapGeometryPreset = {
  id: string;
  name: string;
  themeVars: Partial<Theme["cssVar"]>;
  rootStyle: NodeStylePatch;
  mainStyle: NodeStylePatch;
  leafStyle: NodeStylePatch;
};

export type MindmapFinishPreset = {
  id: string;
  name: string;
  themeVars: Partial<Theme["cssVar"]>;
  rootStyle: NodeStylePatch;
  mainStyle: NodeStylePatch;
  leafStyle: NodeStylePatch;
};

export type MindmapAdvancedOptions = {
  shapeId?: string;
  densityId?: string;
  typographyId?: string;
  branchPaletteId?: string;
  connectorId?: string;
  geometryId?: string;
  finishId?: string;
  maxExpandedDepth?: number;
};

export const skeletonTemplates: MindmapSkeletonTemplate[] = [
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Product",
    format: "headings",
    recommendedThemeId: "paper-board",
    recommendedStyleId: "solid",
    recommendedDirection: 2,
    source: `# Product Launch

## Discovery
### Customer interviews
### Competitor map
### Success metrics

## Build
### Markdown parser
### Mind Elixir renderer
### Responsive review

## Release
### QA checklist
### Team demo
### Feedback loop`,
  },
  {
    id: "sprint-planning",
    name: "Sprint Planning",
    category: "Work",
    format: "plaintext",
    recommendedThemeId: "blueprint",
    recommendedStyleId: "technical",
    recommendedDirection: 1,
    source: `- Sprint Planning
  - Sprint goal
    - Outcome
    - Constraints
    - Definition of done
  - Stories
    - Ready
    - Needs refinement
    - Blocked
  - Capacity
    - Engineering
    - QA
    - Design
  - Risks
    - Dependencies
    - Unknowns
    - Mitigation`,
  },
  {
    id: "swot",
    name: "SWOT Analysis",
    category: "Product",
    format: "plaintext",
    recommendedThemeId: "solid-ink",
    recommendedStyleId: "fine-line",
    recommendedDirection: 2,
    source: `- SWOT Analysis
  - Strengths
    - Existing advantage
    - Team capability
    - Distribution
  - Weaknesses
    - Product gaps
    - Operational limits
    - Technical debt
  - Opportunities
    - Market shift
    - New segment
    - Partner channel
  - Threats
    - Competitor move
    - Cost pressure
    - Platform risk`,
  },
  {
    id: "study-guide",
    name: "Study Guide",
    category: "Study",
    format: "headings",
    recommendedThemeId: "paper-board",
    recommendedStyleId: "hand-drawn",
    recommendedDirection: 2,
    source: `# Study Guide

## Core Concepts
### Definitions
### Key formulas
### Mental models

## Examples
### Easy case
### Edge case
### Common mistake

## Review
### Flashcards
### Practice questions
### Summary`,
  },
  {
    id: "customer-journey",
    name: "Customer Journey",
    category: "Product",
    format: "plaintext",
    recommendedThemeId: "sticky-notes",
    recommendedStyleId: "sticky",
    recommendedDirection: 1,
    source: `- Customer Journey
  - Discover
    - Trigger
    - Channel
    - First impression
  - Evaluate
    - Needs
    - Objections
    - Comparison
  - Activate
    - Setup
    - First value
    - Support
  - Retain
    - Habit loop
    - Expansion
    - Renewal signal`,
  },
  {
    id: "creative-brief",
    name: "Creative Brief",
    category: "Creative",
    format: "headings",
    recommendedThemeId: "noir",
    recommendedStyleId: "presentation",
    recommendedDirection: 2,
    source: `# Creative Brief

## Intent
### Audience
### Feeling
### Message

## Direction
### Visual language
### References
### Constraints

## Production
### Assets
### Review
### Delivery`,
  },
  {
    id: "meeting-agenda",
    name: "Meeting Agenda",
    category: "Work",
    format: "plaintext",
    recommendedThemeId: "solid-ink",
    recommendedStyleId: "presentation",
    recommendedDirection: 1,
    source: `- Meeting Agenda
  - Context
    - Objective
    - Background
    - Constraints
  - Discussion
    - Topic 1
    - Topic 2
    - Decisions needed
  - Actions
    - Owner
    - Due date
    - Follow-up`,
  },
  {
    id: "decision-tree",
    name: "Decision Tree",
    category: "Product",
    format: "plaintext",
    recommendedThemeId: "blueprint",
    recommendedStyleId: "technical",
    recommendedDirection: 1,
    source: `- Decision Tree
  - Option A
    - Upside
    - Cost
    - Risk
  - Option B
    - Upside
    - Cost
    - Risk
  - Option C
    - Upside
    - Cost
    - Risk
  - Criteria
    - Time
    - Confidence
    - Reversibility`,
  },
  {
    id: "quarterly-roadmap",
    name: "Quarterly Roadmap",
    category: "Product",
    format: "plaintext",
    recommendedThemeId: "executive",
    recommendedStyleId: "solid",
    recommendedDirection: 1,
    source: `- Quarterly Roadmap
  - Q1
    - Discovery
    - Foundations
    - Pilot
  - Q2
    - Launch
    - Adoption
    - Measurement
  - Q3
    - Expansion
    - Automation
    - Optimization
  - Q4
    - Scale
    - Review
    - Next bets`,
  },
  {
    id: "root-cause",
    name: "Root Cause",
    category: "Work",
    format: "headings",
    recommendedThemeId: "paper-board",
    recommendedStyleId: "hand-drawn",
    recommendedDirection: 2,
    source: `# Root Cause Analysis

## Problem
### Symptom
### Impact
### Scope

## Causes
### People
### Process
### System

## Evidence
### Logs
### Interviews
### Metrics

## Fixes
### Immediate
### Preventive
### Owner`,
  },
  {
    id: "research-paper",
    name: "Research Paper",
    category: "Study",
    format: "headings",
    recommendedThemeId: "clean-room",
    recommendedStyleId: "fine-line",
    recommendedDirection: 2,
    source: `# Research Paper

## Abstract
### Problem
### Method
### Result

## Literature
### Prior work
### Gaps
### Definitions

## Method
### Dataset
### Procedure
### Limitations

## Findings
### Result 1
### Result 2
### Implications`,
  },
  {
    id: "brand-system",
    name: "Brand System",
    category: "Creative",
    format: "plaintext",
    recommendedThemeId: "pastel-studio",
    recommendedStyleId: "soft-block",
    recommendedDirection: 2,
    source: `- Brand System
  - Voice
    - Principles
    - Vocabulary
    - Anti-patterns
  - Visuals
    - Color
    - Type
    - Motion
  - Components
    - Buttons
    - Cards
    - Navigation
  - Governance
    - Review
    - Versioning
    - Adoption`,
  },
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    category: "Sales",
    format: "plaintext",
    recommendedThemeId: "revenue",
    recommendedStyleId: "badge",
    recommendedDirection: 1,
    source: `- Sales Pipeline
  - Prospecting
    - Target account
    - Trigger event
    - First touch
  - Qualification
    - Need
    - Authority
    - Budget
    - Timeline
  - Proposal
    - Value case
    - Pricing
    - Objections
  - Close
    - Procurement
    - Legal
    - Handoff`,
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    category: "Marketing",
    format: "headings",
    recommendedThemeId: "pastel-studio",
    recommendedStyleId: "soft-block",
    recommendedDirection: 2,
    source: `# Marketing Campaign

## Audience
### Segment
### Jobs to be done
### Objections

## Message
### Promise
### Proof
### CTA

## Channels
### Email
### Social
### Paid

## Measurement
### Leading metrics
### Conversion
### Learnings`,
  },
  {
    id: "software-architecture",
    name: "Software Architecture",
    category: "Engineering",
    format: "plaintext",
    recommendedThemeId: "blueprint",
    recommendedStyleId: "technical",
    recommendedDirection: 1,
    source: `- Software Architecture
  - Clients
    - Web app
    - Mobile app
    - Admin
  - API Layer
    - Routes
    - Auth
    - Validation
  - Services
    - Domain logic
    - Queue workers
    - Integrations
  - Data
    - Primary DB
    - Cache
    - Search index
  - Operations
    - Observability
    - Deployments
    - Incident response`,
  },
  {
    id: "incident-response",
    name: "Incident Response",
    category: "Engineering",
    format: "plaintext",
    recommendedThemeId: "ops-slate",
    recommendedStyleId: "alert",
    recommendedDirection: 1,
    source: `- Incident Response
  - Detect
    - Alert source
    - Customer signal
    - Severity
  - Triage
    - Impact
    - Blast radius
    - Owner
  - Mitigate
    - Rollback
    - Patch
    - Communication
  - Resolve
    - Verification
    - Timeline
    - Postmortem
  - Prevent
    - Monitoring
    - Guardrail
    - Runbook`,
  },
  {
    id: "hiring-scorecard",
    name: "Hiring Scorecard",
    category: "HR",
    format: "headings",
    recommendedThemeId: "clean-room",
    recommendedStyleId: "outline",
    recommendedDirection: 2,
    source: `# Hiring Scorecard

## Role Fit
### Responsibilities
### Must-have skills
### Nice-to-have skills

## Interview Loop
### Recruiter screen
### Technical screen
### Team interview
### Final review

## Evaluation
### Strengths
### Risks
### Decision`,
  },
  {
    id: "onboarding-plan",
    name: "Onboarding Plan",
    category: "HR",
    format: "plaintext",
    recommendedThemeId: "paper-board",
    recommendedStyleId: "solid",
    recommendedDirection: 1,
    source: `- Onboarding Plan
  - Day 1
    - Access
    - Setup
    - Welcome
  - Week 1
    - Product overview
    - Team rituals
    - First task
  - Month 1
    - Ownership area
    - Feedback
    - Success criteria
  - Support
    - Buddy
    - Manager
    - Docs`,
  },
  {
    id: "budget-planning",
    name: "Budget Planning",
    category: "Finance",
    format: "plaintext",
    recommendedThemeId: "executive",
    recommendedStyleId: "ledger",
    recommendedDirection: 1,
    source: `- Budget Planning
  - Revenue
    - Existing contracts
    - Expansion
    - New pipeline
  - Costs
    - Payroll
    - Infrastructure
    - Vendors
  - Scenarios
    - Base
    - Upside
    - Downside
  - Controls
    - Approval
    - Forecast cadence
    - Variance review`,
  },
  {
    id: "financial-model",
    name: "Financial Model",
    category: "Finance",
    format: "headings",
    recommendedThemeId: "revenue",
    recommendedStyleId: "ledger",
    recommendedDirection: 1,
    source: `# Financial Model

## Inputs
### Pricing
### Volume
### Conversion

## Revenue
### New business
### Expansion
### Churn

## Costs
### Fixed
### Variable
### One-time

## Outputs
### Margin
### Cash flow
### Sensitivity`,
  },
  {
    id: "care-coordination",
    name: "Care Coordination",
    category: "Healthcare",
    format: "plaintext",
    recommendedThemeId: "clinical",
    recommendedStyleId: "clinical",
    recommendedDirection: 2,
    source: `- Care Coordination
  - Intake
    - Patient context
    - Consent
    - Priority
  - Care Team
    - Primary owner
    - Specialists
    - Support contacts
  - Plan
    - Goals
    - Tasks
    - Follow-up
  - Communication
    - Updates
    - Escalation
    - Documentation`,
  },
  {
    id: "clinic-ops",
    name: "Clinic Operations",
    category: "Healthcare",
    format: "headings",
    recommendedThemeId: "clinical",
    recommendedStyleId: "fine-line",
    recommendedDirection: 1,
    source: `# Clinic Operations

## Front Desk
### Scheduling
### Check-in
### Billing handoff

## Clinical Flow
### Rooming
### Provider visit
### Orders

## Follow-up
### Results
### Referrals
### Patient messaging`,
  },
  {
    id: "legal-case-brief",
    name: "Legal Case Brief",
    category: "Legal",
    format: "headings",
    recommendedThemeId: "legal-pad",
    recommendedStyleId: "outline",
    recommendedDirection: 2,
    source: `# Legal Case Brief

## Facts
### Parties
### Timeline
### Evidence

## Issues
### Question 1
### Question 2
### Open points

## Rules
### Statutes
### Precedent
### Standards

## Analysis
### Argument
### Counterargument
### Risk

## Conclusion
### Recommendation
### Next steps`,
  },
  {
    id: "contract-review",
    name: "Contract Review",
    category: "Legal",
    format: "plaintext",
    recommendedThemeId: "legal-pad",
    recommendedStyleId: "ledger",
    recommendedDirection: 1,
    source: `- Contract Review
  - Commercial Terms
    - Price
    - Payment
    - Renewal
  - Obligations
    - Deliverables
    - Service levels
    - Reporting
  - Risk Clauses
    - Liability
    - Termination
    - Indemnity
  - Open Items
    - Redlines
    - Approvals
    - Owner`,
  },
  {
    id: "real-estate-deal",
    name: "Real Estate Deal",
    category: "Real Estate",
    format: "plaintext",
    recommendedThemeId: "executive",
    recommendedStyleId: "solid",
    recommendedDirection: 1,
    source: `- Real Estate Deal
  - Property
    - Location
    - Condition
    - Comparable sales
  - Financials
    - Purchase price
    - Renovation
    - Yield
  - Due Diligence
    - Title
    - Inspection
    - Zoning
  - Closing
    - Financing
    - Documents
    - Timeline`,
  },
  {
    id: "restaurant-launch",
    name: "Restaurant Launch",
    category: "Hospitality",
    format: "headings",
    recommendedThemeId: "market",
    recommendedStyleId: "marker",
    recommendedDirection: 2,
    source: `# Restaurant Launch

## Concept
### Cuisine
### Audience
### Positioning

## Menu
### Signature items
### Costing
### Suppliers

## Operations
### Staffing
### Service flow
### Inventory

## Opening
### Soft launch
### Marketing
### Feedback`,
  },
  {
    id: "event-production",
    name: "Event Production",
    category: "Operations",
    format: "plaintext",
    recommendedThemeId: "market",
    recommendedStyleId: "sticky",
    recommendedDirection: 1,
    source: `- Event Production
  - Program
    - Agenda
    - Speakers
    - Run of show
  - Venue
    - Layout
    - AV
    - Signage
  - Operations
    - Staffing
    - Vendor list
    - Load-in
  - Guest Experience
    - Registration
    - Food and beverage
    - Follow-up`,
  },
  {
    id: "sop-map",
    name: "SOP Map",
    category: "Operations",
    format: "plaintext",
    recommendedThemeId: "ops-slate",
    recommendedStyleId: "technical",
    recommendedDirection: 1,
    source: `- SOP Map
  - Trigger
    - Input
    - Preconditions
    - Owner
  - Procedure
    - Step 1
    - Step 2
    - Step 3
  - Quality Check
    - Criteria
    - Evidence
    - Escalation
  - Output
    - Deliverable
    - Handoff
    - Archive`,
  },
  {
    id: "lesson-plan",
    name: "Lesson Plan",
    category: "Study",
    format: "headings",
    recommendedThemeId: "pastel-studio",
    recommendedStyleId: "hand-drawn",
    recommendedDirection: 2,
    source: `# Lesson Plan

## Objective
### Knowledge
### Skill
### Assessment

## Warm-up
### Prompt
### Discussion
### Prior knowledge

## Activity
### Demonstration
### Practice
### Group work

## Closure
### Exit ticket
### Homework
### Reflection`,
  },
  {
    id: "ux-research",
    name: "UX Research",
    category: "Product",
    format: "plaintext",
    recommendedThemeId: "clean-room",
    recommendedStyleId: "soft-block",
    recommendedDirection: 2,
    source: `- UX Research
  - Research Questions
    - Behavior
    - Motivation
    - Friction
  - Participants
    - Segment
    - Recruiting
    - Screening
  - Method
    - Interview
    - Usability test
    - Survey
  - Synthesis
    - Insights
    - Opportunities
    - Recommendations`,
  },
  {
    id: "investor-pitch",
    name: "Investor Pitch",
    category: "Finance",
    format: "headings",
    recommendedThemeId: "noir",
    recommendedStyleId: "presentation",
    recommendedDirection: 1,
    source: `# Investor Pitch

## Problem
### User pain
### Current alternatives
### Timing

## Solution
### Product
### Differentiation
### Proof

## Market
### Segment
### Size
### Competition

## Business
### Model
### Traction
### Ask`,
  },
];

export const diagramPresets: MindmapDiagramPreset[] = [
  {
    id: "focus-canvas",
    name: "Focus Canvas",
    category: "Strategy",
    format: "headings",
    themeId: "solid-canvas",
    styleId: "solid-canvas",
    direction: 2,
    shapeId: "pill",
    densityId: "cinematic",
    typographyId: "compact-ui",
    branchPaletteId: "signal",
    connectorId: "rounded-flow",
    geometryId: "balanced-orbit",
    finishId: "no-border",
    source: `# Focus Canvas

## Strategy
### North star
### Current bet
### Trade-off

## Product
### Core loop
### User signal
### Differentiator

## Execution
### This week
### Next release
### Blockers

## Learning
### Assumption
### Experiment
### Decision`,
  },
  {
    id: "active-recall",
    name: "Recall Study",
    category: "Study",
    format: "headings",
    themeId: "paper-board",
    styleId: "hand-drawn",
    direction: 2,
    shapeId: "index-card",
    densityId: "compact",
    typographyId: "marker",
    branchPaletteId: "rainbow",
    connectorId: "rounded-flow",
    geometryId: "card-stack",
    finishId: "hand-sketch",
    source: `# Active Recall Map

## Trigger Question
### What do I need to remember?
### Where do I usually confuse it?
### What is the simplest cue?

## Memory Hooks
### Keyword
### Visual association
### Example case

## Retrieval Path
### First answer
### Checkpoint
### Correction

## Spaced Review
### Today
### Three days
### One week`,
  },
  {
    id: "family-tree",
    name: "Family Tree",
    category: "Family",
    format: "plaintext",
    themeId: "legal-pad",
    styleId: "ledger",
    direction: 2,
    shapeId: "label-tag",
    densityId: "balanced",
    typographyId: "editorial",
    branchPaletteId: "earth",
    connectorId: "balanced",
    geometryId: "rounded-rect",
    finishId: "vintage-print",
    source: `- Family Lineage
  - Grandparents
    - Paternal side
    - Maternal side
    - Key stories
  - Parents
    - Siblings
    - Milestones
    - Home places
  - Current Generation
    - Children
    - Cousins
    - Relationships
  - Archive
    - Photos
    - Documents
    - Unknown links`,
  },
  {
    id: "fishbone-root-cause",
    name: "Fishbone",
    category: "Operations",
    format: "plaintext",
    themeId: "solid-ink",
    styleId: "outline",
    direction: 2,
    shapeId: "underlined",
    densityId: "spacious",
    typographyId: "compact-ui",
    branchPaletteId: "risk",
    connectorId: "sharp-angle",
    geometryId: "rail",
    finishId: "ink-print",
    source: `- Fishbone Root Cause
  - People
    - Skills gap
    - Ownership unclear
    - Fatigue
  - Process
    - Missing step
    - Approval delay
    - Hand-off loss
  - System
    - Alert noise
    - Slow dependency
    - Data mismatch
  - Environment
    - Peak traffic
    - Vendor issue
    - Policy change
  - Evidence
    - Logs
    - Timeline
    - Customer reports`,
  },
  {
    id: "system-architecture",
    name: "Architecture",
    category: "Engineering",
    format: "plaintext",
    themeId: "blueprint",
    styleId: "technical",
    direction: 1,
    shapeId: "sharp",
    densityId: "balanced",
    typographyId: "mono",
    branchPaletteId: "neon",
    connectorId: "elbow",
    geometryId: "module-block",
    finishId: "blueprint-grid",
    source: `- System Architecture
  - Clients
    - Web
    - Mobile
    - Admin
  - Edge Layer
    - CDN
    - Gateway
    - Auth
  - Services
    - User service
    - Billing service
    - Workflow service
  - Data Plane
    - SQL
    - Cache
    - Search
  - Operations
    - Metrics
    - Logs
    - Alerts`,
  },
  {
    id: "arrow-dependency",
    name: "Dependency Flow",
    category: "Engineering",
    format: "headings",
    themeId: "noir",
    styleId: "presentation",
    direction: 1,
    shapeId: "pill",
    densityId: "presentation",
    typographyId: "mono",
    branchPaletteId: "neon",
    connectorId: "arrow-sequence",
    geometryId: "pill-system",
    finishId: "neon-edge",
    source: `# Dependency Flow

## Input
### Request
### Event
### Validation

## Transform
### Rules
### Enrichment
### Routing

## Persist
### Transaction
### Index
### Audit

## Notify
### Webhook
### Email
### Dashboard`,
  },
  {
    id: "decision-ladder",
    name: "Decision Ladder",
    category: "Strategy",
    format: "plaintext",
    themeId: "executive",
    styleId: "badge",
    direction: 1,
    shapeId: "pill",
    densityId: "compact",
    typographyId: "system",
    branchPaletteId: "monochrome",
    connectorId: "straight",
    geometryId: "compact-chip",
    finishId: "solid-block",
    source: `- Decision Ladder
  - Goal
    - Desired outcome
    - Constraint
    - Success metric
  - Options
    - Option A
    - Option B
    - Option C
  - Criteria
    - Impact
    - Cost
    - Reversibility
  - Decision
    - Selected path
    - Owner
    - Review date`,
  },
  {
    id: "process-swimlane",
    name: "Process Map",
    category: "Process",
    format: "plaintext",
    themeId: "clean-room",
    styleId: "fine-line",
    direction: 1,
    shapeId: "index-card",
    densityId: "spacious",
    typographyId: "compact-ui",
    branchPaletteId: "theme",
    connectorId: "rounded-flow",
    geometryId: "flow-card",
    finishId: "clean-print",
    source: `- Process Map
  - Intake
    - Request
    - Triage
    - Priority
  - Work
    - Assign
    - Execute
    - Review
  - Approval
    - QA
    - Stakeholder
    - Sign-off
  - Delivery
    - Release
    - Communicate
    - Measure`,
  },
];

export const layoutPresets: MindmapLayoutPreset[] = [
  {
    id: "bidirectional-mindmap",
    name: "Bidirectional",
    category: "Map",
    direction: 2,
    description: "Root in the middle, level-2 branches split left and right for Markdown notes.",
    shapeId: "pill",
    densityId: "cinematic",
    connectorId: "rounded-flow",
    geometryId: "balanced-orbit",
    maxExpandedDepth: 3,
  },
  {
    id: "horizontal-tree",
    name: "Horizontal Tree",
    category: "Tree",
    direction: 1,
    description: "One-way hierarchy for org charts, long outlines, and process maps.",
    shapeId: "index-card",
    densityId: "balanced",
    connectorId: "straight",
    geometryId: "module-block",
    maxExpandedDepth: 3,
  },
  {
    id: "vertical-tree",
    name: "Vertical Tree",
    category: "Tree",
    direction: 1,
    description: "Compact document outline feel with rail geometry and smaller nodes.",
    shapeId: "underlined",
    densityId: "compact",
    connectorId: "straight",
    geometryId: "rail",
    maxExpandedDepth: 2,
  },
  {
    id: "radial-tree",
    name: "Radial Tree",
    category: "Orbit",
    direction: 2,
    description: "Balanced orbit-style spread for visual brainstorming and architecture hubs.",
    shapeId: "circle",
    densityId: "spacious",
    connectorId: "sharp-angle",
    geometryId: "balanced-orbit",
    maxExpandedDepth: 2,
  },
  {
    id: "left-tree",
    name: "Left Tree",
    category: "Tree",
    direction: 0,
    description: "Reverse hierarchy when the reading flow should move toward the left.",
    shapeId: "index-card",
    densityId: "balanced",
    connectorId: "elbow",
    geometryId: "flow-card",
    maxExpandedDepth: 3,
  },
];

export const viewPresets: MindmapViewPreset[] = [
  {
    id: "modern-clean",
    name: "Modern Clean",
    category: "Explore",
    description: "Light, breathable visual Markdown explorer with curved branches and soft grouping.",
    themeId: "clean-room",
    styleId: "soft-block",
    direction: 2,
    shapeId: "rounded",
    densityId: "balanced",
    typographyId: "system",
    branchPaletteId: "theme",
    connectorId: "rounded-flow",
    geometryId: "balanced-orbit",
    finishId: "clean-print",
    maxExpandedDepth: 3,
  },
  {
    id: "grid-sketch",
    name: "Grid Sketch",
    category: "Explore",
    description: "Hand-drawn grid-paper template with chunky rounded nodes like a notebook mind map.",
    format: "headings",
    themeId: "grid-paper",
    styleId: "grid-sketch",
    direction: 2,
    shapeId: "pill",
    densityId: "spacious",
    typographyId: "compact-ui",
    branchPaletteId: "sketch-muted",
    connectorId: "sketch-arrow",
    geometryId: "balanced-orbit",
    finishId: "grid-sketch",
    maxExpandedDepth: 3,
    source: `# MIND MAP

## CONNECTION
### Interaction
### Exchange

## PROGRESS
### Monitor
### Reflect

## AWARENESS
### Focus
### Presence

## RESPECT
### Boundaries
### Tone

## UNDERSTANDING
### Clarify
### Interpret

## DECISION
### Compare
### Choose`,
  },
  {
    id: "mindmap",
    name: "Mindmap",
    category: "Explore",
    description: "Root-centered split branches for brainstorming and study notes.",
    themeId: "paper-board",
    styleId: "solid",
    direction: 2,
    shapeId: "pill",
    densityId: "cinematic",
    typographyId: "compact-ui",
    branchPaletteId: "earth",
    connectorId: "rounded-flow",
    geometryId: "balanced-orbit",
    finishId: "clean-print",
    maxExpandedDepth: 3,
  },
  {
    id: "tree",
    name: "Tree",
    category: "Read",
    description: "Technical reading mode for outlines, docs, and deeply nested Markdown.",
    themeId: "solid-ink",
    styleId: "fine-line",
    direction: 1,
    shapeId: "index-card",
    densityId: "compact",
    typographyId: "mono",
    branchPaletteId: "monochrome",
    connectorId: "straight",
    geometryId: "rail",
    finishId: "clean-print",
    maxExpandedDepth: 2,
  },
  {
    id: "cards",
    name: "Cards",
    category: "Read",
    description: "Grouped cards for long descriptive Markdown where each heading is a block.",
    themeId: "pastel-studio",
    styleId: "soft-block",
    direction: 2,
    shapeId: "index-card",
    densityId: "balanced",
    typographyId: "editorial",
    branchPaletteId: "rainbow",
    connectorId: "balanced",
    geometryId: "card-stack",
    finishId: "clean-print",
    maxExpandedDepth: 2,
  },
  {
    id: "focus",
    name: "Focus",
    category: "Present",
    description: "Presentation-like mode that hides deep detail until users expand branches.",
    themeId: "solid-canvas",
    styleId: "solid-canvas",
    direction: 2,
    shapeId: "pill",
    densityId: "cinematic",
    typographyId: "compact-ui",
    branchPaletteId: "signal",
    connectorId: "rounded-flow",
    geometryId: "balanced-orbit",
    finishId: "no-border",
    maxExpandedDepth: 2,
  },
];

export const structurePresets: MindmapStructurePreset[] = [
  {
    id: "classic-mind-map",
    name: "Mind Map",
    category: "Core",
    format: "headings",
    themeId: "solid-canvas",
    styleId: "solid-canvas",
    direction: 2,
    shapeId: "pill",
    densityId: "cinematic",
    typographyId: "compact-ui",
    branchPaletteId: "signal",
    connectorId: "rounded-flow",
    geometryId: "balanced-orbit",
    finishId: "no-border",
    source: `# Strategy Map

## Market
### Segment
### Trigger
### Objection

## Product
### Core value
### Differentiator
### Proof

## Channel
### Organic
### Partner
### Sales motion

## Execution
### Next bet
### Owner
### Metric`,
  },
  {
    id: "org-chart",
    name: "Org Chart",
    category: "Organization",
    format: "plaintext",
    themeId: "executive",
    styleId: "presentation",
    direction: 1,
    shapeId: "rounded",
    densityId: "balanced",
    typographyId: "system",
    branchPaletteId: "theme",
    connectorId: "straight",
    geometryId: "module-block",
    finishId: "clean-print",
    source: `- Company
  - Leadership
    - CEO
    - COO
    - CTO
  - Product
    - Product Manager
    - Designer
    - Research
  - Engineering
    - Frontend
    - Backend
    - Platform
  - Revenue
    - Sales
    - Marketing
    - Customer Success`,
  },
  {
    id: "outline-list",
    name: "Outline List",
    category: "Core",
    format: "headings",
    themeId: "clean-room",
    styleId: "fine-line",
    direction: 1,
    shapeId: "index-card",
    densityId: "compact",
    typographyId: "editorial",
    branchPaletteId: "monochrome",
    connectorId: "straight",
    geometryId: "rail",
    finishId: "clean-print",
    source: `# Study Notes

## Chapter 1
### Definition
### Formula
### Example

## Chapter 2
### Key argument
### Evidence
### Exception

## Chapter 3
### Pattern
### Memory hook
### Practice`,
  },
  {
    id: "timeline-roadmap",
    name: "Timeline",
    category: "Sequence",
    format: "plaintext",
    themeId: "blueprint",
    styleId: "technical",
    direction: 1,
    shapeId: "label-tag",
    densityId: "presentation",
    typographyId: "mono",
    branchPaletteId: "neon",
    connectorId: "arrow-sequence",
    geometryId: "flow-card",
    finishId: "blueprint-grid",
    source: `- Product Roadmap
  - Now
    - Stabilize core
    - Collect signal
    - Fix onboarding
  - Next
    - Collaboration
    - Export flow
    - Template library
  - Later
    - Automations
    - Team analytics
    - Marketplace
  - Measure
    - Activation
    - Retention
    - Expansion`,
  },
  {
    id: "matrix-quadrant",
    name: "Matrix",
    category: "Analysis",
    format: "headings",
    themeId: "legal-pad",
    styleId: "ledger",
    direction: 2,
    shapeId: "square",
    densityId: "balanced",
    typographyId: "editorial",
    branchPaletteId: "risk",
    connectorId: "balanced",
    geometryId: "compact-chip",
    finishId: "ink-print",
    source: `# Decision Matrix

## High Impact
### Quick win
### Strategic bet
### Executive ask

## Low Impact
### Defer
### Delegate
### Remove

## High Effort
### Break down
### Prototype first
### Add owner

## Low Effort
### Batch
### Automate
### Ship now`,
  },
  {
    id: "hub-spoke",
    name: "Hub & Spoke",
    category: "System",
    format: "plaintext",
    themeId: "noir",
    styleId: "soft-block",
    direction: 2,
    shapeId: "circle",
    densityId: "spacious",
    typographyId: "system",
    branchPaletteId: "rainbow",
    connectorId: "sharp-angle",
    geometryId: "balanced-orbit",
    finishId: "neon-edge",
    source: `- Architecture Hub
  - App Shell
    - Routing
    - State
    - Permissions
  - Data Layer
    - API
    - Cache
    - Sync
  - AI Layer
    - Prompt
    - Tools
    - Evaluation
  - Delivery
    - Build
    - Observability
    - Rollback`,
  },
];

export const visualThemes: MindmapVisualTheme[] = [
  {
    id: "solid-canvas",
    name: "Solid Canvas",
    theme: createTheme("Solid Canvas", "dark", {
      background: "#0a0b0f",
      node: "#17191f",
      text: "#f5f7fb",
      root: "#f5f7fb",
      rootText: "#0a0b0f",
      accent: "#d7ff45",
      border: "#17191f",
      palette: ["#d7ff45", "#50e3c2", "#ff6b4a", "#8ea7ff", "#f9c74f", "#f15bb5"],
    }),
  },
  {
    id: "paper-board",
    name: "Paper Board",
    theme: createTheme("Paper Board", "light", {
      background: "#f7f3ea",
      node: "#fffdfa",
      text: "#14171f",
      root: "#1f3a2e",
      rootText: "#fffdfa",
      accent: "#b58b2a",
      border: "#e7e1d7",
      palette: ["#1f3a2e", "#0f766e", "#b58b2a", "#b42318", "#334155", "#7c3aed"],
    }),
  },
  {
    id: "blueprint",
    name: "Blueprint",
    theme: createTheme("Blueprint", "dark", {
      background: "#0b1220",
      node: "#111c2f",
      text: "#e5eefc",
      root: "#60a5fa",
      rootText: "#06111f",
      accent: "#38bdf8",
      border: "#1e3a5f",
      palette: ["#38bdf8", "#60a5fa", "#a78bfa", "#22d3ee", "#fbbf24", "#34d399"],
    }),
  },
  {
    id: "solid-ink",
    name: "Solid Ink",
    theme: createTheme("Solid Ink", "light", {
      background: "#ffffff",
      node: "#ffffff",
      text: "#111827",
      root: "#111827",
      rootText: "#ffffff",
      accent: "#111827",
      border: "#d1d5db",
      palette: ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af"],
    }),
  },
  {
    id: "grid-paper",
    name: "Grid Paper",
    theme: createTheme("Grid Paper", "light", {
      background: "#fbfcf8",
      node: "#e5e1d8",
      text: "#2f3f43",
      root: "#34474c",
      rootText: "#ffffff",
      accent: "#34474c",
      border: "#34474c",
      palette: ["#34474c", "#d8d1c8", "#d7d7d3", "#ece9dd", "#4b6066", "#cfc8bd"],
    }),
  },
  {
    id: "sticky-notes",
    name: "Sticky Notes",
    theme: createTheme("Sticky Notes", "light", {
      background: "#fff7d6",
      node: "#fffdf0",
      text: "#2f2a1f",
      root: "#c2410c",
      rootText: "#fff7ed",
      accent: "#ea580c",
      border: "#f3d179",
      palette: ["#f59e0b", "#84cc16", "#06b6d4", "#f43f5e", "#8b5cf6", "#10b981"],
    }),
  },
  {
    id: "noir",
    name: "Noir",
    theme: createTheme("Noir", "dark", {
      background: "#111111",
      node: "#1b1b1b",
      text: "#f5f5f5",
      root: "#f5f5f5",
      rootText: "#111111",
      accent: "#d4af37",
      border: "#2f2f2f",
      palette: ["#d4af37", "#ef4444", "#f5f5f5", "#a3a3a3", "#737373"],
    }),
  },
  {
    id: "clean-room",
    name: "Clean Room",
    theme: createTheme("Clean Room", "light", {
      background: "#f8fafc",
      node: "#ffffff",
      text: "#0f172a",
      root: "#0f172a",
      rootText: "#ffffff",
      accent: "#2563eb",
      border: "#dbe4ee",
      palette: ["#2563eb", "#0f766e", "#64748b", "#9333ea", "#0891b2", "#475569"],
    }),
  },
  {
    id: "pastel-studio",
    name: "Pastel Studio",
    theme: createTheme("Pastel Studio", "light", {
      background: "#fbf7f2",
      node: "#fffefd",
      text: "#312e2b",
      root: "#be185d",
      rootText: "#fff7fb",
      accent: "#db2777",
      border: "#eaded1",
      palette: ["#db2777", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444", "#22c55e"],
    }),
  },
  {
    id: "executive",
    name: "Executive",
    theme: createTheme("Executive", "light", {
      background: "#f6f3ec",
      node: "#ffffff",
      text: "#18181b",
      root: "#27272a",
      rootText: "#fafafa",
      accent: "#b58b2a",
      border: "#ddd6c7",
      palette: ["#27272a", "#b58b2a", "#57534e", "#0f766e", "#7c2d12", "#1d4ed8"],
    }),
  },
  {
    id: "revenue",
    name: "Revenue",
    theme: createTheme("Revenue", "light", {
      background: "#f7f8f3",
      node: "#ffffff",
      text: "#1f2933",
      root: "#065f46",
      rootText: "#ecfdf5",
      accent: "#16a34a",
      border: "#d7e4cf",
      palette: ["#16a34a", "#0f766e", "#65a30d", "#ca8a04", "#2563eb", "#7c3aed"],
    }),
  },
  {
    id: "clinical",
    name: "Clinical",
    theme: createTheme("Clinical", "light", {
      background: "#eefaf7",
      node: "#ffffff",
      text: "#12313a",
      root: "#0f766e",
      rootText: "#ecfeff",
      accent: "#06b6d4",
      border: "#bae6e1",
      palette: ["#0f766e", "#06b6d4", "#2563eb", "#14b8a6", "#65a30d", "#64748b"],
    }),
  },
  {
    id: "legal-pad",
    name: "Legal Pad",
    theme: createTheme("Legal Pad", "light", {
      background: "#fff8dc",
      node: "#fffef2",
      text: "#2f2a1f",
      root: "#78350f",
      rootText: "#fffbeb",
      accent: "#b45309",
      border: "#ead68a",
      palette: ["#78350f", "#b45309", "#92400e", "#4b5563", "#1d4ed8", "#166534"],
    }),
  },
  {
    id: "ops-slate",
    name: "Ops Slate",
    theme: createTheme("Ops Slate", "dark", {
      background: "#111827",
      node: "#1f2937",
      text: "#f8fafc",
      root: "#f97316",
      rootText: "#111827",
      accent: "#f97316",
      border: "#374151",
      palette: ["#f97316", "#38bdf8", "#a3e635", "#facc15", "#fb7185", "#c084fc"],
    }),
  },
  {
    id: "market",
    name: "Market",
    theme: createTheme("Market", "light", {
      background: "#fff7ed",
      node: "#ffffff",
      text: "#431407",
      root: "#c2410c",
      rootText: "#fff7ed",
      accent: "#ea580c",
      border: "#fed7aa",
      palette: ["#ea580c", "#f59e0b", "#16a34a", "#0891b2", "#db2777", "#7c3aed"],
    }),
  },
];

export const stylePresets: MindmapStylePreset[] = [
  {
    id: "solid-canvas",
    name: "Solid Canvas",
    description: "Borderless solid nodes with editorial contrast and balanced scale.",
    mainLinkStyle: 2,
    branchColors: ["#d7ff45", "#50e3c2", "#ff6b4a", "#8ea7ff", "#f9c74f", "#f15bb5"],
    rootStyle: {
      fontFamily: "var(--font-nacelle), ui-sans-serif, system-ui, sans-serif",
      fontSize: "26px",
      fontWeight: "700",
      background: "#f5f7fb",
      color: "#0a0b0f",
      border: "0",
      width: "220px",
    },
    mainStyle: {
      fontFamily: "var(--font-nacelle), ui-sans-serif, system-ui, sans-serif",
      fontSize: "15px",
      fontWeight: "700",
      background: "#17191f",
      color: "#f5f7fb",
      border: "0",
      width: "170px",
    },
    leafStyle: {
      fontFamily: "var(--font-nacelle), ui-sans-serif, system-ui, sans-serif",
      fontSize: "13px",
      fontWeight: "600",
      background: "#242832",
      color: "#cdd4e4",
      border: "0",
      width: "142px",
    },
  },
  {
    id: "solid",
    name: "Solid",
    description: "Dense nodes, strong borders, direct business map.",
    mainLinkStyle: 2,
    branchColors: ["#1f3a2e", "#0f766e", "#b58b2a", "#b42318", "#334155", "#7c3aed"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "#1f3a2e",
      color: "#ffffff",
      border: "2px solid #1f3a2e",
    },
    mainStyle: {
      fontSize: "15px",
      fontWeight: "700",
      background: "#ffffff",
      color: "#14171f",
      border: "2px solid #1f3a2e",
    },
    leafStyle: {
      fontSize: "14px",
      background: "#ffffff",
      color: "#4b5563",
      border: "1px solid #d8d0c3",
    },
  },
  {
    id: "fine-line",
    name: "Fine Line",
    description: "Thin border, quiet contrast, compact review mode.",
    mainLinkStyle: 1,
    branchColors: ["#64748b", "#0f766e", "#475569", "#0369a1", "#6b7280"],
    rootStyle: {
      fontSize: "18px",
      fontWeight: "700",
      background: "#ffffff",
      color: "#111827",
      border: "1px solid #94a3b8",
    },
    mainStyle: {
      fontSize: "14px",
      fontWeight: "600",
      background: "#ffffff",
      color: "#111827",
      border: "1px solid #cbd5e1",
    },
    leafStyle: {
      fontSize: "13px",
      background: "#ffffff",
      color: "#475569",
      border: "1px solid #e2e8f0",
    },
  },
  {
    id: "hand-drawn",
    name: "Hand Drawn",
    description: "Marker-like branches, dashed borders, paper-friendly nodes.",
    mainLinkStyle: 3,
    branchColors: ["#0f766e", "#c2410c", "#2563eb", "#be123c", "#7c3aed", "#15803d"],
    rootStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "21px",
      fontWeight: "700",
      background: "#fff7d6",
      color: "#1f2937",
      border: "2px dashed #92400e",
    },
    mainStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "15px",
      fontWeight: "700",
      background: "#fffbeb",
      color: "#1f2937",
      border: "2px dashed #d97706",
    },
    leafStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      background: "#fffdf0",
      color: "#4b5563",
      border: "1px dashed #d6b45f",
    },
  },
  {
    id: "sticky",
    name: "Sticky",
    description: "Colorful note blocks for workshops and ideation.",
    mainLinkStyle: 2,
    branchColors: ["#f59e0b", "#84cc16", "#06b6d4", "#f43f5e", "#8b5cf6", "#10b981"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "#f97316",
      color: "#fff7ed",
      border: "2px solid #c2410c",
    },
    mainStyle: {
      fontSize: "15px",
      fontWeight: "700",
      background: "#fef3c7",
      color: "#422006",
      border: "1px solid #f59e0b",
    },
    leafStyle: {
      fontSize: "14px",
      background: "#ecfeff",
      color: "#164e63",
      border: "1px solid #67e8f9",
    },
  },
  {
    id: "technical",
    name: "Technical",
    description: "Monospace, dark-friendly, precise implementation map.",
    mainLinkStyle: 1,
    branchColors: ["#38bdf8", "#22d3ee", "#60a5fa", "#a78bfa", "#34d399"],
    rootStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "18px",
      fontWeight: "700",
      background: "#0f172a",
      color: "#e0f2fe",
      border: "1px solid #38bdf8",
    },
    mainStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "13px",
      fontWeight: "700",
      background: "#111827",
      color: "#dbeafe",
      border: "1px solid #2563eb",
    },
    leafStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "12px",
      background: "#172033",
      color: "#bae6fd",
      border: "1px solid #334155",
    },
  },
  {
    id: "presentation",
    name: "Presentation",
    description: "High-contrast nodes with larger labels for demos.",
    mainLinkStyle: 2,
    branchColors: ["#111827", "#b58b2a", "#0f766e", "#1d4ed8", "#be123c"],
    rootStyle: {
      fontSize: "24px",
      fontWeight: "700",
      background: "#111827",
      color: "#ffffff",
      border: "3px solid #111827",
    },
    mainStyle: {
      fontSize: "17px",
      fontWeight: "700",
      background: "#ffffff",
      color: "#111827",
      border: "2px solid #111827",
    },
    leafStyle: {
      fontSize: "15px",
      fontWeight: "600",
      background: "#fafafa",
      color: "#374151",
      border: "1px solid #a3a3a3",
    },
  },
  {
    id: "soft-block",
    name: "Soft Block",
    description: "Muted blocks with gentle contrast for creative planning.",
    mainLinkStyle: 2,
    branchColors: ["#db2777", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444", "#22c55e"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "#be185d",
      color: "#fff7fb",
      border: "2px solid #be185d",
    },
    mainStyle: {
      fontSize: "15px",
      fontWeight: "700",
      background: "#fce7f3",
      color: "#831843",
      border: "1px solid #f9a8d4",
    },
    leafStyle: {
      fontSize: "14px",
      background: "#f0fdfa",
      color: "#134e4a",
      border: "1px solid #99f6e4",
    },
  },
  {
    id: "grid-sketch",
    name: "Grid Sketch",
    description: "Chunky hand-drawn notebook nodes with dark leaf labels and soft center branches.",
    mainLinkStyle: 2,
    branchColors: ["#34474c", "#34474c", "#34474c", "#34474c", "#34474c", "#34474c"],
    rootStyle: {
      fontFamily: '"Comic Sans MS", "Comic Sans", ui-rounded, system-ui, sans-serif',
      fontSize: "44px",
      fontWeight: "900",
      background: "#34474c",
      color: "#ffffff",
      border: "0",
      width: "176px",
    },
    mainStyle: {
      fontFamily: '"Comic Sans MS", "Comic Sans", ui-rounded, system-ui, sans-serif',
      fontSize: "21px",
      fontWeight: "900",
      background: "#ded8cf",
      color: "#2f3f43",
      border: "0",
      width: "198px",
    },
    leafStyle: {
      fontFamily: '"Comic Sans MS", "Comic Sans", ui-rounded, system-ui, sans-serif',
      fontSize: "22px",
      fontWeight: "900",
      background: "#4b6066",
      color: "#ffffff",
      border: "0",
      width: "164px",
    },
  },
  {
    id: "outline",
    name: "Outline",
    description: "Mostly transparent nodes with strong outline hierarchy.",
    mainLinkStyle: 1,
    branchColors: ["#111827", "#334155", "#475569", "#64748b"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "transparent",
      color: "#111827",
      border: "2px solid #111827",
    },
    mainStyle: {
      fontSize: "15px",
      fontWeight: "700",
      background: "transparent",
      color: "#111827",
      border: "1px solid #334155",
    },
    leafStyle: {
      fontSize: "14px",
      background: "transparent",
      color: "#475569",
      border: "1px solid #cbd5e1",
    },
  },
  {
    id: "badge",
    name: "Badge",
    description: "Compact capsule nodes for pipeline and status maps.",
    mainLinkStyle: 2,
    branchColors: ["#16a34a", "#0f766e", "#65a30d", "#ca8a04", "#2563eb", "#7c3aed"],
    rootStyle: {
      fontSize: "19px",
      fontWeight: "700",
      background: "#065f46",
      color: "#ecfdf5",
      border: "2px solid #064e3b",
    },
    mainStyle: {
      fontSize: "14px",
      fontWeight: "700",
      background: "#dcfce7",
      color: "#14532d",
      border: "1px solid #86efac",
    },
    leafStyle: {
      fontSize: "13px",
      fontWeight: "600",
      background: "#ffffff",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
  },
  {
    id: "alert",
    name: "Alert",
    description: "Incident-style severity colors and dense technical labels.",
    mainLinkStyle: 1,
    branchColors: ["#f97316", "#ef4444", "#facc15", "#38bdf8", "#a3e635"],
    rootStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "18px",
      fontWeight: "700",
      background: "#f97316",
      color: "#111827",
      border: "2px solid #fed7aa",
    },
    mainStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "13px",
      fontWeight: "700",
      background: "#1f2937",
      color: "#fed7aa",
      border: "1px solid #f97316",
    },
    leafStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "12px",
      background: "#111827",
      color: "#fde68a",
      border: "1px solid #374151",
    },
  },
  {
    id: "clinical",
    name: "Clinical",
    description: "Calm healthcare operations styling with clear ownership.",
    mainLinkStyle: 2,
    branchColors: ["#0f766e", "#06b6d4", "#2563eb", "#14b8a6", "#65a30d"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "#0f766e",
      color: "#ecfeff",
      border: "2px solid #0f766e",
    },
    mainStyle: {
      fontSize: "15px",
      fontWeight: "700",
      background: "#ccfbf1",
      color: "#134e4a",
      border: "1px solid #5eead4",
    },
    leafStyle: {
      fontSize: "14px",
      background: "#ffffff",
      color: "#155e75",
      border: "1px solid #a5f3fc",
    },
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Table-like finance and legal review styling.",
    mainLinkStyle: 1,
    branchColors: ["#78350f", "#b45309", "#27272a", "#0f766e", "#1d4ed8"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "#27272a",
      color: "#fafafa",
      border: "2px solid #27272a",
    },
    mainStyle: {
      fontSize: "14px",
      fontWeight: "700",
      background: "#fef3c7",
      color: "#451a03",
      border: "1px solid #d97706",
    },
    leafStyle: {
      fontSize: "13px",
      background: "#fffef2",
      color: "#44403c",
      border: "1px solid #ead68a",
    },
  },
  {
    id: "marker",
    name: "Marker",
    description: "Bold warm colors for food, events, and workshop maps.",
    mainLinkStyle: 3,
    branchColors: ["#ea580c", "#f59e0b", "#16a34a", "#0891b2", "#db2777", "#7c3aed"],
    rootStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "22px",
      fontWeight: "700",
      background: "#c2410c",
      color: "#fff7ed",
      border: "3px solid #9a3412",
    },
    mainStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      fontWeight: "700",
      background: "#fed7aa",
      color: "#431407",
      border: "2px solid #fb923c",
    },
    leafStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      background: "#fff7ed",
      color: "#7c2d12",
      border: "1px solid #fdba74",
    },
  },
  {
    id: "classic-print",
    name: "Classic Print",
    description: "Serif labels, muted ink, archival document tone.",
    mainLinkStyle: 1,
    branchColors: ["#78350f", "#57534e", "#854d0e", "#365314", "#1f2937"],
    rootStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "21px",
      fontWeight: "700",
      background: "#fef3c7",
      color: "#451a03",
      border: "3px double #78350f",
    },
    mainStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "15px",
      fontWeight: "700",
      background: "#fff7d6",
      color: "#451a03",
      border: "1px solid #b45309",
    },
    leafStyle: {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      background: "#fffef2",
      color: "#57534e",
      border: "1px solid #ead68a",
    },
  },
  {
    id: "block-model",
    name: "Block Model",
    description: "Architectural blocks for systems, modules, and org maps.",
    mainLinkStyle: 1,
    branchColors: ["#111827", "#2563eb", "#0f766e", "#7c3aed", "#b42318"],
    rootStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "19px",
      fontWeight: "700",
      background: "#111827",
      color: "#ffffff",
      border: "3px solid #111827",
    },
    mainStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "14px",
      fontWeight: "700",
      background: "#f8fafc",
      color: "#111827",
      border: "2px solid #111827",
    },
    leafStyle: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "12px",
      background: "#ffffff",
      color: "#334155",
      border: "1px solid #64748b",
    },
  },
  {
    id: "print-proof",
    name: "Print Proof",
    description: "Crisp black-and-white map for export and handouts.",
    mainLinkStyle: 1,
    branchColors: ["#000000", "#262626", "#404040", "#525252"],
    rootStyle: {
      fontSize: "20px",
      fontWeight: "700",
      background: "#ffffff",
      color: "#000000",
      border: "2px solid #000000",
    },
    mainStyle: {
      fontSize: "15px",
      fontWeight: "700",
      background: "#ffffff",
      color: "#111111",
      border: "1px solid #111111",
    },
    leafStyle: {
      fontSize: "13px",
      background: "#ffffff",
      color: "#262626",
      border: "1px solid #737373",
    },
  },
];

export const shapePresets: MindmapShapePreset[] = [
  {
    id: "rounded",
    name: "Rounded",
    themeVars: {
      "--root-radius": "22px",
      "--main-radius": "14px",
      "--topic-padding": "7px",
    },
    rootStyle: {},
    mainStyle: {},
    leafStyle: {},
  },
  {
    id: "sharp",
    name: "Sharp",
    themeVars: {
      "--root-radius": "0px",
      "--main-radius": "0px",
      "--topic-padding": "5px",
    },
    rootStyle: {},
    mainStyle: {},
    leafStyle: {},
  },
  {
    id: "pill",
    name: "Pill",
    themeVars: {
      "--root-radius": "999px",
      "--main-radius": "999px",
      "--topic-padding": "7px 16px",
    },
    rootStyle: {},
    mainStyle: {},
    leafStyle: {},
  },
  {
    id: "square",
    name: "Square",
    themeVars: {
      "--root-radius": "2px",
      "--main-radius": "2px",
      "--topic-padding": "9px 14px",
    },
    rootStyle: { width: "172px" },
    mainStyle: { width: "150px" },
    leafStyle: { width: "132px" },
  },
  {
    id: "circle",
    name: "Circle",
    themeVars: {
      "--root-radius": "999px",
      "--main-radius": "999px",
      "--topic-padding": "12px 16px",
    },
    rootStyle: { width: "156px" },
    mainStyle: { width: "132px" },
    leafStyle: { width: "116px" },
  },
  {
    id: "index-card",
    name: "Index Card",
    themeVars: {
      "--root-radius": "8px",
      "--main-radius": "6px",
      "--topic-padding": "10px 18px",
    },
    rootStyle: { width: "190px" },
    mainStyle: { width: "170px" },
    leafStyle: { width: "150px" },
  },
  {
    id: "underlined",
    name: "Underlined",
    themeVars: {
      "--root-radius": "0px",
      "--main-radius": "0px",
      "--topic-padding": "4px 2px",
    },
    rootStyle: { background: "transparent", textDecoration: "underline" },
    mainStyle: { background: "transparent", textDecoration: "underline" },
    leafStyle: { background: "transparent" },
  },
  {
    id: "label-tag",
    name: "Label Tag",
    themeVars: {
      "--root-radius": "6px",
      "--main-radius": "4px",
      "--topic-padding": "4px 10px",
    },
    rootStyle: { width: "160px" },
    mainStyle: { width: "136px" },
    leafStyle: { width: "120px" },
  },
];

export const densityPresets: MindmapDensityPreset[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    fontScale: "large",
    nodeWidth: "168px",
    themeVars: {
      "--node-gap-x": "56px",
      "--node-gap-y": "14px",
      "--main-gap-x": "76px",
      "--main-gap-y": "46px",
      "--map-padding": "72px 96px",
    },
  },
  {
    id: "compact",
    name: "Compact",
    fontScale: "compact",
    nodeWidth: "128px",
    themeVars: {
      "--node-gap-x": "22px",
      "--node-gap-y": "6px",
      "--main-gap-x": "40px",
      "--main-gap-y": "24px",
      "--map-padding": "36px 48px",
    },
  },
  {
    id: "balanced",
    name: "Balanced",
    fontScale: "normal",
    themeVars: {
      "--node-gap-x": "42px",
      "--node-gap-y": "12px",
      "--main-gap-x": "64px",
      "--main-gap-y": "42px",
      "--map-padding": "64px 88px",
    },
  },
  {
    id: "spacious",
    name: "Spacious",
    fontScale: "large",
    nodeWidth: "180px",
    themeVars: {
      "--node-gap-x": "72px",
      "--node-gap-y": "20px",
      "--main-gap-x": "96px",
      "--main-gap-y": "62px",
      "--map-padding": "92px 120px",
    },
  },
  {
    id: "presentation",
    name: "Stage",
    fontScale: "large",
    nodeWidth: "220px",
    themeVars: {
      "--node-gap-x": "86px",
      "--node-gap-y": "24px",
      "--main-gap-x": "112px",
      "--main-gap-y": "74px",
      "--map-padding": "108px 148px",
    },
  },
];

export const typographyPresets: MindmapTypographyPreset[] = [
  {
    id: "style",
    name: "Style",
  },
  {
    id: "system",
    name: "System",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    rootWeight: "700",
    nodeWeight: "600",
  },
  {
    id: "editorial",
    name: "Editorial",
    fontFamily: "var(--font-fraunces), ui-serif, Georgia, serif",
    rootWeight: "700",
    nodeWeight: "600",
  },
  {
    id: "mono",
    name: "Mono",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    rootWeight: "700",
    nodeWeight: "600",
  },
  {
    id: "marker",
    name: "Marker",
    fontFamily: "Georgia, 'Times New Roman', serif",
    rootWeight: "700",
    nodeWeight: "700",
  },
  {
    id: "compact-ui",
    name: "Compact UI",
    fontFamily: "var(--font-nacelle), ui-sans-serif, system-ui, sans-serif",
    rootWeight: "600",
    nodeWeight: "600",
  },
];

export const branchPalettePresets: MindmapBranchPalettePreset[] = [
  {
    id: "signal",
    name: "Signal",
    colors: ["#d7ff45", "#50e3c2", "#ff6b4a", "#8ea7ff", "#f9c74f", "#f15bb5"],
  },
  {
    id: "theme",
    name: "Theme",
    colors: [],
  },
  {
    id: "rainbow",
    name: "Rainbow",
    colors: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6"],
  },
  {
    id: "earth",
    name: "Earth",
    colors: ["#1f3a2e", "#78716c", "#92400e", "#b58b2a", "#166534", "#0f766e"],
  },
  {
    id: "neon",
    name: "Neon",
    colors: ["#22d3ee", "#a3e635", "#f472b6", "#facc15", "#c084fc", "#fb7185"],
  },
  {
    id: "monochrome",
    name: "Mono",
    colors: ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af"],
  },
  {
    id: "risk",
    name: "Risk",
    colors: ["#b42318", "#f97316", "#ca8a04", "#0f766e", "#2563eb", "#4b5563"],
  },
  {
    id: "sketch-muted",
    name: "Sketch",
    colors: ["#34474c", "#6b7f84", "#cfc8bd", "#d7d7d3", "#4b6066", "#e3ddd4"],
  },
];

export const connectorPresets: MindmapConnectorPreset[] = [
  {
    id: "style",
    name: "Style",
    mainLinkStyle: 2,
  },
  {
    id: "balanced",
    name: "Balanced",
    mainLinkStyle: 2,
  },
  {
    id: "straight",
    name: "Straight",
    mainLinkStyle: 1,
    branchColors: ["#111827", "#374151", "#4b5563", "#6b7280"],
  },
  {
    id: "elbow",
    name: "Elbow",
    mainLinkStyle: 1,
    branchColors: ["#38bdf8", "#60a5fa", "#22d3ee", "#818cf8"],
  },
  {
    id: "sharp-angle",
    name: "Sharp Angle",
    mainLinkStyle: 3,
    branchColors: ["#b42318", "#f97316", "#ca8a04", "#64748b"],
  },
  {
    id: "rounded-flow",
    name: "Round Flow",
    mainLinkStyle: 2,
    branchColors: ["#0f766e", "#14b8a6", "#06b6d4", "#2563eb"],
  },
  {
    id: "sketch-arrow",
    name: "Sketch Arrow",
    mainLinkStyle: 2,
    branchColors: ["#34474c", "#34474c", "#34474c", "#34474c", "#34474c", "#34474c"],
    arrowMode: "primary",
    arrowStyle: {
      stroke: "#34474c",
      strokeWidth: 3.2,
      strokeLinecap: "round",
      opacity: 0.82,
    },
  },
  {
    id: "arrow-primary",
    name: "Arrow Cues",
    mainLinkStyle: 2,
    arrowMode: "primary",
    arrowStyle: {
      stroke: "#0f766e",
      strokeWidth: 2.4,
      strokeLinecap: "round",
      opacity: 0.72,
    },
  },
  {
    id: "arrow-sequence",
    name: "Arrow Sequence",
    mainLinkStyle: 1,
    arrowMode: "sequence",
    branchColors: ["#22d3ee", "#a3e635", "#f472b6", "#facc15"],
    arrowStyle: {
      stroke: "#22d3ee",
      strokeWidth: 2.8,
      strokeLinecap: "round",
      opacity: 0.82,
    },
  },
  {
    id: "two-way",
    name: "Two Way",
    mainLinkStyle: 2,
    arrowMode: "bidirectional",
    arrowStyle: {
      stroke: "#7c3aed",
      strokeWidth: 2.2,
      strokeDasharray: "6 4",
      strokeLinecap: "round",
      opacity: 0.7,
    },
  },
];

export const geometryPresets: MindmapGeometryPreset[] = [
  {
    id: "balanced-orbit",
    name: "Balanced Orbit",
    themeVars: {
      "--root-radius": "999px",
      "--main-radius": "999px",
      "--topic-padding": "9px 18px",
    },
    rootStyle: { width: "220px" },
    mainStyle: { width: "168px" },
    leafStyle: { width: "142px" },
  },
  {
    id: "style",
    name: "Style",
    themeVars: {},
    rootStyle: {},
    mainStyle: {},
    leafStyle: {},
  },
  {
    id: "square",
    name: "Square",
    themeVars: {
      "--root-radius": "0px",
      "--main-radius": "0px",
      "--topic-padding": "9px",
    },
    rootStyle: { width: "154px" },
    mainStyle: { width: "138px" },
    leafStyle: { width: "122px" },
  },
  {
    id: "rounded-rect",
    name: "Rounded Rect",
    themeVars: {
      "--root-radius": "18px",
      "--main-radius": "12px",
      "--topic-padding": "8px 14px",
    },
    rootStyle: { width: "190px" },
    mainStyle: { width: "170px" },
    leafStyle: { width: "150px" },
  },
  {
    id: "circle",
    name: "Circle",
    themeVars: {
      "--root-radius": "999px",
      "--main-radius": "999px",
      "--topic-padding": "14px",
    },
    rootStyle: { width: "132px" },
    mainStyle: { width: "116px" },
    leafStyle: { width: "104px" },
  },
  {
    id: "pill-system",
    name: "Pill System",
    themeVars: {
      "--root-radius": "999px",
      "--main-radius": "999px",
      "--topic-padding": "8px 18px",
    },
    rootStyle: { width: "210px" },
    mainStyle: { width: "180px" },
    leafStyle: { width: "150px" },
  },
  {
    id: "module-block",
    name: "Module Block",
    themeVars: {
      "--root-radius": "4px",
      "--main-radius": "2px",
      "--topic-padding": "10px 16px",
    },
    rootStyle: { width: "220px" },
    mainStyle: { width: "190px" },
    leafStyle: { width: "160px" },
  },
  {
    id: "rail",
    name: "Rail",
    themeVars: {
      "--root-radius": "0px",
      "--main-radius": "0px",
      "--topic-padding": "4px 8px",
    },
    rootStyle: { background: "transparent", width: "210px" },
    mainStyle: { background: "transparent", width: "180px" },
    leafStyle: { background: "transparent", width: "150px" },
  },
  {
    id: "card-stack",
    name: "Card Stack",
    themeVars: {
      "--root-radius": "10px",
      "--main-radius": "8px",
      "--topic-padding": "12px 16px",
    },
    rootStyle: { width: "210px" },
    mainStyle: { width: "180px" },
    leafStyle: { width: "156px" },
  },
  {
    id: "compact-chip",
    name: "Compact Chip",
    themeVars: {
      "--root-radius": "999px",
      "--main-radius": "999px",
      "--topic-padding": "4px 10px",
    },
    rootStyle: { width: "146px" },
    mainStyle: { width: "126px" },
    leafStyle: { width: "110px" },
  },
  {
    id: "flow-card",
    name: "Flow Card",
    themeVars: {
      "--root-radius": "12px",
      "--main-radius": "10px",
      "--topic-padding": "10px 18px",
    },
    rootStyle: { width: "230px" },
    mainStyle: { width: "198px" },
    leafStyle: { width: "166px" },
  },
];

export const finishPresets: MindmapFinishPreset[] = [
  {
    id: "no-border",
    name: "No Border",
    themeVars: {
      "--topic-padding": "9px 18px",
    },
    rootStyle: { border: "0", background: "#f5f7fb", color: "#0a0b0f" },
    mainStyle: { border: "0", background: "#17191f", color: "#f5f7fb" },
    leafStyle: { border: "0", background: "#242832", color: "#cdd4e4" },
  },
  {
    id: "style",
    name: "Style",
    themeVars: {},
    rootStyle: {},
    mainStyle: {},
    leafStyle: {},
  },
  {
    id: "hand-sketch",
    name: "Hand Sketch",
    themeVars: {
      "--topic-padding": "8px 14px",
    },
    rootStyle: { border: "2px dashed #92400e", background: "#fff7d6" },
    mainStyle: { border: "2px dashed #d97706", background: "#fffbeb" },
    leafStyle: { border: "1px dashed #d6b45f", background: "#fffdf0" },
  },
  {
    id: "ink-print",
    name: "Ink Print",
    themeVars: {},
    rootStyle: { border: "3px double #111827", background: "#ffffff", color: "#111827" },
    mainStyle: { border: "2px solid #111827", background: "#ffffff", color: "#111827" },
    leafStyle: { border: "1px solid #374151", background: "#ffffff", color: "#374151" },
  },
  {
    id: "vintage-print",
    name: "Vintage",
    themeVars: {},
    rootStyle: { border: "2px solid #78350f", background: "#fef3c7", color: "#451a03" },
    mainStyle: { border: "1px solid #b45309", background: "#fff7d6", color: "#451a03" },
    leafStyle: { border: "1px solid #ead68a", background: "#fffef2", color: "#57534e" },
  },
  {
    id: "solid-block",
    name: "Solid Block",
    themeVars: {},
    rootStyle: { border: "3px solid #111827", background: "#111827", color: "#ffffff" },
    mainStyle: { border: "2px solid #111827", background: "#f8fafc", color: "#111827" },
    leafStyle: { border: "1px solid #64748b", background: "#ffffff", color: "#334155" },
  },
  {
    id: "blueprint-grid",
    name: "Blueprint",
    themeVars: {},
    rootStyle: { border: "2px solid #38bdf8", background: "#0f172a", color: "#e0f2fe" },
    mainStyle: { border: "1px solid #60a5fa", background: "#111827", color: "#dbeafe" },
    leafStyle: { border: "1px solid #334155", background: "#172033", color: "#bae6fd" },
  },
  {
    id: "clean-print",
    name: "Clean Print",
    themeVars: {},
    rootStyle: { border: "1px solid #475569", background: "#ffffff", color: "#0f172a" },
    mainStyle: { border: "1px solid #cbd5e1", background: "#ffffff", color: "#111827" },
    leafStyle: { border: "1px solid #e2e8f0", background: "#ffffff", color: "#475569" },
  },
  {
    id: "neon-edge",
    name: "Neon Edge",
    themeVars: {},
    rootStyle: { border: "2px solid #22d3ee", background: "#020617", color: "#e0f2fe" },
    mainStyle: { border: "1px solid #a3e635", background: "#0f172a", color: "#f0fdf4" },
    leafStyle: { border: "1px solid #f472b6", background: "#111827", color: "#fdf2f8" },
  },
  {
    id: "grid-sketch",
    name: "Grid Sketch",
    themeVars: {
      "--root-radius": "22px 19px 24px 18px",
      "--main-radius": "19px 23px 18px 21px",
      "--topic-padding": "13px 24px",
      "--node-gap-x": "88px",
      "--node-gap-y": "22px",
      "--main-gap-x": "112px",
      "--main-gap-y": "68px",
      "--map-padding": "110px 150px",
    },
    rootStyle: {
      border: "0",
      background: "#34474c",
      color: "#ffffff",
    },
    mainStyle: {
      border: "0",
      background: "#ded8cf",
      color: "#2f3f43",
    },
    leafStyle: {
      border: "0",
      background: "#4b6066",
      color: "#ffffff",
    },
  },
];

export function applyMindmapTemplateStyle(
  data: MindElixirData,
  themeId: string,
  styleId: string,
  advanced: MindmapAdvancedOptions = {},
): MindElixirData {
  const visualTheme = visualThemes.find((item) => item.id === themeId) ?? visualThemes[0];
  const stylePreset = stylePresets.find((item) => item.id === styleId) ?? stylePresets[0];
  const shapePreset = getShapePreset(advanced.shapeId ?? "rounded");
  const densityPreset = getDensityPreset(advanced.densityId ?? "balanced");
  const typographyPreset = getTypographyPreset(advanced.typographyId ?? "style");
  const branchPalettePreset = getBranchPalettePreset(advanced.branchPaletteId ?? "theme");
  const connectorPreset = getConnectorPreset(advanced.connectorId ?? "style");
  const geometryPreset = getGeometryPreset(advanced.geometryId ?? "style");
  const finishPreset = getFinishPreset(advanced.finishId ?? "style");
  const clonedData = cloneMindElixirData(data);
  const branchColors =
    branchPalettePreset.colors.length > 0
      ? branchPalettePreset.colors
      : connectorPreset.branchColors ?? stylePreset.branchColors;
  const connectorArrows = createConnectorArrows(clonedData.nodeData, connectorPreset);

  return {
    ...clonedData,
    arrows:
      connectorArrows.length > 0
        ? [...(clonedData.arrows ?? []), ...connectorArrows]
        : clonedData.arrows,
    theme: {
      ...visualTheme.theme,
      cssVar: {
        ...visualTheme.theme.cssVar,
        ...shapePreset.themeVars,
        ...geometryPreset.themeVars,
        ...densityPreset.themeVars,
        ...finishPreset.themeVars,
      },
    },
    nodeData: applyNodeStyle(
      clonedData.nodeData,
      stylePreset,
      shapePreset,
      densityPreset,
      typographyPreset,
      geometryPreset,
        finishPreset,
        branchColors,
        advanced.maxExpandedDepth,
        0,
        0,
      ),
  };
}

export function getStylePreset(styleId: string): MindmapStylePreset {
  return stylePresets.find((item) => item.id === styleId) ?? stylePresets[0];
}

export function getShapePreset(shapeId: string): MindmapShapePreset {
  return shapePresets.find((item) => item.id === shapeId) ?? shapePresets[0];
}

export function getDensityPreset(densityId: string): MindmapDensityPreset {
  return densityPresets.find((item) => item.id === densityId) ?? densityPresets[1];
}

export function getTypographyPreset(typographyId: string): MindmapTypographyPreset {
  return typographyPresets.find((item) => item.id === typographyId) ?? typographyPresets[0];
}

export function getBranchPalettePreset(branchPaletteId: string): MindmapBranchPalettePreset {
  return branchPalettePresets.find((item) => item.id === branchPaletteId) ?? branchPalettePresets[0];
}

export function getConnectorPreset(connectorId: string): MindmapConnectorPreset {
  return connectorPresets.find((item) => item.id === connectorId) ?? connectorPresets[0];
}

export function getGeometryPreset(geometryId: string): MindmapGeometryPreset {
  return geometryPresets.find((item) => item.id === geometryId) ?? geometryPresets[0];
}

export function getFinishPreset(finishId: string): MindmapFinishPreset {
  return finishPresets.find((item) => item.id === finishId) ?? finishPresets[0];
}

function applyNodeStyle(
  node: NodeObj,
  preset: MindmapStylePreset,
  shape: MindmapShapePreset,
  density: MindmapDensityPreset,
  typography: MindmapTypographyPreset,
  geometry: MindmapGeometryPreset,
  finish: MindmapFinishPreset,
  branchColors: string[],
  maxExpandedDepth: number | undefined,
  depth: number,
  siblingIndex: number,
): NodeObj {
  const children = node.children ?? [];
  const style =
    depth === 0 ? preset.rootStyle : children.length > 0 ? preset.mainStyle : preset.leafStyle;
  const shapeStyle =
    depth === 0 ? shape.rootStyle : children.length > 0 ? shape.mainStyle : shape.leafStyle;
  const geometryStyle =
    depth === 0 ? geometry.rootStyle : children.length > 0 ? geometry.mainStyle : geometry.leafStyle;
  const finishStyle =
    depth === 0 ? finish.rootStyle : children.length > 0 ? finish.mainStyle : finish.leafStyle;
  const fontSizePatch = getDensityFontPatch(density.fontScale, depth, children.length > 0);

  return {
    ...node,
    style: {
      ...node.style,
      ...style,
      ...shapeStyle,
      ...geometryStyle,
      ...finishStyle,
      ...fontSizePatch,
      ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
      ...(typography.rootWeight || typography.nodeWeight
        ? { fontWeight: depth === 0 ? typography.rootWeight : typography.nodeWeight }
        : {}),
      ...(density.nodeWidth && depth > 0 ? { width: density.nodeWidth } : {}),
    },
    branchColor: depth === 0 ? undefined : branchColors[siblingIndex % branchColors.length],
    expanded:
      maxExpandedDepth && depth >= maxExpandedDepth && children.length > 0
        ? false
        : node.expanded,
    children: children.map((child, index) =>
      applyNodeStyle(
        child,
        preset,
        shape,
        density,
        typography,
        geometry,
        finish,
        branchColors,
        maxExpandedDepth,
        depth + 1,
        index,
      ),
    ),
  };
}

function createConnectorArrows(
  root: NodeObj,
  connector: MindmapConnectorPreset,
): NonNullable<MindElixirData["arrows"]> {
  const children = root.children ?? [];
  const baseStyle = connector.arrowStyle ?? {};

  if (!connector.arrowMode || connector.arrowMode === "none" || children.length === 0) {
    return [];
  }

  if (connector.arrowMode === "sequence") {
    return children.slice(0, -1).map((child, index) => ({
      id: `arrow-${connector.id}-${child.id}-${children[index + 1].id}`,
      label: "",
      from: child.id,
      to: children[index + 1].id,
      style: baseStyle,
    }));
  }

  return children.map((child) => ({
    id: `arrow-${connector.id}-${root.id}-${child.id}`,
    label: "",
    from: root.id,
    to: child.id,
    bidirectional: connector.arrowMode === "bidirectional",
    style: baseStyle,
  }));
}

function getDensityFontPatch(
  fontScale: MindmapDensityPreset["fontScale"],
  depth: number,
  hasChildren: boolean,
): NodeStylePatch {
  if (fontScale === "compact") {
    return { fontSize: depth === 0 ? "17px" : hasChildren ? "13px" : "12px" };
  }
  if (fontScale === "large") {
    return { fontSize: depth === 0 ? "24px" : hasChildren ? "17px" : "15px" };
  }
  return {};
}

function cloneMindElixirData(data: MindElixirData): MindElixirData {
  return JSON.parse(
    JSON.stringify(data, (key, value) => (key === "parent" ? undefined : value)),
  ) as MindElixirData;
}

function createTheme(
  name: string,
  type: "light" | "dark",
  config: {
    background: string;
    node: string;
    text: string;
    root: string;
    rootText: string;
    accent: string;
    border: string;
    palette: string[];
  },
): Theme {
  return {
    name,
    type,
    palette: config.palette,
    cssVar: {
      "--node-gap-x": "42px",
      "--node-gap-y": "12px",
      "--main-gap-x": "64px",
      "--main-gap-y": "42px",
      "--main-color": config.text,
      "--main-bgcolor": config.node,
      "--main-bgcolor-transparent": `${config.node}dd`,
      "--color": config.text,
      "--bgcolor": config.background,
      "--selected": config.accent,
      "--accent-color": config.accent,
      "--root-color": config.rootText,
      "--root-bgcolor": config.root,
      "--root-border-color": config.border,
      "--root-radius": "18px",
      "--main-radius": "12px",
      "--topic-padding": "6px",
      "--panel-color": config.text,
      "--panel-bgcolor": config.node,
      "--panel-border-color": config.border,
      "--map-padding": "64px 88px",
    },
  };
}
