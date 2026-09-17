const REFERER = "https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3";
const ALLOWED_HOST = "gitsview.gg.go.kr";

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("u");
  if (!target) return new Response("not found", { status: 404 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("not found", { status: 404 });
  }

  if (parsed.protocol !== "https:" || parsed.hostname !== ALLOWED_HOST) {
    return new Response("not found", { status: 404 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: { Referer: REFERER },
      cache: "no-store",
    });
    if (!upstream.ok) return new Response("unavailable", { status: 502 });

    const contentType =
      upstream.headers.get("content-type") ??
      (parsed.pathname.endsWith(".m3u8")
        ? "application/vnd.apple.mpegurl"
        : "video/MP2T");

    if (parsed.pathname.endsWith(".m3u8")) {
      const text = await upstream.text();
      const rewritten = text
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return line;
          const absolute = new URL(trimmed, parsed).toString();
          return "/api/gits/seg?u=" + encodeURIComponent(absolute);
        })
        .join("\n");
      return new Response(rewritten, {
        headers: {
          "content-type": "application/vnd.apple.mpegurl",
          "cache-control": "no-store",
        },
      });
    }

    return new Response(upstream.body, {
      headers: { "content-type": contentType, "cache-control": "no-store" },
    });
  } catch {
    return new Response("unavailable", { status: 502 });
  }
}
