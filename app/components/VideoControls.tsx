import React from "react";

interface VideoControlsProps {
  videoId: string;
  videoIndex: number;
  status: "pending" | "loading" | "success" | "error";
  isDownloading: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  progress?: number;
  onRetry?: () => void;
  onClear?: () => void;
}

export default function VideoControls({
  status, isDownloading, onStart, onPause, onResume, onStop,
  progress = 0, onRetry, onClear,
}: VideoControlsProps) {
  const btnBase: React.CSSProperties = {
    borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 4, border: "none",
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {status === "pending" && (
        <button onClick={onStart} style={{ ...btnBase, background: "var(--accent)", color: "white" }}>
          <span>▶</span> Start
        </button>
      )}

      {status === "loading" && isDownloading && (
        <>
          <button onClick={onPause} style={{ ...btnBase, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}>
            <span>⏸</span> Pause
          </button>
          <button onClick={onStop} style={{ ...btnBase, background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.5)", color: "#ef4444" }}>
            <span>⏹</span> Stop
          </button>
          {progress > 0 && progress < 100 && (
            <div style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "4px 8px", borderRadius: 4 }}>
              {progress}%
            </div>
          )}
        </>
      )}

      {status === "error" && (
        <>
          <button onClick={onRetry || onResume} style={{ ...btnBase, background: "var(--accent)", color: "white" }}>
            <span>🔄</span> Retry
          </button>
          <button onClick={onClear || onStop} style={{ ...btnBase, background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.5)", color: "#ef4444" }}>
            <span>🗑</span> Clear
          </button>
        </>
      )}

      {status === "success" && (
        <div style={{ fontSize: 11, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span>✓</span> Completed
        </div>
      )}
    </div>
  );
}
