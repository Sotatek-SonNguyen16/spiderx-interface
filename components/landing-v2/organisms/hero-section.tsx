import { EmailInput } from '../molecules';

interface HeroSectionProps {
  onEmailSubmit: (email: string) => void;
}

export default function HeroSection({ onEmailSubmit }: HeroSectionProps) {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
          Never miss a task,
          <span className="block text-gray-500">Start getting things done</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          AI that spots and captures everything you need to act on
        </p>

        <EmailInput onSubmit={onEmailSubmit} />
      </div>
    </section>
  );
}

