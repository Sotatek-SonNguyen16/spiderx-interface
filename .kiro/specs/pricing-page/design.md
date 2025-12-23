# Design Document: SpiderX Pricing Page

## Overview

The SpiderX Pricing Page is a modern SaaS pricing interface designed to guide visitors through a clear decision-making journey: understanding value → comparing plans → building trust → taking action. The page emphasizes usage-based value metrics (AI credits, integrations, workspaces, history retention) rather than technical specifications, making it easy for visitors to self-identify the right plan.

The design follows a vertical flow optimized for conversion:
1. Hero with billing toggle and trust signals
2. Three-column plan cards (Free/Pro/Team) with Enterprise strip
3. Value strip reinforcing key benefits
4. Detailed comparison table grouped by capability
5. Optional add-ons for flexibility
6. FAQ addressing purchase barriers
7. Trust & security section
8. Final CTA with clear next steps

The visual design maintains consistency with the existing SpiderX landing page (v2), using the established color system: neutral base (white/light gray), electric blue primary (#2563eb), purple AI accents, and minimal use of orange for highlights.

## Architecture

### Component Hierarchy

```
PricingPage
├── Header (reused from landing)
├── HeroSection
│   ├── Title & Subtitle
│   ├── BillingToggle
│   └── ProductMockup (optional)
├── PlanCardsSection
│   ├── PlanCard (Free)
│   ├── PlanCard (Pro) [Recommended]
│   ├── PlanCard (Team)
│   └── EnterpriseStrip
├── ValueStrip
├── CompareTable
│   ├── TableHeader (sticky)
│   └── FeatureGroups (5 groups)
├── AddOnsSection
│   └── AddOnCard[] (3 cards)
├── FAQSection
│   └── FAQItem[] (6-8 items, accordion)
├── TrustSection
├── FinalCTASection
└── Footer (reused from landing)
```

### State Management

The pricing page requires minimal state management:

**Local Component State:**
- `billingPeriod`: 'monthly' | 'yearly' - Controls price display across all plan cards
- `expandedFAQ`: string | null - Tracks which FAQ item is currently expanded
- `activeAnchor`: string - Tracks which section is currently in viewport for anchor tab highlighting

**No Global State Required:** The pricing page is primarily presentational with no user data persistence needs.

### Routing

The pricing page will be accessible at `/pricing` route. Anchor navigation will use hash fragments:
- `/pricing#plans` - Scrolls to plan cards
- `/pricing#compare` - Scrolls to comparison table
- `/pricing#faq` - Scrolls to FAQ section
- `/pricing#security` - Scrolls to trust section

## Components and Interfaces

### 1. BillingToggle Component

**Purpose:** Allows users to switch between monthly and yearly pricing views.

**Props:**
```typescript
interface BillingToggleProps {
  value: 'monthly' | 'yearly';
  onChange: (value: 'monthly' | 'yearly') => void;
}
```

**Behavior:**
- Displays two options: "Monthly" and "Yearly (Save 20%)"
- Animates transition between states with 200ms easeOut
- Highlights selected option with primary blue background
- Displays "Cancel anytime" microcopy below toggle

**Styling:**
- Rounded pill shape with border
- Selected state: blue background, white text
- Unselected state: transparent background, gray text
- Smooth sliding indicator animation

### 2. PlanCard Component

**Purpose:** Displays a single pricing tier with features and CTA.

**Props:**
```typescript
interface PlanCardProps {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  bestFor: string;
  limits: string[];
  features: string[];
  ctaText: string;
  ctaAction: () => void;
  recommended?: boolean;
  billingPeriod: 'monthly' | 'yearly';
}
```

**Layout Structure:**
1. Badge (if recommended)
2. Plan name (h3)
3. Price display (large, bold)
4. "Best for" description (gray text)
5. Key limits (bulleted list, compact)
6. CTA button (primary or secondary)
7. Features list (5-7 items with checkmarks)

**Styling:**
- 16px border radius
- Soft shadow (elevated on hover)
- Equal height cards using flexbox
- Recommended card: primary blue border + subtle glow
- Standard cards: light gray border

### 3. CompareTable Component

**Purpose:** Displays detailed feature comparison across plans.

**Props:**
```typescript
interface CompareTableProps {
  featureGroups: FeatureGroup[];
}

interface FeatureGroup {
  name: string;
  features: Feature[];
}

interface Feature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  team: boolean | string;
}
```

**Desktop Layout:**
- Sticky header with plan names
- Grouped rows with category headers
- Check icons for boolean features
- Text labels for limit-based features (e.g., "Up to 3 integrations")

**Mobile Layout:**
- Accordion grouped by category
- Each category expands to show features
- Plan comparison within each expanded section

### 4. FAQItem Component

**Purpose:** Displays a single FAQ question/answer pair with accordion behavior.

**Props:**
```typescript
interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}
```

**Behavior:**
- Click question to expand/collapse
- Smooth height animation (300ms)
- Rotate chevron icon on expand
- Only one item expanded at a time (controlled by parent)

### 5. AnchorTabs Component

**Purpose:** Provides sticky navigation to page sections.

**Props:**
```typescript
interface AnchorTabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
}
```

**Behavior:**
- Sticks to top of viewport on scroll
- Highlights active section based on scroll position
- Smooth scroll to section on click
- Uses Intersection Observer API for active state

## Data Models

### PricingConfig

The pricing configuration will be stored as a TypeScript constant for easy updates:

```typescript
export const PRICING_CONFIG = {
  plans: {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      bestFor: 'Try SpiderX on one account',
      limits: [
        '1 integration',
        '1 workspace',
        '7-day history',
        'AI credits: 200/mo',
        'Manual sync only'
      ],
      features: [
        'AI task detection (basic)',
        'Queue review (swipe/list)',
        'Basic tags',
        'Duplicate safety (basic)',
        'Email support (standard)'
      ],
      ctaText: 'Start free',
      ctaLink: '/signup'
    },
    pro: {
      name: 'Pro',
      price: { monthly: 12, yearly: 10 },
      bestFor: 'Individuals managing multiple projects',
      limits: [
        'Up to 3 integrations',
        '3 workspaces',
        '90-day history',
        'AI credits: 2,000/mo',
        'Auto-sync hourly'
      ],
      features: [
        'AI extracts due date/assignee/priority',
        'Context grouping',
        'Advanced filters',
        'Smart suggestions',
        'Duplicate prevention (enhanced)',
        'Export CSV',
        'Priority support'
      ],
      ctaText: 'Get Pro',
      ctaLink: '/signup?plan=pro',
      recommended: true
    },
    team: {
      name: 'Team',
      price: { monthly: 20, yearly: 16 },
      bestFor: 'Teams that share context and workload',
      limits: [
        'Up to 8 integrations',
        'Unlimited workspaces',
        '365-day history',
        'AI credits: 8,000/mo',
        'Auto-sync every 15 min'
      ],
      features: [
        'Shared spaces',
        'Roles/permissions',
        'Team queue review',
        'Assignments & mentions',
        'Team analytics (basic)',
        'Audit log (basic)',
        'Shared templates/rules',
        'Priority support'
      ],
      ctaText: 'Start Team',
      ctaLink: '/signup?plan=team'
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom',
      bestFor: 'Security & compliance requirements',
      features: [
        'SSO/SAML',
        'SCIM',
        'DPA',
        'Custom retention',
        'Dedicated support',
        'SLA',
        'Security review'
      ],
      ctaText: 'Contact sales',
      ctaLink: '/contact-sales'
    }
  },
  
  compareTable: {
    groups: [
      {
        name: 'Capture & Sync',
        features: [
          { name: 'Manual sync', free: true, pro: true, team: true },
          { name: 'Auto-sync', free: false, pro: 'Hourly', team: 'Every 15 min' },
          { name: 'Time-range sync', free: false, pro: true, team: true },
          { name: 'Multi-account connectors', free: false, pro: false, team: true }
        ]
      },
      {
        name: 'AI Extraction',
        features: [
          { name: 'AI detect tasks', free: true, pro: true, team: true },
          { name: 'Extract due date & assignee', free: false, pro: true, team: true },
          { name: 'Priority scoring', free: false, pro: true, team: true },
          { name: 'Bulk generate subtasks', free: false, pro: false, team: true },
          { name: 'AI credits/month', free: '200', pro: '2,000', team: '8,000' }
        ]
      },
      {
        name: 'Organization',
        features: [
          { name: 'Queue swipe review', free: true, pro: true, team: true },
          { name: 'Project/context grouping', free: false, pro: true, team: true },
          { name: 'Advanced filters & saved views', free: false, pro: true, team: true },
          { name: 'Dedup enhanced', free: false, pro: true, team: true },
          { name: 'Export', free: false, pro: true, team: true }
        ]
      },
      {
        name: 'Team & Admin',
        features: [
          { name: 'Shared workspaces', free: false, pro: false, team: true },
          { name: 'Roles/permissions', free: false, pro: false, team: true },
          { name: 'Audit log', free: false, pro: false, team: true },
          { name: 'Admin dashboard', free: false, pro: false, team: true }
        ]
      },
      {
        name: 'Security',
        features: [
          { name: 'Standard encryption', free: true, pro: true, team: true },
          { name: 'OAuth connectors', free: false, pro: true, team: true },
          { name: 'SSO/SAML', free: false, pro: false, team: 'Enterprise only' }
        ]
      }
    ]
  },
  
  addOns: [
    {
      name: 'Extra AI extraction credits',
      description: 'Add more AI credits to your monthly quota',
      icon: 'sparkles'
    },
    {
      name: 'Additional integrations',
      description: 'Connect more platforms beyond your plan limit',
      icon: 'link'
    },
    {
      name: 'Extended history retention',
      description: 'Keep sync history for longer periods',
      icon: 'clock'
    }
  ],
  
  faqs: [
    {
      question: 'What counts as an AI extraction?',
      answer: 'One AI credit is used each time SpiderX extracts or updates a task using AI. This includes detecting tasks from messages, extracting due dates, assignees, or priorities. AI credits reset monthly.'
    },
    {
      question: 'Will it create duplicate tasks?',
      answer: 'No. SpiderX uses intelligent duplicate detection to prevent creating the same task multiple times. Pro and Team plans include enhanced duplicate prevention that learns from your patterns.'
    },
    {
      question: 'Can I stop sync anytime?',
      answer: 'Yes. You can pause or stop syncing from any integration at any time. You can also disconnect integrations completely. Your existing tasks remain in SpiderX.'
    },
    {
      question: 'Does SpiderX post to my accounts?',
      answer: 'No. SpiderX only reads from your connected accounts. We never send messages or modify your emails/chats without your explicit action.'
    },
    {
      question: 'How does billing work per seat?',
      answer: 'Pro and Team plans are billed per user per month. You can add or remove team members anytime, and billing adjusts automatically on your next cycle.'
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your current billing period.'
    }
  ],
  
  trustStatements: [
    {
      icon: 'lock',
      text: 'Permissions-based access'
    },
    {
      icon: 'shield',
      text: 'We never send messages without your action'
    },
    {
      icon: 'key',
      text: 'Data encrypted in transit/at rest'
    }
  ]
} as const;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Billing Toggle Updates All Prices

*For any* billing period selection (monthly or yearly), when the billing toggle is changed, all displayed prices across all plan cards should update to reflect the selected billing period.

**Validates: Requirements 2.3, 2.4**

### Property 2: Anchor Tab Navigation

*For any* anchor tab in the navigation, when clicked, the page should scroll to the corresponding section.

**Validates: Requirements 1.5**

### Property 3: Plan Card Element Order

*For any* plan card (Free, Pro, Team), the elements should appear in this order: plan name, price, "Best for" description, key limits, CTA button, features list.

**Validates: Requirements 3.7**

### Property 4: Plan Cards Equal Height

*For all* plan cards displayed in the same row, the cards should have equal height regardless of content length.

**Validates: Requirements 3.9**

### Property 5: Compare Table Boolean Features

*For any* feature in the compare table that has boolean availability (available or not available), the table should display a check icon when available and no icon when unavailable.

**Validates: Requirements 9.9**

### Property 6: Compare Table Limit Features

*For any* feature in the compare table that has limit-based availability (e.g., "Up to 3 integrations", "Hourly"), the table should display the limit text instead of a simple check icon.

**Validates: Requirements 9.10**

### Property 7: FAQ Accordion Behavior

*For any* FAQ item, when clicked, it should expand to show the answer if collapsed, or collapse to hide the answer if expanded.

**Validates: Requirements 16.8, 16.9**

### Property 8: Plan Card Hover Elevation

*For any* plan card, when hovered, the card should elevate with increased shadow styling.

**Validates: Requirements 20.1**

### Property 9: CTA Button Loading State

*For any* CTA button, when clicked, the button should display a loading state while the action is processing.

**Validates: Requirements 20.2**

### Property 10: Anchor Tab Smooth Scroll

*For any* anchor tab navigation action, the scroll to the target section should use smooth scroll behavior.

**Validates: Requirements 20.5**

### Property 11: AI Credits Tooltip Behavior

*For any* "AI credits" text element, when hovered, a tooltip should appear, and when the hover ends, the tooltip should disappear.

**Validates: Requirements 21.1, 21.4**

### Property 12: Sticky Anchor Tabs

*For any* scroll position on the page, the anchor tabs should remain visible at the top of the viewport.

**Validates: Requirements 1.6**

**Note on Testing Approach:**

Most requirements in this specification are concrete examples testing specific content, layout, and styling (e.g., "display the title 'Pricing that scales with your workflow'", "Free plan shows $0", "Pro plan has 7 features"). These are best validated through unit tests that check for specific values and DOM structure.

The properties listed above represent universal behaviors that should hold across multiple instances or states. These are ideal candidates for property-based testing where we can generate variations and ensure the behavior holds consistently.



## Error Handling

The pricing page is primarily a static presentational page with minimal error scenarios. However, the following error cases should be handled:

### 1. CTA Button Click Failures

**Scenario:** User clicks a CTA button (e.g., "Start free", "Get Pro") but navigation fails.

**Handling:**
- Display loading state on button
- If navigation fails after 5 seconds, show error toast: "Unable to proceed. Please try again."
- Log error to monitoring service
- Reset button to normal state
- Allow user to retry

### 2. Anchor Navigation Failures

**Scenario:** User clicks an anchor tab but the target section doesn't exist or scroll fails.

**Handling:**
- Gracefully fail without showing error to user
- Log warning to console for debugging
- Highlight the clicked tab anyway to maintain UI consistency

### 3. Responsive Layout Issues

**Scenario:** Page is viewed on an unsupported or very small viewport.

**Handling:**
- Ensure minimum viewport width of 320px is supported
- Stack all elements vertically on very small screens
- Maintain readability with appropriate font sizes
- Test on common mobile devices (iPhone SE, iPhone 12, Android devices)

### 4. Missing Configuration Data

**Scenario:** Pricing configuration data is incomplete or malformed.

**Handling:**
- Validate PRICING_CONFIG at build time using TypeScript types
- If runtime data is missing, display fallback message: "Pricing information temporarily unavailable. Please contact sales."
- Log error to monitoring service
- Provide contact sales link as fallback CTA

### 5. Animation Performance Issues

**Scenario:** Animations cause performance issues on low-end devices.

**Handling:**
- Respect `prefers-reduced-motion` media query
- Disable animations if user has motion sensitivity settings enabled
- Use CSS transforms for animations (GPU-accelerated)
- Provide instant state changes as fallback

## Testing Strategy

### Unit Testing Approach

The pricing page requires comprehensive unit tests for specific content, layout, and behavior. Unit tests should focus on:

**Component Rendering:**
- Test that each component renders without errors
- Verify specific text content appears (titles, descriptions, feature lists)
- Check that correct number of elements render (4 plans, 5 compare groups, 6-8 FAQs)
- Validate CSS classes are applied correctly

**State Management:**
- Test billing toggle state changes
- Verify price updates when billing period changes
- Test FAQ accordion expand/collapse state
- Verify anchor tab active state tracking

**User Interactions:**
- Test button click handlers are called
- Verify anchor tab navigation triggers scroll
- Test FAQ item click toggles expansion
- Verify hover states apply correct styling

**Responsive Behavior:**
- Test mobile layout transformations
- Verify plan cards stack vertically on mobile
- Test compare table converts to accordion on mobile
- Verify sticky elements remain positioned correctly

**Example Unit Tests:**

```typescript
describe('PlanCard', () => {
  it('should display Free plan with correct content', () => {
    const { getByText } = render(<PlanCard {...PRICING_CONFIG.plans.free} />);
    expect(getByText('Free')).toBeInTheDocument();
    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('1 integration')).toBeInTheDocument();
  });

  it('should display Pro plan with recommended badge', () => {
    const { getByText } = render(<PlanCard {...PRICING_CONFIG.plans.pro} />);
    expect(getByText('Recommended')).toBeInTheDocument();
  });

  it('should update price when billing period changes', () => {
    const { getByText, rerender } = render(
      <PlanCard {...PRICING_CONFIG.plans.pro} billingPeriod="monthly" />
    );
    expect(getByText('$12/user/mo')).toBeInTheDocument();
    
    rerender(<PlanCard {...PRICING_CONFIG.plans.pro} billingPeriod="yearly" />);
    expect(getByText('$10/user/mo')).toBeInTheDocument();
  });
});

