"use client";

interface PlaylistStatusProps {
  videos: Array<{ status: string; id: string; subtitles?: any[] }>;
  onRetryFailed: () => void;
  onResumeIncomplete: () => void;
  hasIncomplete: boolean;
  hasFailed: boolean;
  isResuming: boolean;
  retryingAll: boolean;
}

export function PlaylistStatus({ videos, onRetryFailed, onResumeIncomplete, hasIncomplete, hasFailed, isResuming, retryingAll }: PlaylistStatusProps) {
  const total = videos.length;
  const success = videos.filter((v) => v.status === "success").length;
  const failed = videos.filter((v) => v.status === "error").length;
  const pending = videos.filter((v) => v.status === "pending").length;
  const loading = videos.filter((v) => v.status === "loading").length;
  const percentComplete = total > 0 ? Math.round((success / total) * 100) : 0;
  const remaining = total - success;

  return (
    <div className="mb-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-[var(--text)]">Playlist Progress</span>
        <span className="text-sm text-[var(--text-muted)]">
          {success} / {total} ({percentComplete}%) — {remaining} remaining
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden mb-3">
        <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${percentComplete}%` }} />
      </div>
      <div className="flex gap-3 text-xs mb-3 flex-wrap">
        <span className="text-green-500">✓ Completed: {success}</span>
        {pending > 0 && <span className="text-yellow-500">⏳ Pending: {pending}</span>}
        {loading > 0 && <span className="text-blue-500">⟳ Downloading: {loading}</span>}
        {failed > 0 && <span className="text-red-500">✗ Failed: {failed}</span>}
      </div>
      <div className="flex gap-2 flex-wrap">
        {hasFailed && (
          <button
            onClick={onRetryFailed} disabled={retryingAll}
            className="px-3 py-1.5 text-xs bg-red-500/20 border border-red-500/50 rounded-md text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            {retryingAll ? "Retrying..." : `Retry Failed (${failed})`}
          </button>
        )}
        {hasIncomplete && (
          <button
            onClick={onResumeIncomplete} disabled={isResuming}
            className="px-3 py-1.5 text-xs bg-[var(--accent)]/20 border border-[var(--accent)]/50 rounded-md text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors disabled:opacity-50"
          >
            {isResuming ? "Resuming..." : `Resume (${remaining} left)`}
          </button>
        )}
      </div>
    </div>
  );
}
