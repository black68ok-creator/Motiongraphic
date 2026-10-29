/* 10 QUARTER — "한 분기에만 / 962억 달러."
   Six quarters (§4) as server racks; each rack unit = $2B and fills bottom-up on a 16th-note
   ripple, two racks per beat over b1–b3. On b4 the Q2 FY2027 rack lights up with its stats. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const Q = D.quarters;
  const K = D.q2fy27;

  const UNIT_B = 2;
  const UH = 11;
  const UG = 2;
  const RW = 124;
  const PITCH = 152;
  const X0 = 900;
  const BASE = 862;
  const NU = Math.ceil(Math.max(...Q.map((q) => q.v)) / UNIT_B); // 49
  const FRAME_H = NU * (UH + UG) + 14;
  const rackStart = (i) => Math.floor(i / 2) * T.SPB + (i % 2) * T.E8;

  SX.defineScene({
    id: 10,
    role: 'QUARTER',
    bg: 'dark',
    ruler: () => ({ from: 2025, to: 2026.6, mark: 2026.6, label: 'Q2 FY2027' }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, X0 + 5 * PITCH + RW / 2, 520, C.volt, 0.14);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `Q2 FY2027 / ENDED ${K.ended}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['한 분기에만', `${U.fmtInt(K.revenue * 10)}억 달러.`] });

      const svg = U.svgFull();
      st.racks = Q.map((q, i) => {
        const x = X0 + i * PITCH;
        const g = U.s('g');
        const frame = U.s('path', { d: `M${x - 8} ${BASE - FRAME_H} V${BASE + 8} H${x + RW + 8} V${BASE - FRAME_H}`, fill: 'none', stroke: C.paper, 'stroke-width': 2, opacity: 0.45 });
        g.appendChild(frame);
        const units = [];
        const n = Math.ceil(q.v / UNIT_B);
        for (let u = 0; u < n; u++) {
          const frac = u === n - 1 ? q.v / UNIT_B - u : 1;
          const y = BASE - (u + 1) * (UH + UG);
          const r = U.s('rect', { x, y: y + UH * (1 - frac), width: RW, height: UH * frac, fill: C.paper });
          g.appendChild(r);
          units.push(r);
        }
        const top = BASE - q.v / UNIT_B * (UH + UG);
        const val = U.s('text', { x: x + RW / 2, y: top - 16, 'text-anchor': 'middle', fill: C.paper, 'font-size': 30, style: 'font-family:var(--f-display);font-weight:900', text: `$${U.fmtFixed(q.v, 1)}B` });
        const lbl = U.s('text', { x: x + RW / 2, y: BASE + 36, 'text-anchor': 'middle', fill: C.paper, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.12em', text: q.q });
        g.append(val, lbl);
        svg.appendChild(g);
        return { g, frame, units, val, lbl };
      });
      st.unitKey = U.s('text', { x: X0 - 8, y: BASE + 76, fill: C.paper, 'font-size': 13, style: 'font-family:var(--f-mono);letter-spacing:.14em', opacity: 0.7, text: `1 UNIT = $${UNIT_B}B REVENUE` });
      svg.appendChild(st.unitKey);
      cam.appendChild(svg);

      st.chips = [
        ui.chip(cam, 124, 540, 'YOY', `+${K.yoyPct}%`),
        ui.chip(cam, 124, 630, 'DATA CENTER', `$${U.fmtFixed(K.dataCenter, 1)}B`),
        ui.chip(cam, 124, 720, 'GROSS MARGIN', `${U.fmtFixed(K.grossMarginPct, 1)}%`),
      ];
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.08);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      const last = Q.length - 1;
      const hi = lt >= 1.5;

      st.racks.forEach((rk, i) => {
        const t0 = rackStart(i);
        const fe = ui.enter(lt, t0 - 0.2, 0.3);
        rk.frame.setAttribute('opacity', (0.45 * fe.o).toFixed(3));
        rk.units.forEach((r, u) => {
          const tu = t0 + u * 0.005;
          const on = lt >= tu;
          const ripple = U.pulse(lt - tu, T.E16, 0.05);
          r.setAttribute('opacity', on ? (0.75 + 0.25 * ripple).toFixed(3) : 0);
          r.setAttribute('fill', i === last && hi ? C.volt : C.paper);
        });
        const vp = U.prog(lt, t0 + 0.2, t0 + 0.35);
        rk.val.setAttribute('opacity', U.clamp(vp * 4).toFixed(3));
        rk.val.setAttribute('fill', i === last && hi ? C.volt : C.paper);
        rk.lbl.setAttribute('opacity', fe.o.toFixed(3));
        if (i === last) {
          const k = hi ? U.pulse(lt - 1.5, 10, 0.12) : 0;
          rk.val.setAttribute('font-size', (30 * (1 + 0.3 * k + (hi ? 0.25 : 0))).toFixed(1));
        }
      });
      st.unitKey.setAttribute('opacity', (0.7 * U.clamp(lt * 4)).toFixed(3));

      st.chips.forEach((el, i) => {
        const t0 = 1.5 + i * T.E16;
        const p = U.prog(lt, t0, t0 + 0.3);
        el.style.opacity = lt < t0 ? 0 : U.clamp(p * 5).toFixed(3);
        el.style.transform = `translate3d(${((1 - E.outBack(p, 2)) * -60).toFixed(1)}px,0,0)`;
      });
    },
  });
})((window.SX = window.SX || {}));
