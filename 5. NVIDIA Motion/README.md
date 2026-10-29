# NVIDIA 1993—2026 · Data Motion Graphic

[← 모션그래픽 목록](../README.md)

25초, 120 BPM, 1920×1080 · 30fps 데이터 모션그래픽입니다. 모든 수치는 [`dataset/NVIDIA_Dataset_1993-2026.md`](dataset/NVIDIA_Dataset_1993-2026.md)(스냅샷 2026-10-28)에서 가져왔고, 기획 과정은 [`prompt/STORYBOARD.md`](prompt/STORYBOARD.md), 생성에 쓴 프롬프트는 [`prompt/NVIDIA Prompt.txt`](<prompt/NVIDIA Prompt.txt>)에 있습니다.

렌더된 영상: [`out/nvidia-1993-2026.mp4`](out/nvidia-1993-2026.mp4)

화면 전체를 하나의 GPU처럼 다룹니다. 창업자 세 픽셀이 띠가 되어 다음 씬을 열고, 상장 1주가 480칸으로 불어나 흩어진 뒤, 03의 래스터화 픽셀 격자가 그대로 04의 CUDA 스레드 격자가 됩니다. 06의 다이 중심에서 07의 매출 링이 열리고, 08의 마지막 매출 막대가 화면을 덮어 09의 배경이 됩니다.

## 실행

빌드 과정도, 외부 의존성도 없습니다.

- **로컬**: `index.html`을 브라우저로 엽니다(`file://`로도 동작).
- **GitHub Pages**: `…/5.%20NVIDIA%20Motion/` 경로에서 바로 재생됩니다.

오디오는 브라우저 정책상 처음 클릭한 뒤에 재생됩니다(`PLAY · SPACE`).

### 컨트롤

| 입력 | 동작 |
|---|---|
| `Space` | 재생 / 정지 |
| `←` `→` | 1프레임 이동 (`Shift`: 1박) |
| `[` `]` | 이전 / 다음 씬 |
| `G` | 박 그리드 오버레이 |
| `M` | 음소거 |
| 하단 바 | 스크럽(씬 구간 + 박 눈금), 씬 점프, WAV 내보내기 |

URL 파라미터: `?t=12.5`(시작 시각), `?grid`(그리드 켜기), `?capture`(1:1 무대, 컨트롤 숨김)

## MP4 렌더

```bash
node tools/render.mjs
```

`out/nvidia-1993-2026.mp4`와 `.wav`가 생성됩니다(WAV와 `out/stills/`는 git에서 제외). Node 22 이상, Chrome 또는 Edge, PATH에 있는 ffmpeg가 필요합니다. 환경 변수 `CHROME_PATH`, `FFMPEG_PATH`로 실행 파일 경로를 지정할 수 있습니다.

```bash
node tools/render.mjs --from 8 --to 12
node tools/render.mjs --stills 1.7,5.6,17.8
node tools/render.mjs --wav
```

## 구조

```
index.html              무대, 레이어, 색수차·모션블러 SVG 필터, 스크립트 로드 순서
dataset/                원본 데이터셋 (NVIDIA_Dataset_1993-2026.md)
prompt/                 생성 프롬프트 (NVIDIA Prompt.txt) + 스토리보드 (STORYBOARD.md)
out/                    렌더 결과 (nvidia-1993-2026.mp4, poster.jpg)
css/
  tokens.css            팔레트(다크 · 라임 · 바이올렛 · 페이퍼 · 코럴), 폰트 스택
  stage.css             뷰포트 맞춤, 레이어, 캡처 모드, 박 그리드
  hud.css               크롭마크, 씬 번호, 박 인디케이터, 연도 눈금자
  scenes.css            공용 컴포넌트와 씬별 스타일(알약, 티켓, 코드 창, 몽타주, 엔드카드)
  controls.css          플레이어 UI
js/
  core/util.js          수학, 이징, 시드 난수, DOM/SVG 빌더
  core/timeline.js      BPM → 박 → 프레임 (정수 박 기준이라 누적 오차 없음)
  data.js               DATA: 화면에 나오는 모든 사실 (씬은 여기만 참조)
  ui/components.js      헤드라인, 타이핑 캡션, 카운터, 링, 도장, 칩, 색 혼합
  fx/textures.js        회로 격자 점과 신호 펄스(다크 씬), 그레인, 도장 잉크 마스크
  hud.js                상시 HUD
  scenes/01…12-*.js     씬별 build() + update(lt)
  transitions.js        스트립 셔터, 수렴, RGB 색수차, 휩 팬, 아이리스, 슬라이스, 링 버스트
  engine.js             render(t): 씬 활성화, 전환 창, HUD
  audio.js              WebAudio 트랙 + OfflineAudioContext WAV
  controls.js           재생, 스크럽, 씬 점프, 그리드, 사운드, WAV
  main.js               부트스트랩, window.seek(t)
tools/render.mjs        무의존 MP4 렌더러 (CDP + ffmpeg)
```

`render(t)`는 순수 함수입니다. 모든 상태를 `t`에서 계산하고, 실시간 타이머에 기대지 않으며, 난수는 시드를 고정합니다.

## 폰트

웹폰트 CDN을 쓰지 않습니다. 시스템에 설치된 Pretendard Black / JetBrains Mono를 먼저 찾고, 없으면 Noto Sans KR · Apple SD Gothic Neo · Malgun Gothic / Cascadia Mono · Consolas 순서로 대체합니다(둘 다 SIL OFL).

## 표기 원칙

- 회계연도는 `FY`를 붙여 씁니다. NVIDIA의 FY2026은 2026-01-25에 끝난 해입니다.
- 시가총액 $2T·$3T 이정표는 출처마다 날짜가 달라 연-월까지만 씁니다. 세계 최초 $5T(2025-10-29)만 일까지 씁니다. 현재 시가총액은 변동값이라 `~$5.2T · 2026-10-28`로 표기합니다.
- 07의 GAMING 외 나머지($6.2B)와 데이터센터 비중(89.7%), 05의 차이(−10.9 PT), 11의 원가 비중(25.0%)은 데이터셋 값에서 계산한 값입니다.
- 06과 엔드카드의 트랜지스터 수는 칩별 대표값입니다(G80은 690M 표기도 있어 데이터셋 표 값 681M을 씀).
- 직원 수, IPO 조달액, Q3 FY2027 가이던스는 출처가 2차뿐이거나 갈리거나 전망치여서 쓰지 않았습니다.
- 칩·패키지·랙·GPU 보드는 단순화한 일반 도형입니다. 로고, 워드마크, 제품 디자인은 재현하지 않았습니다.
- 영상의 120 BPM 트랙은 시리즈 형식의 장식입니다.
