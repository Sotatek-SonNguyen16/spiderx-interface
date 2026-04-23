"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type PanoramaOrientation = "front" | "right" | "back" | "left" | "up" | "down";

export type PanoramaViewerHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  setOrientation: (orientation: PanoramaOrientation) => void;
};

type PanoramaViewerProps = {
  imageSrc: string;
  className?: string;
  children?: ReactNode;
};

const ORIENTATION_VECTOR: Record<PanoramaOrientation, [number, number, number]> = {
  front: [0, 0, 0.1],
  right: [0.1, 0, 0],
  back: [0, 0, -0.1],
  left: [-0.1, 0, 0],
  up: [0, 0.1, 0],
  down: [0, -0.1, 0],
};

export const PanoramaViewer = forwardRef<PanoramaViewerHandle, PanoramaViewerProps>(
  function PanoramaViewer({ imageSrc, className, children }, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useImperativeHandle(ref, () => ({
    zoomIn() {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) {
        return;
      }
      camera.position.multiplyScalar(0.88);
      controls.update();
    },
    zoomOut() {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) {
        return;
      }
      camera.position.multiplyScalar(1.12);
      controls.update();
    },
    resetView() {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) {
        return;
      }
      camera.position.set(0, 0, 0.1);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    setOrientation(orientation) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) {
        return;
      }
      const [x, y, z] = ORIENTATION_VECTOR[orientation];
      camera.position.set(x, y, z);
      controls.target.set(0, 0, 0);
      controls.update();
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 30;
    controls.zoomSpeed = 0.6;
    controls.rotateSpeed = -0.35;
    controls.enableDamping = true;
    controlsRef.current = controls;

    const timer = new THREE.Timer();
    const loader = new THREE.TextureLoader();

    const geometry = new THREE.SphereGeometry(50, 64, 64);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    loader.load(
      imageSrc,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
        setIsLoading(false);
      },
      undefined,
      () => {
        setHasError(true);
        setIsLoading(false);
      }
    );

    let isMounted = true;
    renderer.setAnimationLoop(() => {
      if (!isMounted) {
        return;
      }
      timer.update();
      controls.update();
      renderer.render(scene, camera);
    });

    window.addEventListener("resize", resize);

    return () => {
      isMounted = false;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      controls.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      material.map?.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-black ${
        className ?? ""
      }`}
    >
      <div ref={containerRef} className="h-full w-full" />
      {children}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/45 text-sm text-white">
          Loading image...
        </div>
      )}
      {hasError && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/70 px-4 text-center text-sm text-rose-300">
          Khong the tai anh panorama.
        </div>
      )}
    </div>
  );
}
);
