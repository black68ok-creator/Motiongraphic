# Hermes × Nemotron on Termux · 스토리보드 (1단계)

- 1920×1080 · 30fps · 25초 · 120 BPM (1박 = 15프레임)
- 씬 01–11 = 4박, 씬 12 = 6박 → 50박 = 750프레임

---

## 1. 데이터 사용표

| 화면 표기값 | 파일 원문 | 섹션 | 처리 |
|---|---|---|---|
| 550B · 55B ACTIVE · MOE | 550B, 55B 활성 (MoE) | §1 | 원문 |
| 1M TOKENS | 컨텍스트 1M | §1 | 원문(제공사별 차이는 파일 메모) |
| RELEASED 2026-06-04 | 2026-06-04 | §1 | 원문 |
| FREE ENDPOINT · AVAILABLE | Free Endpoint: Available | §1 | 원문 |
| integrate.api.nvidia.com/v1 · OPENAI-COMPATIBLE | 엔드포인트, OpenAI 호환 | §1 | 원문 |
| ~40 RPM · 3RD-PARTY | ~40 RPM | §1 | 2차 출처 → "~" + 라벨 |
| B200-CLASS × 4 · OR H100 × 8 · REPORTED · 3RD-PARTY | 자체 호스팅 최소 사양 | §1 | 2차 출처 → 라벨 |
| `curl … install.sh \| bash` · Termux detected | 원라인 설치, Termux 자동 감지 | §2 | 원문 |
| `hermes doctor` · `pkg install ripgrep nodejs` · ANDROID_API_LEVEL | 점검·문제 해결 | §2 | 원문 |
| `python -m pip install -e '.[termux]' -c constraints-termux.txt` | 수동 설치 | §2 | 원문 |
| CLI · CRON · PTY / BACKGROUND TERMINAL · TELEGRAM GATEWAY · MCP · HONCHO MEMORY (6/6) | [termux] 번들 | §2 | 원문 |
| [all] ✕ ANDROID-INCOMPATIBLE VOICE DEPS | [all] 비권장 이유 | §2 | 원문 |
| `NVIDIA_API_KEY=nvapi-••••` · `provider: "nvidia"` · `model: "nvidia/nemotron-3-ultra-550b-a55b"` | 연결 설정 | §3 | 원문, 키는 가림 |
| `/newbot` · 토큰 `123456:ABC-•••` · `@userinfobot` · Id `••••` | 봇 생성, ID 확인 | §4 | 원문, 값은 가림 |
| TELEGRAM_BOT_TOKEN · TELEGRAM_ALLOWED_USERS · DENY ALL (DEFAULT) · /revoke | 설정·보안 | §4 | 원문 |
| `hermes gateway` · BEST-EFFORT | 게이트웨이 실행, 백그라운드 제약 | §2 · §4 | 원문 |
| termux-wake-lock · 3RD-PARTY TIP | 화면 꺼짐 대책 | §2 | 2차 출처 → 라벨 |
| 매일 아침 8시에 뉴스 브리핑 · 0 8 * * * · 08:00 | 예시 | §5 | EXAMPLE 라벨 |
| NATURAL LANGUAGE OR CRON · ATTACH SKILLS · DELIVER TO TELEGRAM · PAUSE · RESUME · EDIT | 예약 작업 기능 | §5 | 원문 |

---

## 2. 카피 체인

| 씬 | 헤드라인 | 캡션 |
|---|---|---|
| 01 | 550B짜리 AI를 / 내 휴대폰에서, | NEMOTRON 3 ULTRA / ON ANDROID · TERMUX |
| 02 | 직접 돌리면 / B200 네 장이 필요하지만, | SELF-HOST MINIMUM / REPORTED · 3RD-PARTY |
| 03 | API로 부르면 / 0원이다. | BUILD.NVIDIA.COM / FREE ENDPOINT |
| 04 | 휴대폰에 / Termux를 열고, | STEP 01 / TERMUX · ONE-LINE INSTALL |
| 05 | Hermes Agent를 / 설치한 뒤, | STEP 02 / HERMES AGENT · EXTRA [termux] |
| 06 | NVIDIA 키 하나로 / 네모트론을 연결하면, | STEP 03 / BUILD.NVIDIA.COM/SETTINGS/API-KEYS |
| 07 | 550B 중 55B만 / 깨어 일한다. | NEMOTRON 3 ULTRA / MIXTURE OF EXPERTS |
| 08 | 텔레그램 봇을 / 하나 만들어, | STEP 04 / TELEGRAM · @BOTFATHER |
| 09 | 게이트웨이로 / 이어 붙이면, | STEP 05 / MESSAGING GATEWAY |
| 10 | 말로 맡긴 일이 / 알아서 돈다. | STEP 06 / SCHEDULED TASKS · CRON |
| 11 | (숫자만) | 컷별 라벨 |
| 12 | 주머니 속, / 나만의 AI 비서. | ANDROID · TERMUX · TELEGRAM |

