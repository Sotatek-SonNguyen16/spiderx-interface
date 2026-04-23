import { PanoramaGalleryPage } from "@/components/panorama/PanoramaGalleryPage";
import { getPanoramaItems } from "@/lib/panoramas";

export const metadata = {
  title: "Panorama 360 Viewer",
  description: "Preview anh equirectangular theo che do 360 do",
};

export default async function PanoramaPage() {
  const panoramas = await getPanoramaItems();

  return <PanoramaGalleryPage panoramas={panoramas} />;
}
