"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
