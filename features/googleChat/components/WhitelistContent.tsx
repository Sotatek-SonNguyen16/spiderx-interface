"use client";

import { SpaceListPanel } from "./SpaceListPanel";
import type { GoogleChatSpace } from "@/features/googleChat/types";

interface WhitelistContentProps {
  availableSpaces: GoogleChatSpace[];
  whitelistedSpaces: GoogleChatSpace[];
  isLoading: boolean;
  updatingSpaceId: string | null;
  onAddToWhitelist: (space: GoogleChatSpace) => void;
  onRemoveFromWhitelist: (space: GoogleChatSpace) => void;
}

export const WhitelistContent = ({
  availableSpaces,
  whitelistedSpaces,
  isLoading,
  updatingSpaceId,
  onAddToWhitelist,
  onRemoveFromWhitelist,
}: WhitelistContentProps) => {
  return (
    <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
      {/* Left Panel: Available Spaces (Input) */}
      <SpaceListPanel
        title="Available Spaces"
        subtitle="Select spaces to enable todo extraction"
        spaces={availableSpaces}
        variant="available"
        isLoading={isLoading}
        updatingSpaceId={updatingSpaceId}
        showSearch
        emptyMessage="No available spaces"
        emptySubMessage="Connect to Google Chat first"
        onSpaceAction={onAddToWhitelist}
      />

      {/* Right Panel: Enabled for Extraction (Output - More Prominent) */}
      <SpaceListPanel
        title="Enabled for Extraction"
        subtitle="Todos will be generated from these spaces"
        spaces={whitelistedSpaces}
        variant="whitelisted"
        isLoading={isLoading}
        updatingSpaceId={updatingSpaceId}
        showCount
        isOutputPanel
        emptyMessage="📭 No spaces enabled"
        emptySubMessage="Enable spaces from the left to extract todos from conversations"
        onSpaceAction={onRemoveFromWhitelist}
      />
    </div>
  );
};
