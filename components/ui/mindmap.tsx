"use client";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from "react";
import {
  Minus,
  Plus,
  Download,
  Loader2,
  Maximize,
  ScanSearch,
} from "lucide-react";

import { cn } from "@/lib/cn";
import {
  type MindElixirInstance,
  type MindElixirData,
  type NodeObj,
  type Options,
  type Theme as MindElixirTheme,
} from "mind-elixir";
import { snapdom, type SnapdomOptions } from "@zumer/snapdom";
import type { MindmapLineStyle } from "@/lib/mindmap-elixir/template-presets";
import {
  fishboneMainBranch,
  fishboneSubBranch,
  bracketMainBranch,
  bracketSubBranch,
  rightOrganicMainBranch,
  rightOrganicSubBranch,
} from "@/lib/mindmap-elixir/fishbone-layout";

// Check document class for theme (works with next-themes, etc.)
function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

// Get system preference
function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useResolvedTheme(themeProp?: "light" | "dark"): "light" | "dark" {
  const [detectedTheme, setDetectedTheme] = useState<"light" | "dark">(
    () => getDocumentTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    if (themeProp) return; // Skip detection if theme is provided via prop

    // Watch for document class changes (e.g., next-themes toggling dark class)
    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) {
        setDetectedTheme(docTheme);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only use system preference if no document class is set
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [themeProp]);

  return themeProp ?? detectedTheme;
}

type Theme = "light" | "dark";

// Context for MindMap
interface MindMapContextValue {
  mind: MindElixirInstance | null;
  isLoaded: boolean;
}

const MindMapContext = createContext<MindMapContextValue | null>(null);

export function useMindMap() {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error("useMindMap must be used within a MindMap component");
  }
  return context;
}

// MindMap Props
type MindMapData = MindElixirData;

// Ref type to expose MindElixir instance to parent components
export interface MindMapRef {
  instance: MindElixirInstance | null;
}

interface MindMapProps {
  children?: ReactNode;
  data?: MindMapData;
  className?: string;
  direction?: 0 | 1 | 2;
  contextMenu?: boolean;
  nodeMenu?: boolean;
  keypress?: boolean;
  locale?: "en" | "zh_CN" | "zh_TW" | "ja" | "pt";
  overflowHidden?: boolean;
  mainLinkStyle?: number;
  theme?: "dark" | "light";
  monochrome?: boolean;
  fit?: boolean;
  readonly?: boolean;
  smoothInteractions?: boolean;
  /** v2: custom SVG stroke style injected into connector paths */
  lineStyle?: MindmapLineStyle;
  /** v2: activates .mindmap-fishbone CSS class for Ishikawa layout */
  fishbone?: boolean;
  /** v2: layout engine — determines which custom path generators to use */
  layoutEngine?: "default" | "fishbone" | "bracket" | "right-organic";
  onChange?: (data: MindMapData, operation: unknown) => void;
  onOperation?: (operation: unknown) => void;
  onSelectNodes?: (nodeObj: NodeObj[]) => void;
  loader?: ReactNode;
}

function DefaultLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
      <Loader2 className="size-8 animate-spin text-ink2" />
    </div>
  );
}

// Common spacing and layout configuration
const commonSpacing = {
  "--node-gap-x": "48px",
  "--node-gap-y": "16px",
  "--main-gap-x": "24px",
  "--main-gap-y": "32px",
  "--root-radius": "0.625rem",
  "--main-radius": "0.5rem",
  "--topic-padding": "8px 16px",
  "--map-padding": "48px",
};

