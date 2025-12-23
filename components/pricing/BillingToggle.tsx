"use client";

interface BillingToggleProps {
  value: 'monthly' | 'yearly';
  onChange: (value: 'monthly' | 'yearly') => void;
}

export default function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Toggle Container */}
      <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm">
        {/* Monthly Button */}
        <button
          onClick={() => onChange('monthly')}
          className={`
            px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out
            ${value === 'monthly' 
              ? 'bg-brand-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          aria-pressed={value === 'monthly'}
        >
          Monthly
        </button>

        {/* Yearly Button */}
        <button
          onClick={() => onChange('yearly')}
          className={`
            px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out
            ${value === 'yearly' 
              ? 'bg-brand-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          aria-pressed={value === 'yearly'}
        >
          Yearly
          <span className="ml-2 text-xs font-semibold text-orange-500">
            Save 20%
          </span>
        </button>
      </div>

      {/* Microcopy */}
      <p className="text-xs text-gray-500">
        Cancel anytime
      </p>
    </div>
  );
}
