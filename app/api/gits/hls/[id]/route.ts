const POPUP_URL = "https://gits.gg.go.kr/web/popup/webCctvPopup.do?cctvId=";
const REFERER = "https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3";

async function resolvePlaylistUrl(id: string) {
  const popup = await fetch(POPUP_URL + encodeURIComponent(id), {
    headers: { Referer: REFERER },
    cache: "no-store",
  });
  if (!popup.ok) return null;
  const html = await popup.text();

  const tokenMatch = html.match(/\$\.get\(\s*"(\/\/[^"]+?!hls)"/);
  if (tokenMatch) {
    const tokenRes = await fetch("https:" + tokenMatch[1], {
      headers: { Referer: REFERER },
      cache: "no-store",
    });
    if (!tokenRes.ok) return null;
    const resolved = (await tokenRes.text()).trim();
    if (resolved.startsWith("http")) return resolved;
    if (resolved.startsWith("//")) return "https:" + resolved;
    return null;
  }

  const directMatch = html.match(/videoUrl\s*=\s*"(https?:\/\/[^"]+)"/);
  if (directMatch) return directMatch[1].replace(/^http:/, "https:");
  return null;
}

function rewritePlaylist(text: string, base: string) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      const absolute = new URL(trimmed, base).toString();
      return "/api/gits/seg?u=" + encodeURIComponent(absolute);
    })
    .join("\n");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^[0-9]+$/.test(id)) return new Response("not found", { status: 404 });

  try {
    const playlistUrl = await resolvePlaylistUrl(id);
    if (!playlistUrl) return new Response("unavailable", { status: 502 });

    const upstream = await fetch(playlistUrl, {
      headers: { Referer: REFERER },
      cache: "no-store",
    });
    if (!upstream.ok) return new Response("unavailable", { status: 502 });

    const text = await upstream.text();
    return new Response(rewritePlaylist(text, playlistUrl), {
      headers: {
        "content-type": "application/vnd.apple.mpegurl",
        "cache-control": "no-store",
      },
    });
  } catch {
    return new Response("unavailable", { status: 502 });
  }
}
