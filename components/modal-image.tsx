"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";

interface ModalImageProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  fullImage: StaticImageData;
  fullImageWidth: number;
  fullImageHeight: number;
}

export default function ModalImage({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  fullImage,
  fullImageWidth,
  fullImageHeight,
}: ModalImageProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      {/* Image thumbnail */}
      <button
        className="group relative flex items-center justify-center rounded-2xl focus:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200"
        onClick={() => {
          setModalOpen(true);
        }}
        aria-label="View full image"
        data-aos="fade-up"
        data-aos-delay={200}
      >
        <figure className="relative overflow-hidden rounded-2xl bg-blue-50 p-2">
          <Image
            className="transition-transform duration-300 group-hover:scale-105 rounded-xl"
            src={thumb}
            width={thumbWidth}
            height={thumbHeight}
            priority
            alt={thumbAlt}
          />
        </figure>
        {/* Expand icon */}
        <span className="pointer-events-none absolute p-2.5 before:absolute before:inset-0 before:rounded-full before:bg-gray-950/80 before:duration-300 group-hover:before:scale-110">
          <span className="relative flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
              />
            </svg>
          </span>
        </span>
      </button>
      {/* End: Image thumbnail */}

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 z-99999 bg-black/70 transition-opacity duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-99999 flex px-4 py-6 sm:px-6">
          <div className="mx-auto flex h-full max-w-6xl items-center">
            <DialogPanel
              transition
              className="max-h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
              <Image
                src={fullImage}
                width={fullImageWidth}
                height={fullImageHeight}
                alt={thumbAlt}
                className="h-full w-full object-contain"
              />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
