const ITS_API_KEY = process.env.ITS_API_KEY ?? "";

type ItsRow = {
  cctvname?: string;
  cctvurl?: string;
  coordx?: number;
  coordy?: number;
};

const BOXES = [
  { minX: 124.6, maxX: 127.0, minY: 33.0, maxY: 35.5 },
  { minX: 127.0, maxX: 129.6, minY: 33.0, maxY: 35.5 },
  { minX: 124.6, maxX: 127.0, minY: 35.5, maxY: 37.5 },
  { minX: 127.0, maxX: 129.6, minY: 35.5, maxY: 37.5 },
  { minX: 124.6, maxX: 127.0, minY: 37.5, maxY: 38.7 },
  { minX: 127.0, maxX: 129.6, minY: 37.5, maxY: 38.7 },
];

const CACHE_MS = 5 * 60 * 1000;
let cache: { at: number; cameras: ItsCamera[] } | null = null;

type ItsCamera = {
  id: string;
  name: string;
  region: string;
  group: "highway";
  source: string;
  playMode: "hls";
  url: string;
  pageUrl: string;
  lat: number;
  lng: number;
};

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
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return Response.json(
        { cameras: cache.cameras },
        { headers: { "Cache-Control": "public, max-age=60" } },
      );
    }

    const rows = (await Promise.all(BOXES.map(fetchBox))).flat();
    const seen = new Set<string>();
    const cameras: ItsCamera[] = [];
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
    }

    cache = { at: Date.now(), cameras };
    return Response.json(
      { cameras },
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  } catch {
    return Response.json({ cameras: [] }, { status: 200 });
  }
}
