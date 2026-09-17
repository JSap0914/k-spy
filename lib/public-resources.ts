export type ResourceKind = '위치 지도' | '설치 데이터' | '영상 자료' | '열람 안내';

export const PUBLIC_RESOURCES: {
  id: string;
  name: string;
  source: string;
  region: string;
  kind: ResourceKind;
  url: string;
  description: string;
  access: string;
}[] = [
  {
    id: 'national-cctv',
    name: '전국 CCTV 설치 정보',
    source: '행정안전부 · 공공데이터포털',
    region: '전국',
    kind: '설치 데이터',
    url: 'https://www.data.go.kr/data/15013094/standard.do',
    description: '방범·범죄예방 등 설치 목적, 주소, 위도·경도, 카메라 대수와 관리기관을 제공하는 CSV입니다. 녹화 영상이나 재생 주소는 포함하지 않습니다.',
    access: '공개 데이터 · 공식 페이지에서 다운로드',
  },
  {
    id: 'anyang-safety',
    name: '안양 골목·아동보호구역 방범 CCTV 위치',
    source: '안양시 스마트도시통합센터',
    region: '경기 안양',
    kind: '위치 지도',
    url: 'https://smart.anyang.go.kr/smart/map/main?fcltType=cctvPes,cctvCrm',
    description: '공식 지도의 시설물 위치 확인에서 방범CCTV 일반구역·아동보호구역을 선택할 수 있습니다. 위치 안내이며 영상 재생은 제공하지 않습니다.',
    access: '공개 지도 · 공식 사이트에서 확인',
  },
  {
    id: 'safemap',
    name: '생활안전지도',
    source: '행정안전부',
    region: '전국',
    kind: '위치 지도',
    url: 'https://www.safemap.go.kr/main/smap.do',
    description: '생활안전 시설과 지역 안전정보를 확인하는 공식 지도입니다. 제공 항목을 지도에서 선택하며, CCTV 영상 플레이어는 아닙니다.',
    access: '공개 지도 · 생활안전지도 메뉴 선택',
  },
  {
    id: 'yeoncheon-access',
    name: '방범 CCTV 개인영상정보 열람 절차',
    source: '연천군청',
    region: '경기 연천',
    kind: '열람 안내',
    url: 'https://tour.yeoncheon.go.kr/www/contents.do?key=4940',
    description: '보관된 CCTV 영상의 열람 절차를 확인하는 공식 안내입니다. 안내 페이지 접근과 영상 열람 승인은 별개이며, 이 허브에서 녹화본을 바로 재생하지 않습니다.',
    access: '안내 공개 · 실제 영상은 본인 확인·심사 필요',
  },
  {
    id: 'gits-map',
    name: '경기도 공개 교통 CCTV 지도',
    source: '경기도 교통정보센터',
    region: '경기',
    kind: '위치 지도',
    url: 'https://gits.gg.go.kr/web/trafficInfo/webMapInfo.do?opt=3',
    description: '경기 전역의 공개 교통 CCTV를 지도에서 고르고 실시간으로 볼 수 있는 공식 화면입니다. K-SPY의 경기 탭에서도 같은 영상을 재생합니다.',
    access: '공개 지도 · 키 없이 열람',
  },
];
