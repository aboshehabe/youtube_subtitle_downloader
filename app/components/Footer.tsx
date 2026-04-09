export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        justifyContent: "center",
        gap: 24,
        marginTop: "auto",
      }}
    >
      {["SRT", "VTT", "TXT", "JSON", "XML"].map((f) => (
        <span key={f} style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "monospace" }}>
          {f}
        </span>
      ))}
      <span style={{ fontSize: 12, color: "var(--text-dim)" }}>·</span>
      <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Client-side extraction enabled</span>
    </footer>
  );
}
