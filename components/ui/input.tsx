"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "./recipes";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ hasError = false, className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          recipes.input.base,
          hasError && recipes.input.error,
          className
        )}
        {...props}
      />
    );
  }
);

export interface FieldProps {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({
  label,
  helper,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className={recipes.input.label}>{label}</label>
      {children}
      {error ? (
        <div className={recipes.input.errorText}>{error}</div>
      ) : helper ? (
        <div className={recipes.input.helper}>{helper}</div>
      ) : null}
    </div>
  );
}
