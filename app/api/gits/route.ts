const LIST_URL = "https://gits.gg.go.kr/web/map/webLoadCCTVData.do";
const POPUP_URL = "https://gits.gg.go.kr/web/popup/webCctvPopup.do?cctvId=";
const REFERER = "https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3";
const PROBE_CONCURRENCY = 24;

type GitsCamera = {
  id: string;
  name: string;
  region: string;
  group: "gyeonggi";
  source: string;
  playMode: "hls";
  url: string;
  pageUrl: string;
  lat: number;
  lng: number;
};

let cache: { at: number; cameras: GitsCamera[] } | null = null;
const CACHE_MS = 10 * 60 * 1000;

function parseRows(text: string) {
  return text
    .split("@")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => chunk.split("/"))
    .filter((parts) => parts.length >= 4);
}

async function hasStream(id: string) {
  try {
    const res = await fetch(POPUP_URL + encodeURIComponent(id), {
      headers: { Referer: REFERER },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const html = await res.text();
    return /\$\.get\(\s*"\/\/[^"]+?!hls"/.test(html) || /videoUrl\s*=\s*"https?:/.test(html);
  } catch {
    return false;
  }
}

async function keepPlayable(cameras: GitsCamera[]) {
  const playable: GitsCamera[] = [];
  for (let i = 0; i < cameras.length; i += PROBE_CONCURRENCY) {
    const batch = cameras.slice(i, i + PROBE_CONCURRENCY);
    const flags = await Promise.all(
      batch.map((camera) => hasStream(camera.id.replace("gits-", ""))),
    );
    batch.forEach((camera, index) => {
      if (flags[index]) playable.push(camera);
    });
  }
  return playable;
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return Response.json(
        { cameras: cache.cameras },
        { headers: { "Cache-Control": "public, max-age=300" } },
      );
    }

    const res = await fetch(LIST_URL, { cache: "no-store" });
    if (!res.ok) return Response.json({ cameras: [] }, { status: 200 });

    const rows = parseRows(await res.text());
    const seen = new Set<string>();
    const cameras: GitsCamera[] = [];

    for (const parts of rows) {
      const id = parts[0]?.trim();
      const rawName = parts[1]?.trim();
      const lng = Number(parts[2]);
      const lat = Number(parts[3]);
      if (!id || !rawName || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (lat < 33 || lat > 39 || lng < 124 || lng > 132) continue;
      if (seen.has(id)) continue;
      seen.add(id);

      cameras.push({
        id: "gits-" + id,
        name: rawName.replace(/\s+/g, " "),
        region: "경기",
        group: "gyeonggi",
        source: "경기도 교통정보센터",
        playMode: "hls",
        url: "/api/gits/hls/" + id,
        pageUrl: "https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3",
        lat,
        lng,
      });
    }

    const playable = await keepPlayable(cameras);
    cache = { at: Date.now(), cameras: playable };
    return Response.json(
      { cameras: playable },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch {
    return Response.json({ cameras: [] }, { status: 200 });
  }
}
