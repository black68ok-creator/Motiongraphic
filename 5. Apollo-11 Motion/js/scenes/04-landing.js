/* 04 LANDING — "고요의 바다에 / 내렸고,"
   Eagle descends in three decelerating beat steps (b1–b3) above a cratered horizon;
   touchdown and the LANDED stamp hit on b4. Slice glitch into scene 05 (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const LX = 1360;
  const GROUND = 880;
  const K = 38; // px per metre
  const T_DOWN = 1.5;
  // Lander base y at each beat (b1..b4): big drop, smaller, smaller, touchdown
  const STEPS = [-140, 470, 720, 830, GROUND];

  // Segment windows [start, land]: entry on b1, then each step lands on b2, b3, b4
  const WIN = [[-T.LEAD, 0.3], [0.3, 0.5], [0.64, 1.0], [1.14, T_DOWN]];
  function yAt(lt) {
    let y = STEPS[0];
    WIN.forEach(([a, b], k) => (y += (STEPS[k + 1] - STEPS[k]) * E.outCubic(U.prog(lt, a, b))));
    return y;
  }

  const CRATERS = [
    [260, 940, 120, 16], [620, 1010, 200, 22], [1000, 925, 70, 9], [1620, 990, 170, 20], [1820, 920, 60, 8], [1180, 1040, 110, 14],
  ];

  SX.defineScene({
    id: 4,
    role: 'LANDING',
    bg: 'paper',
    ruler: (lt) => ({ from: D.lunarOrbitDay, to: D.landing.day, mark: SX.hud.hop(lt, [19, 19.5, 19.75, D.landing.day]) }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${D.mission.lm} / ${D.mission.landingSite}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 150, lines: ['고요의 바다에', '내렸고,'] });

      const svg = U.svgFull();
      st.ground = U.s('g');
      st.ground.append(U.s('rect', { x: -100, y: GROUND, width: 2120, height: 400, fill: C.ink, opacity: 0.06 }),
        U.s('line', { x1: -100, y1: GROUND, x2: 2020, y2: GROUND, stroke: C.ink, 'stroke-width': 3 }));
      CRATERS.forEach(([x, y, rx, ry]) => st.ground.appendChild(U.s('ellipse', { cx: x, cy: y, rx, ry, fill: 'none', stroke: C.ink, 'stroke-width': 2, opacity: 0.45 })));
      st.alt = U.s('g');
      for (let k = 0; k < 9; k++) {
        const y = 300 + k * 66;
        st.alt.appendChild(U.s('line', { x1: 1700, y1: y, x2: k % 2 ? 1716 : 1730, y2: y, stroke: C.ink, 'stroke-width': 2, opacity: 0.6 }));
      }
      st.altMark = U.s('path', { d: 'M1690 0 l-16 -9 v18 z', fill: C.red });
      st.dust = [0, 1, 2].map(() => U.s('ellipse', { cx: LX, cy: GROUND, fill: 'none', stroke: C.ink, 'stroke-width': 2 }));
      st.lm = SX.vehicles.lander(C.paper, C.ink, C.gold);
      st.lg = U.s('g', {}, st.lm.g);
      svg.append(st.ground, st.alt, st.altMark, ...st.dust, st.lg);
      cam.appendChild(svg);

      st.stamp = ui.stamp(cam, { x: 560, y: 690, main: 'LANDED', sub: `${D.landing.date} · ${D.landing.time} UTC`, rot: -7, color: C.red });
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 12).toFixed(1)}px,${(-lt * 8).toFixed(1)}px,0)`;
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      const y = yAt(lt);
      const down = lt >= T_DOWN;
      const squash = down ? 1 - 0.05 * Math.sin(U.prog(lt, T_DOWN, T_DOWN + 0.2) * Math.PI) : 1;
      const sway = down ? 0 : (U.noise1(lt * 3, 2) - 0.5) * 3;
      st.lg.setAttribute('transform', `translate(${LX} ${y.toFixed(2)}) rotate(${sway.toFixed(2)}) scale(${K} ${(K * squash).toFixed(3)})`);
      st.lm.setPlume(down ? 0 : 1.4 + 0.6 * U.noise1(lt * 30, 4) + (lt % T.SPB < 0.36 ? 0.8 : 0));
      st.altMark.setAttribute('transform', `translate(0 ${U.lerp(300, 300 + 8 * 66, U.clamp((y - STEPS[0]) / (GROUND - STEPS[0]))).toFixed(1)})`);

      st.dust.forEach((d, k) => {
        const q = U.prog(lt, T_DOWN + k * 0.06, T_DOWN + 0.6 + k * 0.06);
        d.setAttribute('rx', (180 + 420 * E.outCubic(q)).toFixed(1));
        d.setAttribute('ry', (12 + 26 * E.outCubic(q)).toFixed(1));
        d.setAttribute('opacity', down ? (0.6 * (1 - q)).toFixed(3) : 0);
      });

      st.stamp.update(lt, T_DOWN);
    },
  });
})((window.SX = window.SX || {}));
