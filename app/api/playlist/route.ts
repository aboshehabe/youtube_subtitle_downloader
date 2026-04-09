import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

const FULL_PLAYLIST = 999_999;
const INNERTUBE_API_URL =
  "https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

interface PlaylistVideo {
  id: string;
  title: string;
  duration: number;
  thumbnail?: string;
}

interface YouTubeApiResponse {
  contents?: {
    twoColumnBrowseResultsRenderer?: {
      tabs?: Array<{
        tabRenderer?: {
          content?: {
            sectionListRenderer?: {
              contents?: Array<{
                itemSectionRenderer?: {
                  contents?: Array<{
                    playlistVideoListRenderer?: {
                      contents?: Array<{
                        playlistVideoRenderer?: {
                          videoId?: string;
                          title?: { runs?: Array<{ text?: string }> };
                          lengthSeconds?: string;
                          thumbnail?: { thumbnails?: Array<{ url?: string }> };
                        };
                      }>;
                      continuations?: Array<{
                        nextContinuationData?: { continuation?: string };
                      }>;
                    };
                  }>;
                };
              }>;
            };
          };
        };
      }>;
    };
  };
  onResponseReceivedActions?: Array<{
    appendContinuationItemsAction?: {
      continuationItems?: Array<{
        playlistVideoRenderer?: {
          videoId?: string;
          title?: { runs?: Array<{ text?: string }> };
          lengthSeconds?: string;
          thumbnail?: { thumbnails?: Array<{ url?: string }> };
        };
        continuationItemRenderer?: {
          continuationEndpoint?: { continuationCommand?: { token?: string } };
        };
      }>;
    };
  }>;
}

function extractPlaylistId(input: string): string | null {
  const patterns = [/[?&]list=([A-Za-z0-9_-]+)/, /^([A-Za-z0-9_-]{12,})/];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractPlaylistNameFromHtml(html: string): string | null {
  const patterns = [
    /<meta name="title" content="([^"]+)"/,
    /<meta property="og:title" content="([^"]+)"/,
    /<title>([^<]+)<\/title>/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      let name = match[1]
        .replace(/\s*-\s*YouTube\s*$/, "")
        .replace(/\s*Playlist\s*$/, "");
      if (name && name.length > 0 && name.length < 200) return name.trim();
    }
  }
  return null;
}

async function fetchPlaylistName(playlistId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/playlist?list=${playlistId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    );
    if (response.ok) {
      const html = await response.text();
      const name = extractPlaylistNameFromHtml(html);
      if (name) return name;
    }
  } catch (error) {
    console.error("Failed to fetch playlist name:", error);
  }
  return `Playlist_${playlistId}`;
}

async function fetchPlaylistVideos(
  playlistId: string,
  maxResults = 50,
): Promise<{ videos: PlaylistVideo[]; name: string }> {
  const fetchAll = maxResults >= FULL_PLAYLIST;
  const limit = fetchAll ? Infinity : maxResults;
  const videos: PlaylistVideo[] = [];
  let continuation: string | null = null;

  const playlistName = await fetchPlaylistName(playlistId);

  while (videos.length < limit) {
    const payload: Record<string, unknown> = {
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20240101.00.00",
          hl: "en",
          gl: "US",
        },
      },
    };

    if (continuation) {
      payload.continuation = continuation;
    } else {
      payload.browseId = `VL${playlistId}`;
    }

    const response = await fetch(INNERTUBE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`Failed to fetch playlist: ${response.status}`);

    const data = (await response.json()) as YouTubeApiResponse;
    let contents: unknown[] = [];

    if (continuation) {
      const actions = data.onResponseReceivedActions;
      if (actions?.[0]?.appendContinuationItemsAction?.continuationItems) {
        contents = actions[0].appendContinuationItemsAction.continuationItems;
      }
    } else {
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0];
      const section =
        tab?.tabRenderer?.content?.sectionListRenderer?.contents?.[0];
      const itemSection = section?.itemSectionRenderer?.contents?.[0];
      const videoList = itemSection?.playlistVideoListRenderer?.contents;
      contents = videoList ?? [];
    }

    if (contents.length === 0) break;

    for (const item of contents) {
      const video = (item as Record<string, unknown>).playlistVideoRenderer as
        | Record<string, unknown>
        | undefined;
      if (video) {
        videos.push({
          id: video.videoId as string,
          title:
            (video.title as { runs?: { text: string }[] })?.runs?.[0]?.text ??
            "Unknown Title",
          duration: parseInt((video.lengthSeconds as string) ?? "0", 10) || 0,
          thumbnail: (video.thumbnail as { thumbnails?: { url: string }[] })
            ?.thumbnails?.[0]?.url,
        });
        if (videos.length >= limit) break;
      }
    }

    if (videos.length >= limit) break;

    if (continuation) {
      const actions = data.onResponseReceivedActions;
      const contItem =
        actions?.[0]?.appendContinuationItemsAction?.continuationItems?.[0];
      const nextToken = (contItem as any)?.continuationItemRenderer
        ?.continuationEndpoint?.continuationCommand?.token;
      continuation = nextToken || null;
    } else {
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0];
      const section =
        tab?.tabRenderer?.content?.sectionListRenderer?.contents?.[0];
      const videoList =
        section?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer;
      const nextContinuation =
        videoList?.continuations?.[0]?.nextContinuationData?.continuation;
      continuation = nextContinuation || null;
    }

    if (!continuation) break;
  }

  return { videos, name: playlistName };
}

export async function GET(request: NextRequest) {
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const playlistUrl = searchParams.get("url");
    const maxResults = parseInt(searchParams.get("maxResults") ?? "50", 10);

    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Missing playlist URL" },
        { status: 400 },
      );
    }

    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      return NextResponse.json(
        { error: "Invalid playlist URL" },
        { status: 400 },
      );
    }

    const { videos, name } = await fetchPlaylistVideos(playlistId, maxResults);

    return NextResponse.json({
      playlistId,
      playlistName: name,
      totalVideos: videos.length,
      isFullPlaylist: maxResults >= FULL_PLAYLIST,
      videos,
    });
  } catch (err) {
    console.error("Playlist API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
