"use client";

import { useState } from 'react';
import { PRICING_CONFIG, FeatureRow } from '@/lib/config/pricing';

export default function CompareTable() {
  const { compareTable } = PRICING_CONFIG;
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-brand-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className="text-gray-300 mx-auto block">—</span>
      );
    }
    return <span className="text-sm text-gray-700 text-center block">{value}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Compare plans
        </h2>
        <p className="text-gray-600">
          See what's included in each plan
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-white z-10 shadow-sm">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 border-b-2 border-gray-200">
                Features
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-900 border-b-2 border-gray-200">
                Free
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-900 border-b-2 border-gray-200 bg-brand-50">
                Pro
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-900 border-b-2 border-gray-200">
                Team
              </th>
            </tr>
          </thead>

          <tbody>
            {compareTable.groups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {/* Group Header */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="py-3 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    {group.name}
                  </td>
                </tr>

                {/* Feature Rows */}
                {group.features.map((feature, featureIndex) => (
                  <tr 
                    key={featureIndex}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6">
                      {renderFeatureValue(feature.free)}
                    </td>
                    <td className="py-4 px-6 bg-brand-50/30">
                      {renderFeatureValue(feature.pro)}
                    </td>
                    <td className="py-4 px-6">
                      {renderFeatureValue(feature.team)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden space-y-4">
        {compareTable.groups.map((group, groupIndex) => (
          <div 
            key={groupIndex}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Group Header - Clickable */}
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                {group.name}
              </span>
              <svg 
                className={`w-5 h-5 text-gray-600 transition-transform ${expandedGroup === group.name ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded Content */}
            {expandedGroup === group.name && (
              <div className="p-4 space-y-4 bg-white">
                {group.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      {feature.name}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-500 mb-1">Free</p>
                        {renderFeatureValue(feature.free)}
                      </div>
                      <div className="text-center bg-brand-50 rounded p-2">
                        <p className="text-gray-500 mb-1">Pro</p>
                        {renderFeatureValue(feature.pro)}
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 mb-1">Team</p>
                        {renderFeatureValue(feature.team)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Add React import for Fragment
import React from 'react';
