/* DATA — every on-screen fact, copied from dataset/apollo-11_dataset_1969.md (compiled 2026-10-24).
   Scenes read only from here. All times are UTC. */
(function (SX) {
  'use strict';

  SX.DATA = Object.freeze({
    asOf: '2026-10-24',

    mission: {
      name: 'APOLLO 11', // §0
      csm: 'COLUMBIA',
      lm: 'EAGLE',
      site: 'LC-39A',
      siteLong: 'KENNEDY SPACE CENTER',
      landingSite: 'SEA OF TRANQUILITY',
      crew: 3,
    },

    launch: {
      // §1
      date: '1969-07-16',
      time: '13:32:00',
      day: 16,
    },

    saturnV: {
      // §3
      heightM: 110.6,
      engines: 5,
      engine: 'F-1',
      stages: 3,
    },

    distanceKm: 384400, // §4 mean Earth–Moon distance
    lunarOrbitDay: 19, // §1 1969-07-19

    landing: {
      // §1
      date: '1969-07-20',
      time: '20:17:40',
      day: 20,
    },

    surface: {
      // §2
      stay: { h: 21, m: 36 },
      eva: { h: 2, m: 31 },
      samplesKg: 21.5,
      liftoffDay: 21, // §1 1969-07-21 17:54
    },

    splashdown: {
      // §1 / §2
      date: '1969-07-24',
      day: 24,
      mission: { d: 8, h: 3, m: 18, s: 35 },
    },

    // HUD source line per scene
    sources: [
      '§1 TIMELINE · NASA HISTORY',
      '§3 SATURN V · NASA',
      '§4 MOON FACT SHEET · NASA',
      '§1 TIMELINE · NASA HISTORY',
      '§2 MISSION OVERVIEW · NASA',
      '§1 · §2 MISSION OVERVIEW · NASA',
    ],
  });
})((window.SX = window.SX || {}));
