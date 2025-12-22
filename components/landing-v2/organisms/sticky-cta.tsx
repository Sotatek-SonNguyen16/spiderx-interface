"use client";

import { useState, useEffect } from 'react';
import { Button } from '../atoms';

interface StickyCTAProps {
  onCtaClick: () => void;
}

export default function StickyCTA({ onCtaClick }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero section (approx 400px)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 shadow-lg">
      <Button 
        onClick={onCtaClick}
        className="w-full h-12 text-base font-semibold"
      >
        Join the waitlist
      </Button>
    </div>
  );
}
