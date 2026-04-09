import { useState, useCallback } from "react";
import { SubtitleTrack, parseYouTubeXml } from "@/lib/subtitles";

export function useSubtitleExtractor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractSubtitles = useCallback(async (videoId: string): Promise<SubtitleTrack[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/subtitles?url=${videoId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.tracks?.length) throw new Error("No subtitle tracks found");

      // Parse cues from rawXml on the client side
      const tracks: SubtitleTrack[] = (data.tracks as SubtitleTrack[]).map((track) => ({
        ...track,
        cues: track.rawXml ? parseYouTubeXml(track.rawXml) : [],
      }));

      return tracks;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract subtitles";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { extractSubtitles, loading, error };
}
