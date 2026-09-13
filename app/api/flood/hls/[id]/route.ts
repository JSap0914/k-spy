import { FLOOD_CAMERA_ROWS } from "@/lib/flood-cameras";

const ALLOWED = new Set(FLOOD_CAMERA_ROWS.map((row) => row.id));

function rewritePlaylist(text: string, id: string) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      return (
        "/api/flood/seg/" +
        encodeURIComponent(id) +
        "?file=" +
        encodeURIComponent(trimmed)
      );
    })
    .join("\n");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!ALLOWED.has(id)) {
    return new Response("not found", { status: 404 });
  }
  const upstream = await fetch(
    "https://lw.hrfco.go.kr/live/cctv" + id + "/hls.m3u8",
    {
      headers: { Referer: "https://www.hrfco.go.kr/sumun/cctvRtmp.do" },
    },
  );
  if (!upstream.ok) {
    return new Response("unavailable", { status: 502 });
  }
  const text = await upstream.text();
  return new Response(rewritePlaylist(text, id), {
    headers: {
      "content-type": "application/vnd.apple.mpegurl",
      "cache-control": "no-store",
    },
  });
}
