import { FLOOD_CAMERA_ROWS } from "@/lib/flood-cameras";

const PAGE_URL = "https://www.hrfco.go.kr/sumun/cctvRtmp.do";

export async function GET() {
  const cameras = FLOOD_CAMERA_ROWS.map((row) => ({
    id: "flood-" + row.id,
    name: row.name,
    region: row.name.split("(")[0] || "하천",
    group: "safety" as const,
    source: "한강홍수통제소",
    playMode: "hls" as const,
    url: "/api/flood/hls/" + encodeURIComponent(row.id),
    pageUrl: PAGE_URL,
    lat: row.lat,
    lng: row.lng,
    note: "하천 수위 감시용 공개 CCTV입니다. 거리 방범 카메라가 아닙니다.",
  }));
  return Response.json({ cameras });
}
