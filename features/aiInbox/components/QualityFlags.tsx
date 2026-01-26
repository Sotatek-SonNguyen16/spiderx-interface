/**
 * QualityFlags Component
 * Displays quality warning flags for suggestions
 */

"use client";

import React from "react";
import { getQualityFlagInfo } from "../services/aiInbox.service";

interface QualityFlagsProps {
  flags: string[];
  compact?: boolean;
}

export function QualityFlags({ flags, compact = false }: QualityFlagsProps) {
  if (flags.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {flags.map((flag) => {
          const info = getQualityFlagInfo(flag);
          return (
            <span key={flag} className="text-xs" title={info.label}>
              {info.icon}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {flags.map((flag) => {
        const info = getQualityFlagInfo(flag);
        const severityColors = {
          warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
          error: "bg-red-100 text-red-800 border-red-300",
          info: "bg-blue-100 text-blue-800 border-blue-300",
        };

        return (
          <div
            key={flag}
            className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${
              severityColors[info.severity]
            }`}
          >
            <span>{info.icon}</span>
            <span className="font-medium">{info.label}</span>
          </div>
        );
      })}
    </div>
  );
}
