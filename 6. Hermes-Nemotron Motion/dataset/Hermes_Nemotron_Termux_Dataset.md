# Hermes Agent × Nemotron 3 Ultra × Termux × Telegram 데이터셋

> 스냅샷: **2026-10-29**. 안드로이드 휴대폰(Termux)에 Hermes Agent를 설치하고, NVIDIA build(build.nvidia.com)의 무료 API로 Nemotron 3 Ultra를 연결한 뒤, 텔레그램 봇으로 AI 자동화를 돌리는 구성을 공개 문서로 정리한 노트.  
> 우선순위: Hermes Agent 공식 문서(hermes-agent.nousresearch.com) · NVIDIA 모델 페이지(build.nvidia.com) > 기술 블로그·집계 사이트. 2차 출처뿐인 값에는 `[3rd-party]`를 붙인다.

---

## 0. 구성 요소

| 요소 | 역할 | 출처 |
|---|---|---|
| Android + Termux | 휴대폰 위의 리눅스 터미널. Hermes Agent가 여기서 돈다 | Hermes 공식 Termux 가이드 |
| Hermes Agent (Nous Research) | 오픈소스 개인 AI 에이전트. 스킬, 메모리, 크론, 메시징 게이트웨이 | Hermes 공식 문서 |
| NVIDIA build (build.nvidia.com) | 무료 API 키 발급, OpenAI 호환 엔드포인트 | build.nvidia.com, Hermes 프로바이더 문서 |
| Nemotron 3 Ultra 550B A55B | 연결할 모델 | build.nvidia.com 모델 페이지 |
| Telegram | 봇을 통해 휴대폰 에이전트에 말을 거는 창구 | Hermes 텔레그램 문서 |

---

## 1. 모델: Nemotron 3 Ultra

| 항목 | 값 | 출처 |
|---|---|---|
| 모델 ID | `nvidia/nemotron-3-ultra-550b-a55b` | build.nvidia.com |
| 전체 파라미터 | **550B** | 모델명 |
| 활성 파라미터 | **55B** (MoE) | 모델명, 집계 사이트 |
| 컨텍스트 | **1M** 토큰 | 다수 모델 카드 (제공사별로 262K 등 차이) |
| 공개일 | **2026-06-04** (Computex 키노트) | NIM 모델 카드 인용 |
| 무료 엔드포인트 | **Available** | build.nvidia.com 모델 페이지 |
| 엔드포인트 | `https://integrate.api.nvidia.com/v1` (OpenAI 호환) | build.nvidia.com |
| 무료 한도 | ~40 RPM | [3rd-party] freellm.net 등 |
| 자체 호스팅 최소 사양 | B200급 4장 또는 H100 8장 | [3rd-party] DEV Community |

---

## 2. Termux 설치 (Hermes 공식 Termux 가이드)

