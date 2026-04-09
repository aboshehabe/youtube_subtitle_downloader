"use client";

import { VideoPlayer } from "../VideoPlayer";
import { SubtitleTrack, OutputFormat } from "@/lib/subtitles";

interface VideoViewProps {
  videoId: string;
  videoTitle?: string;
  tracks: SubtitleTrack[];
  selectedTrack: number;
  selectedFormat: OutputFormat;
  onTrackChange: (index: number) => void;
  onFormatChange: (format: OutputFormat) => void;
  onDownload: () => void;
}

export function VideoView({
  videoId,
  videoTitle,
  tracks,
  selectedTrack,
  selectedFormat,
  onTrackChange,
  onFormatChange,
  onDownload,
}: VideoViewProps) {
  // Ensure tracks is an array
  const safeTracks = Array.isArray(tracks) ? tracks : [];

  return (
    <VideoPlayer
      videoId={videoId}
      videoTitle={videoTitle}
      tracks={safeTracks}
      selectedTrack={selectedTrack}
      onTrackChange={onTrackChange}
      selectedFormat={selectedFormat}
      onFormatChange={onFormatChange}
      onDownload={onDownload}
    />
  );
}
