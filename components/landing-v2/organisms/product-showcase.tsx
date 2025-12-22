"use client";

import Image from 'next/image';

interface AnnotationProps {
  number: string;
  title: string;
  description: string;
}

function Annotation({ number, title, description }: AnnotationProps) {
  return (
    <div className="flex gap-3 md:gap-4 items-start">
      <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs md:text-sm font-semibold shadow-sm">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">{title}</h4>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Mobile step cards
interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold">
        {step}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

const annotations = [
  {
    number: "1",
    title: "Detect tasks directly from emails & chats",
    description: "SpiderX automatically detects tasks as they appear in emails and messages.",
  },
  {
    number: "2",
    title: "AI understands context — not just keywords",
    description: "AI understands intent and responsibility, even when tasks aren't explicitly written.",
  },
  {
    number: "3",
    title: "Deadlines & priority are extracted automatically",
    description: "Deadlines and urgency are inferred automatically — no manual input required.",
  },
  {
    number: "4",
    title: "Tasks are normalized into one clean system",
    description: "Tasks from different tools are converted into a single, consistent task format.",
  },
  {
    number: "5",
    title: "Always visible, without breaking focus",
    description: "SpiderX works quietly in the sidebar so you never lose focus or context.",
  },
];

const mobileSteps = [
  {
    step: 1,
    title: "Detects tasks",
    description: "From emails & chat messages",
  },
  {
    step: 2,
    title: "Understands context",
    description: "Who needs to do what, and when",
  },
  {
    step: 3,
    title: "Organizes automatically",
    description: "Grouped by project & priority",
  },
];

export default function ProductShowcase() {
  return (
    <section id="product-showcase" className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 md:mb-4 tracking-tight">
            <span className="md:hidden">How SpiderX works</span>
            <span className="hidden md:inline">See how SpiderX captures tasks while you work</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            <span className="md:hidden">AI captures and organizes your tasks automatically.</span>
            <span className="hidden md:inline">No switching tabs. No manual organizing. Everything is captured and structured automatically.</span>
          </p>
        </div>

        {/* MOBILE: Step-based flow */}
        <div className="md:hidden space-y-3 mb-8">
          {mobileSteps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>

        {/* MOBILE: Single screenshot */}
        <div className="md:hidden">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-lg border border-gray-200">
            <Image
              src="/images/cover.png"
              alt="SpiderX task list showing automatically captured tasks"
              fill
              sizes="100vw"
              className="object-contain p-1"
              priority
            />
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            Tasks captured automatically from email and chat messages
          </p>
        </div>

        {/* DESKTOP: Side by side layout */}
        <div className="hidden md:flex flex-row gap-10 items-start">
          {/* Screenshot - 60% */}
          <div className="lg:w-[60%] w-full">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl border border-gray-200">
              <Image
                src="/images/cover.png"
                alt="Gmail inbox with SpiderX sidebar showing automatically captured tasks"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-contain p-2"
                priority
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-4 italic">
              Everything shown here was captured automatically — without stopping your work.
            </p>
          </div>

          {/* Annotations - 40% */}
          <div className="lg:w-[40%] w-full space-y-5 lg:pt-4">
            {annotations.map((annotation) => (
              <Annotation key={annotation.number} {...annotation} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
