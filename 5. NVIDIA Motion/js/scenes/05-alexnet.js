/* 05 AI — "2012년, AI가 / 그 위에서 깨어났다."
   Race bars for ILSVRC 2012 top-5 error (§1): both bars launch on b1 and land on b2,
   the −10.9 pt gap bracket draws on b3, two GTX 580 boards pop on b4 (8th stagger). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const A = D.alexnet;

  const X0 = 120;
  const PX = 50; // px per percentage point
  const BH = 76;
  const ROWS = [
    { key: '2ND PLACE', v: A.runnerUpPct, y: 548, land: 1.0 },
    { key: 'ALEXNET', v: A.errorPct, y: 664, land: 0.75 },
  ];
  const GAP = Math.round((A.runnerUpPct - A.errorPct) * 10) / 10;

  SX.defineScene({
    id: 5,
    role: 'AI',
    bg: 'paper',
    ruler: () => ({ from: 2012, to: 2012, mark: 2012 }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `ALEXNET · ${A.contest} / TOP-5 ERROR` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 120, lines: ['2012년, AI가', '그 위에서 깨어났다.'] });

      const svg = U.svgFull();
      st.axis = U.s('g');
      [10, 20].forEach((v) => {
        const x = X0 + v * PX;
        st.axis.append(
          U.s('line', { x1: x, y1: ROWS[0].y - 24, x2: x, y2: ROWS[1].y + BH + 14, stroke: C.ink, 'stroke-width': 1, 'stroke-dasharray': '3 6', opacity: 0.35 }),
          U.s('text', { x, y: ROWS[0].y - 32, 'text-anchor': 'middle', fill: C.ink, 'font-size': 14, style: 'font-family:var(--f-mono);letter-spacing:.1em', opacity: 0.6, text: `${v}%` }));
      });
      svg.appendChild(st.axis);
      st.rows = ROWS.map((r) => {
        const bar = U.s('rect', { x: X0, y: r.y, height: BH, width: 0, fill: C.ink });
        const lbl = U.s('text', { x: X0 + 18, y: r.y + BH / 2 + 6, fill: C.paper, 'font-size': 17, style: 'font-family:var(--f-mono);letter-spacing:.16em', text: r.key });
        svg.append(bar, lbl);
        return { r, bar, lbl };
      });
      // gap bracket
      const bx0 = X0 + A.errorPct * PX;
      const bx1 = X0 + A.runnerUpPct * PX;
      const by = ROWS[1].y + BH + 40;
      st.bracket = U.s('path', { d: `M${bx0} ${by - 14} V${by} H${bx1} V${by - 14}`, fill: 'none', stroke: C.heat, 'stroke-width': 4 });
      st.bracketLen = 28 + (bx1 - bx0);
      st.bracket.setAttribute('stroke-dasharray', `${st.bracketLen} ${st.bracketLen}`);
      st.gapLbl = U.s('text', { x: (bx0 + bx1) / 2, y: by + 50, 'text-anchor': 'middle', fill: C.heat, 'font-size': 40, style: 'font-family:var(--f-display);font-weight:900', text: `−${GAP} PT` });
      st.better = U.s('text', { x: (bx0 + bx1) / 2, y: by + 80, 'text-anchor': 'middle', fill: C.ink, 'font-size': 14, style: 'font-family:var(--f-mono);letter-spacing:.16em', text: 'LOWER IS BETTER' });
      svg.append(st.bracket, st.gapLbl, st.better);

      // two GPU boards
      st.gpus = [0, 1].map((i) => {
        const x = 1490 + i * 196;
        const y = 840;
        const g = U.s('g', {},
          U.s('rect', { x: 0, y: 0, width: 176, height: 108, rx: 6, fill: C.ink }),
          U.s('rect', { x: 52, y: 22, width: 72, height: 64, fill: C.volt }),
          ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => U.s('rect', { x: 14 + k * 20, y: 112, width: 12, height: 10, fill: C.ink })),
          U.s('text', { x: 0, y: -14, fill: C.ink, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.14em', text: `${A.gpuName} · ${U.pad(i + 1)}` }));
        g.dataset.x = x;
        g.dataset.y = y;
        svg.appendChild(g);
        return g;
      });
      cam.appendChild(svg);

      st.vals = ROWS.map((r) => {
        const c = ui.counter(cam, { x: X0, y: r.y + 6, size: 64 });
        return c;
      });
      st.gpuLbl = U.box(1490, 768, 'mono', `× ${A.gpus} GPUS TRAINED IT`);
      cam.appendChild(st.gpuLbl);
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 12).toFixed(1)}px,${(-lt * 4).toFixed(1)}px,0)`;
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      st.axis.setAttribute('opacity', U.clamp((lt + 0.1) * 5).toFixed(3));

      const hi = U.prog(lt, 1.0, 1.15);
      st.rows.forEach((o, i) => {
        const { r } = o;
        const p = U.prog(lt, 0.05, r.land);
        const v = r.v * E.outCubic(p);
        const w = v * PX;
        o.bar.setAttribute('width', w.toFixed(1));
        o.bar.setAttribute('fill', i === 1 && hi > 0.5 ? C.heat : C.ink);
        o.lbl.setAttribute('opacity', w > 220 ? 1 : 0);
        o.lbl.setAttribute('fill', i === 1 && hi > 0.5 ? C.ink : C.paper);
        st.vals[i].set(`${U.fmtFixed(v, 1)}%`);
        st.vals[i].el.style.left = `${(X0 + w + 20).toFixed(1)}px`;
        st.vals[i].el.style.opacity = U.clamp(lt * 8).toFixed(3);
        const land = U.pulse(lt - r.land, 10, 0.12) * (lt >= r.land ? 1 : 0);
        st.vals[i].el.style.transform = `scale(${(1 + 0.1 * land).toFixed(4)})`;
      });

      // b3 bracket
      const bp = E.outCubic(U.prog(lt, 1.0, 1.3));
      st.bracket.setAttribute('stroke-dashoffset', ((1 - bp) * st.bracketLen).toFixed(1));
      const gp = U.prog(lt, 1.12, 1.4);
      st.gapLbl.setAttribute('opacity', U.clamp(gp * 4).toFixed(3));
      st.gapLbl.setAttribute('transform', `translate(0 ${((1 - E.outBack(gp)) * 20).toFixed(1)})`);
      st.better.setAttribute('opacity', U.clamp((lt - 1.2) * 5).toFixed(3));

      // b4 two GPUs on 8ths
      st.gpus.forEach((g, i) => {
        const t0 = 1.5 + i * T.E8 * 0.5;
        const p = U.prog(lt, t0, t0 + 0.3);
        const s = lt < t0 ? 0 : E.outBack(p, 2.2);
        const fl = 1 + 0.02 * Math.sin(lt * 6 + i);
        g.setAttribute('transform', `translate(${g.dataset.x} ${(+g.dataset.y + (1 - s) * 40).toFixed(1)}) scale(${(s * fl).toFixed(4)})`);
        g.setAttribute('opacity', lt < t0 ? 0 : 1);
      });
      const le = U.prog(lt, 1.62, 1.75);
      st.gpuLbl.style.clipPath = `inset(0 ${((1 - E.outExpo(le)) * 100).toFixed(1)}% 0 0)`;
    },
  });
})((window.SX = window.SX || {}));
