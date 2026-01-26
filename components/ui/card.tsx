"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "./recipes";

export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  recommended?: boolean;
  pad?: CardPadding;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { clickable = false, recommended = false, pad = "md", className, ...props },
    ref
  ) {
    const baseClass = clickable ? recipes.card.clickable : recipes.card.base;
    const padClass =
      pad === "sm"
        ? recipes.card.padSm
        : pad === "lg"
          ? recipes.card.padLg
          : recipes.card.padMd;

    return (
      <div
        ref={ref}
        className={cn(
          baseClass,
          padClass,
          recommended && recipes.card.recommended,
          className
        )}
        {...props}
      />
    );
  }
);
