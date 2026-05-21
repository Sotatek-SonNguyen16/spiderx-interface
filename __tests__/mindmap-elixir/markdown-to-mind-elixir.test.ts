import {
  cleanMindmapMarkdown,
  detectMindElixirMarkdownFormat,
  markdownToMindElixir,
  renderSafeNodeMarkdown,
} from "@/lib/mindmap-elixir/markdown-to-mind-elixir";

describe("markdownToMindElixir", () => {
  test("converts heading markdown into Mind Elixir data", () => {
    const data = markdownToMindElixir(`# Launch Plan

## Discovery
### Users
### Competitors

## Delivery
### Frontend
### Backend`, "headings");

    expect(data.nodeData.topic).toBe("Launch Plan");
    expect(data.nodeData.children?.map((node) => node.topic)).toEqual(["Discovery", "Delivery"]);
    expect(data.nodeData.children?.[0].children?.map((node) => node.topic)).toEqual([
      "Users",
      "Competitors",
    ]);
  });

  test("wraps multiple top-level headings in a synthetic root", () => {
    const data = markdownToMindElixir(`# First
# Second`, "headings");

    expect(data.nodeData.topic).toBe("Mind Map");
    expect(data.nodeData.children?.map((node) => node.topic)).toEqual(["First", "Second"]);
  });

  test("converts plaintext list markdown with Mind Elixir converter", () => {
    const data = markdownToMindElixir(`- Root
  - Alpha
  - Beta`, "plaintext");

    expect(data.nodeData.topic).toBe("Root");
    expect(data.nodeData.children?.map((node) => node.topic)).toEqual(["Alpha", "Beta"]);
  });

  test("detects plaintext when list lines dominate", () => {
    expect(
      detectMindElixirMarkdownFormat(`- Root
  - Alpha`),
    ).toBe("plaintext");
  });

  test("cleans fenced stream wrappers", () => {
    expect(cleanMindmapMarkdown("```md\n# Root\n```")).toBe("# Root");
  });

  test("renders limited node markdown without allowing raw html", () => {
    expect(renderSafeNodeMarkdown("**Bold** <script>alert(1)</script> `code`")).toBe(
      "<strong>Bold</strong> &lt;script&gt;alert(1)&lt;/script&gt; <code>code</code>",
    );
  });
});
