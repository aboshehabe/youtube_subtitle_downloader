"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  convertCues,
  sanitizeFilename,
  SubtitleTrack,
  OutputFormat,
  FORMAT_EXTENSIONS,
  FORMAT_MIME_TYPES,
  parseYouTubeXml,
  SubtitleCue, // Add this import
} from "@/lib/subtitles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { VideoView } from "./components/video/VideoView";
import { PlaylistContainer } from "./components/playlist/PlaylistContainer";
import {
  usePlaylistExtractor,
  PlaylistVideo,
} from "./hooks/usePlaylistExtractor";

interface SingleVideoResponse {
  videoId: string;
  videoTitle?: string;
  tracks: SubtitleTrack[];
}

type FilterType = "all" | "success" | "error" | "pending";

const FULL_PLAYLIST = 999999;
const DEFAULT_DELAY_MS = 3000;

function triggerDownload(
  content: string,
  fileName: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"video" | "playlist">("video");
  const [singleData, setSingleData] = useState<SingleVideoResponse | null>(
    null,
  );
  const [singleError, setSingleError] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>("srt");
  const [maxResults, setMaxResults] = useState(FULL_PLAYLIST);
  const [delayMs, setDelayMs] = useState(DEFAULT_DELAY_MS);
  const [retryingAll, setRetryingAll] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isStartingAll, setIsStartingAll] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [downloadProgress, setDownloadProgress] = useState({
    current: 0,
    total: 0,
  });

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    fetchPlaylist,
    downloadSubtitlesForVideo,
    retryAllFailed,
    downloadSingleFile,
    downloadMultipleFormats,
    downloadAllVideosMultipleFormats,
    getSavedPlaylists,
    deleteSavedPlaylist,
    videos: playlistVideos,
    loading: playlistLoading,
    error: playlistError,
    currentPlaylistId,
    currentPlaylistName,
    resumeIncompleteDownloads,
    downloadPlaylistAsZip,
    downloadAllSubtitles,
    pauseDownload,
    resumeDownload,
    stopDownload,
    downloadingAll,
    isPaused,
    saveCurrentVideosToStorage,
  } = usePlaylistExtractor((message, type) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 3000);
  });

  const refreshSidebar = useCallback(
    () => setSidebarKey((prev) => prev + 1),
    [],
  );

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const statusCounts = {
    all: playlistVideos.length,
    success: playlistVideos.filter((v) => v.status === "success").length,
    error: playlistVideos.filter((v) => v.status === "error").length,
    pending: playlistVideos.filter((v) => v.status === "pending").length,
  };

  const hasIncomplete = playlistVideos.some((v) => v.status !== "success");
  const currentTrack = singleData?.tracks?.[selectedTrack];

  const getOutputForDownload = () => {
    if (!currentTrack) return "";
    // Use cues directly from the track
    let cues = currentTrack.cues;
    // If cues are empty but we have rawXml, try to parse it
    if ((!cues || cues.length === 0) && currentTrack.rawXml) {
      cues = parseYouTubeXml(currentTrack.rawXml);
    }
    return convertCues(cues || [], selectedFormat, currentTrack.rawXml);
  };

  const output = getOutputForDownload();
  const currentError = mode === "video" ? singleError : playlistError;

  // FIXED: Single video fetch using the same mechanism as playlist
  const handleFetch = useCallback(async () => {
    if (!url.trim()) return;

    if (mode === "video") {
      setSingleData(null);
      setSingleError(null);
      setLoading(true);
      try {
        // Extract video ID from URL
        const videoIdMatch = url
          .trim()
          .match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
          );
        const videoId = videoIdMatch ? videoIdMatch[1] : url.trim();

        console.log("Fetching subtitles for video ID:", videoId);

        const res = await fetch(`/api/subtitles?url=${videoId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error ?? `HTTP ${res.status}`);
        }
        const data = await res.json();

        console.log("Single video API response:", data);

        if (!data.tracks?.length) throw new Error("No subtitle tracks found");

        // Process tracks exactly like playlist mode does
        const tracks: SubtitleTrack[] = data.tracks.map(
          (track: SubtitleTrack) => {
            // Parse cues from rawXml if available
            let cues: SubtitleCue[] = [];
            if (track.rawXml && track.rawXml.trim() !== "") {
              cues = parseYouTubeXml(track.rawXml);
              console.log(
                `Parsed ${cues.length} cues for ${track.languageCode}`,
              );
            } else if (track.cues && track.cues.length > 0) {
              cues = track.cues;
              console.log(
                `Using existing ${cues.length} cues for ${track.languageCode}`,
              );
            }

            return {
              ...track,
              cues,
            };
          },
        );

        console.log(
          "Final tracks:",
          tracks.map((t) => ({
            lang: t.languageCode,
            cueCount: t.cues?.length || 0,
          })),
        );

        setSingleData({
          videoId: data.videoId,
          videoTitle: data.videoTitle,
          tracks,
        });
        setSelectedTrack(0);

        // Show success message
        if (tracks.length > 0 && tracks[0].cues?.length > 0) {
          setToastMessage({
            message: `Loaded ${tracks[0].cues.length} subtitle cues`,
            type: "success",
          });
          setTimeout(() => setToastMessage(null), 2000);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch subtitles";
        setSingleError(message);
        console.error("Fetch error:", err);
        setToastMessage({ message, type: "error" });
        setTimeout(() => setToastMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await fetchPlaylist(url, maxResults, false);
      } catch {
        /* error is set inside the hook */
      }
    }
  }, [url, mode, maxResults, fetchPlaylist]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetch();
  };

  // FIXED: Single video download using the same mechanism as playlist
  const handleDownload = () => {
    if (!currentTrack || !singleData) return;

    // Get cues from track
    let cues = currentTrack.cues;

    // If cues are empty but we have rawXml, try to parse it
    if (
      (!cues || cues.length === 0) &&
      currentTrack.rawXml &&
      currentTrack.rawXml.trim() !== ""
    ) {
      cues = parseYouTubeXml(currentTrack.rawXml);
      console.log(`Download: Re-parsed ${cues.length} cues from rawXml`);
    }

    if (!cues || cues.length === 0) {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToastMessage({
        message: "No subtitle content to download",
        type: "error",
      });
      toastTimeoutRef.current = setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current = null;
      }, 3000);
      return;
    }

    const content = convertCues(cues, selectedFormat, currentTrack.rawXml);
    if (!content || content.trim() === "") {
      setToastMessage({
        message: "No subtitle content to download",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const stem = sanitizeFilename(singleData.videoTitle ?? singleData.videoId);
    const fileName = `${stem}_${currentTrack.languageCode}${FORMAT_EXTENSIONS[selectedFormat]}`;
    triggerDownload(content, fileName, FORMAT_MIME_TYPES[selectedFormat]);
    setToastMessage({ message: `Downloaded ${stem}`, type: "success" });
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleRetryAllFailed = async () => {
    setRetryingAll(true);
    await retryAllFailed(delayMs);
    setRetryingAll(false);
    refreshSidebar();
  };

  const handleResumeIncomplete = async () => {
    setIsResuming(true);
    await resumeIncompleteDownloads(delayMs);
    setIsResuming(false);
    refreshSidebar();
  };

  const handleStartAll = async () => {
    setIsStartingAll(true);
    setDownloadProgress({
      current: 0,
      total: statusCounts.pending + statusCounts.error,
    });
    await downloadAllSubtitles(delayMs, (current, total) =>
      setDownloadProgress({ current, total }),
    );
    setIsStartingAll(false);
    refreshSidebar();
  };

  const handleDownloadZip = async (
    onProgress: (current: number, total: number) => void,
  ) => {
    await downloadPlaylistAsZip(currentPlaylistName || "playlist", onProgress);
  };

  const handleVideoStart = (videoId: string, index: number) =>
    downloadSubtitlesForVideo(videoId, index, selectedFormat, 0);

  const handleDownloadSingle = (
    video: PlaylistVideo,
    trackIndex: number,
    format: string,
  ) => downloadSingleFile(video, trackIndex, format);

  const handleDownloadMultiple = (
    video: PlaylistVideo,
    trackIndex: number,
    formats: string[],
  ) => downloadMultipleFormats(video, trackIndex, formats);

  const handleDownloadAllMultipleFormats = async (formats: string[]) => {
    await downloadAllVideosMultipleFormats(formats);
    refreshSidebar();
  };

  const handleDeletePlaylist = useCallback(
    (playlistId: string) => {
      deleteSavedPlaylist(playlistId);
      refreshSidebar();
    },
    [deleteSavedPlaylist, refreshSidebar],
  );

  const handleLoadPlaylist = useCallback(
    async (playlistId: string, playlistUrl: string) => {
      setUrl(playlistUrl);
      setMode("playlist");
      await fetchPlaylist(playlistUrl, FULL_PLAYLIST, false);
      setIsSidebarOpen(false);
      setTimeout(() => refreshSidebar(), 500);
    },
    [fetchPlaylist, refreshSidebar],
  );

  const handleSaveProgress = useCallback(() => {
    saveCurrentVideosToStorage();
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage({
      message: "Progress saved successfully!",
      type: "success",
    });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2000);
    refreshSidebar();
  }, [saveCurrentVideosToStorage, refreshSidebar]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1001,
            animation: "fade-in-up 0.3s ease",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              background:
                toastMessage.type === "success"
                  ? "rgba(34,197,94,0.95)"
                  : toastMessage.type === "error"
                    ? "rgba(220,38,38,0.95)"
                    : "rgba(59,130,246,0.95)",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {toastMessage.type === "success" && <span>✓</span>}
            {toastMessage.type === "error" && <span>⚠️</span>}
            {toastMessage.type === "info" && <span>ℹ️</span>}
            {toastMessage.message}
          </div>
        </div>
      )}

      <Header />

      <Hero
        mode={mode}
        setMode={setMode}
        url={url}
        setUrl={setUrl}
        loading={loading || playlistLoading}
        onFetch={handleFetch}
        onKeyDown={handleKeyDown}
        error={currentError}
        maxResults={maxResults}
        setMaxResults={setMaxResults}
        delayMs={delayMs}
        setDelayMs={setDelayMs}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        //onShowSavedPlaylists={() => {}}
      />

      {mode === "playlist" && playlistVideos.length > 0 && (
        <PlaylistContainer
          videos={playlistVideos}
          statusCounts={statusCounts}
          selectedFormat={selectedFormat}
          filterType={filterType}
          savedPlaylists={getSavedPlaylists()}
          currentPlaylistId={currentPlaylistId}
          playlistName={currentPlaylistName}
          hasIncomplete={hasIncomplete}
          isResuming={isResuming}
          isStartingAll={isStartingAll}
          retryingAll={retryingAll}
          isPaused={isPaused}
          downloadingAll={downloadingAll}
          downloadProgress={downloadProgress}
          onFilterChange={setFilterType}
          onVideoStart={handleVideoStart}
          onDownloadSingle={handleDownloadSingle}
          onDownloadMultiple={handleDownloadMultiple}
          onResumeIncomplete={handleResumeIncomplete}
          onDownloadZip={handleDownloadZip}
          onRetryFailed={handleRetryAllFailed}
          onStartAll={handleStartAll}
          onDownloadAllMultipleFormats={handleDownloadAllMultipleFormats}
          onPauseDownload={pauseDownload}
          onResumeDownload={resumeDownload}
          onStopDownload={stopDownload}
          onSaveProgress={handleSaveProgress}
          onLoadPlaylist={handleLoadPlaylist}
          onDeletePlaylist={handleDeletePlaylist}
        />
      )}

      {mode === "video" && singleData && (
        <VideoView
          videoId={singleData.videoId}
          videoTitle={singleData.videoTitle}
          tracks={singleData.tracks}
          selectedTrack={selectedTrack}
          selectedFormat={selectedFormat}
          onTrackChange={setSelectedTrack}
          onFormatChange={setSelectedFormat}
          onDownload={handleDownload}
        />
      )}

      {mode === "video" && !singleData && !loading && <EmptyState />}
      {mode === "playlist" &&
        playlistVideos.length === 0 &&
        !playlistLoading && <EmptyState />}

      <Footer />

      <Sidebar
        key={sidebarKey}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        savedPlaylists={getSavedPlaylists()}
        onLoadPlaylist={handleLoadPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        currentPlaylistId={currentPlaylistId}
      />
    </main>
  );
}
