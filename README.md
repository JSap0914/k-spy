# K-SPY

공개된 한국 실시간 CCTV가 한판에 다 보인다.

국립공원, 한라산, 서울 교통, 고속도로, 하천 수위 감시처럼 **이미 공개된 실시간 영상**만 한 화면에 붙인다. 골목 방범 CCTV는 넣지 않는다.

저장소: https://github.com/JSap0914/k-spy

## 바로 실행

```bash
git clone https://github.com/JSap0914/k-spy.git
cd k-spy
npm install
copy .env.example .env.local
npm run dev
```

[http://localhost:3000](http://localhost:3000)

고속도로 탭까지 보려면 `.env.local`에 `ITS_API_KEY`를 넣는다. 키 발급, 화면 조작, 되는 것/안 되는 것까지는 [SETUP.md](SETUP.md)에 모아 두었다.

## 화면

- `1` `2` `4`: 고른 카메라만 동시에 재생
- `전체`: 지금 필터된 LIVE를 한 페이지에 전부 켠다

