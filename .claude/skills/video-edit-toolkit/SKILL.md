---
name: video-edit-toolkit
description: AI 에이전트 + 오픈소스 도구 조합으로 영상 편집을 자동화하는 가이드. 원본 영상의 무음·실수 구간 컷, 단어 단위 자막, B-roll, 모션 그래픽, 배경음악, 숏폼(릴스·쇼츠) 편집, HTML/React 코드로 영상 렌더링이 필요할 때 사용한다. Herk Edit Kit, HyperFrames, Video Agent Skills, Video Use, Remotion Skills, MoviePy, WhisperX, Auto-Editor 중 작업에 맞는 도구를 고르고 설치·실행 명령을 제공한다. "영상 편집", "컷 편집", "무음 제거", "자막 싱크", "쇼츠 만들어줘", "MP4 렌더" 같은 요청에 트리거.
---

# Video Edit Toolkit

편집 프로그램을 직접 조작하지 않고, 에이전트가 아래 8개 도구를 조합해 반복 작업(컷·자막·B-roll·모션·음악·렌더)을 처리한다.
도구별 설치·명령·주의점은 [references/tools.md](references/tools.md)에 있다. 명령을 실행하기 전에 해당 항목을 읽는다.

## 1. 도구 고르기

| 하고 싶은 일 | 1순위 | 대안 |
|---|---|---|
| 원본 → 컷·자막·B-roll·모션·음악까지 한 번에 | **Herk Edit Kit** (`/edit-video`) | Video Use |
| 폴더에 촬영본 넣고 대화로 편집 → `final.mp4` | **Video Use** | Herk Edit Kit |
| 숏폼 대본 → 편집 → 자막 → 게시 | **Video Agent Skills** (`/editing`) | Herk `/short-form-edit` |
| HTML·CSS·GSAP로 모션그래픽 영상 → 로컬 MP4 | **HyperFrames** | 이 저장소의 `tools/render.mjs` |
| React 코드로 영상·모션그래픽 | **Remotion Skills** | HyperFrames |
| Python 스크립트로 자르기·합치기·자막·효과 | **MoviePy** | ffmpeg 직접 |
| 음성 → 텍스트 + 단어별 타임스탬프(자막 싱크) | **WhisperX** | ElevenLabs Scribe, whisper.cpp |
| 무음(또는 움직임 없는) 구간 자동 컷 | **Auto-Editor** | Herk `cut-silences` |

판단 기준:
- **올인원 에이전트 키트**(Herk · Video Use · Video Agent Skills)는 스킬을 설치해 대화로 쓴다. 대부분 ElevenLabs 등 유료 API 키를 기본으로 쓰므로, 키가 없으면 로컬 Whisper/WhisperX로 바꿔 달라고 지시한다.
- **단일 기능 도구**(Auto-Editor · WhisperX · MoviePy)는 CLI/스크립트로 파이프라인을 직접 짠다. API 키 불필요, 결과가 결정적이다.
- **코드 기반 렌더러**(HyperFrames · Remotion)는 모션그래픽·자막 오버레이·인트로/아웃트로를 만들 때 쓴다.

## 2. 기본 파이프라인 (단일 기능 도구 조합)

```
원본.mp4
 ├─ 1) Auto-Editor   무음 컷        → cut.mp4  (또는 --export premiere/resolve 로 타임라인 XML)
 ├─ 2) WhisperX      단어 단위 자막 → cut.srt / cut.json
 ├─ 3) HyperFrames / Remotion  모션그래픽·자막 오버레이 → overlay.mp4 (투명/합성용)
 ├─ 4) MoviePy       합성: cut + overlay + B-roll + BGM(볼륨 다운) + 자막
 └─ 5) ffprobe       길이·fps·프레임 수 검증 → final.mp4
```

순서 원칙:
1. **컷이 먼저, 자막은 나중.** 자막은 반드시 컷이 끝난 영상에서 다시 뽑는다(타임스탬프 어긋남 방지).
2. 오디오가 기준이다. 컷 지점은 음성 경계·무음 간격에서 정하고, 컷마다 짧은 오디오 페이드(≈30ms)로 팝 노이즈를 없앤다.
3. BGM은 음성 아래로 깐다(보이스 대비 약 -15~-20dB, 보이스 라우드니스 목표 -14 LUFS 정도).

## 3. 작업 규칙

- **원본은 절대 덮어쓰지 않는다.** 결과물은 `edit/` 또는 `out/` 같은 별도 폴더에 쓴다.
- **컷 계획은 실행 전에 보여주고 승인받는다.** 실수·필러 컷 목록(시간 범위 + 대사)을 먼저 제시한다.
- **유료 API·생성형 에셋(ElevenLabs, Kie.ai, Codex 이미지, 음악 생성)은 비용을 먼저 말하고 동의받는다.**
- **게시(Treg 등)는 사용자의 명시적 "예" 없이는 하지 않는다.**
- 렌더 후 검증: `ffprobe -v error -show_entries format=duration:stream=r_frame_rate,nb_frames -of compact out.mp4`
  결과(길이·fps·프레임 수)를 한국어로 풀어서 보고한다.
- 컷 경계마다 정지 화면을 뽑아(`ffmpeg -ss <t> -i out.mp4 -frames:v 1 f.jpg`) 화면 튐·자막 가림을 눈으로 확인한다.
- 모르는 옵션은 추측하지 말고 `<tool> --help` 또는 해당 저장소 README를 확인한다.

## 4. 이 저장소(Motion Graphic)와의 관계

- 이 저장소의 작품(`N. <이름> Motion/`)은 CLAUDE.md 규칙상 **외부 의존성 금지**다. 위 도구들은 작품 폴더 안 코드에 넣지 않는다.
- 활용 범위: 완성된 `out/<NAME>.mp4`를 숏폼으로 재편집하거나, 자막·BGM을 입히거나, 촬영본 편집을 따로 할 때. 이런 작업물은 작품 폴더 밖(별도 작업 폴더)에 둔다.
- HyperFrames의 "HTML → 결정적 MP4" 구조는 이 저장소의 `tools/render.mjs`(CDP + ffmpeg)와 같은 발상이다. 작품 렌더는 기존 `render.mjs`를 쓴다.

## 5. 필수 공통 도구

Node.js 22+, Git, FFmpeg(ffprobe 포함), Chrome/Chromium, Python 3.9+(MoviePy·WhisperX), 선택: `uv`, `yt-dlp`, GPU(CUDA, WhisperX 가속).
