"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { MindElixirData, NodeObj } from "mind-elixir";
import {
  AlertTriangle,
  Box,
  Check,
  Eye,
  GitBranch,
  ListTree,
  Network,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Paintbrush,
  PenLine,
  Rows3,
  Shapes,
  Sparkles,
  SlidersHorizontal,
  Type,
} from "lucide-react";

import { MindMap, MindMapControls } from "@/components/ui/mindmap";
import {
  defaultMindElixirPlaintext,
  detectMindElixirMarkdownFormat,
  markdownToMindElixir,
  type MindElixirMarkdownFormat,
} from "@/lib/mindmap-elixir/markdown-to-mind-elixir";
import {
  applyFishboneLayout,
  isFishboneLayout,
  bracketMainBranch,
  bracketSubBranch,
} from "@/lib/mindmap-elixir/fishbone-layout";
import {
  applyMindmapTemplateStyle,
  branchPalettePresets,
  connectorPresets,
  densityPresets,
  diagramPresets,
  getConnectorPreset,
  getStylePreset,
  finishPresets,
  geometryPresets,
  layoutPresets,
  shapePresets,
  skeletonTemplates,
  stylePresets,
  structurePresets,
  typographyPresets,
  type MindmapDirection,
  viewPresets,
  visualThemes,
} from "@/lib/mindmap-elixir/template-presets";

const defaultDiagram = diagramPresets.find((item) => item.id === "focus-canvas") ?? diagramPresets[0];
const defaultView = viewPresets.find((item) => item.id === "modern-clean") ?? viewPresets[0];
const defaultLayoutId = "bidirectional-mindmap";

type ParseResult = {
  data: MindElixirData;
  error: string;
  detectedFormat: Exclude<MindElixirMarkdownFormat, "auto">;
};

function layoutIdForDirection(direction: MindmapDirection) {
  if (direction === 0) return "left-tree";
  if (direction === 1) return "horizontal-tree";
  return defaultLayoutId;
}

