"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SpaceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

/**
 * SpaceSearch - Search input component for filtering spaces
 * Includes debounce for real-time filtering
 */
export const SpaceSearch = ({
  onSearch,
  placeholder = "Search spaces...",
  className = "",
  debounceMs = 300,
}: SpaceSearchProps) => {
  const [query, setQuery] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-colors text-sm"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      )}
    </div>
  );
};

export default SpaceSearch;
