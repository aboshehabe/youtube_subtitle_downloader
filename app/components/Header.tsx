export default function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: 32, height: 32,
          background: "var(--accent)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 20, fontWeight: 700,
          letterSpacing: "-0.02em", color: "var(--text)",
        }}
      >
        SubRip
      </span>
      <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 4, fontFamily: "monospace" }}>
        v2
      </span>
      <div style={{ flex: 1 }} />
      <a
        href="https://github.com"
        style={{
          fontSize: 13, color: "var(--text-muted)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
        </svg>
        GitHub
      </a>
    </header>
  );
}
