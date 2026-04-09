"use client";

interface SavedPlaylist {
  id: string;
  name: string;
  date: Date;
  videoCount: number;
  url: string;
  completedCount?: number;
}

interface SavedPlaylistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: SavedPlaylist[];
  currentPlaylistId: string | null;
  onLoad: (playlistId: string, url: string) => void;
  onDelete: (playlistId: string) => void;
}

export function SavedPlaylistsModal({ isOpen, onClose, playlists, currentPlaylistId, onLoad, onDelete }: SavedPlaylistsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-[999]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 max-w-[500px] w-[90%] max-h-[80vh] overflow-auto z-[1000] shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Saved Playlists</h3>
          <button onClick={onClose} className="bg-none border-none text-[var(--text-muted)] text-xl cursor-pointer hover:text-[var(--text)]">✕</button>
        </div>

        {playlists.length === 0 ? (
          <p className="text-[var(--text-muted)] text-center py-10">No saved playlists found. Download a playlist to save it automatically.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => onLoad(playlist.id, playlist.url)}
                className={`bg-[var(--bg)] border rounded-xl p-4 cursor-pointer transition-all hover:border-[var(--accent)] ${currentPlaylistId === playlist.id ? "border-[var(--accent)] bg-[rgba(249,115,22,0.08)]" : "border-[var(--border)]"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-[var(--text)] mb-1">{playlist.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {playlist.videoCount} videos · Saved {playlist.date.toLocaleDateString()}
                      {playlist.completedCount !== undefined && ` · ${playlist.completedCount} completed`}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}
                    className="bg-red-500/20 border border-red-500/50 rounded-md px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/30 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
