import { EmailInput } from '../molecules';

interface CTASectionProps {
  onEmailSubmit: (email: string) => void;
}

export default function CTASection({ onEmailSubmit }: CTASectionProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
            Ready to stop missing tasks?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join 1,200+ professionals on the waitlist. Free for early adopters.
          </p>

        <EmailInput onSubmit={onEmailSubmit} />
      </div>
    </section>
  );
}

