"use client";

export interface Tab { id: string; label: string; count?: number; }

interface TabsProps { tabs: Tab[]; activeTab: string; onTabChange: (tabId: string) => void; className?: string; }

export function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
            activeTab === tab.id
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] border border-[var(--border)]"
          }`}
        >
          {tab.label} {tab.count !== undefined && `(${tab.count})`}
        </button>
      ))}
    </div>
  );
}
