import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GoogleChatSpace, IntegrationStatus } from "../types";

interface GoogleChatState {
  status: IntegrationStatus | null;
  spaces: GoogleChatSpace[];
  loading: boolean;
  error: string | null;
}

interface GoogleChatActions {
  setStatus: (status: IntegrationStatus) => void;
  setSpaces: (spaces: GoogleChatSpace[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateSpaceWhitelist: (spaceId: string, is_whitelisted: boolean) => void;
  reset: () => void;
}

const initialState: GoogleChatState = {
  status: null,
  spaces: [],
  loading: false,
  error: null,
};

export const useGoogleChatStore = create<GoogleChatState & GoogleChatActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setStatus: (status) =>
        set({ status, loading: false, error: null }),
      setSpaces: (spaces) =>
        set({ spaces, loading: false, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      updateSpaceWhitelist: (spaceId, is_whitelisted) =>
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === spaceId
              ? { ...space, is_whitelisted }
              : space
          ),
        })),
      reset: () => set(initialState),
    }),
    { name: "GoogleChatStore" }
  )
);

