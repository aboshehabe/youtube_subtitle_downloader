"use client";

type FilterType = "all" | "success" | "error" | "pending";

interface PlaylistFiltersProps {
  filterType: FilterType;
  statusCounts: { all: number; success: number; error: number; pending: number };
  onFilterChange: (filter: FilterType) => void;
}

export function PlaylistFilters({ filterType, statusCounts, onFilterChange }: PlaylistFiltersProps) {
  const filters: FilterType[] = ["all", "success", "error", "pending"];
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          style={{
            background: filterType === filter ? "var(--accent)" : "var(--surface)",
            color: filterType === filter ? "white" : "var(--text-muted)",
            border: `1px solid ${filterType === filter ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer",
          }}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)} ({statusCounts[filter]})
        </button>
      ))}
    </div>
  );
}
