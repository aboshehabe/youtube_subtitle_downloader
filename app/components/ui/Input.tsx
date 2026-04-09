"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, ...props }, ref) => (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={`bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-lg px-4 py-3 w-full outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all ${icon ? "pl-10" : ""} ${className}`}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
