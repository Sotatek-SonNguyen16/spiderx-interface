import type { MindElixirData, NodeObj } from "mind-elixir";

// ─── Types ──────────────────────────────────────────────────────────────────

export type Direction = "lhs" | "rhs";

export type Point = {
  x: number;
  y: number;
};

export type BranchParams = {
  pT: number;
  pL: number;
  pW: number;
  pH: number;
  cT: number;
  cL: number;
  cW: number;
  cH: number;
  direction: Direction;
  containerHeight?: number;
  isFirst?: boolean;
};

export type FishboneConfig = {
  /** Angle of level-1 branches in degrees (default: 35) */
  spineAngle: number;
  /** Alternate branches above/below the spine (default: true) */
  alternating: boolean;
  /** ID of the node to use as the spine root (default: root node) */
  spineNodeId?: string;
};

// ─── Direction helpers ──────────────────────────────────────────────────────

export function isRight(p: BranchParams): boolean {
  return p.direction === "rhs";
}

export function isLeft(p: BranchParams): boolean {
  return p.direction === "lhs";
}

/** +1 for right, -1 for left — multiplier for horizontal offsets */
export function sideSign(p: BranchParams): 1 | -1 {
  return isRight(p) ? 1 : -1;
}

// ─── Point helpers (lấy điểm trên node) ────────────────────────────────────

/** Tâm parent node */
export function parentCenter(p: BranchParams): Point {
  return { x: p.pL + p.pW / 2, y: p.pT + p.pH / 2 };
}

/** Tâm child node */
export function childCenter(p: BranchParams): Point {
  return { x: p.cL + p.cW / 2, y: p.cT + p.cH / 2 };
}

/** Giữa cạnh parent theo hướng branch (right edge nếu rhs, left edge nếu lhs) */
export function parentSideCenter(p: BranchParams): Point {
  return {
    x: isRight(p) ? p.pL + p.pW : p.pL,
    y: p.pT + p.pH / 2,
  };
}

/** Giữa cạnh child đối diện parent (left edge nếu rhs, right edge nếu lhs) */
export function childSideCenter(p: BranchParams): Point {
  return {
    x: isRight(p) ? p.cL : p.cL + p.cW,
    y: p.cT + p.cH / 2,
  };
}

/** Bắt đầu từ root nhưng lệch nhẹ khỏi tâm (dynamic offset theo khoảng cách dọc) */
export function rootOffsetStartPoint(p: BranchParams): Point {
  const root = parentCenter(p);
  const child = childSideCenter(p);

  const containerHeight = p.containerHeight || 1000;
  const verticalRatio = Math.abs(child.y - root.y) / containerHeight;
  const dynamicOffset = (1 - verticalRatio) * 0.25 * (p.pW / 2);

  return {
    x: root.x + sideSign(p) * (p.pW / 10 + dynamicOffset),
    y: root.y,
  };
}

/** Sub branch: node đầu tiên nối từ giữa parent, các node sau nối từ bottom */
export function defaultSubStartPoint(p: BranchParams): Point {
  return {
    x: isRight(p) ? p.pL + p.pW : p.pL,
    y: p.isFirst ? p.pT + p.pH / 2 : p.pT + p.pH,
  };
}

// ─── Geometry helpers ───────────────────────────────────────────────────────

export function dx(a: Point, b: Point): number {
  return b.x - a.x;
}

export function dy(a: Point, b: Point): number {
  return b.y - a.y;
}

export function absDx(a: Point, b: Point): number {
  return Math.abs(dx(a, b));
}

export function absDy(a: Point, b: Point): number {
  return Math.abs(dy(a, b));
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(dx(a, b), dy(a, b));
}

/** Tính độ cong tự động theo khoảng cách giữa 2 điểm */
export function curvatureByDistance(
  a: Point,
  b: Point,
  options?: { min?: number; max?: number; ratio?: number },
): number {
  const min = options?.min ?? 12;
  const max = options?.max ?? 80;
  const ratio = options?.ratio ?? 0.25;

  const raw = distance(a, b) * ratio;
  return Math.max(min, Math.min(max, raw));
}

