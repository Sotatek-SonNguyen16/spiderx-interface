"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms';
import { Confetti } from '../molecules';

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, priority: string) => void;
}

export default function FeatureRequestModal({ isOpen, onClose, onSubmit }: FeatureRequestModalProps) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = () => {
    if (description.trim()) {
      setShowConfetti(true);
      onSubmit(description, priority);
      setTimeout(() => {
        setShowConfetti(false);
        onClose();
        setDescription('');
        setPriority('Medium');
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {showConfetti && <Confetti />}

        {!showConfetti ? (
          <>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-semibold mb-2">Request Feature</h3>
              <p className="text-gray-600 mb-6">Tell us what you'd like to see in SpiderX</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your feature or problem
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="I would love to see..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                  >
                    <option value="Low">Low - Nice to have</option>
                    <option value="Medium">Medium - Would be helpful</option>
                    <option value="High">High - Critical for me</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Submit
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center relative z-10 py-12">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Thanks a lot, bro!</h3>
            <p className="text-gray-600">We'll review your suggestion soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

