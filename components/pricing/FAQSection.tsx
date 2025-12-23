"use client";

import { useState } from 'react';
import { PRICING_CONFIG } from '@/lib/config/pricing';
import FAQItem from './FAQItem';

export default function FAQSection() {
  const { faqs } = PRICING_CONFIG;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Frequently asked questions
        </h2>
        <p className="text-gray-600">
          Everything you need to know about pricing and plans
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}
