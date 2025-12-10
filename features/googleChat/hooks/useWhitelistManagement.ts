"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useGoogleChat } from "@/features/googleChat";
import { googleChatService } from "@/features/googleChat/services/googleChat.service";
import type { GoogleChatSpace } from "@/features/googleChat/types";

export const useWhitelistManagement = () => {
  const { spaces, loading: listLoading, fetchSpaces } = useGoogleChat();
  
  const [whitelistedSpaces, setWhitelistedSpaces] = useState<GoogleChatSpace[]>([]);
  const [loadingWhitelist, setLoadingWhitelist] = useState(false);
  const [updatingSpaceId, setUpdatingSpaceId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load all spaces
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // Load whitelisted spaces
  useEffect(() => {
    let mounted = true;
    const loadWhitelist = async () => {
      setLoadingWhitelist(true);
      try {
        const result = await googleChatService.fetchWhitelistedSpaces();
        if (mounted && result.data) {
          setWhitelistedSpaces(result.data.spaces);
        }
      } catch (error) {
        console.error("Failed to fetch whitelist", error);
      } finally {
        if (mounted) setLoadingWhitelist(false);
      }
    };
    loadWhitelist();
    return () => { mounted = false; };
  }, []);

  // Filter available spaces (not in whitelist)
  const availableSpaces = useMemo(() => {
    const whitelistedIds = new Set(whitelistedSpaces.map((s) => s.id));
    return spaces.filter((s) => !whitelistedIds.has(s.id));
  }, [spaces, whitelistedSpaces]);

  // Auto-update whitelist on server
  const updateWhitelistOnServer = useCallback(
    async (newWhitelistedSpaces: GoogleChatSpace[]) => {
      const spaceIds = newWhitelistedSpaces.map((s) => s.id);
      const result = await googleChatService.updateWhitelist({ space_ids: spaceIds });

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        return false;
      }
      return true;
    },
    []
  );

  // Generic handler for adding/removing spaces
  const handleToggleWhitelist = useCallback(
    async (space: GoogleChatSpace, action: 'add' | 'remove') => {
      setUpdatingSpaceId(space.id);
      setMessage(null);

      let newWhitelist: GoogleChatSpace[];

      if (action === 'add') {
        newWhitelist = [...whitelistedSpaces, { ...space, is_whitelisted: true }];
      } else {
        newWhitelist = whitelistedSpaces.filter((s) => s.id !== space.id);
      }

      // Optimistic update
      setWhitelistedSpaces(newWhitelist);

      // Update on server
      const success = await updateWhitelistOnServer(newWhitelist);

      if (!success) {
        // Rollback on error
        setWhitelistedSpaces(whitelistedSpaces);
      }

      setUpdatingSpaceId(null);
    },
    [whitelistedSpaces, updateWhitelistOnServer]
  );

  const handleAddToWhitelist = useCallback((space: GoogleChatSpace) => {
    return handleToggleWhitelist(space, 'add');
  }, [handleToggleWhitelist]);

  const handleRemoveFromWhitelist = useCallback((space: GoogleChatSpace) => {
    return handleToggleWhitelist(space, 'remove');
  }, [handleToggleWhitelist]);

  return {
    // Data
    allSpaces: spaces,
    availableSpaces,
    whitelistedSpaces,
    
    // Status
    isLoading: listLoading || loadingWhitelist,
    updatingSpaceId,
    message,
    
    // Actions
    handleAddToWhitelist,
    handleRemoveFromWhitelist,
    setMessage
  };
};