export function MarkdownMindmapPage() {
  const [source, setSource] = useState(defaultDiagram.source);
  const [deferredSource, setDeferredSource] = useState(source);
  const [format, setFormat] = useState<MindElixirMarkdownFormat>(defaultDiagram.format);
  const [selectedSkeletonId, setSelectedSkeletonId] = useState("");
  const [selectedViewId, setSelectedViewId] = useState(defaultView.id);
  const [selectedThemeId, setSelectedThemeId] = useState(defaultView.themeId);
  const [selectedStyleId, setSelectedStyleId] = useState(defaultView.styleId);
  const [selectedDirection, setSelectedDirection] = useState<MindmapDirection>(defaultView.direction);
  const [selectedLayoutId, setSelectedLayoutId] = useState(defaultLayoutId);
  const [selectedDiagramId, setSelectedDiagramId] = useState(defaultDiagram.id);
  const [selectedStructureId, setSelectedStructureId] = useState("");
  const [selectedShapeId, setSelectedShapeId] = useState(defaultView.shapeId);
  const [selectedDensityId, setSelectedDensityId] = useState(defaultView.densityId);
  const [selectedTypographyId, setSelectedTypographyId] = useState(defaultView.typographyId);
  const [selectedBranchPaletteId, setSelectedBranchPaletteId] = useState(defaultView.branchPaletteId);
  const [selectedConnectorId, setSelectedConnectorId] = useState(defaultView.connectorId);
  const [selectedGeometryId, setSelectedGeometryId] = useState(defaultView.geometryId);
  const [selectedFinishId, setSelectedFinishId] = useState(defaultView.finishId);
  const [maxExpandedDepth, setMaxExpandedDepth] = useState<number | undefined>(defaultView.maxExpandedDepth);
  const [isPresetBarOpen, setIsPresetBarOpen] = useState(true);
  const [activePresetGroupId, setActivePresetGroupId] = useState("view");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeObj | null>(null);
  // v2: track whether the active layout uses fishbone engine
  const [isFishbone, setIsFishbone] = useState(false);
  // v2: track layout engine type for custom path generators
  const [layoutEngine, setLayoutEngine] = useState<"default" | "fishbone" | "bracket">("default");
  // v2: ref to the active fishbone config (avoids extra re-renders)
  const fishboneConfigRef = useRef<Parameters<typeof applyFishboneLayout>[1]>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => setDeferredSource(source), 320);
    return () => window.clearTimeout(timer);
  }, [source]);

  const parsed = useMemo<ParseResult>(() => {
    const detectedFormat = detectMindElixirMarkdownFormat(deferredSource);

    try {
      return {
        data: markdownToMindElixir(deferredSource, format),
        error: "",
        detectedFormat,
      };
    } catch (error) {
      return {
        data: markdownToMindElixir(defaultMindElixirPlaintext, "plaintext"),
        error: error instanceof Error ? error.message : "Unable to parse markdown.",
        detectedFormat,
      };
    }
  }, [deferredSource, format]);

  const activeFormat = format === "auto" ? parsed.detectedFormat : format;
  const selectedStyle = getStylePreset(selectedStyleId);
  const selectedConnector = getConnectorPreset(selectedConnectorId);
  const activeMainLinkStyle =
    selectedConnectorId === "style" ? selectedStyle.mainLinkStyle : selectedConnector.mainLinkStyle;
  // v2: line style from connector preset (dashed/dotted/thick)
  const activeLineStyle = selectedConnector.lineStyle;

  const styledData = useMemo(
    () => {
      const base = applyMindmapTemplateStyle(parsed.data, selectedThemeId, selectedStyleId, {
        shapeId: selectedShapeId,
        densityId: selectedDensityId,
        typographyId: selectedTypographyId,
        branchPaletteId: selectedBranchPaletteId,
        connectorId: selectedConnectorId,
        geometryId: selectedGeometryId,
        finishId: selectedFinishId,
        maxExpandedDepth,
      });
      // v2: apply fishbone layout annotation when active
      return isFishbone ? applyFishboneLayout(base, fishboneConfigRef.current) : base;
    },
    [
      parsed.data,
      selectedThemeId,
      selectedStyleId,
      selectedShapeId,
      selectedDensityId,
      selectedTypographyId,
      selectedBranchPaletteId,
      selectedConnectorId,
      selectedGeometryId,
      selectedFinishId,
      maxExpandedDepth,
      isFishbone,
    ],
  );
  const isCanvasDark = styledData.theme?.type === "dark";

  const applySkeleton = (skeletonId: string) => {
    const skeleton = skeletonTemplates.find((item) => item.id === skeletonId);
    if (!skeleton) return;

    setSelectedSkeletonId(skeleton.id);
    setSelectedDiagramId("");
    setSelectedStructureId("");
    setSelectedViewId("");
    setSelectedNode(null);
    setFormat(skeleton.format);
    setSource(skeleton.source);
    setSelectedThemeId(skeleton.recommendedThemeId);
    setSelectedStyleId(skeleton.recommendedStyleId);
    setSelectedDirection(skeleton.recommendedDirection);
    setSelectedLayoutId(layoutIdForDirection(skeleton.recommendedDirection));
    setMaxExpandedDepth(3);
  };

  const applyDiagram = (diagramId: string) => {
    const diagram = diagramPresets.find((item) => item.id === diagramId);
    if (!diagram) return;

    setSelectedDiagramId(diagram.id);
    setSelectedStructureId("");
    setSelectedViewId("");
    setSelectedNode(null);
    setFormat(diagram.format);
    setSource(diagram.source);
    setSelectedThemeId(diagram.themeId);
    setSelectedStyleId(diagram.styleId);
    setSelectedDirection(diagram.direction);
    setSelectedLayoutId(layoutIdForDirection(diagram.direction));
    setSelectedShapeId(diagram.shapeId);
    setSelectedDensityId(diagram.densityId);
    setSelectedTypographyId(diagram.typographyId);
    setSelectedBranchPaletteId(diagram.branchPaletteId);
    setSelectedConnectorId(diagram.connectorId);
    setSelectedGeometryId(diagram.geometryId);
    setSelectedFinishId(diagram.finishId);
    setMaxExpandedDepth(3);
  };

  const applyStructure = (structureId: string) => {
    const structure = structurePresets.find((item) => item.id === structureId);
    if (!structure) return;

    setSelectedStructureId(structure.id);
    setSelectedDiagramId("");
    setSelectedSkeletonId("");
    setSelectedViewId("");
    setSelectedNode(null);
    setFormat(structure.format);
    setSource(structure.source);
    setSelectedThemeId(structure.themeId);
    setSelectedStyleId(structure.styleId);
    setSelectedDirection(structure.direction);
    setSelectedLayoutId(layoutIdForDirection(structure.direction));
    setSelectedShapeId(structure.shapeId);
    setSelectedDensityId(structure.densityId);
    setSelectedTypographyId(structure.typographyId);
    setSelectedBranchPaletteId(structure.branchPaletteId);
    setSelectedConnectorId(structure.connectorId);
    setSelectedGeometryId(structure.geometryId);
    setSelectedFinishId(structure.finishId);
    setMaxExpandedDepth(3);
  };

  const applyLayout = (layoutId: string) => {
    const layout = layoutPresets.find((item) => item.id === layoutId);
    if (!layout) return;

    setSelectedLayoutId(layout.id);
    setSelectedDirection(layout.direction);
    if (layout.shapeId) setSelectedShapeId(layout.shapeId);
    if (layout.densityId) setSelectedDensityId(layout.densityId);
    if (layout.connectorId) setSelectedConnectorId(layout.connectorId);
    if (layout.geometryId) setSelectedGeometryId(layout.geometryId);
    setMaxExpandedDepth(layout.maxExpandedDepth);
    // v2: activate layout engine
    const engine = layout.layoutEngine ?? "default";
    const useFishbone = engine === "fishbone" || isFishboneLayout(layout.id);
    setIsFishbone(useFishbone);
    setLayoutEngine(useFishbone ? "fishbone" : engine);
    fishboneConfigRef.current = useFishbone ? layout.fishboneConfig : undefined;
  };

  const applyView = (viewId: string) => {
    const view = viewPresets.find((item) => item.id === viewId);
    if (!view) return;

    setSelectedViewId(view.id);
    setSelectedThemeId(view.themeId);
    setSelectedStyleId(view.styleId);
    setSelectedDirection(view.direction);
    setSelectedLayoutId(layoutIdForDirection(view.direction));
    setSelectedShapeId(view.shapeId);
    setSelectedDensityId(view.densityId);
    setSelectedTypographyId(view.typographyId);
    setSelectedBranchPaletteId(view.branchPaletteId);
    setSelectedConnectorId(view.connectorId);
    setSelectedGeometryId(view.geometryId);
    setSelectedFinishId(view.finishId);
    setMaxExpandedDepth(view.maxExpandedDepth);
    if (view.source) setSource(view.source);
    if (view.format) setFormat(view.format);
    setSelectedNode(null);
  };

  const presetGroups = [
    {
      id: "view",
      label: "Template",
      icon: <Eye className="h-3.5 w-3.5" aria-hidden="true" />,
      items: viewPresets.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.category,
        description: item.description,
      })),
      selectedId: selectedViewId,
      onSelect: applyView,
    },
    {
      id: "structure",
      label: "Structure",
      icon: <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />,
      items: structurePresets.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.category,
      })),
      selectedId: selectedStructureId,
      onSelect: applyStructure,
    },
    {
      id: "diagram",
      label: "Diagram",
      icon: <Network className="h-3.5 w-3.5" aria-hidden="true" />,
      items: diagramPresets.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.category,
      })),
      selectedId: selectedDiagramId,
      onSelect: applyDiagram,
    },
    {
      id: "skeleton",
      label: "Skeleton",
      icon: <ListTree className="h-3.5 w-3.5" aria-hidden="true" />,
      items: skeletonTemplates.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.category,
      })),
      selectedId: selectedSkeletonId,
      onSelect: applySkeleton,
    },
    {
      id: "theme",
      label: "Theme",
      icon: <Palette className="h-3.5 w-3.5" aria-hidden="true" />,
      items: visualThemes.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedThemeId,
      onSelect: setSelectedThemeId,
    },
    {
      id: "style",
      label: "Style",
      icon: <Paintbrush className="h-3.5 w-3.5" aria-hidden="true" />,
      items: stylePresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedStyleId,
      onSelect: setSelectedStyleId,
    },
    {
      id: "connector",
      label: "Connector",
      icon: <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />,
      items: connectorPresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedConnectorId,
      onSelect: setSelectedConnectorId,
    },
    {
      id: "geometry",
      label: "Geometry",
      icon: <Box className="h-3.5 w-3.5" aria-hidden="true" />,
      items: geometryPresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedGeometryId,
      onSelect: setSelectedGeometryId,
    },
    {
      id: "finish",
      label: "Finish",
      icon: <PenLine className="h-3.5 w-3.5" aria-hidden="true" />,
      items: finishPresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedFinishId,
      onSelect: setSelectedFinishId,
    },
    {
      id: "shape",
      label: "Shape",
      icon: <Shapes className="h-3.5 w-3.5" aria-hidden="true" />,
      items: shapePresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedShapeId,
      onSelect: setSelectedShapeId,
    },
    {
      id: "density",
      label: "Density",
      icon: <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />,
      items: densityPresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedDensityId,
      onSelect: setSelectedDensityId,
    },
    {
      id: "type",
      label: "Type",
      icon: <Type className="h-3.5 w-3.5" aria-hidden="true" />,
      items: typographyPresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedTypographyId,
      onSelect: setSelectedTypographyId,
    },
    {
      id: "palette",
      label: "Palette",
      icon: <Palette className="h-3.5 w-3.5" aria-hidden="true" />,
      items: branchPalettePresets.map((item) => ({ id: item.id, name: item.name })),
      selectedId: selectedBranchPaletteId,
      onSelect: setSelectedBranchPaletteId,
    },
    {
      id: "layout",
      label: "Layout",
      icon: <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />,
      items: layoutPresets.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.category,
        description: item.description,
      })),
      selectedId: selectedLayoutId,
      onSelect: applyLayout,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#14171f]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="grid gap-3 border-b border-[#e7e1d7] pb-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#0f766e]">
              Mind Elixir Lab
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-normal text-[#14171f] sm:text-3xl">
              Markdown Mindmap
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                applyDiagram(defaultDiagram.id);
                applyView("focus");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#14171f] px-3 text-sm font-semibold text-[#f5f7fb] shadow-sm transition hover:bg-[#2a2f3a]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Focus Canvas
            </button>
            <button
              type="button"
              onClick={() => {
                setSource(defaultMindElixirPlaintext);
                setFormat("plaintext");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d8d0c3] bg-[#fffdfa] px-3 text-sm font-semibold text-[#1f3a2e] shadow-sm transition hover:border-[#1f3a2e]"
            >
              <ListTree className="h-4 w-4" aria-hidden="true" />
              Plaintext
            </button>
          </div>
        </header>

        <main
          className={`grid flex-1 gap-3 py-3 transition-[grid-template-columns] duration-300 ${
            isEditorOpen
              ? "lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]"
              : "lg:grid-cols-[72px_minmax(0,1fr)]"
          }`}
        >
          {isEditorOpen ? (
            <section className="flex min-h-[560px] flex-col overflow-hidden rounded-lg border border-[#e7e1d7] bg-[#fffdfa] shadow-[0_16px_40px_rgba(20,23,31,0.08)]">
              <div className="flex items-center justify-between gap-2 border-b border-[#e7e1d7] px-3 py-2">
                <div className="inline-flex rounded-md bg-[#f2eee6] p-1">
                  {(["auto", "headings", "plaintext"] as MindElixirMarkdownFormat[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormat(item)}
                      className={`h-7 rounded px-2 text-[11px] font-semibold capitalize transition ${
                        format === item
                          ? "bg-[#1f3a2e] text-white shadow-sm"
                          : "text-[#4b5563] hover:text-[#14171f]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#f2eee6] text-[#1f3a2e] transition hover:bg-[#e7e1d7]"
                  aria-label="Collapse editor"
                >
                  <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <textarea
                value={source}
                onChange={(event) => setSource(event.target.value)}
                spellCheck={false}
                aria-label="Markdown source"
                className="min-h-[430px] flex-1 resize-none bg-[#fffdfa] px-3 py-3 font-mono text-xs leading-5 text-[#14171f] outline-none placeholder:text-[#7b8794]"
              />

              <div className="border-t border-[#e7e1d7] px-3 py-2">
                <div className="flex items-center justify-between gap-3 text-[11px] text-[#4b5563]">
                  <span className="inline-flex items-center gap-1.5">
                    {parsed.error ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-[#b42318]" aria-hidden="true" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-[#1e7a4c]" aria-hidden="true" />
                    )}
                    {activeFormat}
                  </span>
                  <span>{source.length.toLocaleString()} chars</span>
                </div>
                {parsed.error ? (
                  <p className="mt-2 rounded-md bg-[#fee4e2] px-2 py-1.5 text-[11px] font-medium text-[#b42318]">
                    {parsed.error}
                  </p>
                ) : null}
              </div>
            </section>
          ) : (
            <aside className="flex min-h-[560px] flex-col items-center justify-between rounded-lg border border-[#e7e1d7] bg-[#fffdfa] px-2 py-3 shadow-[0_16px_40px_rgba(20,23,31,0.08)]">
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#14171f] text-[#f5f7fb] transition hover:bg-[#2a2f3a]"
                aria-label="Open editor"
              >
                <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex rotate-180 items-center gap-2 [writing-mode:vertical-rl]">
                <span className="text-xs font-semibold uppercase text-[#0f766e]">Edit</span>
                <span className="rounded bg-[#f2eee6] px-1.5 py-1 text-[11px] font-semibold text-[#4b5563]">
                  {source.length.toLocaleString()}
                </span>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#f2eee6] text-[#1e7a4c]">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
            </aside>
          )}

          <section
            className={`relative min-h-[760px] overflow-hidden rounded-lg shadow-[0_30px_80px_rgba(10,11,15,0.18)] ${
              isCanvasDark ? "bg-[#0a0b0f]" : "bg-[#fbfaf6]"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-24 ${
                isCanvasDark
                  ? "bg-[linear-gradient(180deg,rgba(10,11,15,0.88),rgba(10,11,15,0))]"
                  : "bg-[linear-gradient(180deg,rgba(251,250,246,0.92),rgba(251,250,246,0))]"
              }`}
            />
            <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-[#f5f7fb] px-3 py-2 text-xs font-semibold text-[#0a0b0f] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#ff6b4a]" aria-hidden="true" />
              Visual explorer
            </div>
            <FloatingPresetBar
              groups={presetGroups}
              activeGroupId={activePresetGroupId}
              isOpen={isPresetBarOpen}
              onActiveGroupChange={setActivePresetGroupId}
              onOpenChange={setIsPresetBarOpen}
            />
            <MindMap
              data={styledData}
              className={`h-full min-h-[760px] w-full ${
                selectedViewId === "grid-sketch" ? "mindmap-paper-template" : ""
              }`}
              direction={selectedDirection}
              fit
              mainLinkStyle={activeMainLinkStyle}
              lineStyle={activeLineStyle}
              fishbone={isFishbone}
              layoutEngine={layoutEngine}
              onSelectNodes={(nodes) => setSelectedNode(nodes[0] ?? null)}
              smoothInteractions
              theme={isCanvasDark ? "dark" : "light"}
            >
              <MindMapControls position="bottom-right" />
            </MindMap>
            <NodeDetailPanel node={selectedNode} root={styledData.nodeData} />
          </section>
        </main>
      </div>
    </div>
  );
}

type PresetGroupConfig = {
  id: string;
  label: string;
  icon: ReactNode;
  items: Array<{ id: string; name: string; meta?: string; description?: string }>;
  selectedId: string;
  onSelect: (id: string) => void;
};

function NodeDetailPanel({ node, root }: { node: NodeObj | null; root: NodeObj }) {
  const activeNode = node ?? root;
  const childCount = activeNode.children?.length ?? 0;
  const totalCount = countDescendants(activeNode);
  const isRoot = activeNode.id === root.id;

  return (
    <aside className="absolute bottom-4 right-4 z-20 hidden w-[280px] rounded-xl border border-[#d8d0c3]/80 bg-[#fffdfa]/94 p-3 text-[#14171f] shadow-[0_18px_55px_rgba(20,23,31,0.16)] backdrop-blur-xl lg:block">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase text-[#0f766e]">
            {isRoot ? "Main topic" : "Selected node"}
          </p>
          <h2 className="mt-1 text-sm font-semibold leading-snug">
            {stripNodeText(activeNode.topic)}
          </h2>
        </div>
        <span className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[10px] font-bold text-[#047857]">
          {totalCount + 1} nodes
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#f2eee6] px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase text-[#667085]">Branches</p>
          <p className="mt-1 text-lg font-semibold">{childCount}</p>
        </div>
        <div className="rounded-lg bg-[#f2eee6] px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase text-[#667085]">Depth</p>
          <p className="mt-1 text-lg font-semibold">{maxDepth(activeNode)}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#475467]">
        {childCount > 0
          ? "Open or collapse this branch to explore the next layer without flooding the canvas."
          : "This is a leaf idea. Keep it short on the map, and use Markdown for the full detail."}
      </p>
    </aside>
  );
}

function countDescendants(node: NodeObj): number {
  return (node.children ?? []).reduce((total, child) => total + 1 + countDescendants(child), 0);
}

function maxDepth(node: NodeObj): number {
  const children = node.children ?? [];
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map(maxDepth));
}

function stripNodeText(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function FloatingPresetBar({
  groups,
  activeGroupId,
  isOpen,
  onActiveGroupChange,
  onOpenChange,
}: {
  groups: PresetGroupConfig[];
  activeGroupId: string;
  isOpen: boolean;
  onActiveGroupChange: (id: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const primaryGroupIds = new Set(["view", "layout", "diagram", "structure", "theme"]);
  const visibleGroups = showAdvanced
    ? groups
    : groups.filter((group) => primaryGroupIds.has(group.id));
  const activeGroupCandidate = groups.find((group) => group.id === activeGroupId) ?? groups[0];
  const activeGroup =
    showAdvanced || primaryGroupIds.has(activeGroupCandidate.id)
      ? activeGroupCandidate
      : visibleGroups[0];
  const useGalleryCards = activeGroup.id === "view" || activeGroup.id === "layout";

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="absolute right-4 top-4 z-30 inline-flex h-10 items-center gap-2 rounded-full bg-[#f5f7fb] px-3 text-xs font-semibold text-[#0a0b0f] shadow-[0_14px_34px_rgba(0,0,0,0.3)] transition hover:bg-white"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Presets
      </button>
    );
  }

  return (
    <div className="absolute left-4 right-4 top-16 z-30 rounded-xl bg-[#f5f7fb]/94 p-2 text-[#0a0b0f] shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:left-40 lg:top-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full bg-[#0a0b0f] px-3 text-xs font-semibold text-[#f5f7fb] transition hover:bg-[#242832]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Presets
        </button>
        <div className="flex flex-1 gap-1 overflow-x-auto pr-1">
          {visibleGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => onActiveGroupChange(group.id)}
              className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition ${
                activeGroup.id === group.id
                  ? "bg-[#d7ff45] text-[#0a0b0f]"
                  : "bg-[#e7ebf1] text-[#344054] hover:bg-white"
              }`}
            >
              {group.icon}
              {group.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          className={`inline-flex h-8 shrink-0 items-center rounded-full px-3 text-xs font-semibold transition ${
            showAdvanced
              ? "bg-[#0a0b0f] text-[#f5f7fb]"
              : "bg-[#e7ebf1] text-[#344054] hover:bg-white"
          }`}
        >
          Advanced
        </button>
      </div>
      {useGalleryCards ? (
        <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
          {activeGroup.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => activeGroup.onSelect(item.id)}
              className={`min-h-[86px] rounded-lg border px-3 py-2 text-left transition ${
                activeGroup.selectedId === item.id
                  ? "border-[#0a0b0f] bg-[#0a0b0f] text-[#f5f7fb] shadow-[0_12px_28px_rgba(10,11,15,0.22)]"
                  : "border-[#d9e0e8] bg-white/82 text-[#17404a] hover:border-[#0f766e] hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold">{item.name}</span>
                {item.meta ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeGroup.selectedId === item.id
                        ? "bg-[#d7ff45] text-[#0a0b0f]"
                        : "bg-[#eef2f6] text-[#667085]"
                    }`}
                  >
                    {item.meta}
                  </span>
                ) : null}
              </div>
              {item.description ? (
                <p
                  className={`mt-2 line-clamp-2 text-[11px] leading-4 ${
                    activeGroup.selectedId === item.id ? "text-[#d7dee8]" : "text-[#667085]"
                  }`}
                >
                  {item.description}
                </p>
              ) : null}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {activeGroup.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => activeGroup.onSelect(item.id)}
              className={`h-9 shrink-0 rounded-full px-3 text-left text-xs font-semibold transition ${
                activeGroup.selectedId === item.id
                  ? "bg-[#0a0b0f] text-[#f5f7fb]"
                  : "bg-white/80 text-[#17404a] hover:bg-white"
              }`}
            >
              <span className="whitespace-nowrap">{item.name}</span>
              {item.meta ? (
                <span
                  className={`ml-2 text-[10px] font-semibold ${
                    activeGroup.selectedId === item.id ? "text-[#d7ff45]" : "text-[#667085]"
                  }`}
                >
                  {item.meta}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
