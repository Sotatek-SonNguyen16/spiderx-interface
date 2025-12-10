"use client";

import { useState } from "react";
import type { SidebarProps, InboxTab } from "../types/ui.types";

export default function Sidebar({
  data,
  onSearchChange,
  onInboxTabChange,
  onSmartInboxItemClick,
  onSmartInboxItemAccept,
  onSmartInboxItemReject,
  onLogout,
}: SidebarProps & { onLogout?: () => void }) {
  const [searchValue, setSearchValue] = useState("");
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"smart-inbox" | "rejected">("smart-inbox");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleTabChange = (tab: InboxTab) => {
    onInboxTabChange?.(tab);
  };

  const handleAccept = (id: string) => {
    setAnimatingItemId(id);
    setTimeout(() => {
      onSmartInboxItemAccept?.(id);
      setAnimatingItemId(null);
    }, 300);
  };

  const handleReject = (id: string) => {
    setAnimatingItemId(id);
    setTimeout(() => {
      onSmartInboxItemReject?.(id);
      setAnimatingItemId(null);
    }, 300);
  };

  const handleRestore = (id: string) => {
    setAnimatingItemId(id);
    setTimeout(() => {
      // Move back to inbox
      const item = rejectedItems.find((i) => i.id === id);
      if (item) {
        onSmartInboxItemAccept?.(id);
      }
      setAnimatingItemId(null);
    }, 300);
  };

  // Filter items based on current view
  const inboxItems = data.smartInbox.items.filter(
    (item) => !item.tab || item.tab === "inbox" || item.tab === "accepted"
  );
  const rejectedItems = data.smartInbox.items.filter((item) => item.tab === "rejected");

  const displayItems = currentView === "smart-inbox" ? inboxItems : rejectedItems;

  const getDueTypeLabel = (dueType: string) => {
    switch (dueType) {
      case "today":
        return "Due today";
      case "tomorrow":
        return "Due tomorrow";
      case "overdue":
        return "Overdue";
      default:
        return "";
    }
  };

  const handleInboxHeaderClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === "rejectedBtn" || target.classList.contains("rejected-label")) {
      setCurrentView("rejected");
      onInboxTabChange?.("rejected");
    } else {
      setCurrentView("smart-inbox");
      onInboxTabChange?.("inbox");
    }
  };

  return (
    <div className="flex h-full flex-col py-5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] text-base font-bold text-white">
          ⚡
        </div>
        <span className="text-xl font-semibold">{data.appName}</span>
      </div>

      {/* Search Box */}
      <div className="px-5 pb-5">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full rounded-lg border-none bg-[#f5f5f7] py-2 pl-[35px] pr-3 text-sm outline-none placeholder:text-[#86868b]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "10px center",
          }}
        />
      </div>

      {/* Back Button - Hidden when in smart-inbox view */}
      {currentView === "rejected" && (
        <button
          onClick={() => {
            setCurrentView("smart-inbox");
            onInboxTabChange?.("inbox");
          }}
          className="mx-5 mb-4 flex items-center gap-2 rounded-lg border-none bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#007aff] transition-colors hover:bg-[#ebebed]"
        >
          <span>←</span>
          <span>Back to Smart Inbox</span>
        </button>
      )}

      {/* Inbox Section */}
      <div className="px-5 mb-5">
        <div
          className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
            currentView === "smart-inbox" ? "bg-transparent active" : "hover:bg-[#f5f5f7]"
          } cursor-pointer`}
          onClick={handleInboxHeaderClick}
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full transition-colors ${
                inboxItems.length === 0 ? "bg-[#34c759] empty" : "bg-[#ff3b30]"
              }`}
            />
            <span className="text-sm font-medium text-[#1d1d1f]">
              SMART INBOX <span className="text-[#86868b]">({inboxItems.length})</span>
            </span>
          </div>
          <span
            id="rejectedBtn"
            className="text-[13px] text-[#86868b] transition-colors hover:text-[#ff3b30] cursor-pointer"
          >
            Rejected
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-5">
        {displayItems.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#86868b]">
            No items in {currentView === "smart-inbox" ? "inbox" : "rejected"}
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map((item) => {
              const isAnimating = animatingItemId === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col gap-1 rounded-lg px-3 py-3 transition-all ${
                    isAnimating
                      ? currentView === "smart-inbox"
                        ? "animate-[slideOutRight_0.3s_ease_forwards]"
                        : "animate-[slideOutLeft_0.3s_ease_forwards]"
                      : item.isSelected
                        ? "bg-[#f5f5f7]"
                        : "hover:bg-[#f5f5f7]"
                  }`}
                  onClick={() => onSmartInboxItemClick?.(item.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0">
                      <div className="h-[18px] w-[18px] rounded-full border-2 border-[#d1d1d6] transition-colors hover:border-[#007aff] cursor-pointer" />
                    </div>
                    <div className="flex-1 text-sm font-medium text-[#1d1d1f] mb-0">
                      {item.title}
                    </div>
                  </div>
                  <div className="text-xs text-[#86868b] mb-2">
                    {getDueTypeLabel(item.dueType)}
                  </div>
                  <div className="flex items-center gap-3">
                    {currentView === "smart-inbox" && (
                      <>
                        <span
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-base text-[#ff3b30] opacity-60 transition-all hover:bg-[#f5f5f7] hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(item.id);
                          }}
                        >
                          ✕
                        </span>
                        <span
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-base text-[#34c759] opacity-60 transition-all hover:bg-[#f5f5f7] hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(item.id);
                          }}
                        >
                          ✓
                        </span>
                      </>
                    )}
                    {currentView === "rejected" && (
                      <span
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-base text-[#007aff] opacity-60 transition-all hover:bg-[#f5f5f7] hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(item.id);
                        }}
                      >
                        ↩
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Logout */}
      <div
        className="cursor-pointer px-5 py-3 text-sm text-[#86868b] transition-colors hover:text-[#1d1d1f]"
        onClick={onLogout}
      >
        Log out
      </div>
    </div>
  );
}
