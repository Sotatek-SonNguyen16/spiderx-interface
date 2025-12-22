import { EmailInput } from '../molecules';

interface CTASectionProps {
  onEmailSubmit: (email: string) => void;
}

export default function CTASection({ onEmailSubmit }: CTASectionProps) {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 md:mb-6 tracking-tight">
          <span className="md:hidden">Capture tasks from everywhere</span>
          <span className="hidden md:inline">Ready to capture every task — from everywhere?</span>
        </h2>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-10">
          <span className="md:hidden">Manage multiple projects without missing a thing.</span>
          <span className="hidden md:inline">Join professionals who manage multiple projects without missing tasks across email and chat.</span>
        </p>

        <EmailInput onSubmit={onEmailSubmit} />
        
        <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
          Free for early adopters
        </p>
      </div>
    </section>
  );
}

