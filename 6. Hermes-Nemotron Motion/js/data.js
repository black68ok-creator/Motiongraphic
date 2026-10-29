/* DATA — every on-screen fact, copied from dataset/Hermes_Nemotron_Termux_Dataset.md (snapshot 2026-10-29).
   Scenes read only from here. `thirdParty: true` values carry a "~" or a 3RD-PARTY label on screen. */
(function (SX) {
  'use strict';

  SX.DATA = Object.freeze({
    asOf: '2026-10-29',

    parts: ['TERMUX', 'HERMES AGENT', 'NVIDIA BUILD', 'NEMOTRON 3 ULTRA', 'TELEGRAM', 'CRON'],

    model: {
      // §1
      name: 'NEMOTRON 3 ULTRA',
      id: 'nvidia/nemotron-3-ultra-550b-a55b',
      totalB: 550,
      activeB: 55,
      contextM: 1,
      released: '2026-06-04',
      endpoint: 'integrate.api.nvidia.com/v1',
      keyPage: 'build.nvidia.com/settings/api-keys',
      freeEndpoint: 'AVAILABLE',
      rpm: 40, // [3rd-party] ~40 RPM
      selfHost: { b200: 4, h100: 8 }, // [3rd-party]
    },

    termux: {
      // §2
      installer: 'curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash',
      pip: "python -m pip install -e '.[termux]' -c constraints-termux.txt",
      apiLevel: 'export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"',
      doctor: 'hermes doctor',
      tools: 'pkg install ripgrep nodejs',
      bundle: ['CLI', 'CRON', 'PTY / BACKGROUND TERMINAL', 'TELEGRAM GATEWAY', 'MCP', 'HONCHO MEMORY'],
      wakeLock: 'termux-wake-lock', // [3rd-party]
      // §2 official release sources
      sources: [
        { name: 'PLAY STORE', ok: false, note: 'DEPRECATED · NOT UPDATED' },
        { name: 'F-DROID', ok: true, note: 'OFFICIAL' },
        { name: 'GITHUB RELEASES', ok: true, note: 'OFFICIAL' },
      ],
      noMix: "DON'T MIX SOURCES (DIFFERENT SIGNING KEYS)",
    },

    // §6 the user's playbook (tips, not documentation)
    helper: {
      ask: 'termux에 hermes 깔고 텔레그램 연동해줘',
      askModel: 'nemotron 3 ultra 550b로 모델 바꿔줘',
    },
    skills: {
      caveat: 'TRUSTED REPOS ONLY · READ THE CODE FIRST',
    },
    tasks: [
      { k: '자동 매매', label: 'TRADING BOT · 손실 위험 · 모의투자로 먼저 검증', risk: true },
      { k: '유튜브', label: 'YOUTUBE · 기획 · 대본 · 업로드 계획' },
      { k: '스레드', label: 'THREADS · 글 작성 · 예약 게시' },
      { k: '책 쓰기', label: 'BOOK · 목차부터 장별 원고까지' },
    ],
    disclaimer: '투자 판단과 손실 책임은 본인 · 자동 매매는 소액·모의투자로 검증',

    connect: {
      // §3
      envKey: 'NVIDIA_API_KEY',
      keyPrefix: 'nvapi-',
      provider: 'nvidia',
    },

    telegram: {
      // §4
      botFather: '@BotFather',
      newbot: '/newbot',
      idBot: '@userinfobot',
      tokenVar: 'TELEGRAM_BOT_TOKEN',
      allowVar: 'TELEGRAM_ALLOWED_USERS',
      setup: 'hermes gateway setup',
      run: 'hermes gateway',
      revoke: '/revoke',
    },

    cron: {
      // §5 — the 08:00 briefing is an EXAMPLE, labelled as such on screen
      exampleExpr: '0 8 * * *',
      exampleText: '매일 아침 8시에 뉴스 브리핑 보내줘',
      features: ['NATURAL LANGUAGE OR CRON', 'ATTACH SKILLS', 'DELIVER TO TELEGRAM', 'PAUSE · RESUME · EDIT'],
    },

    // HUD source line per scene
    sources: [
      '§0 · §1 BUILD.NVIDIA.COM',
      '§2 HERMES DOCS · TERMUX',
      '§2 TERMUX-APP README · DISCUSSION #4000',
      '§2 HERMES DOCS · TERMUX',
      '§4 HERMES DOCS · TELEGRAM',
      '§6 PLAYBOOK TIP',
      '§2 · §4 HERMES DOCS · [3RD-PARTY] WAKE-LOCK',
      '§3 HERMES DOCS · PROVIDERS',
      '§1 BUILD.NVIDIA.COM · NIM MODEL CARD',
      '§1 BUILD.NVIDIA.COM · [3RD-PARTY] RPM',
      '§0–§4 HERMES · NVIDIA DOCS',
      '§5 · §6 HERMES SKILLS · PLAYBOOK',
      '§6 PLAYBOOK · USE CASES',
      '§6 PLAYBOOK',
    ],
  });
})((window.SX = window.SX || {}));