---

## 3. 씬 표

| # | 역할 | 배경 | 시그니처 | b1 | b2 | b3 | b4 | 전환 |
|---|---|---|---|---|---|---|---|---|
| 01 | HOOK | 다크 | 구성 요소 알약 사이클 | 16분음표 사이클 | NEMOTRON 3 ULTRA 착지 | 화면 점등, 550B 카운트업 | 55B ACTIVE 배지 | 휴대폰 화면이 프레임으로 열림 |
| 02 | PROBLEM | 페이퍼 | GPU 보드 낙하 | B200 ×4 (16분음표) | H100 ×8 | MIN. SPEC 도장 | 휴대폰 등장 | 휩 팬 |
| 03 | FREE | 앰버 | FREE 도장 | 모델 페이지 창 | 도장 + AVAILABLE | RPM 바늘 ~40 | 엔드포인트 타이핑 | FREE 도장으로 아이리스 수축 |
| 04 | TERMUX | 다크 | 터미널 타이핑 | 원라인 설치 | Termux 감지 | hermes doctor | pkg install | RGB 색수차 |
| 05 | INSTALL | 블루 | 체크박스 + 형광펜 | CLI · CRON | PTY · GATEWAY | MCP · MEMORY | [all] ✕ | 6줄 스트립 셔터 |
| 06 | KEY | 페이퍼 | 키 카드 삽입 | .env 키 | provider | model | 엔드포인트 배선 | 슬라이스 글리치 |
| 07 | MODEL | 로즈 | 55칸 점등 순환 | 55B 카운트업 | 점등 순환 | 1M 바 | 공개일 | 그리드 중심 링 버스트 |
| 08 | BOT | 블루 | 채팅 말풍선 | /newbot | 토큰 | @userinfobot · Id | 환경 변수 + 허용 목록 | 하드컷 |
| 09 | GATEWAY | 다크 | 패킷 왕복 | 텔레그램 → 휴대폰 | → NVIDIA API | 응답 복귀 | 답장 + wake-lock 팁 | API 노드 아이리스 팽창 |
| 10 | AUTOMATION | 앰버 | 시계 다이얼 | 예시 요청 | cron + 08:00 | 기능 태그 4개 | 전달 완료 알림 | 하드컷 |
| 11 | MONTAGE | 5색 | 8분음표 컷 | 550B / 55B | 1M / ~40 | 6 / 4× B200 | $0 / 2026-06-04 | 아이리스로 다크 |
| 12 | END CARD | 다크 | 봇 채팅 | 휴대폰 | 예시 요청 | 입력 중 → 답장 | 서브카피 | b5 타이틀 + 히트, b6 정지 |

오디오: 킥 1·3박, 클랩 2·4박, 하이햇 8분음표, 씬별 서브 드론, 04·09에 16분음표 아르페지오, 11은 하이햇 16분음표, 12 b5 마지막 히트.

---

## 4. 메모

1. 사용자의 실제 설정값(봇 이름, 실제로 돌리는 작업)은 받지 않았으므로 공식 문서의 절차와 예시만 썼습니다. 실제 작업으로 바꾸려면 `js/data.js`의 `cron` 항목만 고치면 됩니다.
2. Hermes 문서 예시는 다른 Nemotron 모델(`nemotron-3.5-super-vl-120b-a12b`)을 쓰지만, 이 영상은 요청에 따라 Nemotron 3 Ultra 모델 ID를 config에 넣은 화면으로 그렸습니다. 같은 `provider: "nvidia"` 방식입니다.
3. 무료 한도와 자체 호스팅 사양은 공식 페이지에서 확인하지 못해 3RD-PARTY 라벨을 붙였습니다.