// ─── Control point helpers (tạo điểm control cho curve) ─────────────────────

/** Cong nhẹ theo hướng đi: control point nằm giữa start→end theo X, giữ Y start */
export function gentleQuadraticControl(
  start: Point,
  end: Point,
  strength = 0.45,
): Point {
  return {
    x: start.x + (end.x - start.x) * strength,
    y: start.y,
  };
}

/** Cong organic kiểu mindmap: giữ X start, lấy Y end → đường lượn vào child */
export function organicQuadraticControl(start: Point, end: Point): Point {
  return {
    x: start.x,
    y: end.y,
  };
}

/** Cubic controls kéo ngang từ 2 đầu → đường cong cân bằng, mềm mại */
export function horizontalCubicControls(
  start: Point,
  end: Point,
  strength = 0.5,
): [Point, Point] {
  const offset = Math.abs(end.x - start.x) * strength;
  const sign = end.x >= start.x ? 1 : -1;

  return [
    { x: start.x + sign * offset, y: start.y },
    { x: end.x - sign * offset, y: end.y },
  ];
}

/** Control point tự động theo khoảng cách, kéo ngang từ start */
export function distanceAwareControl(
  start: Point,
  end: Point,
  options?: { min?: number; max?: number; ratio?: number },
): Point {
  const curve = curvatureByDistance(start, end, options);
  const sign = end.x >= start.x ? 1 : -1;

  return {
    x: start.x + sign * curve,
    y: start.y,
  };
}

// ─── SVG path builders ──────────────────────────────────────────────────────

export function moveTo(p: Point): string {
  return `M ${p.x} ${p.y}`;
}

export function lineTo(p: Point): string {
  return `L ${p.x} ${p.y}`;
}

export function horizontalTo(x: number): string {
  return `H ${x}`;
}

export function quadraticTo(control: Point, end: Point): string {
  return `Q ${control.x} ${control.y} ${end.x} ${end.y}`;
}