describe('BillingToggle', () => {
  it('should default to monthly', () => {
    const { getByRole } = render(<BillingToggle value="monthly" onChange={jest.fn()} />);
    const monthlyButton = getByRole('button', { name: /monthly/i });
    expect(monthlyButton).toHaveClass('active');
  });

  it('should call onChange when yearly is clicked', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<BillingToggle value="monthly" onChange={onChange} />);
    const yearlyButton = getByRole('button', { name: /yearly/i });
    fireEvent.click(yearlyButton);
    expect(onChange).toHaveBeenCalledWith('yearly');
  });
});

describe('FAQItem', () => {
  it('should expand when clicked while collapsed', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <FAQItem 
        question="What counts as an AI extraction?"
        answer="One AI credit is used..."
        isExpanded={false}
        onToggle={onToggle}
      />
    );
    fireEvent.click(getByText('What counts as an AI extraction?'));
    expect(onToggle).toHaveBeenCalled();
  });
});
```

### Property-Based Testing Approach

Property-based tests validate universal behaviors across multiple instances. These tests should use a property-based testing library (e.g., `fast-check` for TypeScript/JavaScript).

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: pricing-page, Property {number}: {property_text}`

**Property Test Examples:**

```typescript
import fc from 'fast-check';

describe('Property Tests: Pricing Page', () => {
  test('Property 1: Billing toggle updates all prices', () => {
    // Feature: pricing-page, Property 1: Billing Toggle Updates All Prices
    fc.assert(
      fc.property(
        fc.constantFrom('monthly', 'yearly'),
        (billingPeriod) => {
          const { getAllByTestId } = render(<PricingPage />);
          const toggle = getByRole('button', { name: new RegExp(billingPeriod, 'i') });
          fireEvent.click(toggle);
          
          const priceElements = getAllByTestId('plan-price');
          const expectedPrices = billingPeriod === 'monthly' 
            ? ['$0', '$12/user/mo', '$20/user/mo']
            : ['$0', '$10/user/mo', '$16/user/mo'];
          
          priceElements.forEach((el, idx) => {
            expect(el).toHaveTextContent(expectedPrices[idx]);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Plan card element order', () => {
    // Feature: pricing-page, Property 3: Plan Card Element Order
    fc.assert(
      fc.property(
        fc.constantFrom('free', 'pro', 'team'),
        (planKey) => {
          const plan = PRICING_CONFIG.plans[planKey];
          const { container } = render(<PlanCard {...plan} />);
          
          const elements = container.querySelectorAll('[data-element]');
          const order = Array.from(elements).map(el => el.getAttribute('data-element'));
          
          expect(order).toEqual([
            'plan-name',
            'price',
            'best-for',
            'limits',
            'cta',
            'features'
          ]);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: FAQ accordion behavior', () => {
    // Feature: pricing-page, Property 7: FAQ Accordion Behavior
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: PRICING_CONFIG.faqs.length - 1 }),
        (faqIndex) => {
          const { getByText, queryByText } = render(<FAQSection />);
          const question = PRICING_CONFIG.faqs[faqIndex].question;
          const answer = PRICING_CONFIG.faqs[faqIndex].answer;
          
          // Initially collapsed
          expect(queryByText(answer)).not.toBeVisible();
          
          // Click to expand
          fireEvent.click(getByText(question));
          expect(getByText(answer)).toBeVisible();
          
          // Click to collapse
          fireEvent.click(getByText(question));
          expect(queryByText(answer)).not.toBeVisible();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8: Plan card hover elevation', () => {
    // Feature: pricing-page, Property 8: Plan Card Hover Elevation
    fc.assert(
      fc.property(
        fc.constantFrom('free', 'pro', 'team'),
        (planKey) => {
          const plan = PRICING_CONFIG.plans[planKey];
          const { container } = render(<PlanCard {...plan} />);
          const card = container.firstChild;
          
          const initialShadow = window.getComputedStyle(card).boxShadow;
          
          fireEvent.mouseEnter(card);
          const hoverShadow = window.getComputedStyle(card).boxShadow;
          
          // Shadow should change on hover (indicating elevation)
          expect(hoverShadow).not.toBe(initialShadow);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

Integration tests should verify that components work together correctly:

**Page-Level Tests:**
- Test full page renders without errors
- Verify all sections appear in correct order
- Test navigation between sections via anchor tabs
- Verify billing toggle affects all plan cards simultaneously

**User Journey Tests:**
- Test complete user flow: land on page → compare plans → read FAQ → click CTA
- Verify mobile responsive transformations work end-to-end
- Test keyboard navigation through interactive elements

### Visual Regression Testing

Use visual regression testing tools (e.g., Percy, Chromatic) to catch unintended visual changes:

**Snapshots to Capture:**
- Full page on desktop (1920x1080)
- Full page on tablet (768x1024)
- Full page on mobile (375x667)
- Plan cards section with monthly pricing
- Plan cards section with yearly pricing
- Compare table expanded
- FAQ section with one item expanded
- Hover states for plan cards and buttons

### Accessibility Testing

Ensure the pricing page meets WCAG 2.1 AA standards:

**Automated Tests:**
- Run axe-core or similar tool on rendered page
- Check for proper heading hierarchy (h1 → h2 → h3)
- Verify all interactive elements are keyboard accessible
- Check color contrast ratios meet minimum requirements

**Manual Tests:**
- Test keyboard navigation through all interactive elements
- Verify screen reader announces all content correctly
- Test with browser zoom at 200%
- Verify focus indicators are visible

### Performance Testing

Monitor and optimize page performance:

**Metrics to Track:**
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1

**Optimization Strategies:**
- Lazy load images below the fold
- Use CSS transforms for animations (GPU-accelerated)
- Minimize JavaScript bundle size
- Implement code splitting for non-critical components

### Test Coverage Goals

- Unit test coverage: > 80% for all components
- Property test coverage: All 12 properties implemented
- Integration test coverage: All major user flows
- Visual regression: All responsive breakpoints
- Accessibility: 100% automated checks passing

### Continuous Testing

- Run unit tests on every commit
- Run property tests on every pull request
- Run visual regression tests on staging deployment
- Run accessibility tests weekly
- Monitor performance metrics in production
