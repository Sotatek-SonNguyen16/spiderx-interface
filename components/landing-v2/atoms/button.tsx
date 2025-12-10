import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-full transition-colors flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50',
    outline: 'border-2 border-gray-300 hover:border-gray-400 hover:bg-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

