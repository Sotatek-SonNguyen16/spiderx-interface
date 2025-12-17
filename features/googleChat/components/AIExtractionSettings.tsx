"use client";

import { Sparkles, Target, User, Calendar, HelpCircle } from "lucide-react";
import { useState } from "react";

export type AIMode = "smart" | "strict" | "review";

interface AIExtractionSettingsProps {
  mode: AIMode;
  onModeChange: (mode: AIMode) => void;
  detectionRules: {
    actionVerbs: boolean;
    assignee: boolean;
    deadline: boolean;
  };
  onRuleToggle: (
    rule: keyof AIExtractionSettingsProps["detectionRules"]
  ) => void;
  sensitivity: number; // 0-100
  onSensitivityChange: (value: number) => void;
}

const modeOptions: {
  value: AIMode;
  label: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    value: "smart",
    label: "Smart",
    description: "Creates tasks when confidence is high",
    recommended: true,
  },
  {
    value: "strict",
    label: "Strict",
    description: "Only when message is explicit",
  },
  {
    value: "review",
    label: "Review first",
    description: "Always send to review",
  },
];

export const AIExtractionSettings = ({
  mode,
  onModeChange,
  detectionRules,
  onRuleToggle,
  sensitivity,
  onSensitivityChange,
}: AIExtractionSettingsProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            AI Task Extraction
          </h2>
          <p className="text-sm text-gray-500">
            Configure how AI detects and creates tasks
          </p>
        </div>
      </div>

      {/* AI Mode - Segmented Control */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          AI Mode
        </label>
        <div className="inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onModeChange(option.value)}
              className={`relative flex flex-col items-start px-4 py-3 rounded-lg transition-all min-w-[140px] ${
                mode === option.value
                  ? "bg-white shadow-sm border border-gray-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-medium text-sm ${
                    mode === option.value ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </span>
                {option.recommended && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                    Recommended
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-0.5">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Detection Rules */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Detection Rules
        </label>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Detect action verbs
                </span>
                <p className="text-xs text-gray-500">
                  Words like "do", "complete", "send", "review"
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={detectionRules.actionVerbs}
              onChange={() => onRuleToggle("actionVerbs")}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Detect assignee
                </span>
                <p className="text-xs text-gray-500">
                  @mentions and name references
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={detectionRules.assignee}
              onChange={() => onRuleToggle("assignee")}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Detect deadline
                </span>
                <p className="text-xs text-gray-500">
                  Date/time mentions like "by Friday", "tomorrow"
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={detectionRules.deadline}
              onChange={() => onRuleToggle("deadline")}
              className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
          </label>
        </div>
      </div>

      {/* Sensitivity Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Extraction sensitivity
          </label>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-48 z-10">
                Higher sensitivity = more tasks detected, but lower accuracy
                <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={sensitivity}
            onChange={(e) => onSensitivityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low (fewer, more accurate)</span>
            <span className="font-medium text-purple-600">{sensitivity}%</span>
            <span>High (more, less accurate)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
