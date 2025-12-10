"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Input, Button } from '../atoms';

interface EmailInputProps {
  onSubmit: (email: string) => void;
  placeholder?: string;
  buttonText?: string;
  showHelper?: boolean;
}

export default function EmailInput({
  onSubmit,
  placeholder = 'Enter your email',
  buttonText = 'Join Waitlist',
  showHelper = true,
}: EmailInputProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email && email.includes('@')) {
      onSubmit(email);
      setEmail('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={handleSubmit} size="lg" className="whitespace-nowrap">
          {buttonText}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      {showHelper && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          Free for early adopters. No credit card required.
        </p>
      )}
    </div>
  );
}

