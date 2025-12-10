"use client";

import { Check, X } from 'lucide-react';
import { Button } from '../atoms';
import { Confetti } from '../molecules';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  showConfetti: boolean;
}

export default function EmailModal({ isOpen, onClose, showConfetti }: EmailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {showConfetti && <Confetti />}

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">You're on the list!</h3>
          <p className="text-gray-600 mb-6">Thanks for joining. We'll notify you when SpiderX launches.</p>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

