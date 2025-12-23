"use client";

import { PRICING_CONFIG } from '@/lib/config/pricing';
import AddOnCard from './AddOnCard';

export default function AddOnsSection() {
  const { addOns } = PRICING_CONFIG;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Add-ons
        </h2>
        <p className="text-gray-600">
          Customize your plan with additional features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {addOns.map((addOn, index) => (
          <AddOnCard key={index} addOn={addOn} />
        ))}
      </div>
    </div>
  );
}
