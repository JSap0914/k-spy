const PAGE_URL = "https://topis.seoul.go.kr/map/openCctvMap.do";
const LIST_URL = "https://topis.seoul.go.kr/map/cctv/selectCctvList.do";
const INFO_URL = "https://topis.seoul.go.kr/map/selectCctvInfo.do";

type ListRow = {
  camId?: string;
  camName?: string;
  lat?: number;
  lng?: number;
};

type InfoRow = {
  cctvName?: string;
  axX?: number;
  axY?: number;
  hlsUrl?: string;
  remark5?: string;
  gvrNm?: string;
};

const HEADERS = {
  Referer: PAGE_URL,
  "User-Agent": "Mozilla/5.0",
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
};

let cache: { at: number; cameras: TopisCamera[] } | null = null;
const CACHE_MS = 5 * 60 * 1000;
const INFO_CONCURRENCY = 24;

type TopisCamera = {
  id: string;
  name: string;
  region: string;
  group: "city";
  source: string;
  playMode: "hls";
  url: string;
  pageUrl: string;
  lat: number;
  lng: number;
};

function pickHls(row: InfoRow) {
  const urls = [row.hlsUrl, row.remark5].filter(Boolean) as string[];
  return urls.find((url) => url.includes(".m3u8")) ?? null;
}

async function fetchList(pageIndex: number) {
  const res = await fetch(LIST_URL, {
    method: "POST",
    headers: HEADERS,
    body: "cctvName=&pageIndex=" + pageIndex,
  });
  if (!res.ok) return { rows: [] as ListRow[], lastPage: pageIndex };
  const json = (await res.json()) as {
    rows?: ListRow[];
    paginationInfo?: { lastPageNo?: number; totalPageCount?: number };
  };
  return {
    rows: json.rows ?? [],
    lastPage: json.paginationInfo?.lastPageNo ?? json.paginationInfo?.totalPageCount ?? pageIndex,
  };
}

async function fetchInfo(camId: string) {
  const res = await fetch(INFO_URL, {
    method: "POST",
    headers: HEADERS,
    body: "camId=" + encodeURIComponent(camId) + "&cctvSourceCd=HP",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { rows?: InfoRow[] };
  return json.rows?.[0] ?? null;
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return Response.json(
        { cameras: cache.cameras },
        { headers: { "Cache-Control": "public, max-age=60" } },
      );
    }

    const first = await fetchList(1);
    const pages = first.lastPage;
    const listed: ListRow[] = [...first.rows];
    if (pages > 1) {
      const rest = await Promise.all(
        Array.from({ length: pages - 1 }, (_, index) => fetchList(index + 2)),
      );
      for (const page of rest) listed.push(...page.rows);
    }

    const unique = listed.filter((row) => row.camId);
    const infos: Array<InfoRow | null> = [];
    for (let i = 0; i < unique.length; i += INFO_CONCURRENCY) {
      const batch = unique.slice(i, i + INFO_CONCURRENCY);
      const part = await Promise.all(
        batch.map((row) => fetchInfo(row.camId as string)),
      );
      infos.push(...part);
    }
    const cameras: TopisCamera[] = [];
    const seen = new Set<string>();
    unique.forEach((row, index) => {
      const info = infos[index];
      const hls = info ? pickHls(info) : null;
      if (!hls || info?.axX == null || info.axY == null) return;
      const id = "topis-" + row.camId;
      if (seen.has(id)) return;
      seen.add(id);
      cameras.push({
        id,
        name: (info.cctvName ?? row.camName ?? "서울 도로").replace(/\s+/g, " ").trim(),
        region: "서울",
        group: "city" as const,
        source: info.gvrNm ?? "서울 TOPIS",
        playMode: "hls" as const,
        url: hls,
        pageUrl: PAGE_URL,
        lat: info.axY,
        lng: info.axX,
      });
    });
    cache = { at: Date.now(), cameras };
    return Response.json(
      { cameras },
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  } catch {
    return Response.json({ cameras: [] }, { status: 200 });
  }
}
