import { readdir } from "node:fs/promises";
import path from "node:path";

export type PanoramaItem = {
  id: string;
  filename: string;
  src: string;
  title: string;
};

const PANORAMA_DIRECTORY = path.join(process.cwd(), "public", "images", "360");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const toPanoramaId = (filename: string): string =>
  filename
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toDisplayTitle = (filename: string): string =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getPanoramaItems = async (): Promise<PanoramaItem[]> => {
  let files: string[] = [];

  try {
    files = await readdir(PANORAMA_DIRECTORY);
  } catch {
    return [];
  }

  return files
    .filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((filename, index) => {
      const id = toPanoramaId(filename) || `scene-${index + 1}`;
      return {
        id,
        filename,
        src: `/images/360/${filename}`,
        title: toDisplayTitle(filename),
      };
    });
};
