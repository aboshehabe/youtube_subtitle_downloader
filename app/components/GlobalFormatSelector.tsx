"use client";

import { useState } from "react";

interface GlobalFormatSelectorProps {
  onDownloadAllFormats: (formats: string[]) => Promise<void>;
  disabled?: boolean;
}

const AVAILABLE_FORMATS = [
  { value: "srt", label: "SRT", icon: "📄", description: "SubRip - Most compatible" },
  { value: "vtt", label: "VTT", icon: "🎬", description: "WebVTT - HTML5 video" },
  { value: "txt", label: "TXT", icon: "📝", description: "Plain text - No timing" },
  { value: "json", label: "JSON", icon: "{}", description: "JSON - Programmatic use" },
  { value: "xml", label: "XML", icon: "📋", description: "XML - Raw YouTube format" },
];

export function GlobalFormatSelector({ onDownloadAllFormats, disabled = false }: GlobalFormatSelectorProps) {
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set(["srt"]));
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      next.has(format) ? next.delete(format) : next.add(format);
      return next;
    });
  };

  const handleDownloadAll = async () => {
    if (selectedFormats.size === 0) return;
    setIsDownloading(true);
    try { await onDownloadAllFormats(Array.from(selectedFormats)); }
    finally { setIsDownloading(false); }
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>📦 Multi-Format Download</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>Select multiple formats to download for each video</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Select All", () => setSelectedFormats(new Set(AVAILABLE_FORMATS.map((f) => f.value)))],
            ["Clear", () => setSelectedFormats(new Set())]].map(([label, fn]) => (
            <button
              key={label as string}
              onClick={fn as () => void}
              disabled={disabled || isDownloading}
              style={{ fontSize: 12, padding: "6px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-muted)", cursor: "pointer" }}
            >
              {label as string}
            </button>
          ))}
          <button
            onClick={handleDownloadAll}
            disabled={disabled || isDownloading || selectedFormats.size === 0}
            style={{
              fontSize: 13, fontWeight: 600, padding: "6px 16px",
              background: selectedFormats.size > 0 ? "var(--accent)" : "var(--surface-2)",
              border: "none", borderRadius: 6,
              color: selectedFormats.size > 0 ? "white" : "var(--text-muted)",
              cursor: selectedFormats.size === 0 ? "not-allowed" : "pointer",
              opacity: disabled || isDownloading ? 0.5 : 1,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {isDownloading ? "Creating ZIP..." : `📥 Download All (${selectedFormats.size} format${selectedFormats.size !== 1 ? "s" : ""})`}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, auto))", gap: 10 }}>
        {AVAILABLE_FORMATS.map((format) => (
          <label
            key={format.value}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              background: selectedFormats.has(format.value) ? "rgba(249,115,22,0.1)" : "var(--surface-2)",
              border: selectedFormats.has(format.value) ? "1px solid var(--accent)" : "1px solid var(--border)",
              borderRadius: 8, cursor: disabled || isDownloading ? "not-allowed" : "pointer",
              transition: "all 0.15s", opacity: disabled || isDownloading ? 0.5 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={selectedFormats.has(format.value)}
              onChange={() => toggleFormat(format.value)}
              disabled={disabled || isDownloading}
              style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{format.icon} {format.label}</div>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>{format.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