// Helper function to create theme
function createTheme(
  name: string,
  type: "light" | "dark",
  colors: {
    mainColor: string;
    mainBgcolor: string;
    color: string;
    bgcolor: string;
    selected: string;
    accentColor: string;
    rootColor: string;
    rootBgcolor: string;
    rootBorderColor: string;
    panelColor: string;
    panelBgcolor: string;
    panelBorderColor: string;
  },
  palette: string[],
): MindElixirTheme {
  return {
    name,
    type,
    palette,
    cssVar: {
      ...commonSpacing,
      "--main-color": colors.mainColor,
      "--main-bgcolor": colors.mainBgcolor,
      "--main-bgcolor-transparent": `${colors.mainBgcolor.replace(")", " / 95%)")}`,
      "--color": colors.color,
      "--bgcolor": colors.bgcolor,
      "--selected": colors.selected,
      "--accent-color": colors.accentColor,
      "--root-color": colors.rootColor,
      "--root-bgcolor": colors.rootBgcolor,
      "--root-border-color": colors.rootBorderColor,
      "--panel-color": colors.panelColor,
      "--panel-bgcolor": colors.panelBgcolor,
      "--panel-border-color": colors.panelBorderColor,
    },
  };
}

// Base color configurations
const lightColors = {
  mainColor: "oklch(0.145 0 0)", // foreground
  mainBgcolor: "oklch(1 0 0)", // background (white)
  color: "oklch(0.145 0 0)", // foreground
  bgcolor: "oklch(1 0 0)", // card background
  selected: "oklch(0.205 0 0)", // primary
  rootColor: "oklch(0.985 0 0)", // primary-foreground
  rootBgcolor: "oklch(0.205 0 0)", // primary
  rootBorderColor: "oklch(0.205 0 0)", // primary
  panelColor: "oklch(0.145 0 0)", // foreground
  panelBgcolor: "oklch(1 0 0)", // popover
  panelBorderColor: "oklch(0.922 0 0)", // border
};

const darkColors = {
  mainColor: "oklch(0.985 0 0)", // foreground
  mainBgcolor: "oklch(0.145 0 0)", // background (dark)
  color: "oklch(0.985 0 0)", // foreground
  bgcolor: "oklch(0.205 0 0)", // card background
  selected: "oklch(0.922 0 0)", // primary
  rootColor: "oklch(0.205 0 0)", // primary-foreground
  rootBgcolor: "oklch(0.922 0 0)", // primary
  rootBorderColor: "oklch(0.922 0 0)", // primary
  panelColor: "oklch(0.985 0 0)", // foreground
  panelBgcolor: "oklch(0.205 0 0)", // popover
  panelBorderColor: "oklch(1 0 0 / 10%)", // border
};

// Shadcn-styled light theme
const lightTheme: MindElixirTheme = createTheme(
  "shadcn-light",
  "light",
  {
    ...lightColors,
    accentColor: "oklch(0.646 0.222 41.116)", // chart-1 (vibrant)
  },
  [
    "oklch(0.646 0.222 41.116)", // chart-1: vibrant orange
    "oklch(0.6 0.118 184.704)", // chart-2: teal
    "oklch(0.398 0.07 227.392)", // chart-3: blue
    "oklch(0.828 0.189 84.429)", // chart-4: yellow-green
    "oklch(0.769 0.188 70.08)", // chart-5: warm yellow
    "oklch(0.488 0.243 264.376)", // purple
    "oklch(0.696 0.17 162.48)", // mint
  ],
);

// Shadcn-styled dark theme
const darkTheme: MindElixirTheme = createTheme(
  "shadcn-dark",
  "dark",
  {
    ...darkColors,
    accentColor: "oklch(0.488 0.243 264.376)", // chart-1 (purple)
  },
  [
    "oklch(0.488 0.243 264.376)", // chart-1: purple
    "oklch(0.696 0.17 162.48)", // chart-2: mint
    "oklch(0.769 0.188 70.08)", // chart-3: warm yellow
    "oklch(0.627 0.265 303.9)", // chart-4: pink
    "oklch(0.645 0.246 16.439)", // chart-5: coral
    "oklch(0.646 0.222 41.116)", // orange
    "oklch(0.6 0.118 184.704)", // teal
  ],
);

// Monochrome variants - reuse base colors, only change accentColor and palette
const lightThemeMonochrome: MindElixirTheme = createTheme(
  "shadcn-light-mono",
  "light",
  {
    ...lightColors,
    accentColor: "oklch(0.205 0 0)", // primary
  },
  ["oklch(0.205 0 0)"], // Single primary color
);

