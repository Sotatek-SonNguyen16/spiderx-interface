"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { recipes } from "./recipes";
import { X } from "lucide-react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  widthClass = "w-[420px] max-w-[90vw]",
}: DrawerProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/20 backdrop-blur-[2px]" />
        </TransitionChild>

        {/* Drawer panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel
                className={cn(
                  "h-full bg-surface border-l border-border shadow-s2 rounded-l-xl",
                  widthClass
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
                  <div>
                    <DialogTitle className="text-lg font-semibold text-ink">
                      {title}
                    </DialogTitle>
                    {subtitle && (
                      <p className="mt-1 text-sm text-ink2">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className={cn(recipes.chip.iconBtn, recipes.focusRing)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-100px)]">
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
