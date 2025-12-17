"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Settings,
  RefreshCw,
  ChevronDown,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface IntegrationHeaderProps {
  platformName: string;
  platformIcon: string;
  isConnected: boolean;
  connectionStatus: "connected" | "needs_reauth" | "error" | "disconnected";
  lastSyncTime?: string;
  messagesScannedToday?: number;
  tasksCreatedToday?: number;
  workspaceName?: string;
  isSaving?: boolean;
  onSave?: () => void;
  onReconnect?: () => void;
  onDisconnect?: () => void;
}

export const IntegrationHeader = ({
  platformName,
  platformIcon,
  isConnected,
  connectionStatus,
  lastSyncTime = "5 min ago",
  messagesScannedToday = 124,
  tasksCreatedToday = 12,
  workspaceName,
  isSaving = false,
  onSave,
  onReconnect,
  onDisconnect,
}: IntegrationHeaderProps) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          label: "Connected",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          dotColor: "bg-green-500",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };
      case "needs_reauth":
        return {
          label: "Needs re-auth",
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          dotColor: "bg-amber-500",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
        };
      case "error":
        return {
          label: "Error",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          dotColor: "bg-red-500",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
        };
      default:
        return {
          label: "Disconnected",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          dotColor: "bg-gray-400",
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-6 py-5">
        {/* Main header row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Platform identity + status */}
          <div className="flex items-center gap-4">
            {/* Platform icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm">
              <Image
                src={platformIcon}
                alt={platformName}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>

            {/* Platform name + status */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900">
                  {platformName}
                </h1>
                {/* Status chip */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`}
                  />
                  {statusConfig.label}
                </span>
              </div>
              {workspaceName && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Workspace: {workspaceName}
                </p>
              )}
            </div>
          </div>

          {/* Middle: Health metrics (only when connected) */}
          {isConnected && (
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Last sync:{" "}
                  <span className="font-medium text-gray-900">
                    {lastSyncTime}
                  </span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    {messagesScannedToday}
                  </span>{" "}
                  msgs scanned
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    {tasksCreatedToday}
                  </span>{" "}
                  tasks created
                </span>
              </div>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {onSave && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm
                  hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            )}

            {/* Dropdown menu for secondary actions */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm
                  hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Options</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-lg py-1 z-20">
                  {onReconnect && (
                    <button
                      onClick={() => {
                        onReconnect();
                        setShowDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reconnect
                    </button>
                  )}
                  <button
                    onClick={() => router.push("/whitelist")}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Manage Spaces
                  </button>
                  {onDisconnect && (
                    <>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => {
                          onDisconnect();
                          setShowDropdown(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Microcopy - explains AI value */}
        <p className="mt-3 text-sm text-gray-500">
          We scan selected messages and create tasks based on your AI rules.
        </p>
      </div>
    </div>
  );
};
