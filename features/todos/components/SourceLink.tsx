"use client";

import { Globe, ExternalLink, Mail, Video, FileText, MessageSquare } from "lucide-react";
import type { TodoSourceType } from "../types";

interface SourceLinkProps {
  sourceType: TodoSourceType;
  sourceSpaceId: string | null;
  sourceMessageId: string | null;
  sourceSpaceName: string | null;
  sourceThreadNames?: string[];
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

/**
 * SourceLink - Displays the source of a todo with a link to the original
 * Supports Google Chat, Email, Meeting sources
 */
export const SourceLink = ({
  sourceType,
  sourceSpaceId,
  sourceMessageId,
  sourceSpaceName,
  sourceThreadNames = [],
  className = "",
  showIcon = true,
  compact = false,
}: SourceLinkProps) => {
  // Don't render for manual todos
  if (sourceType === "manual" || sourceType === "template") {
    return null;
  }

  // Generate link URL
  const getLink = (threadName?: string): string | null => {
    if (sourceType === "chat" && sourceSpaceId) {
      // Google Chat URL format
      const base = `https://chat.google.com/room/${sourceSpaceId}`;
      return sourceMessageId ? `${base}/${sourceMessageId}` : base;
    }
    return null;
  };

  // Get source links - either from thread names or space name
  const getSourceLinks = (): { label: string; url: string | null }[] => {
    if (sourceThreadNames && sourceThreadNames.length > 0) {
      return sourceThreadNames.map((name, index) => ({
        label: `Source ${index + 1}`,
        url: getLink(name),
      }));
    }
    
    if (sourceSpaceName) {
      return [{ label: sourceSpaceName, url: getLink() }];
    }
    
    return [{ label: "Source", url: getLink() }];
  };

  const sourceLinks = getSourceLinks();

  if (compact) {
    // Compact version for list items
    const firstLink = sourceLinks[0];
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        {showIcon && <Globe className="w-4 h-4 text-gray-400" />}
        {firstLink?.url ? (
          <a
            href={firstLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-blue-600 hover:underline truncate max-w-[150px]"
            title={firstLink.label}
          >
            {firstLink.label}
          </a>
        ) : (
          <span className="text-xs text-gray-500 truncate max-w-[150px]" title={firstLink?.label}>
            {firstLink?.label}
          </span>
        )}
      </div>
    );
  }

  // Full version for detail view - matching design with "Source: Source 1; Source 2"
  return (
    <div className={`flex items-center gap-3 text-sm ${className}`}>
      {showIcon && <Globe className="w-4 h-4 text-gray-400" />}
      <span className="text-gray-500">Source:</span>
      <div className="flex items-center gap-1">
        {sourceLinks.map((link, index) => (
          <span key={index} className="inline-flex items-center">
            {link.url ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 font-medium underline hover:text-blue-600"
              >
                {link.label}
              </a>
            ) : (
              <span className="text-gray-900 font-medium">{link.label}</span>
            )}
            {index < sourceLinks.length - 1 && (
              <span className="text-gray-400 mx-1">;</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SourceLink;
