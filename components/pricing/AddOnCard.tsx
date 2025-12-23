"use client";

import { AddOn } from '@/lib/config/pricing';

interface AddOnCardProps {
  addOn: AddOn;
}

export default function AddOnCard({ addOn }: AddOnCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'link':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
        {getIcon(addOn.icon)}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {addOn.name}
      </h3>
      <p className="text-sm text-gray-600">
        {addOn.description}
      </p>
    </div>
  );
}
