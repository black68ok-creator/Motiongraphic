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
    },

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
      '§1 [3RD-PARTY] DEV COMMUNITY',
      '§1 BUILD.NVIDIA.COM · [3RD-PARTY] RPM',
      '§2 HERMES DOCS · TERMUX',
      '§2 HERMES DOCS · TERMUX',
      '§3 HERMES DOCS · PROVIDERS',
      '§1 NIM MODEL CARD',
      '§4 HERMES DOCS · TELEGRAM',
      '§2 · §4 HERMES DOCS',
      '§5 HERMES DOCS · FEATURES',
      '§1–§5 PER CUT',
      '§0–§5 HERMES · NVIDIA DOCS',
    ],
  });
})((window.SX = window.SX || {}));
