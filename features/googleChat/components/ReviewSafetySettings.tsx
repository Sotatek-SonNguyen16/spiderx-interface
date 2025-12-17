"use client";

import { Shield, HelpCircle, Undo2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export type LowConfidenceBehavior = "review_queue" | "create_marked" | "ignore";

interface ReviewSafetySettingsProps {
  confidenceThreshold: number; // 0-100
  onConfidenceThresholdChange: (value: number) => void;
  lowConfidenceBehavior: LowConfidenceBehavior;
  onLowConfidenceBehaviorChange: (behavior: LowConfidenceBehavior) => void;
  undoWindow: boolean;
  onUndoWindowChange: (enabled: boolean) => void;
  undoMinutes: number;
  onUndoMinutesChange: (minutes: number) => void;
}

export const ReviewSafetySettings = ({
  confidenceThreshold,
  onConfidenceThresholdChange,
  lowConfidenceBehavior,
  onLowConfidenceBehaviorChange,
  undoWindow,
  onUndoWindowChange,
  undoMinutes,
  onUndoMinutesChange,
}: ReviewSafetySettingsProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getThresholdColor = () => {
    if (confidenceThreshold >= 80) return "text-green-600";
    if (confidenceThreshold >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getThresholdBg = () => {
    if (confidenceThreshold >= 80) return "bg-green-500";
    if (confidenceThreshold >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
          <Shield className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Review & Safety
          </h2>
          <p className="text-sm text-gray-500">
            Control when tasks are auto-created vs reviewed
          </p>
        </div>
      </div>

      {/* Confidence Threshold */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Confidence threshold
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
              <div className="absolute right-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-56 z-10">
                Tasks with confidence below this threshold will be handled
                according to your low-confidence behavior setting
                <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Auto-create when confidence ≥
            </span>
            <span className={`text-2xl font-bold ${getThresholdColor()}`}>
              {confidenceThreshold}%
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={confidenceThreshold}
              onChange={(e) =>
                onConfidenceThresholdChange(parseInt(e.target.value))
              }
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${
                  confidenceThreshold >= 80
                    ? "#22c55e"
                    : confidenceThreshold >= 60
                    ? "#f59e0b"
                    : "#ef4444"
                } 0%, ${
                  confidenceThreshold >= 80
                    ? "#22c55e"
                    : confidenceThreshold >= 60
                    ? "#f59e0b"
                    : "#ef4444"
                } ${((confidenceThreshold - 50) / 45) * 100}%, #e5e7eb ${
                  ((confidenceThreshold - 50) / 45) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>50% (More tasks)</span>
              <span>95% (Fewer, accurate)</span>
            </div>
          </div>

          {/* Visual indicator */}
          <div className="mt-4 p-3 rounded-lg bg-white border border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className={`h-4 w-4 ${getThresholdColor()}`} />
              <span className="text-gray-600">
                Tasks below{" "}
                <span className="font-medium">{confidenceThreshold}%</span>{" "}
                confidence will be
                {lowConfidenceBehavior === "review_queue" &&
                  " sent to review queue"}
                {lowConfidenceBehavior === "create_marked" &&
                  " created but marked 'Needs review'"}
                {lowConfidenceBehavior === "ignore" && " ignored"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Confidence Behavior */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          When confidence is below threshold
        </label>
        <div className="space-y-2">
          {[
            {
              value: "review_queue" as LowConfidenceBehavior,
              label: "Send to Review Queue",
              description: "You'll review and approve before task is created",
            },
            {
              value: "create_marked" as LowConfidenceBehavior,
              label: "Create but mark 'Needs review'",
              description: "Task is created with a review flag",
            },
            {
              value: "ignore" as LowConfidenceBehavior,
              label: "Ignore",
              description: "Low-confidence tasks are skipped entirely",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                lowConfidenceBehavior === option.value
                  ? "bg-amber-50 border-2 border-amber-200"
                  : "border border-gray-100 hover:border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="lowConfidenceBehavior"
                checked={lowConfidenceBehavior === option.value}
                onChange={() => onLowConfidenceBehaviorChange(option.value)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Undo Window */}
      <div>
        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer hover:border-gray-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Undo2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Allow undo window
              </span>
              <p className="text-xs text-gray-500">
                Auto-created tasks can be undone within {undoMinutes} minutes
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={undoWindow}
            onChange={(e) => onUndoWindowChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>

        {undoWindow && (
          <div className="mt-3 ml-4 flex items-center gap-3">
            <span className="text-sm text-gray-600">Undo window:</span>
            <select
              value={undoMinutes}
              onChange={(e) => onUndoMinutesChange(parseInt(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>
        )}
      </div>
    </section>
  );
};
