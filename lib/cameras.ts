export type PlayMode = "hls" | "outbound";
export type CameraGroup = "park" | "halla" | "highway" | "city" | "seoul" | "gyeonggi";

export type Camera = {
  id: string;
  name: string;
  region: string;
  group: CameraGroup;
  source: string;
  playMode: PlayMode;
  url: string;
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
};

export const CAMERAS: Camera[] = [
  { id: "knps-baegundae", name: "북한산 백운대", region: "서울", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/gangbuk.m3u8", lat: 37.6587, lng: 126.993 },
  { id: "knps-sapaesan", name: "북한산 사패산", region: "경기", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/sapesan.m3u8", lat: 37.6624, lng: 127.0136 },
  { id: "knps-jangteomok", name: "지리산 장터목", region: "경남", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/zjangteo.m3u8", lat: 35.3371, lng: 127.7306 },
  { id: "knps-cheonwangbong", name: "지리산 천왕봉", region: "경남", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/wongbong.m3u8", lat: 35.337, lng: 127.7305 },
  { id: "knps-ulsanbawi", name: "설악산 울산바위", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/solak.m3u8", lat: 38.1712, lng: 128.4747 },
  { id: "knps-yeonhwabong", name: "소백산 연화봉", region: "충북", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/sobak.m3u8", lat: 36.957, lng: 128.477 },
  { id: "knps-seolcheonbong", name: "덕유산 설천봉", region: "전북", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/zsulchun.m3u8", lat: 35.8608, lng: 127.746 },
  { id: "knps-duroreong", name: "오대산 두로령", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/zduro.m3u8", lat: 37.798, lng: 128.543 },
  { id: "knps-cheonjedan", name: "태백산 천제단", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/zchunje.m3u8", lat: 37.099, lng: 128.915 },
  { id: "knps-giam", name: "주왕산 기암", region: "경북", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/zjulje.m3u8", lat: 36.397, lng: 129.187 },
  { id: "knps-jangbuljae", name: "무등산 장불재", region: "광주", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/jangbuljai.m3u8", lat: 35.134, lng: 126.988 },
  { id: "knps-cheonhwangbong", name: "계룡산 천황봉", region: "충남", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/sinsungbong.m3u8", lat: 36.342, lng: 127.206 },
  { id: "knps-sangwonsa", name: "치악산 상원사", region: "강원", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/sangwonsa.m3u8", lat: 37.372, lng: 128.05 },
  { id: "knps-hagampo", name: "태안해안 학암포", region: "충남", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/hakampo.m3u8", lat: 36.9, lng: 126.206 },
  { id: "knps-jukmak", name: "변산반도 죽막탐방로", region: "전북", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/jukmak.m3u8", lat: 35.626, lng: 126.468 },
  { id: "knps-gaksan", name: "한려해상 각산", region: "경남", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/gaksan.m3u8", lat: 34.826, lng: 128.043 },
  { id: "knps-jiricheongsong", name: "다도해해상 지리청송해변", region: "전남", group: "park", source: "국립공원공단", playMode: "hls", url: "https://live.knps.or.kr/cctv/hls/jodo.m3u8", lat: 34.3, lng: 126.52 },
  { id: "halla-baengnokdam", name: "한라산 백록담", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", url: "https://hallacctv.kr/live/cctv01.stream_360p/playlist.m3u8", lat: 33.3617, lng: 126.5292 },
  { id: "halla-wanggwanreung", name: "한라산 왕관릉", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", url: "https://hallacctv.kr/live/cctv02.stream_360p/playlist.m3u8", lat: 33.37, lng: 126.51 },
  { id: "halla-witseoreum", name: "한라산 윗세오름", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", url: "https://hallacctv.kr/live/cctv03.stream_360p/playlist.m3u8", lat: 33.361, lng: 126.505 },
  { id: "halla-eoseungsaengak", name: "한라산 어승생악", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", url: "https://hallacctv.kr/live/cctv04.stream_360p/playlist.m3u8", lat: 33.392, lng: 126.49 },
  { id: "halla-1100", name: "한라산 1100도로", region: "제주", group: "halla", source: "한라산국립공원관리소", playMode: "hls", url: "https://hallacctv.kr/live/cctv05.stream_360p/playlist.m3u8", lat: 33.358, lng: 126.462 },
  { id: "topis-gaehwasa", name: "개화사거리", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", url: "https://topiscctv1.eseoul.go.kr/edge12/ch133.stream/playlist.m3u8", lat: 37.5725, lng: 126.80371 },
  { id: "topis-gyeongridan", name: "남산 경리단길", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", url: "https://topiscctv1.eseoul.go.kr/edge6/ch113.stream/playlist.m3u8", lat: 37.538197, lng: 126.986663 },
  { id: "topis-library", name: "남산 도서관", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", url: "https://topiscctv1.eseoul.go.kr/edge6/ch89.stream/playlist.m3u8", lat: 37.5528, lng: 126.97924 },
  { id: "topis-baekbeom", name: "남산 백범광장", region: "서울", group: "seoul", source: "서울 TOPIS", playMode: "hls", url: "https://topiscctv1.eseoul.go.kr/edge6/ch77.stream/playlist.m3u8", lat: 37.55616, lng: 126.97904 },
  { id: "spatic-2", name: "서울 교차로 2", region: "서울", group: "seoul", source: "서울경찰청 교통정보센터", playMode: "hls", url: "https://strm1.spatic.go.kr/live/2.stream/playlist.m3u8", lat: 37.5665, lng: 126.978 },
  { id: "its-hub", name: "고속도로·국도", region: "전국", group: "highway", source: "국가교통정보센터", playMode: "outbound", url: "https://www.its.go.kr/?mapTab=cctv", lat: 36.5, lng: 127.8, note: "공식 API 키가 연결되면 전국 도로 CCTV를 이 지도에서 바로 재생합니다." },
  { id: "its-01", name: "수도권제1순환선  판교분기점", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/1/LxZdZaq5Tz3wXUpjhzUERcLXVyGm/NlYRF3pgbV4c8YjhUsLjRpuAlmI2S32Xry503r4FV+VkVTw8wE/eurkCg==", lat: 37.40665, lng: 127.09706 },
  { id: "its-02", name: "수도권제1순환선  성남", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/2/kVGOeJuU3i4a+Ytvmm1SJjcu90U4Ahk1gJVyVlGjZimdA4zvIb+FrcaPrvdAwfURGAvf0MoeSbhMyqDAhT2TMA==", lat: 37.42889, lng: 127.12361 },
  { id: "its-03", name: "수도권제1순환선  성남요금소", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/3/4CvneaIIzLIBeZm0m1OokpKQZzZKcVKcXuqBYbszTWopKUoBu0Gl1JAy0UOA53SIYvGuKGmqZHWz7j5OJKKXmg==", lat: 37.43909, lng: 127.12262 },
  { id: "its-04", name: "수도권제1순환선  송파", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/4/305ABUIEozUEmqgRw0u24JnzPPVoEp1v9ymHWnZ5vwtXvOFUvm//liNeazPnOqCuOftSvnby5lqqcqR65djWog==", lat: 37.475, lng: 127.12944 },
  { id: "its-05", name: "수도권제1순환선  서하남2", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/5/EWTtl0WhJBjxebqmz9o5xsNnhwNC5qZNn5aUEuCS+U3KyDkXDoRTTXRt/CHfbHd7mdULGFz8rC4t7AXksUluPg==", lat: 37.51167, lng: 127.14972 },
  { id: "its-06", name: "수도권제1순환선  광암터널2", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/6/xJ5HJVtfx4ACW7MxpUtpJ7G1TdXoy92Cqvrbx2NlxpeM4pV2XkGlr7OrgLxi+wmIu66AJ4UTyA8b0kUZdjF5Yg==", lat: 37.516332, lng: 127.173364 },
  { id: "its-07", name: "수도권제1순환선  광암터널3", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/7/HhtpZSLXG6Rf00L/yiYedrXMjzF0NzAmeZXUa4KMcE58K/mci2cx6+bdMAzPKwdrR6gufWLNQgJJ22XQUhgkUg==", lat: 37.51916667, lng: 127.1866667 },
  { id: "its-08", name: "수도권제1순환선  하남분기점", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/8/bZ6fWikAGjnfAd/uUONJHMx3W1wF0T0rut5OKZ5p5WG36kryvvwNWI00r8tuAMCdU0QLLsGACfgFG0Ma7W53Dw==", lat: 37.5325, lng: 127.19361 },
  { id: "its-09", name: "수도권제1순환선  상일", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/9/hRTHZ32ipTvYtQU5ZUsm7qahWJtOd60+lR4lXU07xISRGgdjTLO4CmUD3lsVeJOuq9/CBo4bIjm0ROlMik6exg==", lat: 37.5457231, lng: 127.181422 },
  { id: "its-10", name: "수도권제1순환선  강일", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/10/WtFHYkviBt7Z4W4SvnBFldOCAIRdrep5tmoBX5A48UyoiUoWugoZ9TXKISi+ADi1HsO5Z31xLASzMJr9pcGw58YOSYjThE9yHSmH3X/HKHs=", lat: 37.57333333, lng: 127.1655556 },
  { id: "its-11", name: "수도권제1순환선  토평", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/11/9ulIages62UbRjbJFKYNlEH8fqCH8P0kspOx5LljU6mUbtUxVW4uIkp07RLo6gyUdvcr+1he+AGvnmRnFgDp5dPPyMPb114blkXGI0bpXXw=", lat: 37.58428, lng: 127.156631 },
  { id: "its-12", name: "수도권제1순환선  남양주", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/12/Ui0hl4wf1pjxjrbKLrFyFi27pm9betUsCMZtQRAWiPP1eoj3Pe2PUAVfJkU8Ygla23QMzrNIaukV6zqlU7rmaf1oZG9cO5iNwhDbu9KqCzY=", lat: 37.60222222, lng: 127.1536111 },
  { id: "its-13", name: "수도권제1순환선  학의분기점", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/13/awQerAujTtRziKFeDt6zME63wOavqn7/Cli0kRM+h7zEzL67ewfAUoIHtDeoFd8qm/Yl2yGAEF6Cd2iyI/AXxuKLebpKjdK1g5k4ND9yXtw=", lat: 37.38482, lng: 126.99123 },
  { id: "its-14", name: "수도권제1순환선  청계요금소", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/14/1KJ7EKm+j1yEEkq2zoBMcoLSRowI5O0G26cWCpYfIW7q3yfjPDm03yO08dQw/IbsRlf4UXBhEvkkfEhx7mFNOQ6HX/hS8DQCTQ7YynJnCHA=", lat: 37.39333, lng: 127.02722 },
  { id: "its-15", name: "수도권제1순환선  청계운중교", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/15/z3Tn+53BBclXzMAx8wUxdXu1eiQ7/sPVVh6x57G3Bqz2n/xEN6JflzvN4gciXTsPtmL3+l3taw7tzuzUCNormiNnglEG1C7bEbZWR57OD54=", lat: 37.395054, lng: 127.062568 },
  { id: "its-16", name: "수도권제1순환선  퇴계원", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/16/SgWRIaBERdiQNhnAEjT3H8CFEASdegIxnDuO8qy7nrVu5QcSRuYWToRvjfp4o6Y/pWTTSknuT4Gt0MqmxSCPMEB275DMjd72onMgzfKvclY=", lat: 37.63944, lng: 127.13361 },
  { id: "its-17", name: "수도권제1순환선  구리", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/17/Yd8UuzHMYX6GRKF+IrxEcJZuuIP0timo7HCoW9lrLRhCpTgGtJBeoqbK9QZgC6qCLoPyCUelQKO5rySHSCxqI3UKWZW6G9fClGYjtFC4hhM=", lat: 37.61559764, lng: 127.1412691 },
  { id: "its-18", name: "중부선  상산곡교", region: "수도권", group: "highway", source: "국가교통정보센터", playMode: "hls", url: "https://cctvsec.ktict.co.kr/18/+N9LrE+t696PjCw2TJ0XDAiORVY1P67C9VSeARYxgjO7tCTyaEbzVAle1HCI6SxgmL8nvjQv8edhjy61/x3q7Rr32XhzPxK1y4g/ul7q9+o=", lat: 37.49375532, lng: 127.2372552 },
  { id: "utic-hub", name: "도시 도로·교차로", region: "전국", group: "city", source: "도시교통정보센터", playMode: "outbound", url: "https://www.utic.go.kr/map/map.do?menu=cctv", lat: 37.48, lng: 127.03, note: "개방데이터는 키와 IP 인증이 필요합니다." },
  { id: "gits-hub", name: "경기도 도로", region: "경기", group: "gyeonggi", source: "경기도 교통정보센터", playMode: "outbound", url: "https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3", lat: 37.29, lng: 127.03, note: "공식 팝업에서 실시간 HLS를 발급합니다." },
];
