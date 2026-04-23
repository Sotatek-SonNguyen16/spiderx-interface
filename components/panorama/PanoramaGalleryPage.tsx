"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Compass,
  ChevronUp,
  EllipsisVertical,
  HelpCircle,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  UploadCloud,
} from "lucide-react";

import type { PanoramaItem } from "@/lib/panoramas";
import {
  PanoramaViewer,
  type PanoramaOrientation,
  type PanoramaViewerHandle,
} from "@/components/panorama/PanoramaViewer";

type PanoramaGalleryPageProps = {
  panoramas: PanoramaItem[];
};

type SceneItem = {
  id: string;
  title: string;
  filename: string;
  src: string;
};

const ORIENTATION_SHORTCUTS: Array<{ label: string; key: PanoramaOrientation }> = [
  { label: "Front", key: "front" },
  { label: "Right", key: "right" },
  { label: "Back", key: "back" },
  { label: "Left", key: "left" },
  { label: "Up", key: "up" },
  { label: "Down", key: "down" },
];

const ORIENTATION_LABEL_MAP: Record<PanoramaOrientation, string> = {
  front: "N",
  right: "E",
  back: "S",
  left: "W",
  up: "UP",
  down: "DN",
};

const formatTitleFromFile = (fileName: string): string =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export function PanoramaGalleryPage({ panoramas }: PanoramaGalleryPageProps) {
  return (
    <Suspense fallback={<PanoramaGalleryLoading />}>
      <PanoramaGalleryPageContent panoramas={panoramas} />
    </Suspense>
  );
}

function PanoramaGalleryLoading() {
  return <section className="min-h-screen bg-[#050b1a] p-8 text-[#d9e3ff]">Loading viewer...</section>;
}

