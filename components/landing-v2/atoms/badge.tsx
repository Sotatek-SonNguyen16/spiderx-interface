import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'cyan' | 'green' | 'soon';
  className?: string;
}

export default function Badge({
  children,
  variant = 'blue',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    green: 'bg-green-50 text-green-600',
    soon: 'bg-blue-500 text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

