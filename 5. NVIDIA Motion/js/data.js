/* DATA — every on-screen fact, copied from dataset/NVIDIA_Dataset_1993-2026.md (snapshot 2026-10-28).
   Scenes read only from here. `approx: true` renders a leading "~".
   Fiscal years end in late January (FY2026 = year ended 2026-01-25). */
(function (SX) {
  'use strict';

  SX.DATA = Object.freeze({
    asOf: '2026-10-28',

    company: {
      founded: '1993-04-05', // §0 · §1
      founders: ['JENSEN HUANG', 'CHRIS MALACHOWSKY', 'CURTIS PRIEM'], // §0
    },

    ipo: {
      // §1 · §6
      date: '1999-01-22',
      exchange: 'NASDAQ',
      ticker: 'NVDA',
      priceUsd: 12,
      splits: [
        { date: '1999-01', ratio: 'IPO', k: 1 },
        { date: '2000-06', ratio: '2:1', k: 2 },
        { date: '2001-09', ratio: '2:1', k: 2 },
        { date: '2006-04', ratio: '2:1', k: 2 },
        { date: '2007-09', ratio: '3:2', k: 1.5 },
        { date: '2021-07', ratio: '4:1', k: 4 },
        { date: '2024-06', ratio: '10:1', k: 10 },
      ],
      sharesNow: 480,
    },

    firstGpu: {
      // §1 · §5
      name: 'GEFORCE 256',
      date: '1999-08-31',
      transistors: 23e6,
    },

    cuda: {
      // §1 · §5
      chip: 'G80',
      card: 'GEFORCE 8800 GTX',
      year: 2006,
      cores: 128,
      transistors: 681e6,
      developersM: 6, // §1 GTC 2026
      years: 20, // §1 "CUDA 20주년"
    },

    alexnet: {
      // §1
      year: 2012,
      contest: 'ILSVRC 2012',
      errorPct: 15.3,
      runnerUpPct: 26.2,
      gpus: 2,
      gpuName: 'GTX 580',
    },

    // §5 transistors per GPU
    transistors: [
      { year: 1999, chip: 'GEFORCE 256', v: 23e6 },
      { year: 2006, chip: 'G80', v: 681e6 },
      { year: 2012, chip: 'GK110', v: 7.1e9 },
      { year: 2020, chip: 'A100', v: 54.2e9 },
      { year: 2022, chip: 'H100', v: 80e9 },
      { year: 2024, chip: 'B200', v: 208e9 },
      { year: 2026, chip: 'RUBIN', v: 336e9 },
    ],

    fy2026: {
      // §3 (USD billions)
      revenue: 215.9,
      dataCenter: 193.7,
      gaming: 16.0,
      other: 6.2, // 215.9 − 193.7 − 16.0
      netIncome: 120.1, // GAAP $120,067M
      growthPct: 65,
    },

    // §2 annual revenue, FY, USD millions
    revenueByFy: [
      [2000, 374.5], [2001, 735.3], [2002, 1369], [2003, 1909], [2004, 1823], [2005, 2010],
      [2006, 2376], [2007, 3069], [2008, 4098], [2009, 3425], [2010, 3326], [2011, 3543],
      [2012, 3998], [2013, 4280], [2014, 4130], [2015, 4682], [2016, 5010], [2017, 6910],
      [2018, 9714], [2019, 11716], [2020, 10918], [2021, 16675], [2022, 26914], [2023, 26974],
      [2024, 60922], [2025, 130497], [2026, 215938],
    ].map(([fy, m]) => ({ fy, m })),

    marketCap: {
      // §7 — dates disagree across sources, so month precision only (except the $5T day)
      milestones: [
        { t: 1, date: '2023-05', year: 2023.4 },
        { t: 2, date: '2024-02', year: 2024.1 },
        { t: 3, date: '2024-06', year: 2024.45 },
        { t: 4, date: '2025-07', year: 2025.52 },
        { t: 5, date: '2025-10', year: 2025.82 },
      ],
      firstFiveT: '2025-10-29',
      months1to5: 29,
      nowT: 5.2,
      nowApprox: true,
      nowDate: '2026-10-28',
    },

    // §4 quarterly revenue, USD billions
    quarters: [
      { q: 'Q1 FY26', v: 44.1 },
      { q: 'Q2 FY26', v: 46.7 },
      { q: 'Q3 FY26', v: 57.0 },
      { q: 'Q4 FY26', v: 68.1 },
      { q: 'Q1 FY27', v: 81.6 },
      { q: 'Q2 FY27', v: 96.2 },
    ],
    q2fy27: {
      ended: '2026-07-26',
      revenue: 96.2,
      yoyPct: 106,
      dataCenter: 89.0,
      dataCenterYoyPct: 117,
      grossMarginPct: 75.0,
    },

    rubin: {
      // §1 · §5
      name: 'VERA RUBIN',
      process: 'TSMC 3NM',
      dies: 2,
      transistors: 336e9,
      ship: '2026 H2',
    },

    // HUD source line per scene, named by §8 priority
    sources: [
      '§0 · §1 COMPANY HISTORY',
      '§1 · §6 NASDAQ / BARCHART',
      '§1 · §5 NVIDIA / UVA HPC',
      '§1 · §5 ANANDTECH / PC WATCH',
      '§1 KRIZHEVSKY ET AL. 2012',
      '§5 ANANDTECH / SPEC SHEETS / GTC 2026',
      '§3 NVIDIA 10-K · 8-K FY2026',
      '§2 MACROTRENDS · 10-K',
      '§7 REUTERS / FORTUNE / CMC',
      '§4 NVIDIA 8-K Q2 FY2027',
      '§1–§7 · §8 ORDER PER CUT',
      '§1 · §5 GTC 2026',
    ],
  });
})((window.SX = window.SX || {}));
