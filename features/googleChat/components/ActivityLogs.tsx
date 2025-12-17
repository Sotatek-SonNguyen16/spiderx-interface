"use client";

import {
  Activity,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface ActivityMetrics {
  messagesScanned: number;
  tasksCreated: number;
  sentToReview: number;
  skipped: number;
}

interface LogEntry {
  id: string;
  time: string;
  source: string;
  sourceType: "dm" | "group" | "space";
  result: "created" | "skipped" | "review";
  confidence: number;
  taskTitle?: string;
}

interface ActivityLogsProps {
  metrics: ActivityMetrics;
  logs: LogEntry[];
  dateRange: "today" | "week" | "month";
  onDateRangeChange: (range: "today" | "week" | "month") => void;
  resultFilter: "all" | "created" | "skipped" | "review";
  onResultFilterChange: (
    filter: "all" | "created" | "skipped" | "review"
  ) => void;
}

// Mock data for demo
export const mockMetrics: ActivityMetrics = {
  messagesScanned: 1247,
  tasksCreated: 42,
  sentToReview: 18,
  skipped: 89,
};

export const mockLogs: LogEntry[] = [
  {
    id: "1",
    time: "2 min ago",
    source: "Project Alpha",
    sourceType: "group",
    result: "created",
    confidence: 94,
    taskTitle: "Review PR #234",
  },
  {
    id: "2",
    time: "15 min ago",
    source: "Uyen",
    sourceType: "dm",
    result: "review",
    confidence: 67,
    taskTitle: "Possible: Update design specs",
  },
  {
    id: "3",
    time: "1 hour ago",
    source: "Team Standup",
    sourceType: "space",
    result: "skipped",
    confidence: 32,
  },
  {
    id: "4",
    time: "2 hours ago",
    source: "Minh",
    sourceType: "dm",
    result: "created",
    confidence: 89,
    taskTitle: "Send invoice to client",
  },
  {
    id: "5",
    time: "3 hours ago",
    source: "Engineering",
    sourceType: "space",
    result: "created",
    confidence: 91,
    taskTitle: "Fix login bug on mobile",
  },
];

export const ActivityLogs = ({
  metrics,
  logs,
  dateRange,
  onDateRangeChange,
  resultFilter,
  onResultFilterChange,
}: ActivityLogsProps) => {
  const filteredLogs =
    resultFilter === "all"
      ? logs
      : logs.filter((log) => log.result === resultFilter);

  const getResultBadge = (result: LogEntry["result"]) => {
    switch (result) {
      case "created":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Created
          </span>
        );
      case "review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            <Clock className="h-3 w-3" />
            Review
          </span>
        );
      case "skipped":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            <XCircle className="h-3 w-3" />
            Skipped
          </span>
        );
    }
  };

  const getSourceIcon = (type: LogEntry["sourceType"]) => {
    switch (type) {
      case "dm":
        return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />;
      case "group":
        return <MessageSquare className="h-3.5 w-3.5 text-purple-500" />;
      case "space":
        return <MessageSquare className="h-3.5 w-3.5 text-green-500" />;
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Activity & Logs
            </h2>
            <p className="text-sm text-gray-500">
              Track what's being scanned and created
            </p>
          </div>
        </div>

        {/* Date Range Filter */}
        <select
          value={dateRange}
          onChange={(e) =>
            onDateRangeChange(e.target.value as "today" | "week" | "month")
          }
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">
            {metrics.messagesScanned.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Messages scanned</p>
        </div>
        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
          <p className="text-2xl font-bold text-green-600">
            {metrics.tasksCreated}
          </p>
          <p className="text-xs text-gray-500 mt-1">Tasks created</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-2xl font-bold text-amber-600">
            {metrics.sentToReview}
          </p>
          <p className="text-xs text-gray-500 mt-1">Sent to review</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-2xl font-bold text-gray-500">{metrics.skipped}</p>
          <p className="text-xs text-gray-500 mt-1">Skipped</p>
        </div>
      </div>

      {/* Log Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Recent activity
          </span>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={resultFilter}
              onChange={(e) =>
                onResultFilterChange(
                  e.target.value as "all" | "created" | "skipped" | "review"
                )
              }
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white"
            >
              <option value="all">All results</option>
              <option value="created">Created</option>
              <option value="review">Review</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {log.time}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(log.sourceType)}
                      <span className="text-sm text-gray-900">
                        {log.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getResultBadge(log.result)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${
                        log.confidence >= 80
                          ? "text-green-600"
                          : log.confidence >= 60
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {log.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.taskTitle ? (
                      <span className="text-sm text-gray-600 truncate max-w-[200px] block">
                        {log.taskTitle}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        No task
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No activity matching your filters
          </div>
        )}
      </div>
    </section>
  );
};
