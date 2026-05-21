import type { MindElixirData, NodeObj } from "mind-elixir";

export type MindElixirMarkdownFormat = "auto" | "headings" | "plaintext";

type DraftNode = {
  topic: string;
  depth: number;
  children: DraftNode[];
};

export const defaultMindElixirMarkdown = `# Product Launch

## Discovery
### Customer interviews
### Competitor map
### Success metrics

## Build
### Markdown parser
### Mind Elixir renderer
### Responsive review

## Release
### QA checklist
### Team demo
### Feedback loop`;

export const defaultMindElixirPlaintext = `- Product Launch
  - Discovery
    - Customer interviews
    - Competitor map
    - Success metrics
  - Build
    - Markdown parser
    - Mind Elixir renderer
    - Responsive review
  - Release
    - QA checklist
    - Team demo
    - Feedback loop`;

export function cleanMindmapMarkdown(input: string): string {
  return input
    .replace(/^```[\w-]*\s*$/gm, "")
    .replace(/^```\s*$/gm, "")
    .trim();
}

export function detectMindElixirMarkdownFormat(input: string): Exclude<MindElixirMarkdownFormat, "auto"> {
  const clean = cleanMindmapMarkdown(input);
  const lines = clean.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const listLines = lines.filter((line) => /^\s*[-*+]\s+/.test(line));
  const headingLines = lines.filter((line) => /^#{1,6}\s+/.test(line));

  if (listLines.length > 0 && listLines.length >= headingLines.length) {
    return "plaintext";
  }

  return "headings";
}

export function markdownToMindElixir(
  input: string,
  format: MindElixirMarkdownFormat = "auto",
): MindElixirData {
  const clean = cleanMindmapMarkdown(input);
  const selectedFormat = format === "auto" ? detectMindElixirMarkdownFormat(clean) : format;

  if (!clean) {
    return createMindElixirData({
      topic: "Mind Map",
      depth: 1,
      children: [],
    });
  }

  if (selectedFormat === "plaintext") {
    return plaintextMarkdownToMindElixir(clean);
  }

  return headingsMarkdownToMindElixir(clean);
}

export function renderSafeNodeMarkdown(markdown: string): string {
  const escaped = escapeHtml(markdown);

  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>',
    )
    .replace(/\n/g, "<br />");
}

function headingsMarkdownToMindElixir(markdown: string): MindElixirData {
  const drafts = headingLinesToDraftNodes(markdown);

  if (drafts.length === 0) {
    return createMindElixirData({
      topic: "Mind Map",
      depth: 1,
      children: markdown
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((topic) => ({ topic, depth: 2, children: [] })),
    });
  }

  if (drafts.length === 1) {
    return createMindElixirData(drafts[0]);
  }

  return createMindElixirData({
    topic: "Mind Map",
    depth: 1,
    children: drafts,
  });
}

function headingLinesToDraftNodes(markdown: string): DraftNode[] {
  return markdownToHeadingDrafts(markdown);
}

function markdownToHeadingDrafts(markdown: string): DraftNode[] {
  const topLevel: DraftNode[] = [];
  const stack: DraftNode[] = [];
  let currentContainer: DraftNode | null = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const depth = heading[1].length;
      const node: DraftNode = {
        topic: heading[2].trim() || "Untitled",
        depth,
        children: [],
      };

      while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
        stack.pop();
      }

      if (stack.length === 0) {
        topLevel.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }

      stack.push(node);
      currentContainer = node;
      continue;
    }

    if (currentContainer) {
      currentContainer.children.push({
        topic: line,
        depth: currentContainer.depth + 1,
        children: [],
      });
    }
  }

  return topLevel;
}

function plaintextMarkdownToMindElixir(markdown: string): MindElixirData {
  const topLevel: DraftNode[] = [];
  const stack: DraftNode[] = [];

  for (const rawLine of markdown.split(/\r?\n/)) {
    const match = rawLine.match(/^(\s*)[-*+]\s+(.+)$/);
    if (!match) continue;

    const indent = match[1].replace(/\t/g, "  ").length;
    const depth = Math.floor(indent / 2) + 1;
    const node: DraftNode = {
      topic: match[2].trim() || "Untitled",
      depth,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      topLevel.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  if (topLevel.length === 0) {
    return createMindElixirData({
      topic: "Mind Map",
      depth: 1,
      children: [],
    });
  }

  if (topLevel.length === 1) {
    return createMindElixirData(topLevel[0]);
  }

  return createMindElixirData({
    topic: "Mind Map",
    depth: 1,
    children: topLevel,
  });
}

function createMindElixirData(root: DraftNode): MindElixirData {
  return {
    nodeData: draftToNode(root, "root"),
  };
}

function draftToNode(draft: DraftNode, path: string): NodeObj {
  return {
    id: stableNodeId(draft.topic, path),
    topic: draft.topic,
    expanded: true,
    children: draft.children.map((child, index) => draftToNode(child, `${path}-${index}`)),
  };
}

function stableNodeId(topic: string, path: string): string {
  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);

  return `me-${slug || "node"}-${path}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
