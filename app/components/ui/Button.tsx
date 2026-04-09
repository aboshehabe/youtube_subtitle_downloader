"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", loading = false, disabled, className = "", ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98]",
      secondary: "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface)]",
      danger: "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30",
      ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-2)]",
    };
    const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
