import type { Metadata } from "next";

import { MarkdownMindmapPage } from "@/components/mindmap-elixir/markdown-mindmap-page";

export const metadata: Metadata = {
  title: "Mind Elixir Markdown Mindmap",
  description: "Render Markdown input as an interactive Mind Elixir mind map.",
};

export default function MindMapElixirPage() {
  return <MarkdownMindmapPage />;
}
