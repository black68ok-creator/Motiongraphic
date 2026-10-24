/* 02 LAUNCH — "110.6m 로켓이 / 솟아올라,"
   The Saturn V rises into frame one step per beat (b1–b3) against a 0–110 m ruler;
   the height counter lands on 110.6 at b4, the five F-1s ignite and the stack lifts.
   Its plume column widens into the teal strip of scene 03 (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const V = D.saturnV;

  const RX = 1380; // rocket centre line
  const BASE = 960; // pad line
  const K = 7; // px per metre
  const TOP = BASE - V.heightM * K;
  const RULER_X = 1590;
  const T_LAND = 1.5;
  SX.L.rocketX = RX;

  /** Rocket base y: three beat-locked steps up from below the frame, then liftoff */
  function baseAt(lt) {
    let y = BASE + 760;
    for (let k = 0; k < 3; k++) {
      const tEnd = (k + 1) * T.SPB;
      y -= (760 / 3) * E.outBack(U.prog(lt, tEnd - 0.32, tEnd), 1.2);
    }
    if (lt > T_LAND + 0.12) y -= 260 * E.inCubic(U.prog(lt, T_LAND + 0.12, 2.0));
    return y;
  }

  SX.defineScene({
    id: 2,
    role: 'LAUNCH',
    bg: 'red',
    ruler: () => ({ from: D.launch.day, to: D.launch.day, mark: D.launch.day }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `SATURN V / ${V.engines} × ${V.engine}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 150, lines: [`${V.heightM}m 로켓이`, '솟아올라,'] });

      const svg = U.svgFull();
      // Height ruler: ticks every 10 m, labels every 20 m, top mark at 110.6 m
      st.ruler = U.s('g');
      st.ruler.appendChild(U.s('line', { x1: RULER_X, y1: BASE, x2: RULER_X, y2: TOP, stroke: C.ink, 'stroke-width': 2 }));
      for (let m = 0; m <= 110; m += 10) {
        const y = BASE - m * K;
        st.ruler.appendChild(U.s('line', { x1: RULER_X, y1: y, x2: RULER_X + (m % 20 ? 14 : 26), y2: y, stroke: C.ink, 'stroke-width': 2 }));
      }
      st.topLine = U.s('line', { x1: RX - 120, y1: TOP, x2: RULER_X + 40, y2: TOP, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 6' });
      st.pad = U.s('line', { x1: RX - 220, y1: BASE, x2: RULER_X + 40, y2: BASE, stroke: C.ink, 'stroke-width': 3 });
      st.level = U.s('rect', { x: RULER_X - 6, width: 12, fill: C.ink });
      st.rocket = SX.vehicles.saturnV(C.paper, C.ink, C.gold);
      st.rg = U.s('g', {}, st.rocket.g);
      svg.append(st.ruler, st.pad, st.topLine, st.level, st.rg);
      cam.appendChild(svg);

      st.lbls = [];
      for (let m = 0; m <= 100; m += 20) {
        const el = U.box(RULER_X + 36, BASE - m * K, 'ruler-lbl', `${m} M`);
        cam.appendChild(el);
        st.lbls.push(el);
      }
      st.num = ui.counter(cam, { x: 120, y: 640, size: 220 });
      st.unit = U.box(126, 880, 'mono', `METRES · ${V.stages} STAGES · ${V.engines} × ${V.engine}`);
      st.unit.style.fontSize = '20px';
      cam.appendChild(st.unit);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      const by = baseAt(lt);
      const shake = lt >= T_LAND ? (U.noise1(lt * 40, 3) - 0.5) * 4 : 0;
      st.rg.setAttribute('transform', `translate(${(RX + shake).toFixed(2)} ${by.toFixed(2)}) scale(${K})`);
      st.rocket.setPlume(lt >= T_LAND ? (14 + 26 * E.outCubic(U.prog(lt, T_LAND, T_LAND + 0.3))) * (0.85 + 0.3 * U.noise1(lt * 30, 5)) : 0);

      // Visible height above the pad = counter value; exact 110.6 from b4
      const h = lt >= T_LAND ? V.heightM : U.clamp((BASE - (by - V.heightM * K)) / K, 0, V.heightM) * U.clamp((lt + 0.05) * 10);
      const top = BASE - h * K;
      st.num.set(U.fmtFixed(Math.min(h, V.heightM), 1));
      const ne = ui.enter(lt, 0, 0.4);
      st.num.el.style.opacity = st.unit.style.opacity = ne.o.toFixed(3);
      st.num.el.style.transform = `translate3d(0,${((1 - ne.e) * 40).toFixed(1)}px,0)`;
      st.level.setAttribute('y', top.toFixed(1));
      st.level.setAttribute('height', (BASE - top).toFixed(1));
      st.topLine.setAttribute('opacity', lt >= T_LAND ? 1 : 0);
      st.lbls.forEach((el, k) => (el.style.opacity = h >= k * 20 - 0.01 ? 1 : 0.35));
      st.ruler.setAttribute('opacity', ne.o.toFixed(3));
    },
  });
})((window.SX = window.SX || {}));
