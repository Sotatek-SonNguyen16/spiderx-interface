"use client";

import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
          Start capturing tasks in minutes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join early users and experience AI-powered task management
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Start free
        </Link>
        <Link
          href="#compare"
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
        >
          See integrations
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          No credit card for Free
        </span>
        <span className="hidden sm:inline text-gray-300">•</span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Cancel anytime
        </span>
        <span className="hidden sm:inline text-gray-300">•</span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Upgrade later
        </span>
      </div>
    </div>
  );
}
