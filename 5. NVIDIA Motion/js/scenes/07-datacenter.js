/* 07 SHIFT — "매출 열에 아홉은 / 데이터센터에서,"
   FY2026 revenue mix (§3) as a progress ring centered where scene 06's die was (iris match):
   the data-center arc fills to 89.7% over b1–b2, gaming and other slices click in on b3, hold b4. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const F = D.fy2026;

  const R = 300;
  const W = 66;
  const SEGS = [
    { key: 'DATA CENTER', v: F.dataCenter, color: C.ink },
    { key: 'GAMING', v: F.gaming, color: C.paper },
    { key: 'OTHER', v: F.other, color: C.tensor },
  ];
  let acc = 0;
  SEGS.forEach((s) => {
    s.f = s.v / F.revenue;
    s.a = acc;
    acc += s.f;
  });
  const DC_PCT = Math.round(SEGS[0].f * 1000) / 10; // 89.7
  const DC_DONE = 1.0;

  SX.defineScene({
    id: 7,
    role: 'SHIFT',
    bg: 'heat',
    ruler: () => ({ from: 2025, to: 2026, mark: 2026, label: 'FY2026' }),

    build(cam) {
      const st = {};
      const { x: cx, y: cy } = SX.L.dieCenter;
      st.cx = cx;
      st.cy = cy;
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'FY2026 REVENUE MIX / DATA CENTER' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 110, lines: ['매출 열에 아홉은', '데이터센터에서,'] });

      const svg = U.svgFull();
      const Cc = 2 * Math.PI * R;
      st.C = Cc;
      st.track = U.s('circle', { cx, cy, r: R, fill: 'none', stroke: C.ink, 'stroke-width': W, opacity: 0.12 });
      st.ticks = U.s('g');
      for (let i = 0; i < 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        const r0 = R + W / 2 + 14;
        const r1 = r0 + (i % 10 === 0 ? 18 : 8);
        st.ticks.appendChild(U.s('line', { x1: cx + r0 * Math.sin(a), y1: cy - r0 * Math.cos(a), x2: cx + r1 * Math.sin(a), y2: cy - r1 * Math.cos(a), stroke: C.ink, 'stroke-width': 2 }));
      }
      svg.append(st.track, st.ticks);
      st.arcs = SEGS.map((s) => {
        const c = U.s('circle', { cx, cy, r: R, fill: 'none', stroke: s.color, 'stroke-width': W, transform: `rotate(-90 ${cx} ${cy})`, 'stroke-dasharray': `0 ${Cc}` });
        svg.appendChild(c);
        return c;
      });
      // slice labels on b3
      st.sliceLbls = SEGS.slice(1).map((s, i) => {
        const mid = (s.a + s.f / 2) * Math.PI * 2;
        const rr = R + W / 2 + 64;
        const x = cx + rr * Math.sin(mid);
        const y = cy - rr * Math.cos(mid);
        const g = U.s('g', { transform: `translate(${x.toFixed(1)} ${(y + (i ? -26 : 0)).toFixed(1)})` },
          U.s('text', { x: -14, y: 0, 'text-anchor': 'end', fill: C.ink, 'font-size': 16, style: 'font-family:var(--f-mono);letter-spacing:.14em', text: s.key }),
          U.s('text', { x: -14, y: 30, 'text-anchor': 'end', fill: C.ink, 'font-size': 28, style: 'font-family:var(--f-display);font-weight:900', text: `$${U.fmtFixed(s.v, 1)}B` }));
        svg.appendChild(g);
        return g;
      });
      cam.appendChild(svg);

      st.pct = ui.counter(cam, { x: cx, y: cy - 92, size: 128, align: 'center' });
      st.sub = U.h('div', { class: 'mono', style: `left:${cx - 300}px;top:${cy + 58}px;width:600px;text-align:center`, text: `$${U.fmtFixed(F.dataCenter, 1)}B OF $${U.fmtFixed(F.revenue, 1)}B` });
      cam.appendChild(st.sub);
      st.chip = ui.chip(cam, 124, 520, 'DATA CENTER', `$${U.fmtFixed(F.dataCenter, 1)}B`);
      st.note = U.box(126, 610, 'mono', 'FY2026 · YEAR ENDED 2026-01-25');
      cam.appendChild(st.note);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0, 1.64);
      st.head.update(lt, 0.02, 1.64);

      const re = ui.enter(lt, -0.1, 0.4);
      const scale = U.lerp(0.7, 1, re.e) * (1 + 0.015 * U.pulse(lt, T.SPB, 0.14));
      const tr = `translate(${st.cx} ${st.cy}) scale(${scale.toFixed(4)}) translate(${-st.cx} ${-st.cy})`;
      st.track.setAttribute('transform', tr);
      st.ticks.setAttribute('transform', `${tr} rotate(${(lt * 12).toFixed(2)} ${st.cx} ${st.cy})`);

      const fill = E.inOutCubic(U.prog(lt, 0.02, DC_DONE));
      SEGS.forEach((s, i) => {
        const len = i === 0 ? s.f * fill : s.f * E.outBack(U.prog(lt, 1.0 + (i - 1) * T.E8 * 0.5, 1.2 + (i - 1) * T.E8 * 0.5), 1.6);
        st.arcs[i].setAttribute('stroke-dasharray', `${(Math.max(0, len) * st.C).toFixed(2)} ${(st.C + 1).toFixed(2)}`);
        st.arcs[i].setAttribute('stroke-dashoffset', (-s.a * st.C).toFixed(2));
        st.arcs[i].setAttribute('transform', `${tr} rotate(-90 ${st.cx} ${st.cy})`);
      });
      st.sliceLbls.forEach((g, i) => {
        const p = U.prog(lt, 1.1 + i * 0.12, 1.35 + i * 0.12);
        g.setAttribute('opacity', U.clamp(p * 4).toFixed(3));
      });

      st.pct.set(`${U.fmtFixed(DC_PCT * fill, 1)}%`);
      const land = lt >= DC_DONE ? U.pulse(lt - DC_DONE, 10, 0.12) : 0;
      st.pct.el.style.opacity = re.o.toFixed(3);
      st.pct.el.style.transform = `scale(${(1 + 0.08 * land).toFixed(4)})`;
      st.sub.style.opacity = U.clamp((lt - 0.5) * 4).toFixed(3);

      const out = ui.exit(lt, 1.64, 0.22);
      const ce = ui.enter(lt, 0.5, 0.4);
      st.chip.style.opacity = (ce.o * (1 - out)).toFixed(3);
      st.chip.style.transform = `translate3d(${(-out * 100).toFixed(1)}px,0,0) scale(${U.lerp(0.6, 1, ce.e).toFixed(4)})`;
      st.note.style.opacity = (U.clamp((lt - 0.6) * 4) * 0.8 * (1 - out)).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
