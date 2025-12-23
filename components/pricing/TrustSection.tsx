"use client";

import { PRICING_CONFIG } from '@/lib/config/pricing';

export default function TrustSection() {
  const { trustStatements } = PRICING_CONFIG;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'lock':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'key':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Trust & Security
        </h2>
        <p className="text-gray-600">
          Your data is safe with us
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {trustStatements.map((statement, index) => (
          <div 
            key={index}
            className="flex flex-col items-center text-center gap-4 p-6 rounded-xl bg-white border border-gray-200"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
              {getIcon(statement.icon)}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {statement.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
