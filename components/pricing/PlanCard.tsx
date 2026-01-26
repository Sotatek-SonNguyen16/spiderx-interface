"use client";

import { useState } from 'react';
import { Plan } from '@/lib/config/pricing';
import Link from 'next/link';
import Tooltip from './Tooltip';

interface PlanCardProps {
  plan: Plan;
  billingPeriod: 'monthly' | 'yearly';
  recommended?: boolean;
}

export default function PlanCard({ plan, billingPeriod, recommended }: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const price = plan.price[billingPeriod];
  const isNumericPrice = typeof price === 'number';

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsLoading(true);
    // Loading state will be cleared when navigation completes or after timeout
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div
      className={`
        relative flex flex-col h-full rounded-2xl border bg-white shadow-sm
        transition-all duration-200 hover:shadow-lg hover:-translate-y-1
        ${recommended
          ? 'border-brand-600 ring-2 ring-brand-600/20'
          : 'border-gray-200'
        }
      `}
      data-element="plan-card"
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-sm">
            Recommended
          </span>
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Plan Name */}
        <h3
          className="text-xl md:text-2xl font-semibold text-gray-900 mb-4"
          data-element="plan-name"
        >
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-4" data-element="price" data-testid="plan-price">
          {isNumericPrice ? (
            <>
              {price === 0 ? (
                <div className="text-4xl md:text-5xl font-bold text-gray-900">
                  $0
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">
                    ${price}
                  </span>
                  <span className="text-gray-600 text-sm">
                    /user/mo
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-4xl md:text-5xl font-bold text-gray-900">
              {price}
            </div>
          )}
        </div>

        {/* Best For */}
        <p
          className="text-sm text-gray-600 mb-6"
          data-element="best-for"
        >
          {plan.bestFor}
        </p>

        {/* Key Limits */}
        {plan.limits && (
          <div
            className="mb-6 space-y-2"
            data-element="limits"
          >
            {Object.entries(plan.limits).map(([key, limit], index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {key === 'aiCredits' ? (
                  <Tooltip content="1 credit = 1 task extracted/updated">
                    <span className="border-b border-dotted border-gray-400">{limit}</span>
                  </Tooltip>
                ) : (
                  <span>{limit}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="mb-6" data-element="cta">
          <Link
            href={plan.ctaLink}
            onClick={handleCTAClick}
            className={`
              block w-full text-center px-6 py-3 rounded-xl font-medium
              transition-all duration-200 relative
              ${recommended
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }
              ${isLoading ? 'opacity-75 cursor-wait' : ''}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              plan.ctaText
            )}
          </Link>
        </div>

        {/* Features List */}
        <div
          className="space-y-3 pt-6 border-t border-gray-100"
          data-element="features"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Includes
          </p>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5"
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
              <span className="text-sm text-gray-700 leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
