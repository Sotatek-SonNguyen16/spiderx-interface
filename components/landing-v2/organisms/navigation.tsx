"use client";

import { useEffect, useRef, useState } from 'react';
import { Logo } from '../atoms';

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const lastY = lastYRef.current;

      // hide when scrolling down, show when scrolling up
      if (y > lastY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastYRef.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </div>
    </nav>
  );
}

