/* 08 REVENUE — "연 매출 / 2,159억 달러,"
   Annual revenue FY2000–FY2026 (§2) on a linear scale: three decades of bars grow on b1–b3,
   FY2026 shoots up on b4. Then that last bar widens over the whole frame and turns volt —
   the hard cut lands on scene 09's volt background (match cut). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const R = D.revenueByFy;

  const X0 = 1010;
  const X1 = 1806;
  const BASE = 900;
  const HMAX = 620;
  const PITCH = (X1 - X0) / R.length;
  const BW = PITCH - 7;
  const MAX = R[R.length - 1].m;
  const LABELED = { 2000: 'below', 2016: 'above', 2024: 'above', 2025: 'above' };
  const LAST = R.length - 1;

  const section = (fy) => (fy <= 2010 ? 0 : fy <= 2020 ? 1 : fy <= 2025 ? 2 : 3);
  const growStart = (r, i) => section(r.fy) * T.SPB + (section(r.fy) < 3 ? (i % 11) * 0.025 : 0);
  const fmtB = (m) => `$${m < 1000 ? U.fmtFixed(m / 1000, 2) : U.fmtFixed(m / 1000, 1)}B`;

  SX.defineScene({
    id: 8,
    role: 'REVENUE',
    bg: 'paper',
    ruler: (lt) => ({ from: 1999, to: 2026, mark: SX.hud.hop(lt, [2010, 2020, 2025, 2026]), label: `FY${Math.round(SX.hud.hop(lt, [2010, 2020, 2025, 2026]))}` }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'ANNUAL REVENUE / FY2000 → FY2026' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 140, lines: ['연 매출', `${U.fmtInt(D.fy2026.revenue * 10)}억 달러,`] });

      const svg = U.svgFull();
      st.axis = U.s('g');
      [50, 100, 150, 200].forEach((v) => {
        const y = BASE - (v * 1000 * HMAX) / MAX;
        st.axis.append(
          U.s('line', { x1: X0 - 10, y1: y, x2: X1, y2: y, stroke: C.ink, 'stroke-width': 1, 'stroke-dasharray': '3 6', opacity: 0.3 }),
          U.s('text', { x: X0 - 18, y: y + 5, 'text-anchor': 'end', fill: C.ink, 'font-size': 13, style: 'font-family:var(--f-mono);letter-spacing:.08em', opacity: 0.6, text: `$${v}B` }));
      });
      st.axis.appendChild(U.s('line', { x1: X0 - 10, y1: BASE, x2: X1, y2: BASE, stroke: C.ink, 'stroke-width': 2 }));
      [2000, 2010, 2020, 2026].forEach((fy) => {
        const i = R.findIndex((r) => r.fy === fy);
        st.axis.appendChild(U.s('text', { x: X0 + i * PITCH + BW / 2, y: BASE + 30, 'text-anchor': 'middle', fill: C.ink, 'font-size': 14, style: 'font-family:var(--f-mono);letter-spacing:.08em', text: `FY${String(fy).slice(2)}` }));
      });
      svg.appendChild(st.axis);
      st.bars = R.map((r, i) => {
        const bar = U.s('rect', { x: X0 + i * PITCH, width: BW, y: BASE, height: 0, fill: C.ink });
        svg.appendChild(bar);
        const o = { r, i, bar, h: (r.m * HMAX) / MAX };
        if (LABELED[r.fy]) {
          o.lbl = U.s('text', { x: X0 + i * PITCH + BW / 2, 'text-anchor': i === 0 ? 'start' : 'end', fill: C.ink, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.06em', text: fmtB(r.m) });
          svg.appendChild(o.lbl);
        }
        return o;
      });
      st.hi = U.s('text', { 'text-anchor': 'end', fill: C.heat, 'font-size': 44, style: 'font-family:var(--f-display);font-weight:900', text: fmtB(R[LAST].m) });
      svg.appendChild(st.hi);
      st.cover = U.s('rect', { fill: C.ink });
      svg.appendChild(st.cover);
      cam.appendChild(svg);

      st.growth = ui.chip(cam, 124, 560, 'FY2026 YOY', `+${D.fy2026.growthPct}%`);
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 10).toFixed(1)}px,${(lt * 6).toFixed(1)}px,0)`;
      st.cap.update(lt, 0, 1.66);
      st.head.update(lt, 0.02, 1.66);
      st.axis.setAttribute('opacity', U.clamp((lt + 0.15) * 5).toFixed(3));

      st.bars.forEach((o) => {
        const t0 = growStart(o.r, o.i);
        const p = U.prog(lt, t0, t0 + (o.i === LAST ? 0.22 : 0.3));
        const h = lt < t0 ? 0 : o.h * (o.i === LAST ? E.outBack(p, 1.2) : E.outCubic(p));
        o.bar.setAttribute('y', (BASE - Math.max(h, lt >= t0 ? 1.5 : 0)).toFixed(2));
        o.bar.setAttribute('height', Math.max(h, lt >= t0 ? 1.5 : 0).toFixed(2));
        o.bar.setAttribute('fill', o.i === LAST && lt >= 1.5 ? C.heat : C.ink);
        if (o.lbl) {
          o.lbl.setAttribute('y', (o.r.fy === 2000 ? BASE - 16 : BASE - h - 12).toFixed(1));
          o.lbl.setAttribute('opacity', U.clamp((lt - t0 - 0.15) * 5).toFixed(3));
        }
      });

      const last = st.bars[LAST];
      const lp = U.prog(lt, 1.5, 1.7);
      st.hi.setAttribute('x', (X0 + LAST * PITCH - 14).toFixed(1));
      st.hi.setAttribute('y', (BASE - last.h + 40).toFixed(1));
      st.hi.setAttribute('opacity', lt < 1.5 ? 0 : U.clamp(lp * 5).toFixed(3));

      const ce = ui.enter(lt, 1.5, 0.35);
      st.growth.style.opacity = ce.o.toFixed(3);
      st.growth.style.transform = `scale(${U.lerp(0.6, 1, ce.e).toFixed(4)})`;

      // Match cut: FY2026 bar widens over the frame and turns volt
      const m = E.inOutCubic(U.prog(lt, 1.74, 1.98));
      if (m <= 0) {
        st.cover.setAttribute('display', 'none');
        return;
      }
      const bx = X0 + LAST * PITCH;
      st.cover.setAttribute('display', '');
      st.cover.setAttribute('x', U.lerp(bx, -40, m).toFixed(1));
      st.cover.setAttribute('width', U.lerp(BW, T.W + 80, m).toFixed(1));
      st.cover.setAttribute('y', U.lerp(BASE - last.h, -40, m).toFixed(1));
      st.cover.setAttribute('height', U.lerp(last.h, T.H + 80, m).toFixed(1));
      st.cover.setAttribute('fill', ui.mix(C.heat, C.volt, U.prog(m, 0.2, 0.8)));
    },
  });
})((window.SX = window.SX || {}));
