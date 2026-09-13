import { FLOOD_CAMERA_ROWS } from "./flood-cameras";

export type PlayMode = "hls" | "outbound";
export type CameraGroup =
  | "park"
  | "halla"
  | "highway"
  | "city"
  | "seoul"
  | "gyeonggi"
  | "safety";

export type Camera = {
  id: string;
  name: string;
  region: string;
  group: CameraGroup;
  source: string;
  playMode: PlayMode;
  url: string;
  pageUrl?: string;
  lat: number;
  lng: number;
  note?: string;
};

export const GROUP_LABEL: Record<CameraGroup | "all", string> = {
  all: "전체",
  park: "국립공원",
  halla: "한라산",
  highway: "고속도로",
  city: "도시 도로",
  seoul: "서울",
  gyeonggi: "경기",
  safety: "방범·안전",
};

export const CAMERAS: Camera[] = [
  { id: "knps-baegundae", name: "북한산 백운대", region: "서울", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/gangbuk.m3u8", lat: 37.6587, lng: 126.993 },
  { id: "knps-sapaesan", name: "북한산 사패산", region: "경기", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/sapesan.m3u8", lat: 37.6624, lng: 127.0136 },
  { id: "knps-ulsanbawi", name: "설악산 울산바위", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/solak.m3u8", lat: 38.1712, lng: 128.4747 },
  { id: "knps-yeonhwabong", name: "소백산 연화봉", region: "충북", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/sobak.m3u8", lat: 36.957, lng: 128.477 },
  { id: "knps-seolcheonbong", name: "덕유산 설천봉", region: "전북", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/zsulchun.m3u8", lat: 35.8608, lng: 127.746 },
  { id: "knps-duroreong", name: "오대산 두로령", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/zduro.m3u8", lat: 37.798, lng: 128.543 },
  { id: "knps-cheonjedan", name: "태백산 천제단", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/zchunje.m3u8", lat: 37.099, lng: 128.915 },
  { id: "knps-giam", name: "주왕산 기암", region: "경북", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/zjulje.m3u8", lat: 36.397, lng: 129.187 },
  { id: "knps-jangbuljae", name: "무등산 장불재", region: "광주", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/jangbuljai.m3u8", lat: 35.134, lng: 126.988 },
  { id: "knps-sangwonsa", name: "치악산 상원사", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/sangwonsa.m3u8", lat: 37.372, lng: 128.05 },
  { id: "knps-hagampo", name: "태안해안 학암포", region: "충남", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/hakampo.m3u8", lat: 36.9, lng: 126.206 },
  { id: "knps-jukmak", name: "변산반도 죽막탐방로", region: "전북", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/jukmak.m3u8", lat: 35.626, lng: 126.468 },
  { id: "knps-gaksan", name: "한려해상 각산", region: "경남", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/gaksan.m3u8", lat: 34.826, lng: 128.043 },
  { id: "knps-jiricheongsong", name: "다도해해상 지리청송해변", region: "전남", group: "park", source: "국립공원공단", playMode: "hls", pageUrl: "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168", url: "https://live.knps.or.kr/cctv/hls/jodo.m3u8", lat: 34.3, lng: 126.52 },
  { id: "halla-baengnokdam", name: "한라산 백록담", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", pageUrl: "https://www.jeju.go.kr/tool/halla/cctv.html", url: "https://hallacctv.kr/live/cctv01.stream_360p/playlist.m3u8", lat: 33.3617, lng: 126.5292 },
  { id: "halla-wanggwanreung", name: "한라산 왕관릉", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", pageUrl: "https://www.jeju.go.kr/tool/halla/cctv.html", url: "https://hallacctv.kr/live/cctv02.stream_360p/playlist.m3u8", lat: 33.37, lng: 126.51 },
  { id: "halla-witseoreum", name: "한라산 윗세오름", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", pageUrl: "https://www.jeju.go.kr/tool/halla/cctv.html", url: "https://hallacctv.kr/live/cctv03.stream_360p/playlist.m3u8", lat: 33.361, lng: 126.505 },
  { id: "halla-eoseungsaengak", name: "한라산 어승생악", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", pageUrl: "https://www.jeju.go.kr/tool/halla/cctv.html", url: "https://hallacctv.kr/live/cctv04.stream_360p/playlist.m3u8", lat: 33.392, lng: 126.49 },
  { id: "halla-1100", name: "한라산 1100도로", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", pageUrl: "https://www.jeju.go.kr/tool/halla/cctv.html", url: "https://hallacctv.kr/live/cctv05.stream_360p/playlist.m3u8", lat: 33.358, lng: 126.462 },
  { id: "topis-gaehwasa", name: "개화사거리", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", pageUrl: "https://topis.seoul.go.kr/map/openCctvMap.do", url: "https://topiscctv1.eseoul.go.kr/edge12/ch133.stream/playlist.m3u8", lat: 37.5725, lng: 126.80371 },
  { id: "topis-gyeongridan", name: "남산 경리단길", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", pageUrl: "https://topis.seoul.go.kr/map/openCctvMap.do", url: "https://topiscctv1.eseoul.go.kr/edge6/ch113.stream/playlist.m3u8", lat: 37.538197, lng: 126.986663 },
  { id: "topis-library", name: "남산 도서관", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", pageUrl: "https://topis.seoul.go.kr/map/openCctvMap.do", url: "https://topiscctv1.eseoul.go.kr/edge6/ch89.stream/playlist.m3u8", lat: 37.5528, lng: 126.97924 },
  { id: "topis-baekbeom", name: "남산 백범광장", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", pageUrl: "https://topis.seoul.go.kr/map/openCctvMap.do", url: "https://topiscctv1.eseoul.go.kr/edge6/ch77.stream/playlist.m3u8", lat: 37.55616, lng: 126.97904 },
  { id: "spatic-2", name: "서울 교차로 2", region: "서울", group: "seoul", source: "서울경찰청 교통정보센터", playMode: "hls", pageUrl: "https://topis.seoul.go.kr/map/openCctvMap.do", url: "https://strm1.spatic.go.kr/live/2.stream/playlist.m3u8", lat: 37.5665, lng: 126.978 },
  { id: "its-hub", name: "고속도로·국도 전체", region: "전국", group: "highway", source: "국가교통정보센터", playMode: "outbound", url: "https://www.its.go.kr/?mapTab=cctv", lat: 36.5, lng: 127.8, note: "지도에 올라온 고속도로는 바로 재생됩니다. 전체 카메라는 공식 사이트에서 봅니다." },
  { id: "utic-hub", name: "도시 도로·교차로", region: "전국", group: "city", source: "도시교통정보센터", playMode: "outbound", url: "https://www.utic.go.kr/map/map.do?menu=cctv", lat: 37.48, lng: 127.03, note: "개방데이터는 키와 IP 인증이 필요합니다." },
  { id: "gits-hub", name: "경기도 도로", region: "경기", group: "gyeonggi", source: "경기도 교통정보센터", playMode: "outbound", url: "https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3", lat: 37.29, lng: 127.03, note: "공식 팝업에서 실시간 HLS를 발급합니다." },
  { id: "flood-hub", name: "하천 수위 감시 전체", region: "전국", group: "safety", source: "한강홍수통제소", playMode: "outbound", url: "https://www.hrfco.go.kr/sumun/cctvRtmp.do", lat: 37.5911, lng: 127.8453, note: "공개된 하천 수위 감시 CCTV입니다. 거리 방범 카메라가 아닙니다." },
  { id: "safemap-hub", name: "생활안전지도", region: "전국", group: "safety", source: "행정안전부", playMode: "outbound", url: "https://www.safemap.go.kr/main/smap.do", lat: 36.5, lng: 127.8, note: "시설·위험지역 위치는 공개됩니다. 거리 방범 실시간 영상은 열리지 않습니다." },
  { id: "utic-safety-hub", name: "경찰 교통 CCTV 신청", region: "전국", group: "safety", source: "경찰청 UTIC", playMode: "outbound", url: "https://www.utic.go.kr/guide/newUtisData.do", lat: 37.56, lng: 126.98, note: "교통관제 CCTV는 키와 IP 승인 뒤에만 열립니다. 방범용 거리 카메라는 공개되지 않습니다." },
];

export const DEFAULT_CAMERA_ID = "knps-baegundae";

export const FLOOD_CAMERAS: Camera[] = FLOOD_CAMERA_ROWS.map((row) => ({
  id: "flood-" + row.id,
  name: row.name,
  region: row.name.split("(")[0] || "하천",
  group: "safety",
  source: "한강홍수통제소",
  playMode: "hls",
  url: "/api/flood/hls/" + encodeURIComponent(row.id),
  pageUrl: "https://www.hrfco.go.kr/sumun/cctvRtmp.do",
  lat: row.lat,
  lng: row.lng,
}));