const darkThemeMonochrome: MindElixirTheme = createTheme(
  "shadcn-dark-mono",
  "dark",
  {
    ...darkColors,
    accentColor: "oklch(0.922 0 0)", // primary
  },
  ["oklch(0.922 0 0)"], // Single primary color
);

// Helper function to get the appropriate theme
function getTheme(isDark: boolean, isMonochrome: boolean): MindElixirTheme {
  if (isDark) {
    return isMonochrome ? darkThemeMonochrome : darkTheme;
  }
  return isMonochrome ? lightThemeMonochrome : lightTheme;
}

const SIDE = 2;
export const MindMap = forwardRef<MindMapRef, MindMapProps>(function MindMap(
  {
    children,
    data,
    className,
    direction = SIDE,
    contextMenu = true,
    nodeMenu = true,
    keypress = true,
    locale = "en",
    overflowHidden = false,
    mainLinkStyle = 2,
    theme: themeProp,
    monochrome = false,
    fit = true,
    readonly = false,
    smoothInteractions = false,
    lineStyle,
    fishbone = false,
    layoutEngine: layoutEngineProp = "default",
    onChange,
    onOperation,
    onSelectNodes,
    loader,
  }: MindMapProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindRef = useRef<MindElixirInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mindInstance, setMindInstance] = useState<MindElixirInstance | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);
  const resolvedTheme = useResolvedTheme(themeProp);
  const id = useId();
  const fitTimerRef = useRef<number | null>(null);

  const scheduleScaleFit = (delay = 120) => {
    if (!fit || !mindRef.current) return;
    if (fitTimerRef.current) {
      window.clearTimeout(fitTimerRef.current);
    }
    fitTimerRef.current = window.setTimeout(() => {
      mindRef.current?.scaleFit();
    }, delay);
  };

  // Expose mind instance to parent component via ref
  useImperativeHandle(
    ref,
    () => ({
      instance: mindRef.current,
    }),
    [],
  );

  // Store resolvedTheme in a ref for use in effects without triggering re-runs
  const resolvedThemeRef = useRef(resolvedTheme);
  useEffect(() => {
    resolvedThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  // Store callbacks in refs to avoid re-initialization when they change
  const onChangeRef = useRef(onChange);
  const onOperationRef = useRef(onOperation);
  const onSelectNodesRef = useRef(onSelectNodes);

  useEffect(() => {
    onChangeRef.current = onChange;
    onOperationRef.current = onOperation;
    onSelectNodesRef.current = onSelectNodes;
  }, [onChange, onOperation, onSelectNodes]);

  // Store initial data in ref - only used for initialization, not reactive
  const initialDataRef = useRef(data);

  // Ensure component only renders on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize MindElixir (client-side only)
  useEffect(() => {
    if (!isMounted || !containerRef.current || mindRef.current) return;

    let isSubscribed = true;

    // Dynamic import to avoid SSR issues
    import("mind-elixir").then((MindElixirModule) => {
      if (!isSubscribed || !containerRef.current) return;

      const MindElixir = MindElixirModule.default;

      // Prioritize theme from data, then fall back to component props
      const initialData = initialDataRef.current || MindElixir.new("Mind Map");
      const themeToUse =
        initialData.theme ||
        getTheme(resolvedThemeRef.current === "dark", monochrome);

      const options = {
        el: containerRef.current,
        direction,
        contextMenu,
        toolBar: false,
        nodeMenu,
        keypress,
        locale,
        overflowHidden,
        mainLinkStyle,
        draggable: !readonly,
        editable: !readonly,
        alignment: "nodes",
        theme: themeToUse,
        // v2: use custom path generators based on layout engine
        ...(layoutEngineProp === "fishbone" ? {
          generateMainBranch: fishboneMainBranch,
          generateSubBranch: fishboneSubBranch,
        } : layoutEngineProp === "bracket" ? {
          generateMainBranch: bracketMainBranch,
          generateSubBranch: bracketSubBranch,
        } : layoutEngineProp === "right-organic" ? {
          generateMainBranch: rightOrganicMainBranch,
          generateSubBranch: rightOrganicSubBranch,
        } : {}),
      } as Options;

      try {
        const mind = new MindElixir(options);
        mind.init(initialData);

        if (isSubscribed) {
          mindRef.current = mind;
          setMindInstance(mind);
          setIsLoaded(true);

          // Auto-fit if enabled
          if (fit) {
            window.requestAnimationFrame(() => scheduleScaleFit(80));
          }

          // Event listeners (using refs to avoid re-initialization)
          mind.bus.addListener("operation", (operation) => {
            // Call onOperation if provided
            if (onOperationRef.current) {
              onOperationRef.current(operation);
            }
            // Call onChange if provided
            if (onChangeRef.current) {
              const updatedData = mind.getData();
              // Mark this as an internal change to prevent refresh loop
              isInternalChangeRef.current = true;
              onChangeRef.current(updatedData, operation);
            }

            scheduleScaleFit(180);
          });

          mind.bus.addListener("expandNode", () => {
            scheduleScaleFit(220);
          });

          if (onSelectNodesRef.current) {
            mind.bus.addListener("selectNodes", (nodeObj) => {
              onSelectNodesRef.current?.(nodeObj);
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize MindElixir:", error);
      }
    });

    return () => {
      isSubscribed = false;
      // Note: We intentionally don't clean up the mind instance here
      // to avoid DOM manipulation conflicts with React
      // The instance will be garbage collected when the component unmounts
      if (fitTimerRef.current) {
        window.clearTimeout(fitTimerRef.current);
      }
      mindRef.current = null;
    };
  }, [
    isMounted,
    direction,
    contextMenu,
    nodeMenu,
    keypress,
    locale,
    overflowHidden,
    mainLinkStyle,
    monochrome,
    readonly,
    fit,
    smoothInteractions,
    fishbone,
    layoutEngineProp,
  ]);

  // Track internal changes to avoid refresh loops
  const isInternalChangeRef = useRef(false);

  // Update data when it changes
  useEffect(() => {
    if (mindRef.current && data && isLoaded) {
      // Skip refresh if this change came from onChange (internal change)
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false;
        return;
      }
      mindRef.current.refresh(data);
      scheduleScaleFit(140);
    }
  }, [data, isLoaded]);

  // v2: Draw fishbone spine overlay — a horizontal line through root node
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !fishbone) return;

    const drawSpine = () => {
      const container = containerRef.current;
      if (!container) return;

      // Remove previous overlay
      container.querySelector(".fishbone-spine-overlay")?.remove();

      const nodeLayer = container.querySelector("me-nodes");
      const rootEl = nodeLayer?.querySelector(":scope > me-root > me-tpc");
      if (!nodeLayer || !rootEl) return;

      const containerRect = container.getBoundingClientRect();
      const rootRect = rootEl.getBoundingClientRect();

      // Spine extends from left edge of container to right edge, at root's vertical center
      const rootCenterY = rootRect.top - containerRect.top + rootRect.height / 2;

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("fishbone-spine-overlay");
      svg.setAttribute("width", `${container.clientWidth}`);
      svg.setAttribute("height", `${container.clientHeight}`);
      svg.setAttribute("viewBox", `0 0 ${container.clientWidth} ${container.clientHeight}`);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", `${rootCenterY.toFixed(1)}`);
      line.setAttribute("x2", `${container.clientWidth}`);
      line.setAttribute("y2", `${rootCenterY.toFixed(1)}`);
      svg.appendChild(line);

      container.appendChild(svg);
    };

    const timers = [150, 500, 1200].map((d) => window.setTimeout(drawSpine, d));
    const observer = new ResizeObserver(drawSpine);
    observer.observe(containerRef.current);

    const opListener = () => window.setTimeout(drawSpine, 100);
    mindRef.current?.bus.addListener("operation", opListener);
    mindRef.current?.bus.addListener("expandNode", opListener);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      observer.disconnect();
      containerRef.current?.querySelector(".fishbone-spine-overlay")?.remove();
      mindRef.current?.bus.removeListener?.("operation", opListener);
      mindRef.current?.bus.removeListener?.("expandNode", opListener);
    };
  }, [fishbone, data, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const isPaperTemplate = className?.includes("mindmap-paper-template");
    const markerId = `paper-arrowhead-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    const drawPaperConnectors = () => {
      const container = containerRef.current;
      if (!container) return;

      const existingOverlay = container.querySelector(".paper-arrow-overlay");
      existingOverlay?.remove();
      container.classList.remove("paper-connectors-ready");

      if (!isPaperTemplate) return;

      const nodeLayer = container.querySelector("me-nodes");
      const rootTopic = nodeLayer?.querySelector(":scope > me-root > me-tpc");
      if (!nodeLayer || !rootTopic) return;

      const containerRect = container.getBoundingClientRect();
      const overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      overlay.classList.add("paper-arrow-overlay");
      overlay.setAttribute("width", `${container.clientWidth}`);
      overlay.setAttribute("height", `${container.clientHeight}`);
      overlay.setAttribute("viewBox", `0 0 ${container.clientWidth} ${container.clientHeight}`);

      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", markerId);
      marker.setAttribute("viewBox", "0 0 12 10");
      marker.setAttribute("markerWidth", "5");
      marker.setAttribute("markerHeight", "5");
      marker.setAttribute("refX", "9.2");
      marker.setAttribute("refY", "5");
      marker.setAttribute("orient", "auto");
      marker.setAttribute("markerUnits", "strokeWidth");

      const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      markerPath.setAttribute("d", "M 1 1 L 10 5 L 1 9");
      markerPath.setAttribute("fill", "none");
      markerPath.setAttribute("stroke", "#34474c");
      markerPath.setAttribute("stroke-width", "2.1");
      markerPath.setAttribute("stroke-linecap", "round");
      markerPath.setAttribute("stroke-linejoin", "round");
      marker.append(markerPath);
      defs.append(marker);
      overlay.append(defs);

      const directChildren = (element: Element, tagName: string) =>
        Array.from(element.children).filter(
          (child) => child.tagName.toLowerCase() === tagName,
        );

      const directChild = (element: Element, tagName: string) =>
        directChildren(element, tagName)[0];

      const directTopic = (element: Element) => {
        const topic = directChild(element, "me-tpc");
        if (topic) return topic;

        const parent = directChild(element, "me-parent");
        return parent ? directChild(parent, "me-tpc") : undefined;
      };

      const center = (rect: DOMRect) => ({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      });

      const edgePoint = (rect: DOMRect, towardX: number) => {
        const midpoint = center(rect);
        return {
          x:
            towardX >= midpoint.x
              ? rect.right - containerRect.left
              : rect.left - containerRect.left,
          y: midpoint.y,
        };
      };

      const addConnector = (fromTopic: Element | undefined, toTopic: Element | undefined) => {
        if (!fromTopic || !toTopic) return;

        const fromRect = fromTopic.getBoundingClientRect();
        const toRect = toTopic.getBoundingClientRect();
        if (!fromRect.width || !toRect.width) return;

        const fromCenter = center(fromRect);
        const toCenter = center(toRect);
        const start = edgePoint(fromRect, toCenter.x);
        const end = edgePoint(toRect, fromCenter.x);
        const dx = end.x - start.x;
        const curve = Math.max(36, Math.min(96, Math.abs(dx) * 0.42));
        const c1x = start.x + (dx >= 0 ? curve : -curve);
        const c2x = end.x - (dx >= 0 ? curve : -curve);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
          "d",
          `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${c1x.toFixed(1)} ${start.y.toFixed(1)}, ${c2x.toFixed(1)} ${end.y.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
        );
        path.setAttribute("marker-end", `url(#${markerId})`);
        overlay.append(path);
      };

      directChildren(nodeLayer, "me-main").forEach((mainLayer) => {
        directChildren(mainLayer, "me-wrapper").forEach((branchWrapper) => {
          const branchTopic = directTopic(branchWrapper);
          addConnector(rootTopic, branchTopic);

          const childHost = directChild(branchWrapper, "me-children");
          if (!childHost) return;

          directChildren(childHost, "me-wrapper").forEach((childWrapper) => {
            addConnector(branchTopic, directTopic(childWrapper));
          });
        });
      });

      const connectorCount = overlay.querySelectorAll("path[marker-end]").length;
      if (connectorCount === 0) return;

      container.append(overlay);
      container.classList.add("paper-connectors-ready");
    };

    const timers = [120, 420, 900, 1600].map((delay) =>
      window.setTimeout(drawPaperConnectors, delay),
    );
    const observer = new ResizeObserver(drawPaperConnectors);
    observer.observe(containerRef.current);

    const operationListener = () => window.setTimeout(drawPaperConnectors, 80);
    mindRef.current?.bus.addListener("operation", operationListener);
    mindRef.current?.bus.addListener("expandNode", operationListener);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      containerRef.current?.classList.remove("paper-connectors-ready");
      containerRef.current?.querySelector(".paper-arrow-overlay")?.remove();
      mindRef.current?.bus.removeListener?.("operation", operationListener);
      mindRef.current?.bus.removeListener?.("expandNode", operationListener);
    };
  }, [className, data, id, isLoaded]);

  useEffect(() => {
    if (!fit || !containerRef.current || !isLoaded) return;

    const observer = new ResizeObserver(() => {
      scheduleScaleFit(160);
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fit, isLoaded]);

  // v2: inject custom SVG line style (dashed/dotted/thick) into connector paths
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const styleId = `me-line-style-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const existing = containerRef.current.querySelector(`#${styleId}`);

    if (!lineStyle || Object.keys(lineStyle).length === 0) {
      existing?.remove();
      return;
    }

    const safeContainerId = `mindmap-${id}`.replace(/[^a-zA-Z0-9_-]/g, "");
    const parts: string[] = [];

    // Sanitize each value — only allow safe CSS value characters
    const safeDasharray = lineStyle.strokeDasharray?.replace(/[^0-9.\s]/g, "");
    const safeWidth =
      lineStyle.strokeWidth !== undefined &&
      lineStyle.strokeWidth >= 0.5 &&
      lineStyle.strokeWidth <= 8
        ? lineStyle.strokeWidth
        : undefined;
    const safeLinecap =
      lineStyle.strokeLinecap === "round" ||
      lineStyle.strokeLinecap === "square" ||
      lineStyle.strokeLinecap === "butt"
        ? lineStyle.strokeLinecap
        : undefined;
    const safeOpacity =
      lineStyle.opacity !== undefined &&
      lineStyle.opacity >= 0 &&
      lineStyle.opacity <= 1
        ? lineStyle.opacity
        : undefined;

    if (safeDasharray) parts.push(`stroke-dasharray: ${safeDasharray};`);
    if (safeWidth !== undefined) parts.push(`stroke-width: ${safeWidth}px;`);
    if (safeLinecap) parts.push(`stroke-linecap: ${safeLinecap};`);
    if (safeOpacity !== undefined) parts.push(`opacity: ${safeOpacity};`);

    if (parts.length === 0) {
      existing?.remove();
      return;
    }

    const css = `
      #${safeContainerId} me-main svg path,
      #${safeContainerId} me-main svg polyline,
      #${safeContainerId} me-main svg line,
      #${safeContainerId} me-children svg path,
      #${safeContainerId} me-children svg polyline,
      #${safeContainerId} me-children svg line {
        ${parts.join("\n        ")}
      }
    `;

    if (existing) {
      existing.textContent = css;
    } else {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = css;
      containerRef.current.appendChild(styleEl);
    }

    return () => {
      containerRef.current?.querySelector(`#${styleId}`)?.remove();
    };
  }, [lineStyle, isLoaded, id]);

  // Update theme when resolvedTheme or monochrome changes
  // BUT only if the data itself doesn't have a theme (data.theme has highest priority)
  useEffect(() => {
    if (!mindRef.current || !isLoaded) return;

    // Check if current data has its own theme
    const currentData = mindRef.current.getData();
    if (currentData.theme) {
      // Data has its own theme, don't override it with prop changes
      return;
    }

    // No theme in data, apply theme from props
    const newTheme = getTheme(resolvedTheme === "dark", monochrome);
    mindRef.current.changeTheme(newTheme);
  }, [resolvedTheme, monochrome, isLoaded]);

  return (
    <MindMapContext.Provider value={{ mind: mindInstance, isLoaded }}>
      <div
        className={cn(
          "relative w-full h-full",
          smoothInteractions && "mindmap-smooth",
          fishbone && "mindmap-fishbone",
          layoutEngineProp === "bracket" && "mindmap-bracket",
          layoutEngineProp === "right-organic" && "mindmap-right-organic",
          className,
        )}
      >
        <div
          key={id}
          ref={containerRef}
          id={`mindmap-${id}`}
          className="h-full w-full overflow-hidden rounded-lg bg-surface"
        />
        {!isMounted || !isLoaded ? loader || <DefaultLoader /> : null}
        {children}
      </div>
    </MindMapContext.Provider>
  );
});

