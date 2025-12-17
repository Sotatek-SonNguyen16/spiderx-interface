"use client";

import { useState } from "react";
import {
  FileText,
  User,
  Flag,
  Tag,
  ChevronDown,
  MessageSquare,
  Calendar,
  Sparkles,
} from "lucide-react";

export type TitleFormat = "ai_summary" | "first_sentence" | "template";
export type AssigneeOption = "detected" | "me" | "sender";
export type PriorityOption = "detected" | "high" | "medium" | "low";

interface TaskOutputPreviewProps {
  titleFormat: TitleFormat;
  onTitleFormatChange: (format: TitleFormat) => void;
  assignee: AssigneeOption;
  onAssigneeChange: (option: AssigneeOption) => void;
  priority: PriorityOption;
  onPriorityChange: (option: PriorityOption) => void;
  autoTag: boolean;
  onAutoTagChange: (enabled: boolean) => void;
}

// Example messages for preview
const exampleMessages = [
  {
    id: "1",
    sender: "Uyen",
    content: "Can you please review the Q4 report and send feedback by Friday?",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    sender: "Minh",
    content: "@Tam please update the API docs before the meeting tomorrow",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    sender: "Linh",
    content:
      "The client wants the landing page completed by next week. High priority!",
    timestamp: "1 day ago",
  },
];

export const TaskOutputPreview = ({
  titleFormat,
  onTitleFormatChange,
  assignee,
  onAssigneeChange,
  priority,
  onPriorityChange,
  autoTag,
  onAutoTagChange,
}: TaskOutputPreviewProps) => {
  const [selectedExample, setSelectedExample] = useState(exampleMessages[0]);

  // Generate preview task based on settings
  const getPreviewTask = () => {
    const msg = selectedExample;

    let title = "";
    switch (titleFormat) {
      case "ai_summary":
        if (msg.id === "1") title = "Review Q4 report and provide feedback";
        else if (msg.id === "2") title = "Update API documentation";
        else title = "Complete landing page for client";
        break;
      case "first_sentence":
        title =
          msg.content.split(".")[0].slice(0, 50) +
          (msg.content.length > 50 ? "..." : "");
        break;
      case "template":
        title = `Task from ${msg.sender}: ${msg.content.slice(0, 30)}...`;
        break;
    }

    let detectedAssignee = "You";
    if (msg.id === "2") detectedAssignee = "Tam";

    let deadline = "";
    if (msg.id === "1") deadline = "Friday";
    else if (msg.id === "2") deadline = "Tomorrow";
    else if (msg.id === "3") deadline = "Next week";

    let detectedPriority: "high" | "medium" | "low" = "medium";
    if (msg.id === "3") detectedPriority = "high";

    return {
      title,
      assignee:
        assignee === "detected"
          ? detectedAssignee
          : assignee === "me"
          ? "You"
          : msg.sender,
      deadline,
      priority: priority === "detected" ? detectedPriority : priority,
      confidence: msg.id === "1" ? 92 : msg.id === "2" ? 88 : 76,
      tags: autoTag ? ["#google-chat"] : [],
    };
  };

  const previewTask = getPreviewTask();

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
          <FileText className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Task Output</h2>
          <p className="text-sm text-gray-500">
            Configure how created tasks will look
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Settings */}
        <div className="space-y-6">
          {/* Title Format */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Todo title format
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "ai_summary" as TitleFormat,
                  label: "AI summary",
                  desc: "Concise AI-generated title",
                },
                {
                  value: "first_sentence" as TitleFormat,
                  label: "First sentence",
                  desc: "Use first sentence of message",
                },
                {
                  value: "template" as TitleFormat,
                  label: "Custom template",
                  desc: "Task from [Sender]: [Preview]",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    titleFormat === option.value
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="titleFormat"
                    checked={titleFormat === option.value}
                    onChange={() => onTitleFormatChange(option.value)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Assignee
            </label>
            <div className="flex gap-2">
              {[
                { value: "detected" as AssigneeOption, label: "Detected" },
                { value: "me" as AssigneeOption, label: "Always me" },
                { value: "sender" as AssigneeOption, label: "Sender" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onAssigneeChange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    assignee === option.value
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Priority
            </label>
            <div className="flex gap-2">
              {[
                { value: "detected" as PriorityOption, label: "Detected" },
                { value: "high" as PriorityOption, label: "High" },
                { value: "medium" as PriorityOption, label: "Medium" },
                { value: "low" as PriorityOption, label: "Low" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onPriorityChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    priority === option.value
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-tag */}
          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Auto-add tag
                </span>
                <p className="text-xs text-gray-500">#google-chat</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoTag}
              onChange={(e) => onAutoTagChange(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </label>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Live Preview
              </span>
              <select
                value={selectedExample.id}
                onChange={(e) =>
                  setSelectedExample(
                    exampleMessages.find((m) => m.id === e.target.value) ||
                      exampleMessages[0]
                  )
                }
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
              >
                {exampleMessages.map((msg) => (
                  <option key={msg.id} value={msg.id}>
                    Message from {msg.sender}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Message */}
            <div className="mb-4 p-3 rounded-lg bg-white border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Source message
                </span>
              </div>
              <p className="text-sm text-gray-700">{selectedExample.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedExample.sender} · {selectedExample.timestamp}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center my-2">
              <div className="flex items-center gap-2 text-purple-500">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI extracts</span>
              </div>
            </div>

            {/* Resulting Task Card */}
            <div className="p-4 rounded-lg bg-white border-2 border-green-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Resulting task
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    previewTask.confidence >= 80
                      ? "bg-green-100 text-green-700"
                      : previewTask.confidence >= 60
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {previewTask.confidence}% confidence
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-3">
                {previewTask.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                  <User className="h-3 w-3" />
                  {previewTask.assignee}
                </span>
                {previewTask.deadline && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs">
                    <Calendar className="h-3 w-3" />
                    {previewTask.deadline}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                    previewTask.priority === "high"
                      ? "bg-red-50 text-red-700"
                      : previewTask.priority === "medium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Flag className="h-3 w-3" />
                  {previewTask.priority.charAt(0).toUpperCase() +
                    previewTask.priority.slice(1)}
                </span>
                {previewTask.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
