"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";

interface ScopeReauthPromptProps {
  missingScope: string;
  featureDescription: string;
  onReauthorize?: () => void;
  className?: string;
}

/**
 * ScopeReauthPrompt - Prompt user to re-authorize with additional scope
 * **Feature: fe-update-v1, Requirements 4.4**
 * 
 * WHEN the chat.memberships.readonly scope is not granted 
 * THEN the SpiderX_System SHALL prompt the user to re-authorize
 */
export const ScopeReauthPrompt = ({
  missingScope,
  featureDescription,
  onReauthorize,
  className = "",
}: ScopeReauthPromptProps) => {
  return (
    <div className={`p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Additional Permission Required
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            {featureDescription} requires the <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-800 rounded text-xs">{missingScope}</code> permission.
          </p>
          {onReauthorize && (
            <button
              onClick={onReauthorize}
              className="flex items-center gap-1.5 mt-3 text-sm font-medium text-amber-700 dark:text-amber-300 
                       hover:text-amber-800 dark:hover:text-amber-200"
            >
              <ExternalLink className="w-4 h-4" />
              Re-authorize with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScopeReauthPrompt;
