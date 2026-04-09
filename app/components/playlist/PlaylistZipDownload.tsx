"use client";

import { useState } from "react";
import { sanitizeFilename } from "@/lib/subtitles";

interface PlaylistZipDownloadProps {
  playlistName: string;
  onDownloadZip: (onProgress: (current: number, total: number) => void) => Promise<void>;
  disabled?: boolean;
}

export function PlaylistZipDownload({ playlistName, onDownloadZip, disabled = false }: PlaylistZipDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showProgress, setShowProgress] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setShowProgress(true);
    setProgress({ current: 0, total: 0 });
    try {
      await onDownloadZip((current, total) => setProgress({ current, total }));
    } finally {
      setIsDownloading(false);
      setTimeout(() => setShowProgress(false), 3000);
    }
  };

  const displayName = (() => {
    let name = playlistName.replace(/ - YouTube$/, "");
    return name.length > 40 ? name.substring(0, 37) + "..." : name;
  })();

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isDownloading ? `Zipping... ${progress.current}/${progress.total}` : `Download "${displayName}" as ZIP`}
      </button>
      {showProgress && isDownloading && progress.total > 0 && (
        <div className="mt-2">
          <div className="text-xs text-[var(--text-muted)] mb-1">Fetching: {progress.current}/{progress.total}</div>
          <div className="w-full h-1 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
