"use client";

import { useEffect } from "react";
import { initializeMocks } from "./mock";

/**
 * MockProvider - Initializes API mocking when enabled
 * Add this to your root layout to enable mock data
 */
export function MockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeMocks();
  }, []);

  return <>{children}</>;
}
