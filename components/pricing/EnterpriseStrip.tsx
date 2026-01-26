"use client";

import { Plan } from '@/lib/config/pricing';
import Link from 'next/link';

interface EnterpriseStripProps {
  plan: Plan;
}

export default function EnterpriseStrip({ plan }: EnterpriseStripProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Enterprise Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-semibold text-gray-900">
              {plan.name}
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Custom pricing
            </span>
          </div>

          <p className="text-gray-600 mb-4">
            {plan.bestFor}
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-brand-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="md:flex-shrink-0">
          <Link
            href={plan.ctaLink}
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            {plan.ctaText}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
