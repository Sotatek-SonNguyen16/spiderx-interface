/**
 * AI Inbox Page
 * Main page for reviewing AI-suggested todos
 */

import { Metadata } from "next";
import { AiInboxList } from "@/features/aiInbox";

export const metadata: Metadata = {
  title: "AI Inbox | SpiderX",
  description: "Review and manage AI-suggested tasks before they become todos",
};

export default function AiInboxPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AiInboxList />
    </div>
  );
}
