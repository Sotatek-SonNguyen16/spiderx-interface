"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "./recipes";

export type BadgeVariant =
  | "default"
  | "ai"
  | "success"
  | "warning"
  | "danger"
  | "gold";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ variant = "default", className, ...props }, ref) {
    const variantClass =
      variant === "ai"
        ? recipes.badge.ai
        : variant === "success"
          ? recipes.badge.success
          : variant === "warning"
            ? recipes.badge.warning
            : variant === "danger"
              ? recipes.badge.danger
              : variant === "gold"
                ? recipes.badge.gold
                : recipes.badge.default;

    return (
      <span
        ref={ref}
        className={cn(recipes.badge.base, variantClass, className)}
        {...props}
      />
    );
  }
);
