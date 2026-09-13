import { FLOOD_CAMERA_ROWS } from "@/lib/flood-cameras";

const ALLOWED = new Set(FLOOD_CAMERA_ROWS.map((row) => row.id));

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const file = new URL(request.url).searchParams.get("file") ?? "";
  const decoded = decodeURIComponent(file).replace(/\\/g, "/");
  if (
    !ALLOWED.has(id) ||
    !decoded ||
    decoded.includes("..") ||
    decoded.startsWith("/") ||
    decoded.includes("://")
  ) {
    return new Response("not found", { status: 404 });
  }
  if (!/^\d{4}-\d{2}-\d{2}\/\d{2}\/[\w.-]+$/.test(decoded) && !/^[\w.-]+$/.test(decoded)) {
    return new Response("not found", { status: 404 });
  }
  const upstream = await fetch(
    "https://lw.hrfco.go.kr/live/cctv" + id + "/" + decoded,
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
