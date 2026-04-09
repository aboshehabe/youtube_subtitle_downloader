interface HeroProps {
  mode: "video" | "playlist";
  setMode: (mode: "video" | "playlist") => void;
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  onFetch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  error: string | null;
  maxResults: number;
  setMaxResults: (max: number) => void;
  delayMs: number;
  setDelayMs: (delay: number) => void;
  onOpenSidebar: () => void;
}

export default function Hero({
  mode, setMode, url, setUrl, loading, onFetch, onKeyDown, error,
  maxResults, setMaxResults, delayMs, setDelayMs, onOpenSidebar,
}: HeroProps) {
  return (
    <section
      style={{
        padding: "64px 32px 48px", maxWidth: 760, margin: "0 auto",
        width: "100%", textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800,
          lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 16px",
          background: "linear-gradient(135deg, #fafafa 0%, #888 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}
      >
        Download YouTube<br />Subtitles Instantly
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, margin: "0 0 40px", lineHeight: 1.7 }}>
        Paste any YouTube URL. Get subtitles in SRT, VTT, TXT, JSON, or XML format.
      </p>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {(["video", "playlist"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              background: mode === m ? "var(--accent)" : "var(--surface)",
              color: mode === m ? "white" : "var(--text-muted)",
              border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 600,
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {m === "video" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            )}
            {m === "video" ? "Single Video" : "Playlist"}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ display: "flex", gap: 8, maxWidth: 640, margin: "0 auto", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-dim)", pointerEvents: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={mode === "video" ? "https://www.youtube.com/watch?v=..." : "https://www.youtube.com/playlist?list=..."}
              style={{ paddingLeft: 40 }}
            />
          </div>
          <button
            onClick={onFetch}
            disabled={loading || !url.trim()}
            style={{
              background: loading ? "var(--surface-2)" : "var(--accent)",
              color: loading ? "var(--text-muted)" : "white",
              border: "none", borderRadius: 8, padding: "12px 24px",
              fontSize: 14, fontWeight: 600, transition: "all 0.15s",
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8,
              opacity: loading || !url.trim() ? 0.6 : 1,
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 14, height: 14,
                    border: "2px solid var(--text-dim)", borderTopColor: "var(--text-muted)",
                    borderRadius: "50%", display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                {mode === "playlist" ? "Loading Playlist..." : "Fetching..."}
              </>
            ) : mode === "video" ? "Fetch Subtitles" : "Load Playlist"}
          </button>
        </div>

        {/* Playlist options */}
        {mode === "playlist" && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              background: "var(--surface)", borderRadius: 8,
              border: "1px solid var(--border)", flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Max videos:</span>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              style={{ width: "auto", minWidth: 100 }}
            >
              <option value={10}>10 videos</option>
              <option value={25}>25 videos</option>
              <option value={50}>50 videos</option>
              <option value={100}>100 videos</option>
              <option value={999999}>Full Playlist</option>
            </select>

            <div style={{ width: 1, height: 24, background: "var(--border)" }} />

            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Delay:</span>
            <input
              type="number"
              value={delayMs}
              onChange={(e) => setDelayMs(Math.max(100, parseInt(e.target.value) || 1000))}
              min={100} max={10000} step={100}
              style={{
                width: 80, background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 6, padding: "6px 10px", color: "var(--text)", fontSize: 13,
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>ms</span>

            <button
              onClick={onOpenSidebar}
              style={{
                marginLeft: "auto", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "var(--text)",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              Playlists
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          className="animate-fade-up"
          style={{
            marginTop: 16, padding: "12px 16px",
            background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: 8, color: "#f87171", fontSize: 14,
            maxWidth: 640, margin: "16px auto 0",
          }}
        >
          <span>⚠️</span> <strong>Error:</strong> {error}
        </div>
      )}
    </section>
  );
}
