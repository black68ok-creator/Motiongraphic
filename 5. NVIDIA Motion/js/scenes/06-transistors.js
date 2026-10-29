/* 06 SCALE — "칩은 2,300만에서 / 3,360억 트랜지스터로,"
   One die splits into a finer tile mosaic on every 8th note while the transistor counter steps
   through the file values (§5): GeForce 256 → … → Rubin lands on b4. A log-scale line draws underneath.
   Exit: iris opens from the die center (transitions.js) onto scene 07's ring. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const S = D.transistors;

  const DIE = { cx: 1520, cy: 540, size: 560 };
  SX.L.dieCenter = { x: DIE.cx, y: DIE.cy };
  const SPLIT = [1, 2, 3, 5, 7, 11, 16];
  const AT = S.map((_, k) => k * T.E8); // last step lands on b4 (1.5)
  const MAXN = SPLIT[SPLIT.length - 1];

  const PLOT = { x0: 130, x1: 1060, y0: 950, y1: 790 };
  const LOG0 = 7;
  const LOG1 = 12;
  const plotX = (y) => U.lerp(PLOT.x0, PLOT.x1, (y - 1999) / (2026 - 1999));
  const plotY = (v) => U.lerp(PLOT.y0, PLOT.y1, (Math.log10(v) - LOG0) / (LOG1 - LOG0));

  const stepAt = (lt) => {
    let k = 0;
    AT.forEach((a, i) => {
      if (lt >= a) k = i;
    });
    return k;
  };

  SX.defineScene({
    id: 6,
    role: 'SCALE',
    bg: 'tensor',
    ruler: (lt) => ({ from: 1999, to: S[stepAt(lt)].year, mark: S[stepAt(lt)].year }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, DIE.cx, DIE.cy, C.volt, 0.16);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'TRANSISTORS PER GPU / 1999 → 2026' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 100, lines: ['칩은 2,300만에서', '3,360억 트랜지스터로,'] });

      const svg = U.svgFull();
      const h = DIE.size / 2;
      st.pkg = U.s('rect', { x: DIE.cx - h - 26, y: DIE.cy - h - 26, width: DIE.size + 52, height: DIE.size + 52, fill: 'none', stroke: C.paper, 'stroke-width': 2, 'stroke-dasharray': '2 8', opacity: 0.6 });
      svg.appendChild(st.pkg);
      st.tiles = [];
      for (let i = 0; i < MAXN * MAXN; i++) {
        const r = U.s('rect', { fill: C.paper });
        svg.appendChild(r);
        st.tiles.push(r);
      }
      st.dieEdge = U.s('rect', { x: DIE.cx - h, y: DIE.cy - h, width: DIE.size, height: DIE.size, fill: 'none', stroke: C.paper, 'stroke-width': 3 });
      svg.appendChild(st.dieEdge);

      // log-scale plot
      st.plot = U.s('g');
      st.plot.append(
        U.s('line', { x1: PLOT.x0, y1: PLOT.y0 + 10, x2: PLOT.x1, y2: PLOT.y0 + 10, stroke: C.paper, 'stroke-width': 1.5, opacity: 0.5 }),
        U.s('text', { x: PLOT.x1, y: PLOT.y0 + 34, 'text-anchor': 'end', fill: C.paper, 'font-size': 13, style: 'font-family:var(--f-mono);letter-spacing:.14em', opacity: 0.7, text: 'LOG SCALE' }));
      st.line = U.s('path', { fill: 'none', stroke: C.volt, 'stroke-width': 4, 'stroke-linejoin': 'round' });
      st.plot.appendChild(st.line);
      st.dots = S.map((s) => {
        const g = U.s('g', { transform: `translate(${plotX(s.year)} ${plotY(s.v)})` },
          U.s('circle', { r: 7, fill: C.volt }),
          U.s('text', { y: 28, 'text-anchor': 'middle', fill: C.paper, 'font-size': 12, style: 'font-family:var(--f-mono);letter-spacing:.08em', text: String(s.year) }));
        st.plot.appendChild(g);
        return g;
      });
      svg.appendChild(st.plot);
      cam.appendChild(svg);

      st.count = ui.counter(cam, { x: 116, y: 500, size: 170 });
      st.chip = U.box(126, 690, 'mono', '');
      st.chip.style.fontSize = '22px';
      cam.appendChild(st.chip);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.08);
      st.cap.update(lt, 0, 1.64);
      st.head.update(lt, 0.02, 1.64);

      const k = stepAt(lt);
      const n = SPLIT[k];
      const sp = E.outBack(U.prog(lt, AT[k], AT[k] + 0.2), 1.8);
      const h = DIE.size / 2;
      const gap = Math.max(2, 14 - n * 0.8);
      const cell = (DIE.size - gap * (n - 1)) / n;
      const de = ui.enter(lt, -0.1, 0.45);
      st.tiles.forEach((r, i) => {
        if (i >= n * n) {
          r.setAttribute('display', 'none');
          return;
        }
        const c = i % n;
        const row = Math.floor(i / n);
        const s = U.lerp(0.55, 1, sp) * de.e;
        const x = DIE.cx - h + c * (cell + gap) + (cell * (1 - s)) / 2;
        const y = DIE.cy - h + row * (cell + gap) + (cell * (1 - s)) / 2;
        const shimmer = U.pulse(lt - (c + row) * 0.015, T.E16, 0.06);
        r.setAttribute('display', '');
        r.setAttribute('x', x.toFixed(1));
        r.setAttribute('y', y.toFixed(1));
        r.setAttribute('width', Math.max(0, cell * s).toFixed(2));
        r.setAttribute('height', Math.max(0, cell * s).toFixed(2));
        const hot = U.hash(i * 7 + k, 13) < 0.12;
        r.setAttribute('fill', hot ? C.volt : C.paper);
        r.setAttribute('opacity', (0.22 + 0.5 * U.hash(i, k + 3) + 0.25 * shimmer).toFixed(3));
      });
      st.dieEdge.setAttribute('opacity', de.o.toFixed(3));
      st.pkg.setAttribute('stroke-dashoffset', (-lt * 30).toFixed(1));

      // Counter snaps to each chip's value (only file values on screen) and kicks on the step
      st.count.set(ui.fmtCount(S[k].v));
      const pk = U.pulse(lt - AT[k], 10, 0.1);
      st.count.el.style.transform = `scale(${(1 + 0.05 * pk).toFixed(4)})`;
      st.count.el.style.color = k === S.length - 1 ? C.volt : '';
      st.count.el.style.opacity = U.clamp((lt + 0.1) * 6).toFixed(3);
      U.setText(st.chip, `${S[k].chip} · ${S[k].year}`);

      // Line draws through the dots as each step lands
      const pts = [];
      S.forEach((s, i) => {
        const p = E.outCubic(U.prog(lt, AT[i], AT[i] + 0.2));
        st.dots[i].setAttribute('opacity', p > 0 ? 1 : 0.0);
        st.dots[i].setAttribute('transform', `translate(${plotX(s.year)} ${plotY(s.v)}) scale(${(lt < AT[i] ? 0 : E.outBack(p, 2.4)).toFixed(3)})`);
        if (i === 0) {
          if (lt >= AT[0]) pts.push([plotX(s.year), plotY(s.v)]);
        } else if (lt >= AT[i - 1]) {
          const a = S[i - 1];
          const q = E.inOutCubic(U.prog(lt, AT[i - 1] + 0.05, AT[i]));
          pts.push([U.lerp(plotX(a.year), plotX(s.year), q), U.lerp(plotY(a.v), plotY(s.v), q)]);
        }
      });
      st.line.setAttribute('d', U.pathD(pts));
    },
  });
})((window.SX = window.SX || {}));
