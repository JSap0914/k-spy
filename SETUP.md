# 세팅

로컬에서 K-SPY를 띄우는 순서다. GitHub: https://github.com/JSap0914/k-spy

## 1. Node

Node 22.13 이상이 필요하다.

```bash
node -v
```

## 2. 코드

이미 이 폴더가 있으면 그걸 쓴다. 새로 받을 때는:

```bash
git clone https://github.com/JSap0914/k-spy.git
cd k-spy
```

## 3. 패키지

```bash
npm install
```

## 4. 고속도로 키

국립공원, 한라산, 서울 교통, 하천 수위는 키 없이 된다. 고속도로 탭만 ITS 키가 필요하다.

프로젝트 루트에 `.env.local`을 만들고 아래를 넣는다.

```bash
ITS_API_KEY=여기에_키
```

키는 [ITS 오픈데이터 CCTV](https://www.its.go.kr/opendata/opendataList?service=cctv)에서 이메일 가입 후 발급한다. `.env.local`은 Git에 올리지 않는다.

## 5. 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 연다. 끄려면 터미널에서 Ctrl+C.

## 6. 화면

- `1` `2` `4`: 고른 카메라만 동시에 재생
- `전체`: 지금 필터된 LIVE를 한 페이지에 전부 켠다
- 왼쪽 분류: 국립공원 / 한라산 / 고속도로 / 도시 도로 / 서울 / 경기 / 방범·안전
- 목록에서 LIVE를 누르면 영상이 열리고, `링크`는 공식 사이트로 간다

## 7. 지금 되는 것

- 국립공원, 한라산
- 서울 교통 CCTV (`도시 도로`, `서울`)
- 고속도로 (`.env.local`에 키를 넣은 뒤)
- 하천 수위 감시 (`방범·안전`의 한강홍수통제소)

## 8. 아직 안 되는 것

- 전국 도시도로 UTIC: 신청은 되어 있고 승인 대기다. 키가 나오면 그때 붙이면 된다.
- 경기도: 키는 나왔지만 사용 중지다. 풀려도 CCTV 영상 API가 없을 수 있다.
- 골목 방범: 공개 스트림이 없어서 세팅으로 열리지 않는다.
