const ITS_API_KEY = process.env.ITS_API_KEY ?? "";

type ItsRow = {
  cctvname?: string;
  cctvurl?: string;
  coordx?: number;
  coordy?: number;
};

const BOXES = [
  { minX: 126.7, maxX: 127.45, minY: 37.2, maxY: 37.75 },
  { minX: 128.7, maxX: 129.3, minY: 35.0, maxY: 35.35 },
  { minX: 126.7, maxX: 127.2, minY: 35.0, maxY: 35.3 },
  { minX: 128.4, maxX: 129.1, minY: 35.75, maxY: 36.1 },
];

function toHttps(url: string) {
  return url.replace(/^http:\/\//i, "https://");
}

async function fetchBox(box: (typeof BOXES)[number]) {
  if (!ITS_API_KEY) return [];
  const params = new URLSearchParams({
    apiKey: ITS_API_KEY,
    type: "ex",
    cctvType: "4",
    minX: String(box.minX),
    maxX: String(box.maxX),
    minY: String(box.minY),
    maxY: String(box.maxY),
    getType: "json",
  });
  const res = await fetch(
    "https://openapi.its.go.kr:9443/cctvInfo?" + params.toString(),
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { response?: { data?: ItsRow[] } };
  return json.response?.data ?? [];
}

export async function GET() {
  try {
    const rows = (await Promise.all(BOXES.map(fetchBox))).flat();
    const seen = new Set<string>();
    const cameras = [];
    for (const row of rows) {
      if (!row.cctvurl || row.coordx == null || row.coordy == null) continue;
      const name = (row.cctvname ?? "고속도로")
        .replace(/[[\]]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const id =
        "its-" +
        row.coordy.toFixed(5) +
        "-" +
        row.coordx.toFixed(5);
      if (seen.has(id)) continue;
      seen.add(id);
      cameras.push({
        id,
        name,
        region: "고속도로",
        group: "highway" as const,
        source: "국가교통정보센터",
        playMode: "hls" as const,
        url: toHttps(row.cctvurl),
        pageUrl: "https://www.its.go.kr/?mapTab=cctv",
        lat: row.coordy,
        lng: row.coordx,
      });
      if (cameras.length >= 48) break;
    }
    return Response.json(
      { cameras },
      { headers: { "Cache-Control": "public, max-age=45" } },
    );
  } catch {
    return Response.json({ cameras: [] }, { status: 200 });
  }
}
