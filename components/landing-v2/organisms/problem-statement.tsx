import { FeatureCard } from '../molecules';

const problemFeatures = [
  {
    title: 'Time wasted copying tasks',
    description: 'Manually moving tasks from emails and chats into your todo app steals time — every single day.',
    badge: 'Daily Task Capture',
    badgeVariant: 'blue' as const,
    mobileTitle: 'Tasks scattered across tools',
  },
  {
    title: 'Important tasks slip through',
    description: 'Non-urgent but critical tasks get lost when you\'re juggling multiple projects at once.',
    badge: 'AI Prioritization',
    badgeVariant: 'purple' as const,
    mobileTitle: 'Important tasks get buried',
  },
  {
    title: 'No single source of truth',
    description: 'Tasks are scattered across Gmail, Slack, WhatsApp — with no clear ownership or context.',
    badge: 'Context Awareness',
    badgeVariant: 'cyan' as const,
    mobileTitle: 'No clear ownership',
  },
];

const solutionPoints = [
  { text: 'One task inbox' },
  { text: 'Context preserved' },
  { text: 'Nothing slips through' },
];

export default function ProblemStatement() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:block text-center mb-16">
          <p className="text-sm font-medium text-brand-600 uppercase tracking-wider mb-3">
            Why this matters
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            You just saw how SpiderX captures tasks.
            <br />
            <span className="text-gray-500">Here's why that matters.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tasks don't get missed because you forget —
            they get missed because they're scattered everywhere.
          </p>
        </div>

        {/* Mobile: Compact pain → relief layout */}
        <div className="md:hidden">
          {/* Pain section */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why teams miss tasks</h3>
          <div className="space-y-2 mb-8">
            {problemFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">{feature.mobileTitle}</span>
              </div>
            ))}
          </div>

          {/* Relief section */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How SpiderX helps</h3>
          <div className="space-y-2">
            {solutionPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">{point.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Full cards */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
          {problemFeatures.map((feature, i) => (
            <FeatureCard 
              key={i} 
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
              badgeVariant={feature.badgeVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
