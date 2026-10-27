# 도구별 레퍼런스

각 저장소 README(2026-10 기준)에서 확인한 내용만 적었다. 옵션이 바뀌었을 수 있으니 실행 전 `--help`나 README를 다시 확인한다.

---

## 1. Herk Edit Kit — 올인원 편집 키트
https://github.com/nateherkai/herk-edit-kit

원본 영상 → 무음·실수 컷, 자막, B-roll, 모션그래픽, 배경음악·효과음. HyperFrames + GSAP 기반. Claude Code·Codex용 스킬 15개, 모션그래픽 카드 406개, 씬 템플릿 2종(dark graph paper, left glass popout).

설치 (Node 22+, Git, FFmpeg/ffprobe, Chrome 필요):
```sh
git clone https://github.com/nateherkai/herk-edit-kit.git
cd herk-edit-kit
npm ci
npm run setup     # 도구 점검 + .env 생성
npm test
```

데모 렌더:
```sh
npm run demo
cd video-projects/demo
npx hyperframes lint
npx hyperframes preview
npx hyperframes render --quality draft --output renders/demo.mp4
```

주요 스킬 (저장소 폴더에서 Claude Code 실행):
- `/edit-video` — 전체 편집. 예: "Use edit-video to edit my recording at [경로]. Tighten dead air, show me the proposed mistake cuts, and use the dark graph-paper style. Produce a reviewed draft."
- `/short-form-edit` — 9:16 릴스/쇼츠 (훅·페이오프, 자막, B-roll, 사운드)
- `/motion-showreel` — BPM 비트 그리드에 맞춘 모션 쇼릴
- 단일 작업: `cut-silences`, `cut-mistakes`, `video-storytelling`, `style-library`

주의:
- 기본 전사는 ElevenLabs Scribe, 생성 에셋은 Kie.ai(유료 키). "OpenAI Whisper 또는 로컬 Whisper를 써라"고 지시하면 대체 가능.
- 라이브러리 카드가 GSAP·Google Fonts를 CDN으로 불러올 수 있다. 최종본에서는 로컬화한다.

---

## 2. HyperFrames — HTML로 영상 만들기
https://github.com/heygen-com/hyperframes

HTML·CSS·미디어·seek 가능한 애니메이션 → 결정적(deterministic) MP4. Node 22+.

```sh
npx hyperframes init my-video
cd my-video
npx hyperframes preview      # 브라우저 미리보기(라이브 리로드)
npx hyperframes render       # MP4 렌더
npx hyperframes lint
npx hyperframes add data-chart   # 카탈로그 블록 추가 (예: flash-through-white, instagram-follow)
```

에이전트 스킬 설치:
```sh
npx hyperframes skills update          # 코어 세트(/hyperframes, /hyperframes-cli, /hyperframes-registry, /media-use) — 에이전트·비대화형 권장
npx skills add heygen-com/hyperframes  # 대화형 선택기
```

컴포지션 구조: `data-composition-id`, `data-start`, `data-duration`, `data-track-index`, `data-width/height`, `data-volume` 속성으로 클립을 타임라인에 배치하고 GSAP 등으로 애니메이션.

---

## 3. Video Agent Skills — 숏폼 대본·편집·게시
https://github.com/Melvynx/video-agent-skills

```sh
npx skills add Melvynx/video-agent-skills -a claude-code    # -g: 전역 설치
npx skills update
```

흐름:
```
/studio-setup     최초 1회: 도구 점검, 렌더 엔진, voice.md, 기본 스타일
/studio-script    이번 주 대본 (훅 3개, 타이밍, humanize)
                  촬영 → video-agent/takes/
/short-editing    촬영본 → video-agent/edits/short-<slug>/output/ (mp4 + .srt + 게시 문구)
/broll /clips /steal /short-translate /codex-images /vox
/publish          YouTube·Instagram·TikTok 게시 (Treg, 사용자 승인 후)
```
모르면 `/editing <원하는 것>` 이 알맞은 스킬을 고른다.

특징: 로컬 렌더(Node + Chrome + ffmpeg, whisper.cpp로 단어 추출). 0.3초 넘는 정지 제거, 1.15배속, 보이스 -14 LUFS. Treg(게시·인스타 분석), ElevenLabs(번역), Codex(이미지)는 선택.

---

## 4. Video Use — 폴더 기반 대화형 편집
https://github.com/browser-use/video-use

촬영본 폴더에서 Claude Code를 열고 지시 → `<videos_dir>/edit/final.mp4`. 필러 단어·무음 컷, 자동 색보정, 컷마다 30ms 오디오 페이드, 자막 번인(기본 2단어 대문자), HyperFrames/Remotion/Manim/PIL 애니메이션 오버레이, 렌더 결과 자체 검증(최대 3회 재렌더).

