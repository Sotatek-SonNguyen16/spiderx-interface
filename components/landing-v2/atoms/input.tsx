import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`px-5 py-4 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors ${className}`}
      {...props}
    />
  );
}