function PanoramaGalleryPageContent({ panoramas }: PanoramaGalleryPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const viewerRef = useRef<PanoramaViewerHandle | null>(null);
  const createdUrlsRef = useRef<string[]>([]);

  const [uploadedScenes, setUploadedScenes] = useState<SceneItem[]>([]);
  const [activeOrientation, setActiveOrientation] = useState<PanoramaOrientation>("front");
  const [libraryOpen, setLibraryOpen] = useState(true);

  const baseScenes = useMemo<SceneItem[]>(
    () =>
      panoramas.map((item) => ({
        id: item.id,
        title: item.title.toLowerCase(),
        filename: item.filename,
        src: item.src,
      })),
    [panoramas]
  );

  const scenes = useMemo(() => [...uploadedScenes, ...baseScenes], [baseScenes, uploadedScenes]);
  const sceneParam = searchParams.get("scene");
  const fallbackSceneId = scenes[0]?.id ?? null;
  const validSceneId = scenes.some((item) => item.id === sceneParam) ? sceneParam : fallbackSceneId;
  const [selectedId, setSelectedId] = useState<string | null>(validSceneId);

  useEffect(() => {
    setSelectedId(validSceneId);
  }, [validSceneId]);

  useEffect(
    () => () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  const activeScene = useMemo(
    () => scenes.find((item) => item.id === selectedId) ?? null,
    [scenes, selectedId]
  );

  useEffect(() => {
    if (!activeScene) {
      return;
    }
    if (sceneParam === activeScene.id) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("scene", activeScene.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeScene, pathname, router, sceneParam, searchParams]);

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    createdUrlsRef.current.push(objectUrl);

    const id = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    setUploadedScenes((previous) => [
      {
        id,
        title: formatTitleFromFile(file.name) || "uploaded scene",
        filename: file.name,
        src: objectUrl,
      },
      ...previous,
    ]);
    setSelectedId(id);
    setActiveOrientation("front");
    viewerRef.current?.resetView();
    event.target.value = "";
  };

  if (!activeScene) {
    return (
      <section className="min-h-screen bg-[#050b1a] p-8 text-[#d9e3ff]">
        No panorama scene available in <code>public/images/360</code>.
      </section>
    );
  }

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-[#050b1a] text-[#eef3ff]">
      <PanoramaViewer ref={viewerRef} imageSrc={activeScene.src} className="h-screen w-screen">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,24,0.2),rgba(2,8,24,0.03)_45%,rgba(2,8,24,0.3)_100%)]" />

        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-[#081535]/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Compass className="h-3.5 w-3.5" />
          {ORIENTATION_LABEL_MAP[activeOrientation]}
        </div>

        <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 rounded-2xl bg-[#081537]/72 p-2 backdrop-blur-md">
          <button
            type="button"
            onClick={() => viewerRef.current?.zoomIn()}
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#172851]/68 text-[#eaf0ff] transition hover:bg-[#26407c]"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => viewerRef.current?.zoomOut()}
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#172851]/68 text-[#eaf0ff] transition hover:bg-[#26407c]"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 z-20 w-[min(740px,88%)] -translate-x-1/2 rounded-2xl bg-[#0a1638]/60 p-2 backdrop-blur-md">
          <div className="grid grid-cols-6 gap-2">
            {ORIENTATION_SHORTCUTS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveOrientation(item.key);
                  viewerRef.current?.setOrientation(item.key);
                }}
                className={`overflow-hidden rounded-lg transition ${
                  activeOrientation === item.key ? "ring-1 ring-[#6880ff]" : "opacity-90"
                }`}
              >
                <img src={activeScene.src} alt={item.label} className="h-9 w-full object-cover" />
                <p className="bg-[#0d1a3f]/90 px-1 py-0.5 text-center text-[11px] font-medium text-[#ecf2ff]">
                  {item.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 text-white/85">
          <ChevronUp className="h-4 w-4 rotate-180" />
          <span className="text-xs">Drag to look around, scroll to zoom.</span>
        </div>
      </PanoramaViewer>

      <div className="absolute left-4 top-4 z-30 flex items-start gap-2">
        <button
          type="button"
          onClick={() => setLibraryOpen((previous) => !previous)}
          className="grid h-9 w-9 place-items-center rounded-lg bg-[#081535]/78 text-white backdrop-blur-md transition hover:bg-[#122454]"
          aria-label="Toggle scene library"
        >
          {libraryOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>

        {libraryOpen && (
          <aside className="w-[230px] rounded-2xl bg-[linear-gradient(180deg,rgba(16,29,62,0.9),rgba(9,17,39,0.88))] p-2.5 shadow-[0_12px_30px_rgba(3,9,25,0.5)] backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#d6def7]">Scenes</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="grid h-7 w-7 place-items-center rounded-md bg-[#152954]/70 text-[#d8e4ff] transition hover:bg-[#22407f]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="custom-scrollbar max-h-[34vh] space-y-1.5 overflow-auto pr-1">
              {scenes.map((scene) => {
                const active = activeScene.id === scene.id;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(scene.id);
                      setActiveOrientation("front");
                      viewerRef.current?.resetView();
                    }}
                    className={`w-full rounded-xl p-1.5 text-left transition ${
                      active ? "bg-[#20376e]/85" : "bg-[#131f45]/70 hover:bg-[#1a2d5a]/85"
                    }`}
                  >
                    <div className="relative mb-1 overflow-hidden rounded-md">
                      <img src={scene.src} alt={scene.title} className="h-12 w-full object-cover" />
                      {active && (
                        <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-[#7388ff] text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <p className="line-clamp-1 text-xs font-semibold text-white">{scene.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-[10px] text-[#93a3cf]">{scene.filename}</p>
                      </div>
                      <EllipsisVertical className="h-3.5 w-3.5 text-[#9eaed7]" />
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 flex h-[66px] w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-[#111f42]/60 text-[#cfdbfb] transition hover:bg-[#182d5f]/75"
            >
              <UploadCloud className="h-4.5 w-4.5 text-[#8ea2d9]" />
              <p className="text-xs font-medium">Add 360 image</p>
              <p className="text-[10px] text-[#8fa0ca]">PNG . JPG . HDRI</p>
            </button>

            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[#101f43]/85 text-[11px] font-medium text-[#d5def8] transition hover:bg-[#1a3162]"
              >
                <HelpCircle className="h-3 w-3" />
                Help
              </button>
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[#101f43]/85 text-[11px] font-medium text-[#d5def8] transition hover:bg-[#1a3162]"
              >
                <Search className="h-3 w-3" />
                Search
              </button>
            </div>
          </aside>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
        className="hidden"
        onChange={handleUploadFile}
      />
    </section>
  );
}