Termux 앱 자체는 **F-Droid 또는 GitHub Releases**에서 받는다. Google Play판은 업데이트가 끊겨 지원 종료(deprecated) 상태이고, 두 출처는 서명 키가 달라 섞어 설치할 수 없다. (출처: termux-app README, GitHub Discussion #4000)


| 순서 | 명령 / 내용 |
|---|---|
| 1 | 원라인 설치: `curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh \| bash` — Termux를 자동 감지해 검증된 Android 흐름으로 전환 |
| 1′ | 수동 설치: `python -m pip install -e '.[termux]' -c constraints-termux.txt` |
| 주의 | `[all]` 대신 `[termux]` 사용. `[all]`은 Android와 맞지 않는 음성 의존성을 끌어옴 |
| 문제 해결 | `jiter`/maturin 오류 시 `export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"` |
| 점검 | `hermes doctor`, 도구가 없다고 나오면 `pkg install ripgrep nodejs` |

`[termux]` 번들에 들어 있는 기능 (6가지): CLI, cron, PTY/백그라운드 터미널, Telegram 게이트웨이, MCP, Honcho 메모리.

제약: Termux에서는 Docker 기반 터미널 격리를 쓸 수 없고, Android가 백그라운드 작업을 멈출 수 있어 게이트웨이 상시 실행은 best-effort.  
화면이 꺼지면 응답이 멈추는 문제에 `termux-wake-lock`을 권하는 글이 있다. [3rd-party]

---

## 3. 모델 연결 (Hermes 프로바이더 문서)

| 순서 | 내용 |
|---|---|
| 1 | build.nvidia.com/settings/api-keys 에서 무료 키 발급 |
| 2 | `~/.hermes/.env` 에 `NVIDIA_API_KEY=nvapi-...` |
| 3 | `config.yaml` 에 `provider: "nvidia"`, `model:` 에 모델 ID |
| 4 | 또는 `hermes chat --provider nvidia --model <모델 ID>` |
| 비고 | Hermes가 NIM 과금 출처 헤더를 자동으로 붙이므로 추가 설정 불필요 |

---

## 4. 텔레그램 연결 (Hermes 텔레그램 문서)

| 순서 | 내용 |
|---|---|
| 1 | @BotFather 에 `/newbot` → 이름과 `bot`으로 끝나는 사용자명 → 토큰 발급 |
| 2 | @userinfobot 으로 내 숫자 사용자 ID 확인 |
| 3 | `hermes gateway setup` 에서 Telegram 선택, 또는 `.env` 에 `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALLOWED_USERS` |
| 4 | `hermes gateway` 로 게이트웨이 실행 |
| 보안 | 허용 목록이 없으면 모든 사용자를 거부(기본값). 명령을 실행하는 봇은 공개 접근을 열지 말 것. 토큰이 새면 BotFather `/revoke` |

---

## 5. 자동화: 예약 작업 (Hermes 기능 개요)

| 항목 | 내용 |
|---|---|
| 예약 방식 | 자연어 또는 cron 표현식 |
| 스킬 | 작업에 스킬을 붙일 수 있음 (스킬 = 절차 기억) |
| 전달 | 결과를 어느 플랫폼으로든 전달 (예: 텔레그램) |
| 관리 | 일시정지 · 재개 · 수정 |
| 메모리 | MEMORY.md · USER.md 등 다층 메모리 |

영상의 "매일 08:00 브리핑"(`0 8 * * *`)은 기능을 보여 주기 위한 **예시**다.

---

## 6. 사용자 플레이북 (2026-10-29 요청 원문 요약)

공식 문서가 아니라 작품 의뢰자가 실제로 쓰는 순서와 팁이다. 영상의 카피 흐름은 이 순서를 따른다.

| 순서 | 플레이북 | 영상 처리 |
|---|---|---|
| 1 | 안드로이드 폰 필요, 아이폰 불가 | Termux가 안드로이드 전용이라는 사실로 표기 |
| 2 | Termux는 플레이스토어 말고 검색해서 설치 | 공식 출처 F-Droid · GitHub로 구체화 (§2) |
| 3 | 헤르메스 설치 | §2 명령어 |
| 4 | 텔레그램 연동 | §4 |
| 5 | 막히면 GPT 같은 AI 챗봇에게 시키면 다 해 줌 | 팁으로 표기, "명령어는 실행 전에 읽어 보기" 덧붙임 |
| 6 | 백그라운드로 실행 | §2 wake-lock 팁 [3rd-party], best-effort 제약 |
| 7 | NVIDIA build에서 API 키 받기 | §3 |
| 8 | 네모트론 3 울트라 550B로 설정해 달라고 하기 | §1 · §3 |
| 9 | 어쨌든 공짜 | 무료 엔드포인트 (§1), 한도 ~40 RPM [3rd-party] |
| 10 | 너만의 에이전트 완성 | 단계 체크리스트 |
| 11 | 깃허브에서 스킬 많이 배우게 하기 | 스킬 = 절차 기억 (§5). "검증된 저장소만 · 코드 먼저 확인" 경고 |
| 12 | 자동 매매 · 유튜브 · 스레드 · 책 쓰기 등 막 시키기 | 사용 예시. 자동 매매에는 손실 위험 · 모의투자 우선 경고 |
| 13 | 뭘로 경제적 자유를 만들지 고민 | 엔드카드 질문. 투자 판단과 손실 책임은 본인 문구 병기 |
