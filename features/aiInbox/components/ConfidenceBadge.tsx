/**
 * ConfidenceBadge Component
 * Displays AI confidence level with color coding
 */

"use client";

import React from "react";
import { ConfidenceLevel } from "../types";
import {
  getConfidenceColor,
  getConfidenceLevel,
} from "../services/aiInbox.service";

interface ConfidenceBadgeProps {
  confidence: number | null;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ConfidenceBadge({
  confidence,
  showPercentage = false,
  size = "md",
}: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(confidence);
  const color = getConfidenceColor(level);
  const percentage = confidence !== null ? Math.round(confidence * 100) : 0;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconMap = {
    [ConfidenceLevel.HIGH]: "✓",
    [ConfidenceLevel.MEDIUM]: "~",
    [ConfidenceLevel.LOW]: "!",
  };

  const labelMap = {
    [ConfidenceLevel.HIGH]: "High Confidence",
    [ConfidenceLevel.MEDIUM]: "Medium Confidence",
    [ConfidenceLevel.LOW]: "Low Confidence",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}40`,
      }}
      title={`${labelMap[level]}: ${percentage}%`}
    >
      <span>{iconMap[level]}</span>
      <span>{showPercentage ? `${percentage}%` : level.toUpperCase()}</span>
    </div>
  );
}
