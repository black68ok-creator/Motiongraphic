/* 06 END CARD — "8일 만에, / 돌아왔다." (6 beats)
   b1–b2 the capsule falls back along a return arc from the Moon while the mission clock
   runs to 8D 03:18:35 · b3 splashdown ripples · b4 subcopy · b5 title + final hit ·
   b6 micro-motion only. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.splashdown.mission;

  const MOON = { x: 1720, y: 250, r: 54 };
  const EARTH = { x: 1380, y: 1460, r: 560 };
  const SPLASH = { x: 1300, y: EARTH.y - Math.sqrt(EARTH.r * EARTH.r - 80 * 80) };
  const T_HOME = 1.0;
  const TOTAL_S = ((M.d * 24 + M.h) * 60 + M.m) * 60 + M.s;

  const PTS = U.bezierPts([MOON.x - 40, MOON.y + 46], [1640, 520], [1080, 420], [SPLASH.x, SPLASH.y], 90);
  const ACC = U.polyLengths(PTS);
  const TOTAL = ACC[ACC.length - 1];

  const fmtClock = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d}D ${U.pad(h)}:${U.pad(m)}:${U.pad(Math.floor(s % 60))}`;
  };

  SX.defineScene({
    id: 6,
    role: 'END CARD',
    bg: 'dark',
    ruler: (lt) => {
      const y = U.lerp(D.surface.liftoffDay, D.splashdown.day, E.outCubic(U.prog(lt, 0, T_HOME)));
      return { from: D.launch.day, to: y, mark: y };
    },

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, EARTH.x, EARTH.y - EARTH.r, C.teal, 0.3);
      const svg = U.svgFull();
      st.earth = U.s('g');
      st.earth.append(
        U.s('circle', { cx: EARTH.x, cy: EARTH.y, r: EARTH.r + 30, fill: 'none', stroke: C.paper, 'stroke-width': 1.5, 'stroke-dasharray': '1 9', 'stroke-linecap': 'round', opacity: 0.4 }),
        U.s('circle', { cx: EARTH.x, cy: EARTH.y, r: EARTH.r, fill: C.teal, stroke: C.paper, 'stroke-width': 1.5, 'stroke-opacity': 0.6 })
      );
      st.moon = U.s('circle', { cx: MOON.x, cy: MOON.y, r: MOON.r, fill: C.paper });
      st.guide = U.s('path', { d: U.pathD(PTS), fill: 'none', stroke: C.paper, 'stroke-width': 1.5, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round', opacity: 0.4 });
      st.arc = U.s('path', { fill: 'none', stroke: C.gold, 'stroke-width': 4, 'stroke-linecap': 'round' });
      st.capsule = U.s('path', { d: 'M-12 8 L12 8 L5 -10 L-5 -10 Z', fill: C.paper });
      st.ripples = [0, 1, 2].map(() => U.s('ellipse', { cx: SPLASH.x, cy: SPLASH.y, fill: 'none', stroke: C.paper, 'stroke-width': 2 }));
      svg.append(st.earth, st.moon, st.guide, st.arc, ...st.ripples, st.capsule);
      cam.appendChild(svg);

      st.cap = ui.caption(cam, { x: 120, y: 172, text: `SPLASHDOWN / ${D.splashdown.date}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 140, lines: ['8일 만에,', '돌아왔다.'] });
      st.clock = ui.counter(cam, { x: 122, y: 540, size: 72 });
      st.clockLbl = U.box(126, 628, 'mono', 'MISSION ELAPSED TIME');

      st.sub = ui.headline(cam, { x: 122, y: 700, size: 34, stagger: 0.012, lines: [`${D.mission.csm} · ${D.mission.lm} · 승무원 ${D.mission.crew}명 · ${D.launch.date} → ${D.splashdown.date.slice(5)}`] });
      st.sub.el.classList.add('subcopy');
      st.title = ui.headline(cam, { x: 116, y: 800, size: 96, stagger: 0.028, lines: [`${D.mission.name} · 1969`] });
      st.title.el.classList.add('title');
      st.date = ui.caption(cam, { x: 122, y: 930, text: `DATA AS OF ${D.asOf}` });
      cam.appendChild(st.clockLbl);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.04);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      st.sub.update(lt, 1.5);
      st.title.update(lt, 2.0);
      st.date.update(lt, 2.12);

      const ee = ui.enter(lt, 0, 0.6);
      st.earth.setAttribute('transform', `translate(0 ${((1 - ee.e) * 220).toFixed(1)})`);
      st.moon.setAttribute('cx', (MOON.x + lt * 6).toFixed(1));

      const p = E.inOutCubic(U.prog(lt, 0, T_HOME));
      const len = TOTAL * p;
      st.arc.setAttribute('d', U.pathD(U.slicePoly(PTS, ACC, len)));
      const head = U.pointAt(PTS, ACC, len);
      const bob = lt >= T_HOME ? Math.sin((lt - T_HOME) * 5) * 3 : 0;
      st.capsule.setAttribute('transform', `translate(${head.x.toFixed(1)} ${(head.y + bob).toFixed(1)}) rotate(${lt >= T_HOME ? 0 : (U.deg(head.ang) - 90).toFixed(2)})`);

      st.ripples.forEach((r, k) => {
        const q = U.prog(lt, T_HOME + k * T.E8, T_HOME + 1.2 + k * T.E8);
        r.setAttribute('rx', (10 + 200 * E.outCubic(q)).toFixed(1));
        r.setAttribute('ry', (3 + 30 * E.outCubic(q)).toFixed(1));
        r.setAttribute('opacity', lt >= T_HOME ? (0.8 * (1 - q)).toFixed(3) : 0);
      });

      const s = lt >= T_HOME ? TOTAL_S : Math.floor(TOTAL_S * p);
      st.clock.set(fmtClock(s));
      const ce = ui.enter(lt, 0.05, 0.4);
      st.clock.el.style.opacity = st.clockLbl.style.opacity = ce.o.toFixed(3);
      const hit = lt >= T_HOME ? 1 + 0.06 * Math.exp(-(lt - T_HOME) / 0.12) : 1;
      st.clock.el.style.transform = `translate3d(0,${((1 - ce.e) * 20).toFixed(1)}px,0) scale(${hit.toFixed(4)})`;
    },
  });
})((window.SX = window.SX || {}));
