import { markdownToMindElixir } from "@/lib/mindmap-elixir/markdown-to-mind-elixir";
import {
  applyMindmapTemplateStyle,
  branchPalettePresets,
  connectorPresets,
  densityPresets,
  diagramPresets,
  finishPresets,
  getBranchPalettePreset,
  getConnectorPreset,
  getDensityPreset,
  getFinishPreset,
  getGeometryPreset,
  getShapePreset,
  getStylePreset,
  getTypographyPreset,
  geometryPresets,
  layoutPresets,
  shapePresets,
  skeletonTemplates,
  stylePresets,
  structurePresets,
  typographyPresets,
  viewPresets,
  visualThemes,
} from "@/lib/mindmap-elixir/template-presets";

describe("mindmap elixir template presets", () => {
  test("provides multiple skeleton, theme, and style choices", () => {
    expect(skeletonTemplates.length).toBeGreaterThanOrEqual(28);
    expect(visualThemes.length).toBeGreaterThanOrEqual(14);
    expect(stylePresets.length).toBeGreaterThanOrEqual(17);
    expect(shapePresets.length).toBeGreaterThanOrEqual(6);
    expect(densityPresets.length).toBeGreaterThanOrEqual(5);
    expect(typographyPresets.length).toBeGreaterThanOrEqual(5);
    expect(branchPalettePresets.length).toBeGreaterThanOrEqual(7);
    expect(diagramPresets.length).toBeGreaterThanOrEqual(8);
    expect(connectorPresets.length).toBeGreaterThanOrEqual(9);
    expect(geometryPresets.length).toBeGreaterThanOrEqual(10);
    expect(finishPresets.length).toBeGreaterThanOrEqual(8);
    expect(structurePresets.length).toBeGreaterThanOrEqual(6);
    expect(viewPresets.length).toBeGreaterThanOrEqual(5);
    expect(layoutPresets.length).toBeGreaterThanOrEqual(5);
    expect(new Set(layoutPresets.map((item) => item.direction))).toEqual(new Set([0, 1, 2]));
  });

  test("every skeleton recommendation points to available presets", () => {
    const themeIds = new Set(visualThemes.map((item) => item.id));
    const styleIds = new Set(stylePresets.map((item) => item.id));
    const directions = new Set(layoutPresets.map((item) => item.direction));

    for (const skeleton of skeletonTemplates) {
      expect(themeIds.has(skeleton.recommendedThemeId)).toBe(true);
      expect(styleIds.has(skeleton.recommendedStyleId)).toBe(true);
      expect(directions.has(skeleton.recommendedDirection)).toBe(true);
    }
  });

  test("every diagram preset points to available styling layers", () => {
    const themeIds = new Set(visualThemes.map((item) => item.id));
    const styleIds = new Set(stylePresets.map((item) => item.id));
    const shapeIds = new Set(shapePresets.map((item) => item.id));
    const densityIds = new Set(densityPresets.map((item) => item.id));
    const typographyIds = new Set(typographyPresets.map((item) => item.id));
    const branchPaletteIds = new Set(branchPalettePresets.map((item) => item.id));
    const connectorIds = new Set(connectorPresets.map((item) => item.id));
    const geometryIds = new Set(geometryPresets.map((item) => item.id));
    const finishIds = new Set(finishPresets.map((item) => item.id));
    const directions = new Set(layoutPresets.map((item) => item.direction));

    for (const diagram of diagramPresets) {
      expect(themeIds.has(diagram.themeId)).toBe(true);
      expect(styleIds.has(diagram.styleId)).toBe(true);
      expect(shapeIds.has(diagram.shapeId)).toBe(true);
      expect(densityIds.has(diagram.densityId)).toBe(true);
      expect(typographyIds.has(diagram.typographyId)).toBe(true);
      expect(branchPaletteIds.has(diagram.branchPaletteId)).toBe(true);
      expect(connectorIds.has(diagram.connectorId)).toBe(true);
      expect(geometryIds.has(diagram.geometryId)).toBe(true);
      expect(finishIds.has(diagram.finishId)).toBe(true);
      expect(directions.has(diagram.direction)).toBe(true);
    }
  });

  test("every structure preset points to available styling layers", () => {
    const themeIds = new Set(visualThemes.map((item) => item.id));
    const styleIds = new Set(stylePresets.map((item) => item.id));
    const shapeIds = new Set(shapePresets.map((item) => item.id));
    const densityIds = new Set(densityPresets.map((item) => item.id));
    const typographyIds = new Set(typographyPresets.map((item) => item.id));
    const branchPaletteIds = new Set(branchPalettePresets.map((item) => item.id));
    const connectorIds = new Set(connectorPresets.map((item) => item.id));
    const geometryIds = new Set(geometryPresets.map((item) => item.id));
    const finishIds = new Set(finishPresets.map((item) => item.id));
    const directions = new Set(layoutPresets.map((item) => item.direction));

    for (const structure of structurePresets) {
      expect(themeIds.has(structure.themeId)).toBe(true);
      expect(styleIds.has(structure.styleId)).toBe(true);
      expect(shapeIds.has(structure.shapeId)).toBe(true);
      expect(densityIds.has(structure.densityId)).toBe(true);
      expect(typographyIds.has(structure.typographyId)).toBe(true);
      expect(branchPaletteIds.has(structure.branchPaletteId)).toBe(true);
      expect(connectorIds.has(structure.connectorId)).toBe(true);
      expect(geometryIds.has(structure.geometryId)).toBe(true);
      expect(finishIds.has(structure.finishId)).toBe(true);
      expect(directions.has(structure.direction)).toBe(true);
    }
  });

  test("every view preset points to available styling layers", () => {
    const themeIds = new Set(visualThemes.map((item) => item.id));
    const styleIds = new Set(stylePresets.map((item) => item.id));
    const shapeIds = new Set(shapePresets.map((item) => item.id));
    const densityIds = new Set(densityPresets.map((item) => item.id));
    const typographyIds = new Set(typographyPresets.map((item) => item.id));
    const branchPaletteIds = new Set(branchPalettePresets.map((item) => item.id));
    const connectorIds = new Set(connectorPresets.map((item) => item.id));
    const geometryIds = new Set(geometryPresets.map((item) => item.id));
    const finishIds = new Set(finishPresets.map((item) => item.id));
    const directions = new Set(layoutPresets.map((item) => item.direction));

    for (const view of viewPresets) {
      expect(themeIds.has(view.themeId)).toBe(true);
      expect(styleIds.has(view.styleId)).toBe(true);
      expect(shapeIds.has(view.shapeId)).toBe(true);
      expect(densityIds.has(view.densityId)).toBe(true);
      expect(typographyIds.has(view.typographyId)).toBe(true);
      expect(branchPaletteIds.has(view.branchPaletteId)).toBe(true);
      expect(connectorIds.has(view.connectorId)).toBe(true);
      expect(geometryIds.has(view.geometryId)).toBe(true);
      expect(finishIds.has(view.finishId)).toBe(true);
      expect(directions.has(view.direction)).toBe(true);
    }
  });

  test("applies theme and node styles without mutating source data", () => {
    const data = markdownToMindElixir(`# Root
## Branch
### Leaf`);

    const styled = applyMindmapTemplateStyle(data, "blueprint", "technical");

    expect(styled.theme?.name).toBe("Blueprint");
    expect(styled.nodeData.style?.fontFamily).toContain("ui-monospace");
    expect(styled.nodeData.children?.[0].style?.border).toBe("1px solid #2563eb");
    expect(styled.nodeData.children?.[0].children?.[0].style?.fontSize).toBe("12px");
    expect(data.theme).toBeUndefined();
    expect(data.nodeData.style).toBeUndefined();
  });

  test("applies advanced shape, density, typography, and branch palette presets", () => {
    const data = markdownToMindElixir(`# Root
## Branch
### Leaf`);

    const styled = applyMindmapTemplateStyle(data, "paper-board", "solid", {
      shapeId: "pill",
      densityId: "compact",
      typographyId: "mono",
      branchPaletteId: "neon",
      connectorId: "arrow-sequence",
      geometryId: "module-block",
      finishId: "blueprint-grid",
    });

    expect(styled.theme?.cssVar?.["--main-radius"]).toBe("2px");
    expect(styled.theme?.cssVar?.["--node-gap-x"]).toBe("22px");
    expect(styled.nodeData.style?.fontFamily).toContain("ui-monospace");
    expect(styled.nodeData.style?.fontSize).toBe("17px");
    expect(styled.nodeData.children?.[0].branchColor).toBe("#22d3ee");
    expect(styled.nodeData.children?.[0].style?.width).toBe("128px");
    expect(styled.nodeData.children?.[0].style?.background).toBe("#111827");
    expect(styled.arrows ?? []).toHaveLength(0);
  });

  test("layout presets can drive readable spacing and collapse rules", () => {
    const layout = layoutPresets.find((item) => item.id === "radial-tree");
    expect(layout).toBeDefined();

    const data = markdownToMindElixir(`# Root
## Branch
### Group
#### Detail`);

    const styled = applyMindmapTemplateStyle(data, "noir", "soft-block", {
      shapeId: layout?.shapeId,
      densityId: layout?.densityId,
      connectorId: layout?.connectorId,
      geometryId: layout?.geometryId,
      maxExpandedDepth: layout?.maxExpandedDepth,
    });

    expect(styled.theme?.cssVar?.["--node-gap-x"]).toBe("72px");
    expect(styled.theme?.cssVar?.["--root-radius"]).toBe("999px");
    expect(styled.nodeData.children?.[0].children?.[0].expanded).toBe(false);
  });

  test("creates arrow overlays for connector presets when there are sibling branches", () => {
    const data = markdownToMindElixir(`# Root
## First
## Second
## Third`);

    const styled = applyMindmapTemplateStyle(data, "noir", "presentation", {
      connectorId: "arrow-sequence",
    });

    expect(styled.arrows).toHaveLength(2);
    expect(styled.arrows?.[0].from).toBe(styled.nodeData.children?.[0].id);
    expect(styled.arrows?.[0].to).toBe(styled.nodeData.children?.[1].id);
    expect(styled.arrows?.[0].style?.stroke).toBe("#22d3ee");
  });

  test("applies the borderless focus canvas experience", () => {
    const focusCanvas = diagramPresets.find((item) => item.id === "focus-canvas");
    expect(focusCanvas).toBeDefined();

    const data = markdownToMindElixir(focusCanvas?.source ?? "");
    const styled = applyMindmapTemplateStyle(data, "solid-canvas", "solid-canvas", {
      shapeId: "pill",
      densityId: "cinematic",
      typographyId: "compact-ui",
      branchPaletteId: "signal",
      connectorId: "rounded-flow",
      geometryId: "balanced-orbit",
      finishId: "no-border",
    });

    expect(styled.theme?.name).toBe("Solid Canvas");
    expect(styled.theme?.type).toBe("dark");
    expect(styled.nodeData.style?.border).toBe("0");
    expect(styled.nodeData.children?.[0].style?.border).toBe("0");
    expect(styled.nodeData.children?.[0].branchColor).toBe("#d7ff45");
    expect(styled.theme?.cssVar?.["--node-gap-x"]).toBe("56px");
  });

  test("returns requested presets with fallback", () => {
    expect(getStylePreset("hand-drawn").name).toBe("Hand Drawn");
    expect(getStylePreset("missing").name).toBe(stylePresets[0].name);
    expect(getShapePreset("pill").name).toBe("Pill");
    expect(getShapePreset("missing").name).toBe(shapePresets[0].name);
    expect(getDensityPreset("compact").name).toBe("Compact");
    expect(getDensityPreset("missing").name).toBe(densityPresets[1].name);
    expect(getTypographyPreset("mono").name).toBe("Mono");
    expect(getTypographyPreset("missing").name).toBe(typographyPresets[0].name);
    expect(getBranchPalettePreset("neon").name).toBe("Neon");
    expect(getBranchPalettePreset("missing").name).toBe(branchPalettePresets[0].name);
    expect(getConnectorPreset("arrow-sequence").name).toBe("Arrow Sequence");
    expect(getConnectorPreset("missing").name).toBe(connectorPresets[0].name);
    expect(getGeometryPreset("module-block").name).toBe("Module Block");
    expect(getGeometryPreset("missing").name).toBe(geometryPresets[0].name);
    expect(getFinishPreset("blueprint-grid").name).toBe("Blueprint");
    expect(getFinishPreset("missing").name).toBe(finishPresets[0].name);
  });
});
