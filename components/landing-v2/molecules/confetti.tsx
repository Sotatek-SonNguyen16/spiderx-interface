import React from 'react';

interface ConfettiProps {
  count?: number;
}

export default function Confetti({ count = 50 }: ConfettiProps) {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

