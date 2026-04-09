export default function EmptyState() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      title: "Paste a URL",
      desc: "Any YouTube link works — full URL, short URL, or video ID.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: "Client-side Extraction",
      desc: "Subtitles are fetched directly from your browser, bypassing all IP blocks.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      title: "Download",
      desc: "Choose SRT, VTT, TXT, JSON or raw XML. Instant download.",
    },
  ];

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", width: "100%", padding: "0 32px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {features.map((item, i) => (
          <div
            key={i}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}
          >
            <div
              style={{
                width: 40, height: 40, background: "var(--surface-2)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent)", marginBottom: 16,
              }}
            >
              {item.icon}
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>
              {item.title}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
