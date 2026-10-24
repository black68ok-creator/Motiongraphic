/* 01 HOOK — "1969년 / 7월 16일,"
   Countdown dial: T−10 → T−00 ticks on 8th notes (b1–b3) while the ring closes.
   b4 lands T−00 + LIFTOFF chip; the ring then bursts open into scene 02 (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const CX = 1390;
  const CY = 560;
  const R = 270;
  const N0 = 10;
  const T_START = 0.25; // first tick after b1's downbeat
  const T_ZERO = 1.5; // b4
  SX.L.countC = { x: CX, y: CY, r: R };

  SX.defineScene({
    id: 1,
    role: 'HOOK',
    bg: 'dark',
    ruler: () => ({ from: D.launch.day, to: D.launch.day, mark: D.launch.day }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, CX, CY, C.gold, 0.14);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${D.mission.site} / ${D.mission.siteLong}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 168, lines: ['1969년', '7월 16일,'] });

      const svg = U.svgFull();
      st.ticks = U.s('g');
      for (let k = 0; k < 60; k++) {
        const a = (k / 60) * Math.PI * 2;
        const long = k % 5 === 0;
        const r0 = R + 34;
        const r1 = R + (long ? 62 : 46);
        st.ticks.appendChild(U.s('line', {
          x1: (CX + r0 * Math.sin(a)).toFixed(1), y1: (CY - r0 * Math.cos(a)).toFixed(1),
          x2: (CX + r1 * Math.sin(a)).toFixed(1), y2: (CY - r1 * Math.cos(a)).toFixed(1),
          stroke: C.paper, 'stroke-width': long ? 3 : 1.5, opacity: long ? 0.8 : 0.4,
        }));
      }
      svg.appendChild(st.ticks);
      st.ring = ui.ring(svg, { cx: CX, cy: CY, r: R, w: 16, color: C.gold, track: C.paper, trackOpacity: 0.14 });
      cam.appendChild(svg);

      st.tLbl = U.h('div', { class: 'mono', style: `left:${CX - 160}px;top:${CY - 150}px;width:320px;text-align:center;font-size:20px`, text: 'COUNTDOWN' });
      st.num = ui.counter(cam, { x: CX, y: CY - 100, size: 210, align: 'center' });
      st.chip = ui.chip(cam, CX - 196, CY + 128, 'LIFTOFF', `${D.launch.time} UTC`);
      cam.appendChild(st.tLbl);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.06);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      // One count per 8th note: T−10 at T_START … T−00 exactly on b4
      const step = (T_ZERO - T_START) / N0;
      const n = U.clamp(N0 - Math.floor((Math.max(0, lt - T_START)) / step + 1e-6), 0, N0);
      const zero = lt >= T_ZERO;
      st.num.set(`T−${U.pad(n)}`);
      const pb = U.pulse(lt - T_START, step, 0.06);
      const ne = ui.enter(lt, -T.LEAD, 0.45);
      const hit = zero ? 1 + 0.12 * Math.exp(-(lt - T_ZERO) / 0.12) : 1 + 0.03 * (lt >= T_START ? pb : 0);
      st.num.el.style.opacity = ne.o.toFixed(3);
      st.num.el.style.transform = `scale(${(ne.e * hit).toFixed(4)})`;
      st.tLbl.style.opacity = ne.o.toFixed(3);

      // Ring closes in steps with the count (each step eases out within its 8th)
      const k = U.clamp((lt - T_START) / step, 0, N0);
      const f = (Math.floor(k) + E.outCubic(k - Math.floor(k))) / N0;
      st.ring.set(lt < T_START ? 0 : f);
      st.ticks.setAttribute('transform', `rotate(${(lt * 6).toFixed(2)} ${CX} ${CY})`);
      st.ticks.style.opacity = (0.4 + 0.6 * ne.o).toFixed(3);

      if (lt < T_ZERO - 0.01) st.chip.style.opacity = 0;
      else ui.pop(st.chip, lt, T_ZERO, { from: 0.5 });
    },
  });
})((window.SX = window.SX || {}));
