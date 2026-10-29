/* 12 END CARD — "그리고 이제, / 루빈으로." (6 beats)
   b1 package substrate draws · b2 two compute dies drop in (§1) · b3 336B counts up ·
   b4 subcopy · b5 title + data date with the final hit · b6 micro-motion only.
   The package is a generic drawing: no logo, no spec beyond the file (2 dies, 3nm, 336B). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const RB = D.rubin;

  const P = { x: 1180, y: 220, s: 600 };
  const PCX = P.x + P.s / 2;
  const PCY = P.y + P.s / 2;
  const DW = 226;
  const DH = 400;
  const DG = 26;
  const DIES = [0, 1].map((i) => ({ x: PCX - DG / 2 - DW + i * (DW + DG), y: PCY - DH / 2 }));
  const TILE = 10;
  const NPIN = 15;

  SX.defineScene({
    id: 12,
    role: 'END CARD',
    bg: 'dark',
    ruler: (lt) => {
      const y = U.lerp(1993, 2026, E.outCubic(U.prog(lt, 0, 2.0)));
      return { from: 1993, to: y, mark: y };
    },

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, PCX, PCY, C.volt, 0.18);

      const svg = U.svgFull();
      // substrate
      st.sub = U.s('rect', { x: P.x, y: P.y, width: P.s, height: P.s, rx: 18, fill: C.ink, stroke: C.paper, 'stroke-width': 2.5 });
      st.subLen = 4 * P.s;
      st.sub.setAttribute('stroke-dasharray', `${st.subLen} ${st.subLen}`);
      st.inner = U.s('rect', { x: P.x + 28, y: P.y + 28, width: P.s - 56, height: P.s - 56, fill: 'none', stroke: C.paper, 'stroke-width': 1, 'stroke-dasharray': '2 7', opacity: 0.5 });
      st.pins = U.s('g');
      for (let side = 0; side < 4; side++) {
        for (let k = 0; k < NPIN; k++) {
          const u = (k + 1) / (NPIN + 1);
          const [x, y] = side === 0 ? [P.x + u * P.s, P.y + 12] : side === 1 ? [P.x + P.s - 12, P.y + u * P.s] : side === 2 ? [P.x + u * P.s, P.y + P.s - 12] : [P.x + 12, P.y + u * P.s];
          st.pins.appendChild(U.s('circle', { cx: x, cy: y, r: 3, fill: C.paper, opacity: 0.6 }));
        }
      }
      // traces from the dies to the substrate edge, with travelling pulses
      st.traces = [];
      const tg = U.s('g');
      for (let k = 0; k < 10; k++) {
        const left = k < 5;
        const yk = PCY - 160 + (k % 5) * 80;
        const x0 = left ? DIES[0].x : DIES[1].x + DW;
        const x1 = left ? P.x + 40 : P.x + P.s - 40;
        tg.appendChild(U.s('line', { x1: x0, y1: yk, x2: x1, y2: yk, stroke: C.paper, 'stroke-width': 1.5, opacity: 0.35 }));
        const dot = U.s('rect', { width: 14, height: 3, y: yk - 1.5, fill: C.volt });
        tg.appendChild(dot);
        st.traces.push({ dot, x0, x1, k });
      }
      st.dies = DIES.map((d) => {
        const g = U.s('g');
        g.appendChild(U.s('rect', { x: 0, y: 0, width: DW, height: DH, fill: C.volt }));
        for (let r = 1; r < DH / (DW / TILE); r++) g.appendChild(U.s('line', { x1: 0, y1: r * (DW / TILE), x2: DW, y2: r * (DW / TILE), stroke: C.ink, 'stroke-width': 1, opacity: 0.25 }));
        for (let c = 1; c < TILE; c++) g.appendChild(U.s('line', { x1: c * (DW / TILE), y1: 0, x2: c * (DW / TILE), y2: DH, stroke: C.ink, 'stroke-width': 1, opacity: 0.25 }));
        svg.appendChild(g);
        return g;
      });
      svg.append(st.sub, st.inner, st.pins, tg);
      st.dies.forEach((g) => svg.appendChild(g));
      st.pkgLbl = U.s('text', { x: P.x, y: P.y + P.s + 40, fill: C.paper, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.16em', text: `${RB.name} · ${RB.dies} COMPUTE DIES · ${RB.process}` });
      svg.appendChild(st.pkgLbl);
      cam.appendChild(svg);

      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${RB.name} / ${RB.ship}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 124, lines: ['그리고 이제,', '루빈으로.'] });
      st.count = ui.counter(cam, { x: 116, y: 512, size: 104 });
      st.countLbl = U.box(124, 628, 'mono', 'TRANSISTORS PER GPU');
      cam.appendChild(st.countLbl);

      st.subcopy = ui.headline(cam, { x: 122, y: 694, size: 34, stagger: 0.012, lines: [`Vera Rubin · TSMC 3nm · 트랜지스터 3,360억 개 · 2026년 하반기 출하`] });
      st.subcopy.el.classList.add('subcopy');
      st.title = ui.headline(cam, { x: 116, y: 774, size: 100, stagger: 0.028, lines: ['NVIDIA 1993—2026'] });
      st.title.el.classList.add('title');
      st.date = ui.caption(cam, { x: 122, y: 902, text: `DATA AS OF ${D.asOf}` });
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.05);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      st.subcopy.update(lt, 1.5);
      st.title.update(lt, 2.0);
      st.date.update(lt, 2.12);

      // b1 substrate
      const sp = E.outCubic(U.prog(lt, 0, 0.45));
      st.sub.setAttribute('stroke-dashoffset', ((1 - sp) * st.subLen).toFixed(1));
      st.sub.setAttribute('fill-opacity', U.prog(lt, 0.2, 0.5).toFixed(3));
      st.inner.setAttribute('opacity', (0.5 * U.prog(lt, 0.25, 0.5)).toFixed(3));
      st.pins.setAttribute('opacity', U.prog(lt, 0.15, 0.45).toFixed(3));

      // b2 dies drop in on 8ths
      st.dies.forEach((g, i) => {
        const t0 = 0.5 + i * T.E8;
        const p = U.prog(lt, t0 - T.LEAD, t0);
        const y = U.lerp(-500, DIES[i].y, E.inCubic(p));
        const q = U.prog(lt, t0, t0 + 0.2);
        const sq = lt >= t0 ? 1 - 0.05 * Math.sin(q * Math.PI) : 1;
        const br = lt >= 1.5 ? 0.85 + 0.15 * U.pulse(lt, T.SPB, 0.2) : 1;
        g.setAttribute('opacity', lt < t0 - T.LEAD ? 0 : br.toFixed(3));
        g.setAttribute('transform', `translate(${DIES[i].x} ${y.toFixed(1)}) translate(${DW / 2} ${DH}) scale(1 ${sq.toFixed(4)}) translate(${-DW / 2} ${-DH})`);
      });

      // traces carry pulses once both dies are seated
      st.traces.forEach((tr) => {
        const on = lt >= 0.85;
        const u = U.mod((lt - 0.85) * 1.6 + U.hash(tr.k, 5), 1);
        const x = U.lerp(tr.x0, tr.x1, u) - (tr.x1 < tr.x0 ? 14 : 0);
        tr.dot.setAttribute('x', x.toFixed(1));
        tr.dot.setAttribute('opacity', on ? 1 : 0);
      });
      st.pkgLbl.setAttribute('opacity', U.prog(lt, 0.9, 1.1).toFixed(3));

      // b3 count-up to 336B
      const cp = E.outCubic(U.prog(lt, 1.0, 1.4));
      st.count.set(`${Math.round((RB.transistors / 1e9) * cp)}B`);
      const ce = ui.enter(lt, 1.0, 0.4);
      st.count.el.style.opacity = st.countLbl.style.opacity = ce.o.toFixed(3);
      st.count.el.style.transform = `translate3d(0,${((1 - ce.e) * 30).toFixed(1)}px,0)`;
      st.count.el.style.color = cp >= 1 ? C.volt : '';
    },
  });
})((window.SX = window.SX || {}));
