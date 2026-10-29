# Hermes × Nemotron on Termux · Motion Graphic

[← 모션그래픽 목록](../README.md)

25초, 120 BPM, 1920×1080 · 30fps 모션그래픽입니다. 안드로이드 휴대폰의 Termux에 Hermes Agent를 설치하고, NVIDIA build(build.nvidia.com)의 무료 API로 Nemotron 3 Ultra(550B)를 연결한 뒤, 텔레그램 봇으로 AI 자동화를 돌리는 과정을 정리했습니다. 모든 명령어와 수치는 [`dataset/Hermes_Nemotron_Termux_Dataset.md`](dataset/Hermes_Nemotron_Termux_Dataset.md)(스냅샷 2026-10-29)에서 가져왔고, 기획 과정은 [`prompt/STORYBOARD.md`](prompt/STORYBOARD.md), 생성에 쓴 프롬프트는 [`prompt/Hermes-Nemotron Prompt.txt`](<prompt/Hermes-Nemotron Prompt.txt>)에 있습니다.

렌더된 영상: [`out/hermes-nemotron-termux.mp4`](out/hermes-nemotron-termux.mp4)

화면 하단 눈금자는 연도 대신 설정 단계(START → TERMUX → INSTALL → KEY → BOT → GATEWAY → CRON)를 따라갑니다.

## 실행

빌드 과정도, 외부 의존성도 없습니다.

- **로컬**: `index.html`을 브라우저로 엽니다(`file://`로도 동작).
- **GitHub Pages**: `…/6.%20Hermes-Nemotron%20Motion/` 경로에서 바로 재생됩니다.

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

`out/hermes-nemotron-termux.mp4`와 `.wav`가 생성됩니다(WAV와 `out/stills/`는 git에서 제외). Node 22 이상, Chrome 또는 Edge, PATH에 있는 ffmpeg가 필요합니다. 환경 변수 `CHROME_PATH`, `FFMPEG_PATH`로 실행 파일 경로를 지정할 수 있습니다.

```bash
node tools/render.mjs --from 8 --to 12
node tools/render.mjs --stills 1.7,7.7,19.8
node tools/render.mjs --wav
```

## 구조

```
index.html              무대, 레이어, 색수차·모션블러 SVG 필터, 스크립트 로드 순서
dataset/                원본 데이터셋 (Hermes_Nemotron_Termux_Dataset.md)
prompt/                 생성 프롬프트 (Hermes-Nemotron Prompt.txt) + 스토리보드 (STORYBOARD.md)
out/                    렌더 결과 (hermes-nemotron-termux.mp4, poster.jpg)
css/
  tokens.css            팔레트(나이트 · 앰버 · 블루 · 페이퍼 · 로즈), 폰트 스택
  stage.css             뷰포트 맞춤, 레이어, 캡처 모드, 박 그리드
  hud.css               크롭마크, 씬 번호, 박 인디케이터, 단계 눈금자
  scenes.css            공용 컴포넌트, 휴대폰 · 말풍선 · 터미널 · 체크박스 · 노드
  controls.css          플레이어 UI
js/
  core/util.js          수학, 이징, 시드 난수, DOM/SVG 빌더
  core/timeline.js      BPM → 박 → 프레임
  data.js               DATA: 화면에 나오는 모든 명령어·수치 (씬은 여기만 참조)
  ui/components.js      헤드라인, 타이핑 캡션, 카운터, 도장, 칩
  ui/devices.js         일반 휴대폰, 채팅 말풍선, 터미널/파일 창 (로고 없음)
  fx/textures.js        회로 격자 점과 신호 펄스(다크 씬), 그레인, 도장 잉크 마스크
  hud.js                상시 HUD (설정 단계 눈금자)
  scenes/01…12-*.js     씬별 build() + update(lt)
  transitions.js        화면 열림, 휩 팬, 아이리스, RGB 색수차, 스트립 셔터, 슬라이스, 링 버스트
  engine.js             render(t)
  audio.js              WebAudio 트랙 + OfflineAudioContext WAV
  controls.js · main.js 플레이어, window.seek(t)
tools/render.mjs        무의존 MP4 렌더러 (CDP + ffmpeg)
```

## 폰트

웹폰트 CDN을 쓰지 않습니다. 시스템에 설치된 Pretendard Black / JetBrains Mono를 먼저 찾고, 없으면 Noto Sans KR · Apple SD Gothic Neo · Malgun Gothic / Cascadia Mono · Consolas 순서로 대체합니다(둘 다 SIL OFL).

## 표기 원칙

- 명령어, 환경 변수, 모델 ID는 Hermes Agent 공식 문서와 build.nvidia.com 모델 페이지에 적힌 그대로입니다. API 키, 봇 토큰, 사용자 ID는 모두 가렸습니다.
- ~40 RPM 무료 한도, 자체 호스팅 최소 사양(B200급 4장 / H100 8장), `termux-wake-lock` 팁은 2차 출처뿐이라 `~` 또는 `3RD-PARTY` 라벨을 붙였습니다.
- "매일 아침 8시에 뉴스 브리핑"(`0 8 * * *`)은 예약 기능을 보여 주는 예시이며 화면에 EXAMPLE로 표시했습니다.
- Hermes 문서의 NVIDIA 예시는 다른 Nemotron 모델을 쓰지만, 같은 `provider: "nvidia"` 방식으로 Nemotron 3 Ultra 모델 ID를 넣은 화면으로 그렸습니다.
- Termux에서는 Docker 격리를 쓸 수 없고 Android가 백그라운드 작업을 멈출 수 있어, 게이트웨이 상시 실행은 best-effort라고 함께 적었습니다.
- Telegram, NVIDIA, Nous Research의 로고와 앱 화면은 재현하지 않았습니다. 휴대폰과 채팅은 일반 도형입니다.
- 영상의 120 BPM 트랙은 시리즈 형식의 장식입니다.
