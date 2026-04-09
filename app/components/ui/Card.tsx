"use client";

import { ReactNode } from "react";

interface CardProps { children: ReactNode; className?: string; hover?: boolean; }

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 transition-all ${hover ? "hover:border-[var(--accent)]/50 hover:bg-[var(--surface-2)]" : ""} ${className}`}>
      {children}
    </div>
  );
}
