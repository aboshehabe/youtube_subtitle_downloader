"use client";

import { useState, useEffect } from "react";

interface SavedPlaylist {
  id: string;
  name: string;
  date: Date;
  videoCount: number;
  url: string;
  completedCount?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaylists: SavedPlaylist[];
  onLoadPlaylist: (playlistId: string, url: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  currentPlaylistId: string | null;
}

export default function Sidebar({ isOpen, onClose, savedPlaylists, onLoadPlaylist, onDeletePlaylist, currentPlaylistId }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const filteredPlaylists = savedPlaylists.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLoad = (playlistId: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onLoadPlaylist(playlistId, url);
    onClose();
  };

  const handleDelete = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm(playlistId);
  };

  const confirmDelete = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeletePlaylist(playlistId);
    setDeleteConfirm(null);
  };

  const cancelDelete = (e: React.MouseEvent) => { e.stopPropagation(); setDeleteConfirm(null); };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 998, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, width: 480, maxWidth: "90vw", height: "100vh",
        background: "var(--surface)", borderLeft: "1px solid var(--border)",
        boxShadow: "-5px 0 30px rgba(0,0,0,0.5)", zIndex: 999,
        display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideIn 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text)" }}>Saved Playlists</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "6px 0 0" }}>
              {savedPlaylists.length} playlist{savedPlaylists.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <button onClick={onClose} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", padding: "8px 12px", borderRadius: 8 }}>✕</button>
        </div>

        {/* Search */}
        <div style={{ padding: "16px 24px", flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px", color: "var(--text)", fontSize: 14, outline: "none" }}
          />
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredPlaylists.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
              {searchTerm ? (
                <>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <div>No matching playlists found</div>
                  <button onClick={() => setSearchTerm("")} style={{ marginTop: 12, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📀</div>
                  <div>No saved playlists yet</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-dim)" }}>Load a playlist and it will be saved automatically</div>
                </>
              )}
            </div>
          ) : filteredPlaylists.map((playlist) => {
            const isCurrent = currentPlaylistId === playlist.id;
            const completedPercent = playlist.completedCount !== undefined && playlist.videoCount > 0
              ? Math.round((playlist.completedCount / playlist.videoCount) * 100) : 0;
            const isComplete = playlist.completedCount === playlist.videoCount;

            return (
              <div key={playlist.id}
                style={{ background: isCurrent ? "rgba(249,115,22,0.08)" : "var(--bg)", border: `1px solid ${isCurrent ? "var(--accent)" : "var(--border)"}`, borderRadius: 14, padding: 16, cursor: "pointer", transition: "all 0.2s" }}
                onClick={(e) => handleLoad(playlist.id, playlist.url, e)}
              >
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {playlist.name}
                  {isComplete && <span style={{ fontSize: 10, background: "rgba(34,197,94,0.2)", color: "#22c55e", padding: "2px 8px", borderRadius: 20 }}>✓ Complete</span>}
                  {isCurrent && <span style={{ fontSize: 10, background: "rgba(249,115,22,0.2)", color: "var(--accent)", padding: "2px 8px", borderRadius: 20 }}>Loaded</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                  <span>📹 {playlist.videoCount} videos</span>
                  <span>📅 {playlist.date.toLocaleDateString()}</span>
                  {playlist.completedCount !== undefined && <span style={{ color: isComplete ? "#22c55e" : "var(--accent)" }}>✓ {playlist.completedCount} completed</span>}
                </div>
                {playlist.completedCount !== undefined && playlist.videoCount > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ width: "100%", height: 4, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${completedPercent}%`, height: "100%", background: isComplete ? "#22c55e" : "var(--accent)", transition: "width 0.3s ease", borderRadius: 4 }} />
                    </div>
                  </div>
                )}

                {deleteConfirm === playlist.id ? (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <button onClick={(e) => confirmDelete(playlist.id, e)}
                      style={{ flex: 1, background: "#dc2626", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>
                      ⚠️ Confirm Delete
                    </button>
                    <button onClick={cancelDelete}
                      style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <button onClick={(e) => handleLoad(playlist.id, playlist.url, e)}
                      style={{ flex: 1, background: isCurrent ? "rgba(249,115,22,0.2)" : "var(--accent)", border: isCurrent ? "1px solid var(--accent)" : "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600, color: isCurrent ? "var(--accent)" : "white", cursor: "pointer" }}>
                      {isCurrent ? "🔄 Reload" : "📀 Load Playlist"}
                    </button>
                    <button onClick={(e) => handleDelete(playlist.id, e)}
                      style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#ef4444", cursor: "pointer" }}>
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-dim)", textAlign: "center", flexShrink: 0, background: "var(--surface)" }}>
          <div>💾 Playlists are saved locally in your browser</div>
          <div style={{ marginTop: 4 }}>⏱️ Expire after 7 days • Auto-saves progress</div>
        </div>
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
}