수동 설치:
```sh
git clone https://github.com/browser-use/video-use ~/Developer/video-use
ln -sfn ~/Developer/video-use ~/.claude/skills/video-use
cd ~/Developer/video-use
uv sync                      # 또는 pip install -e .
# ffmpeg 필수, yt-dlp 선택
cp .env.example .env         # ELEVENLABS_API_KEY=...
```

사용:
```sh
cd /path/to/your/videos
claude
> edit these into a launch video
```

원리: 영상을 프레임으로 보지 않고 **텍스트로 읽는다** — 단어 타임스탬프 전사(`takes_packed.md`) + 필요한 구간만 `timeline_view`(필름스트립·파형·단어 라벨 PNG). 흐름: Transcribe → Pack → LLM 판단 → EDL → Render → Self-Eval. 전략을 제안하고 승인 후 실행한다.

---

## 5. Remotion Skills — React로 영상
https://github.com/remotion-dev/skills

```sh
npx skills add remotion-dev/skills
# 또는: gh skill install remotion-dev/skills
# 새 프로젝트: bun create video
```

스킬: `/remotion-best-practices`(전체 포괄, 모르면 이것), `/remotion-create`, `/remotion-markup`, `/remotion-studio`, `/remotion-render`, `/remotion-captions`, `/remotion-maps`, `/remotion-docs`, `/remotion-upgrade`, `/remotion-multimedia`, `/remotion-interactivity`, `/remotion-saas`.

예: `/remotion-create Make a promo video for a record store`

주의: Remotion은 회사 규모에 따라 상업 라이선스가 필요할 수 있다. 상업 사용 전 remotion.dev 라이선스를 확인한다.

---

## 6. MoviePy — Python 편집 자동화
https://github.com/Zulko/moviepy

```sh
pip install moviepy
```

v2 API (v1과 호환 안 됨: `subclip`→`subclipped`, `set_*`→`with_*`):
```python
from moviepy import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip, CompositeAudioClip, concatenate_videoclips

clip = VideoFileClip("cut.mp4").subclipped(10, 20).with_volume_scaled(0.8)
txt = (TextClip(font="Arial.ttf", text="Hello", font_size=70, color="white")
       .with_duration(10).with_position("center"))
final = CompositeVideoClip([clip, txt])
final.write_videofile("result.mp4")
```

- 이어붙이기: `concatenate_videoclips([a, b])`
- BGM 깔기: `AudioFileClip("bgm.mp3").with_volume_scaled(0.15)`를 `CompositeAudioClip([clip.audio, bgm])`로 합쳐 `clip.with_audio(...)`
- numpy 배열로 픽셀을 다루므로 유연하지만 ffmpeg 직접 사용보다 느리다. 단순 컷·인코딩은 ffmpeg가 낫다.

---

## 7. WhisperX — 단어 단위 자막 싱크
https://github.com/m-bain/whisperX

```sh
pip install whisperx       # 또는: uvx whisperx
```

```sh
whisperx cut.wav --model large-v2 --highlight_words True        # .srt에 단어 타이밍 표시
whisperx cut.wav --model large-v2 --language ko                  # 언어 지정
whisperx cut.wav --model large-v2 --diarize --hf_token <TOKEN>   # 화자 분리
whisperx cut.wav --compute_type int8 --device cpu                # GPU 없을 때
```

- 화자 분리는 Hugging Face 읽기 토큰 + `pyannote/speaker-diarization-community-1` 모델 약관 동의가 필요하다.
- GPU 메모리 부족 시 `--batch_size` 줄이기, `--compute_type int8`.
- 출력(JSON의 단어별 start/end)을 HyperFrames·Remotion·MoviePy 자막 타이밍 데이터로 쓴다.

---

## 8. Auto-Editor — 무음·무동작 자동 컷
https://github.com/WyattBlue/auto-editor

설치: https://auto-editor.com/installing · 스킬: `npx skills add WyattBlue/auto-editor`

```sh
auto-editor video.mp4                              # 기본: --edit audio:threshold=0.04,stream=all
auto-editor video.mp4 --margin 0.2sec              # 컷 앞뒤 여유(기본 0.2s)
auto-editor video.mp4 --margin 0.3s,1.5sec         # 앞 0.3s / 뒤 1.5s
auto-editor video.mp4 --edit audio:-19dB           # dB 기준
auto-editor video.mp4 --edit motion:threshold=0.02 # 움직임 2% 미만 구간 컷
auto-editor video.mp4 --edit "(or audio:0.03 motion:0.06)"
auto-editor video.mp4 --when-active cut --when-inactive nil   # 잘려나갈 부분만 미리보기
auto-editor video.mp4 --export premiere            # resolve / final-cut-pro / shotcut / kdenlive / clip-sequence
auto-editor --help
```

팁: 자동 컷은 "1차 패스"다. 바로 렌더하지 말고 `--export resolve|premiere`로 타임라인을 내보내 사람이 다듬거나, 잘린 구간 미리보기로 임계값을 먼저 맞춘다.