// MindMap Controls
interface MindMapControlsProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showFit?: boolean;
  showExport?: boolean;
  className?: string;
  onExport?: (file: Blob, filename: string) => void;
}

export function MindMapControls({
  position = "top-right",
  showZoom = true,
  showFit = true,
  showExport = true,
  className,
  onExport,
}: MindMapControlsProps) {
  const { mind, isLoaded } = useMindMap();
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    if (mind) {
      const currentScale = mind.scaleVal || 1;
      mind.scale(currentScale + 0.2);
    }
  };

  const handleZoomOut = () => {
    if (mind) {
      const currentScale = mind.scaleVal || 1;
      mind.scale(Math.max(0.2, currentScale - 0.2));
    }
  };

  const handleFit = () => {
    if (mind) {
      mind.scaleFit();
    }
  };

  const handleExport = async () => {
    if (mind) {
      try {
        // Export as image using snapdom
        const result = await snapdom(mind.nodes);
        // Use root node's topic as filename
        const rootTopic = mind.nodeData.topic || "mindmap";
        const filename = `${rootTopic}.jpg`;
        const options = {
          type: "jpg",
          filename: rootTopic,
          quality: 1,
          backgroundColor: mind.theme.cssVar["--bgcolor"],
        } as SnapdomOptions;

        // Get the blob for the callback
        if (onExport) {
          const blob = await result.toBlob(options);
          onExport(blob, filename);
        }

        // Download the file
        await result.download(options);
      } catch (error) {
        console.error("Failed to export mind map:", error);
      }
    }
  };

  const handleFullscreen = () => {
    const container = mind?.container?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      // When exiting fullscreen, call scaleFit to ensure content is visible
      if (!isNowFullscreen && mind) {
        mind.scaleFit();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [mind]);

  if (!mounted || !isLoaded) return null;

  const positionClasses = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
  };

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col gap-1",
        positionClasses[position],
        className,
      )}
    >
      {showZoom && (
        <>
          <button
            onClick={handleZoomIn}
            className="flex size-8 items-center justify-center rounded-md border border-border/50 bg-surface/95 shadow-lg backdrop-blur-md transition-colors hover:bg-primarySoft"
            aria-label="Zoom in"
          >
            <Plus className="size-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="flex size-8 items-center justify-center rounded-md border border-border/50 bg-surface/95 shadow-lg backdrop-blur-md transition-colors hover:bg-primarySoft"
            aria-label="Zoom out"
          >
            <Minus className="size-4" />
          </button>
        </>
      )}
      {showFit && (
        <button
          onClick={handleFit}
          className="flex size-8 items-center justify-center rounded-md border border-border/50 bg-surface/95 shadow-lg backdrop-blur-md transition-colors hover:bg-primarySoft"
          aria-label="Fit to screen"
        >
          <ScanSearch className="size-4" />
        </button>
      )}
      <button
        onClick={handleFullscreen}
        className="flex size-8 items-center justify-center rounded-md border border-border/50 bg-surface/95 shadow-lg backdrop-blur-md transition-colors hover:bg-primarySoft"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        <Maximize className="size-4" />
      </button>
      {showExport && (
        <button
          onClick={handleExport}
          className="flex size-8 items-center justify-center rounded-md border border-border/50 bg-surface/95 shadow-lg backdrop-blur-md transition-colors hover:bg-primarySoft"
          aria-label="Download as image"
        >
          <Download className="size-4" />
        </button>
      )}
    </div>
  );
}

// Export components
