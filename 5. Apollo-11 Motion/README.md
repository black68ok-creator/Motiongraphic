# Apollo 11 · 1969 · Data Motion Graphic

[← 모션그래픽 목록](../README.md)

13초, 120 BPM, 1920×1080 · 30fps 데이터 모션그래픽 **예시**입니다. 템플릿으로 새 작품을 만드는 과정을 짧게 보여 주려고 6씬으로 만들었습니다. 모든 수치는 [`dataset/apollo-11_dataset_1969.md`](dataset/apollo-11_dataset_1969.md)(정리일 2026-10-24)에서 가져왔고, 기획 과정은 [`prompt/STORYBOARD.md`](prompt/STORYBOARD.md), 생성에 쓴 프롬프트는 [`prompt/Apollo-11 Prompt.txt`](<prompt/Apollo-11 Prompt.txt>)에 있습니다.

렌더된 영상: [`out/apollo-11-1969.mp4`](out/apollo-11-1969.mp4)

## 실행

빌드 과정도, 외부 의존성도 없습니다.

- **로컬**: `index.html`을 브라우저로 엽니다(`file://`로도 동작).
- **GitHub Pages**: `…/5.%20Apollo-11%20Motion/` 경로에서 바로 재생됩니다.

오디오는 브라우저 정책 때문에 처음 클릭한 뒤에 재생됩니다(`PLAY · SPACE`). 컨트롤과 URL 파라미터는 [SpaceX 작품](../1.%20SpaceX%20Motion/README.md#컨트롤)과 같습니다.

## MP4 렌더

```bash
node tools/render.mjs                    # → out/apollo-11-1969.mp4 (+ .wav)
node tools/render.mjs --stills 1.6,7.6   # 정지 화면 → out/stills/
```

Node 22 이상, Chrome 또는 Edge, PATH의 ffmpeg가 필요합니다. 환경 변수 `CHROME_PATH`, `FFMPEG_PATH`로 경로를 지정할 수 있습니다. Linux에서 root로 실행할 때는 `--no-sandbox`를 붙이는 래퍼 스크립트를 `CHROME_PATH`로 지정하세요.

## 구조

[SpaceX 작품](../1.%20SpaceX%20Motion/README.md#구조)과 같은 뼈대입니다. 작품별로 새로 쓴 파일은 다음과 같습니다.

```
js/data.js              DATA: 화면에 나오는 모든 사실
js/ui/vehicles.js       단순화한 Saturn V · 착륙선 실루엣
js/scenes/01…06-*.js    씬별 build() + update(lt)
js/transitions.js       링 버스트, 스트립 셔터, 아이리스, 슬라이스 글리치, 스핀 콜랩스
js/audio.js             120 BPM 트랙 + 카운트다운 블립 + 발사 럼블
css/tokens.css          5색 팔레트 (나이트 · 레드 · 틸 · 페이퍼 · 골드)
css/scenes.css          씬 배경과 공용 컴포넌트
```

## 표기 원칙

- 지구–달 거리 384,400 km는 미션의 실제 비행 거리가 아니라 평균 거리라서 `MEAN`을 붙였습니다.
- 8D 03:18:35는 파일의 195시간 18분 35초를 시계 형식으로 바꾼 것입니다.
- 로켓과 착륙선은 단순화한 일반 실루엣입니다. 공식 미션 패치와 기관 로고는 쓰지 않았습니다.
