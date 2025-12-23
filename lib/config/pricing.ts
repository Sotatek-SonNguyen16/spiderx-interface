/**
 * Pricing Configuration for SpiderX
 * 
 * This file contains all pricing-related data including plans, features,
 * comparison table, FAQs, and trust statements. Update this file to change
 * pricing without modifying component code.
 */

export interface PlanLimits {
  integrations: string;
  workspaces: string;
  history: string;
  aiCredits: string;
  sync: string;
}

export interface Plan {
  name: string;
  price: {
    monthly: number | string;
    yearly: number | string;
  };
  bestFor: string;
  limits?: PlanLimits;
  features: string[];
  ctaText: string;
  ctaLink: string;
  recommended?: boolean;
}

export interface FeatureRow {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  team: boolean | string;
}

export interface FeatureGroup {
  name: string;
  features: FeatureRow[];
}

export interface AddOn {
  name: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface TrustStatement {
  icon: string;
  text: string;
}

export interface PricingConfig {
  plans: {
    free: Plan;
    pro: Plan;
    team: Plan;
    enterprise: Plan;
  };
  compareTable: {
    groups: FeatureGroup[];
  };
  addOns: AddOn[];
  faqs: FAQ[];
  trustStatements: TrustStatement[];
}

export const PRICING_CONFIG: PricingConfig = {
  plans: {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      bestFor: 'Try SpiderX on one account',
      limits: {
        integrations: '1 integration',
        workspaces: '1 workspace',
        history: '7-day history',
        aiCredits: 'AI credits: 200/mo',
        sync: 'Manual sync only'
      },
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
      limits: {
        integrations: 'Up to 3 integrations',
        workspaces: '3 workspaces',
        history: '90-day history',
        aiCredits: 'AI credits: 2,000/mo',
        sync: 'Auto-sync hourly'
      },
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
      limits: {
        integrations: 'Up to 8 integrations',
        workspaces: 'Unlimited workspaces',
        history: '365-day history',
        aiCredits: 'AI credits: 8,000/mo',
        sync: 'Auto-sync every 15 min'
      },
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
      price: { monthly: 'Custom', yearly: 'Custom' },
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
