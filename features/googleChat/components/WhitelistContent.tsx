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
      <SpaceListPanel
        title="All Spaces"
        spaces={availableSpaces}
        variant="available"
        isLoading={isLoading}
        updatingSpaceId={updatingSpaceId}
        showSearch
        emptyMessage="No available spaces"
        onSpaceAction={onAddToWhitelist}
      />

      <SpaceListPanel
        title="Whitelisted Spaces"
        spaces={whitelistedSpaces}
        variant="whitelisted"
        isLoading={isLoading}
        updatingSpaceId={updatingSpaceId}
        showCount
        emptyMessage="No spaces whitelisted yet"
        emptySubMessage="Add spaces from the left list"
        onSpaceAction={onRemoveFromWhitelist}
      />
    </div>
  );
};
