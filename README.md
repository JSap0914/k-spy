# K-SPY

공개된 한국 실시간 CCTV가 한판에 다 보인다.

국립공원, 한라산, 서울 교통, 고속도로, 하천 수위 감시처럼 **이미 공개된 실시간 영상**만 한 화면에 붙인다. 골목 방범 CCTV는 넣지 않는다.

## 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

자세한 순서는 [SETUP.md](SETUP.md)에 있다. 고속도로 탭은 `ITS_API_KEY`가 필요하다.

## 화면

- 1 / 2 / 4: 고른 카메라만 병렬 재생
- 전체: 지금 필터된 LIVE를 한 페이지에 전부 켠다

