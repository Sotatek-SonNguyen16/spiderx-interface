"use client";

const valuePoints = [
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Tasks grouped by project automatically",
    description: "No manual sorting. Tasks are organized by project context as soon as they're captured.",
    mobileDesc: "Organized by project automatically",
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Context preserved from source messages",
    description: "Every task keeps its original context — who said it, when, and why it matters.",
    mobileDesc: "Context preserved from source",
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Priority adapts as projects change",
    description: "AI re-evaluates urgency based on deadlines and project activity — automatically.",
    mobileDesc: "Priority adapts automatically",
  },
];

export default function ValueExpansion() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 md:mb-4 tracking-tight">
            <span className="md:hidden">Built for multiple projects</span>
            <span className="hidden md:inline">Built for multiple projects and changing contexts</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            <span className="md:hidden">Adapts to how you actually work.</span>
            <span className="hidden md:inline">SpiderX adapts to how you actually work — across teams, tools, and priorities.</span>
          </p>
        </div>

        {/* Mobile: Compact list */}
        <div className="md:hidden space-y-3">
          {valuePoints.map((point, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                {point.icon}
              </div>
              <span className="text-gray-700 text-sm font-medium">{point.mobileDesc}</span>
            </div>
          ))}
        </div>

        {/* Desktop: Full cards */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {valuePoints.map((point, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-5">
                {point.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
