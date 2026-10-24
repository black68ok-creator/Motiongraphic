/* 03 TRAVEL — "38만 km를 / 날아"
   A trans-lunar arc draws from Earth to the Moon over b1–b3 while the distance counter
   runs to 384,400 km (mean distance). b4 holds; the Moon then expands as an iris and
   becomes the paper ground of scene 04 (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const EARTH = { x: 300, y: 860, r: 190 };
  const MOON = { x: 1630, y: 400, r: 92 };
  const T_ARRIVE = 1.5;
  SX.L.moon = MOON;

  const PTS = U.bezierPts([EARTH.x + 150, EARTH.y - 130], [760, 420], [1180, 180], [MOON.x - 104, MOON.y - 20], 90);
  const ACC = U.polyLengths(PTS);
  const TOTAL = ACC[ACC.length - 1];

  SX.defineScene({
    id: 3,
    role: 'TRAVEL',
    bg: 'teal',
    ruler: (lt) => ({ from: D.launch.day, to: SX.hud.hop(lt, [16, 17, 18, D.lunarOrbitDay]), mark: SX.hud.hop(lt, [16, 17, 18, D.lunarOrbitDay]) }),

    build(cam) {
      const st = {};
      st.dots = U.h('div', { class: 'dotgrid' });
      cam.appendChild(st.dots);
      st.glow = ui.glow(cam, MOON.x, MOON.y, C.paper, 0.16);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'TRANS-LUNAR / MEAN DISTANCE' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 150, lines: ['38만 km를', '날아'] });

      const svg = U.svgFull();
      st.earth = U.s('g');
      st.earth.append(
        U.s('circle', { cx: EARTH.x, cy: EARTH.y, r: EARTH.r, fill: C.ink, stroke: C.paper, 'stroke-width': 2 }),
        ...[-0.55, -0.15, 0.25, 0.6].map((k) => U.s('ellipse', { cx: EARTH.x, cy: EARTH.y + k * EARTH.r, rx: EARTH.r * Math.sqrt(1 - k * k), ry: 10, fill: 'none', stroke: C.paper, 'stroke-width': 1, opacity: 0.35 }))
      );
      st.meridian = U.s('ellipse', { cx: EARTH.x, cy: EARTH.y, ry: EARTH.r, fill: 'none', stroke: C.paper, 'stroke-width': 1, opacity: 0.35 });
      st.earth.appendChild(st.meridian);
      st.guide = U.s('path', { d: U.pathD(PTS), fill: 'none', stroke: C.paper, 'stroke-width': 2, 'stroke-dasharray': '2 12', 'stroke-linecap': 'round', opacity: 0.5 });
      st.arc = U.s('path', { fill: 'none', stroke: C.gold, 'stroke-width': 5, 'stroke-linecap': 'round' });
      st.craft = U.s('circle', { r: 11, fill: C.gold });
      st.moon = U.s('g');
      st.moon.append(
        U.s('circle', { cx: MOON.x, cy: MOON.y, r: MOON.r, fill: C.paper }),
        U.s('circle', { cx: MOON.x - 30, cy: MOON.y - 22, r: 18, fill: C.ink, opacity: 0.12 }),
        U.s('circle', { cx: MOON.x + 28, cy: MOON.y + 26, r: 12, fill: C.ink, opacity: 0.12 }),
        U.s('circle', { cx: MOON.x + 6, cy: MOON.y - 40, r: 8, fill: C.ink, opacity: 0.12 })
      );
      svg.append(st.earth, st.guide, st.arc, st.craft, st.moon);
      cam.appendChild(svg);

      st.num = ui.counter(cam, { x: 1830, y: 700, size: 150, align: 'right' });
      st.unit = U.h('div', { class: 'mono', style: 'right:96px;top:870px;font-size:20px', text: 'KM · MEAN EARTH–MOON' });
      cam.appendChild(st.unit);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      ui.breathe(st.glow, lt, 0.08);
      st.dots.style.transform = `translate3d(${(-lt * 18).toFixed(1)}px,0,0)`;
      st.meridian.setAttribute('rx', (EARTH.r * Math.abs(Math.cos(lt * 1.4))).toFixed(1));

      const p = E.inOutCubic(U.prog(lt, 0, T_ARRIVE));
      const len = TOTAL * p;
      st.arc.setAttribute('d', U.pathD(U.slicePoly(PTS, ACC, len)));
      const head = U.pointAt(PTS, ACC, len);
      st.craft.setAttribute('cx', head.x.toFixed(1));
      st.craft.setAttribute('cy', head.y.toFixed(1));
      st.craft.setAttribute('r', (11 + 4 * U.pulse(lt, T.SPB, 0.1)).toFixed(2));

      st.num.set(U.fmtInt(lt >= T_ARRIVE ? D.distanceKm : D.distanceKm * p));
      const ne = ui.enter(lt, 0.05, 0.4);
      st.num.el.style.opacity = st.unit.style.opacity = ne.o.toFixed(3);

      const me = ui.enter(lt, -T.LEAD, 0.5);
      const arrive = lt >= T_ARRIVE ? 1 + 0.06 * Math.exp(-(lt - T_ARRIVE) / 0.15) : 1;
      st.moon.setAttribute('transform', `translate(${MOON.x} ${MOON.y}) scale(${(me.e * arrive).toFixed(4)}) translate(${-MOON.x} ${-MOON.y})`);
      const ee = ui.enter(lt, -T.LEAD, 0.5);
      st.earth.setAttribute('transform', `translate(0 ${((1 - ee.e) * 200).toFixed(1)})`);
    },
  });
})((window.SX = window.SX || {}));
