import { FeatureCard } from '../molecules';

const problemFeatures = [
  {
    title: 'Time Wasted',
    description: 'Manually copying tasks from emails and chats to your todo app. Every. Single. Day.',
    badge: 'Daily Todo Capture',
    badgeVariant: 'blue' as const,
    visual: (
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl blur-2xl opacity-60" />
        <div className="relative grid grid-cols-4 gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg ${
                i === 4
                  ? 'bg-gray-800 shadow-lg'
                  : i === 5
                    ? 'bg-gray-600'
                    : i === 9
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Missing Tasks',
    description: 'Important but not urgent tasks slip through when juggling 3+ projects simultaneously.',
    badge: 'AI Prioritize',
    badgeVariant: 'purple' as const,
    visual: (
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-2xl opacity-60" />
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-2 bg-gray-300 top-0 left-1/2"
                style={{
                  transform: `rotate(${i * 30}deg) translateX(-50%)`,
                  transformOrigin: 'center 64px',
                }}
              />
            ))}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                  7
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold shadow-xl">
                  8
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm">
                  9
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Context Chaos',
    description: 'Scattered todos across Gmail, Slack, WhatsApp. No single source of truth.',
    badge: 'Team Sync & Check-ins',
    badgeVariant: 'cyan' as const,
    visual: (
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl blur-2xl opacity-60" />
        <div className="relative">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg ${
                  i === 6
                    ? 'bg-gray-800 flex items-center justify-center text-white font-mono text-sm shadow-2xl scale-110'
                    : 'bg-gray-200'
                }`}
              >
                {i === 6 && 'A'}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function ProblemStatement() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Managing multiple projects?
            <br />
            <span className="text-blue-600">These problems sound familiar.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problemFeatures.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

