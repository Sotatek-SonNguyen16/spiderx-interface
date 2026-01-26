"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "./recipes";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, ...props }, ref) {
    const variantClass =
      variant === "primary"
        ? recipes.button.primary
        : variant === "secondary"
          ? recipes.button.secondary
          : variant === "ghost"
            ? recipes.button.ghost
            : recipes.button.destructive;

    return (
      <button
        ref={ref}
        className={cn(
          recipes.button.base,
          recipes.focusRing,
          variantClass,
          className
        )}
        {...props}
      />
    );
  }
);
