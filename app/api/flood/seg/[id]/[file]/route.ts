import { FLOOD_CAMERA_ROWS } from "@/lib/flood-cameras";

const ALLOWED = new Set(FLOOD_CAMERA_ROWS.map((row) => row.id));

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; file: string }> },
) {
  const { id, file } = await context.params;
  if (!ALLOWED.has(id) || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return new Response("not found", { status: 404 });
  }
  const upstream = await fetch(
    "https://lw.hrfco.go.kr/live/cctv" + id + "/" + file,
    {
      headers: { Referer: "https://www.hrfco.go.kr/sumun/cctvRtmp.do" },
    },
  );
  if (!upstream.ok) {
    return new Response("unavailable", { status: 502 });
  }
  return new Response(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "video/MP2T",
      "cache-control": "no-store",
    },
  });
}