export function cubicTo(c1: Point, c2: Point, end: Point): string {
  return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`;
}

export function path(...commands: string[]): string {
  return commands.join(" ");
}

// ─── Style-intent helpers (mô tả đường nối bằng lời) ───────────────────────

/** Đường thẳng như xương cá */
export function drawStraightBone(start: Point, end: Point): string {
  return path(moveTo(start), lineTo(end));
}

/** Đường cong nhẹ (gentle quadratic) */
export function drawSoftBone(start: Point, end: Point, strength = 0.45): string {
  const control = gentleQuadraticControl(start, end, strength);
  return path(moveTo(start), quadraticTo(control, end));
}

/** Đường cong organic kiểu mindmap (quadratic, X giữ start, Y lấy end) */
export function drawOrganicBranch(start: Point, end: Point): string {
  const control = organicQuadraticControl(start, end);
  return path(moveTo(start), quadraticTo(control, end));
}

/** Đường cong mềm cân bằng 2 đầu (cubic) */
export function drawBalancedCurve(start: Point, end: Point, strength = 0.5): string {
  const [c1, c2] = horizontalCubicControls(start, end, strength);
  return path(moveTo(start), cubicTo(c1, c2, end));
}

/** Đường cong rồi kéo ngang vào child (cubic + horizontal tail) */
export function drawCurveThenHorizontal(
  start: Point,
  bendEnd: Point,
  finalX: number,
  strength = 0.4,
): string {
  const [c1, c2] = horizontalCubicControls(start, bendEnd, strength);
  return path(moveTo(start), cubicTo(c1, c2, bendEnd), horizontalTo(finalX));
}

/** Đường cong tự động điều chỉnh theo khoảng cách */
export function drawDistanceAwareSoftBone(
  start: Point,
  end: Point,
  options?: { min?: number; max?: number; ratio?: number },
): string {
  const control = distanceAwareControl(start, end, options);
  return path(moveTo(start), quadraticTo(control, end));
}

// ─── Fishbone generators (truyền vào MindElixir options) ────────────────────

/**
 * Main branch: bắt đầu từ root lệch nhẹ khỏi tâm, kết thúc ở cạnh child, vẽ cong organic.
 */
export function fishboneMainBranch(p: BranchParams): string {
  const start = rootOffsetStartPoint(p);
  const end = childSideCenter(p);

  return drawOrganicBranch(start, end);
}

/**
 * Sub branch: bắt đầu từ giữa cạnh parent, kết thúc ở giữa cạnh child, vẽ đường thẳng fishbone.
 */
export function fishboneSubBranch(p: BranchParams): string {
  const start = parentSideCenter(p);
  const end = childSideCenter(p);

  return drawStraightBone(start, end);
}

// ─── Bracket/Outline helpers ────────────────────────────────────────────────

/** Cạnh ngoài của parent (phải nếu rhs, trái nếu lhs) */
export function parentOuterCenter(p: BranchParams): Point {
  return {
    x: isRight(p) ? p.pL + p.pW : p.pL,
    y: p.pT + p.pH / 2,
  };
}

/** Cạnh trong của child (trái nếu rhs, phải nếu lhs) */
export function childInnerCenter(p: BranchParams): Point {
  return {
    x: isRight(p) ? p.cL : p.cL + p.cW,
    y: p.cT + p.cH / 2,
  };
}

/** Tính vị trí X của junction (điểm rẽ dọc giữa parent và child) */
export function bracketJunctionX(
  start: Point,
  end: Point,
  direction: Direction,
  options?: { ratio?: number; minGap?: number; maxGap?: number },
): number {
  const ratio = options?.ratio ?? 0.45;
  const minGap = options?.minGap ?? 24;
  const maxGap = options?.maxGap ?? 80;
  const sign = direction === "rhs" ? 1 : -1;

  const gap = Math.abs(end.x - start.x);
  const offset = Math.max(minGap, Math.min(maxGap, gap * ratio));

  return start.x + sign * offset;
}

/**
 * Đường nối bracket bo góc: ngang → bo → dọc → bo → ngang.
 *
 * Tạo path kiểu:
 *   parent ───┐
 *             │
 *             └── child
 *
 * Nếu start/end gần như cùng hàng (Δy < 4px), chỉ vẽ line ngang đơn giản.
 */
export function drawDirectionalRoundedBracket(
  start: Point,
  end: Point,
  direction: Direction,
  radius = 6,
  junctionOffset?: number,
): string {
  const sign = direction === "rhs" ? 1 : -1;
  const verticalDir = end.y >= start.y ? 1 : -1;

  // Cùng hàng: chỉ cần line ngang, bỏ qua bracket
  if (Math.abs(end.y - start.y) < 4) {
    return `M ${start.x} ${start.y} H ${end.x}`;
  }

  // Junction offset: cố định nếu được truyền vào, không thì dùng auto-scale
  const offset = junctionOffset ?? bracketJunctionOffset(start, end);
  const junctionX = start.x + sign * offset;

  // Clamp radius cho không vượt quá chiều ngang/dọc available
  const availableH = Math.abs(junctionX - start.x) - 2;
  const availableV = Math.abs(end.y - start.y) / 2;
  const r = Math.max(0, Math.min(radius, availableH, availableV));

  if (r === 0) {
    // Sharp bracket: H → V → H, không bo góc
    return [
      `M ${start.x} ${start.y}`,
      `H ${junctionX}`,
      `V ${end.y}`,
      `H ${end.x}`,
    ].join(" ");
  }

  return [
    `M ${start.x} ${start.y}`,
    `H ${junctionX - sign * r}`,
    `Q ${junctionX} ${start.y} ${junctionX} ${start.y + verticalDir * r}`,
    `V ${end.y - verticalDir * r}`,
    `Q ${junctionX} ${end.y} ${junctionX + sign * r} ${end.y}`,
    `H ${end.x}`,
  ].join(" ");
}

/** Auto-scale junction offset (fallback khi không truyền cố định) */
function bracketJunctionOffset(start: Point, end: Point): number {
  const gap = Math.abs(end.x - start.x);
  return Math.max(24, Math.min(40, gap * 0.4));
}

// ─── Right-Outline Bracket generators ───────────────────────────────────────

/**
 * Main branch (root → level-1):
 * Junction cách parent 30px, bo nhẹ radius 5.
 */
export function bracketMainBranch(p: BranchParams): string {
  const start = parentOuterCenter(p);
  const end = childInnerCenter(p);

  return drawDirectionalRoundedBracket(start, end, p.direction, 5, 30);
}

/**
 * Sub branch (level-1 → level-2+):
 * Junction cách parent 30px (shared spine effect), bo rất nhẹ radius 3.
 */
export function bracketSubBranch(p: BranchParams): string {
  const start = parentOuterCenter(p);
  const end = childInnerCenter(p);

  return drawDirectionalRoundedBracket(start, end, p.direction, 3, 30);
}

// ─── Right Organic generators (classic mindmap, cubic Bezier curves) ────────

/**
 * Đường cong organic kiểu cubic Bezier — control points kéo ngang từ 2 đầu.
 * Tạo curve mềm mại như classic mindmap.
 *
 * `strength` = mức độ kéo control points theo phương ngang (0 = thẳng, 0.5 = cong vừa, 1 = cong cực mạnh).
 */
export function drawOrganicCurve(start: Point, end: Point, strength = 0.5): string {
  const dxValue = end.x - start.x;

  const c1: Point = {
    x: start.x + dxValue * strength,
    y: start.y,
  };

  const c2: Point = {
    x: end.x - dxValue * strength,
    y: end.y,
  };

  return path(moveTo(start), cubicTo(c1, c2, end));
}

/**
 * Heuristic: chọn curve strength theo khoảng cách giữa 2 điểm.
 *
 * Lý do: mind-elixir không truyền depth cho generateSubBranch, nhưng:
 *   - Root → Level 1: distance lớn nhất (qua nhiều cột) → curve rõ (strength 0.4)
 *   - Level 1 → Level 2: distance trung bình → curve mềm (strength 0.45)
 *   - Level 2 → Level 3+: distance ngắn → cong nhẹ (strength 0.35)
 *
 * Threshold dựa trên khoảng cách ngang Δx.
 */
export function curveStrengthByDistance(start: Point, end: Point): number {
  const distanceX = Math.abs(end.x - start.x);

  if (distanceX > 200) return 0.4;   // root → level 1
  if (distanceX > 100) return 0.45;  // level 1 → level 2 (mềm)
  return 0.35;                        // level 2 → level 3+ (vẫn mềm)
}

/**
 * Main branch (Root → Level 1):
 * Cong rõ (strength 0.4) — nhánh chính tỏa ra từ root.
 * Đường nối:
 *   1. Từ cạnh root (lifted -50) cong mềm tới đầu node con
 *   2. Kéo thẳng ngang qua hết node con tạo underline
 */
export function rightOrganicMainBranch(p: BranchParams): string {
  const start = parentOuterCenter(p);
  // Curve end: cạnh trong child (đầu node con), dịch xuống 50px
  const curveEnd: Point = {
    x: isRight(p) ? p.cL : p.cL + p.cW,
    y: p.cT + p.cH / 2 + 50,
  };
  // Underline end: cạnh ngoài child (cuối node con) + extra
  const underlineExtra = 12;
  const underlineEnd: Point = {
    x: isRight(p) ? p.cL + p.cW + underlineExtra : p.cL - underlineExtra,
    y: curveEnd.y,
  };

  const liftedStart: Point = { x: start.x, y: start.y + 50 };

  // Cubic Bezier từ liftedStart → curveEnd với strength 0.4
  const dxValue = curveEnd.x - liftedStart.x;
  const c1: Point = {
    x: liftedStart.x + dxValue * 0.4,
    y: liftedStart.y,
  };
  const c2: Point = {
    x: curveEnd.x - dxValue * 0.4,
    y: curveEnd.y,
  };

  return [
    `M ${liftedStart.x} ${liftedStart.y}`,
    `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${curveEnd.x} ${curveEnd.y}`,
    `L ${underlineEnd.x} ${underlineEnd.y}`,
  ].join(" ");
}

/**
 * Sub branch (Level 1 → Level 2 → Level 3+):
 *
 * Logic:
 *   1. Stem từ cạnh trái parent (đầu node) kéo ngang qua hết parent + extra
 *   2. Cong mềm S-curve từ cuối stem → đầu node con (đúng hướng lên/xuống)
 *   3. Underline thẳng từ đầu node con → cuối node con + extra
 *
 * S-curve direction:
 *   - c1: kéo ngang từ stemEnd theo phương ngang (giữ y stemEnd) → curve bắt đầu phẳng
 *   - c2: kéo ngang từ curveEnd theo phương ngang (giữ y curveEnd) → curve kết thúc phẳng
 *   - Khoảng cách kéo = |Δx| × strength, đảm bảo positive khi child ở bên phải parent
 */
export function rightOrganicSubBranch(p: BranchParams): string {
  // Stem start: cạnh TRÁI parent (đầu node), dịch xuống 50px
  const stemStart: Point = {
    x: isRight(p) ? p.pL : p.pL + p.pW,
    y: p.pT + p.pH / 2 + 50,
  };

  // Stem end: cạnh PHẢI parent + extra
  const stemExtra = 16;
  const stemEnd: Point = {
    x: isRight(p) ? p.pL + p.pW + stemExtra : p.pL - stemExtra,
    y: stemStart.y,
  };

  // Curve end: đầu node con (cạnh trong), dịch xuống 50px
  const curveEnd: Point = {
    x: isRight(p) ? p.cL : p.cL + p.cW,
    y: p.cT + p.cH / 2 + 50,
  };

  // Underline end: cuối node con + extra
  const underlineExtra = 12;
  const underlineEnd: Point = {
    x: isRight(p) ? p.cL + p.cW + underlineExtra : p.cL - underlineExtra,
    y: curveEnd.y,
  };

  // S-curve: dùng |Δx| × sideSign để control points luôn kéo đúng hướng
  // (về phía child theo phương ngang, bất kể parent ở đâu)
  const dxValue = curveEnd.x - stemEnd.x;
  const absDxControl = Math.abs(dxValue);
  const strength = 0.5;
  const sign = sideSign(p);
  const c1: Point = {
    x: stemEnd.x + sign * absDxControl * strength,
    y: stemEnd.y,
  };
  const c2: Point = {
    x: curveEnd.x - sign * absDxControl * strength,
    y: curveEnd.y,
  };

  return [
    `M ${stemStart.x} ${stemStart.y}`,
    `L ${stemEnd.x} ${stemEnd.y}`,
    `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${curveEnd.x} ${curveEnd.y}`,
    `L ${underlineEnd.x} ${underlineEnd.y}`,
  ].join(" ");
}

// ─── Fishbone data helpers ──────────────────────────────────────────────────

const FISHBONE_LAYOUT_IDS = new Set(["fishbone", "fishbone-ishikawa"]);

/** Returns true if the given layoutId should use fishbone rendering */
export function isFishboneLayout(layoutId: string): boolean {
  return FISHBONE_LAYOUT_IDS.has(layoutId);
}

/**
 * Annotates a MindElixirData tree for fishbone rendering.
 * Does NOT mutate the input — returns a deep clone.
 */
export function applyFishboneLayout(
  data: MindElixirData,
  config: Partial<FishboneConfig> = {},
): MindElixirData {
  const { alternating = true } = config;

  const cloned: MindElixirData = JSON.parse(JSON.stringify(data));

  const mainBranches = cloned.nodeData.children ?? [];

  mainBranches.forEach((branch, index) => {
    const side: "top" | "bottom" = alternating
      ? index % 2 === 0
        ? "top"
        : "bottom"
      : "top";

    (branch as NodeObj & { _fishboneSide?: string })._fishboneSide = side;
  });

  return cloned;
}

/** Count total nodes in a tree (for testing / validation) */
export function countNodes(node: NodeObj): number {
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countNodes(child), 0);
}
