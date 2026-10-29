/* 03 GPU — "그해 8월, / GPU를 만들었다."
   A triangle is rasterized on a pixel grid: vertices pop on b1, edges draw and scanlines fill on b2,
   per-vertex lighting (Gouraud) shades it on b3, FIRST GPU stamp on b4. The same grid becomes
   scene 04's thread grid: at the end every cell floods ink and the cut lands on a dark frame. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const G = D.firstGpu;

  const PIX = { x0: 1060, y0: 232, cols: 25, rows: 20, pitch: 30, cell: 26 };
  SX.L.pix = PIX;
  const V = [[3, 17.5], [22.5, 15], [12, 1.5]]; // triangle in grid units
  const VT = [0, 0.125, 0.25];
  const VCOL = [C.ink, C.tensor, C.paper];

  const px = (c) => PIX.x0 + c * PIX.pitch;
  const py = (r) => PIX.y0 + r * PIX.pitch;
  const area = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const A = area(V[0], V[1], V[2]);

  const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
  const VRGB = VCOL.map(hex);
  const INK = hex(C.ink);

  // Cells inside the triangle with barycentric weights; fill time follows the scanline (row)
  const CELLS = [];
  const rowsIn = [];
  for (let r = 0; r < PIX.rows; r++) {
    for (let c = 0; c < PIX.cols; c++) {
      const p = [c + 0.5, r + 0.5];
      const w0 = area(V[1], V[2], p) / A;
      const w1 = area(V[2], V[0], p) / A;
      const w2 = area(V[0], V[1], p) / A;
      const inside = w0 >= 0 && w1 >= 0 && w2 >= 0;
      CELLS.push({ c, r, inside, w: [w0, w1, w2] });
      if (inside) rowsIn.push(r);
    }
  }
  const R0 = Math.min(...rowsIn);
  const R1 = Math.max(...rowsIn);
  const FILL0 = 0.62;
  const FILL1 = 1.0;
  CELLS.forEach((cl) => {
    cl.t0 = FILL0 + ((cl.r - R0) / (R1 - R0 + 1)) * (FILL1 - FILL0) + (cl.c / PIX.cols) * 0.03;
  });

  SX.defineScene({
    id: 3,
    role: 'FIRST GPU',
    bg: 'volt',
    ruler: () => ({ from: 1999, to: 1999, mark: 1999 }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${G.name} / ${G.date}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 112, lines: ['그해 8월,', 'GPU를 만들었다.'] });

      const svg = U.svgFull();
      st.cells = CELLS.map((cl) => {
        const rc = U.s('rect', { x: px(cl.c), y: py(cl.r), width: PIX.cell, height: PIX.cell, fill: 'none', stroke: C.ink, 'stroke-width': 1 });
        svg.appendChild(rc);
        return rc;
      });
      st.edges = [0, 1, 2].map(() => {
        const l = U.s('line', { stroke: C.ink, 'stroke-width': 3 });
        svg.appendChild(l);
        return l;
      });
      st.scan = U.s('line', { x1: PIX.x0 - 24, x2: px(PIX.cols) + 20, stroke: C.tensor, 'stroke-width': 3 });
      svg.appendChild(st.scan);
      st.verts = V.map((v, i) => {
        const g = U.s('g', { transform: `translate(${px(v[0])} ${py(v[1])})` },
          U.s('circle', { r: 13, fill: VCOL[i], stroke: C.ink, 'stroke-width': 3 }),
          U.s('text', { x: 22, y: -16, fill: C.ink, 'font-size': 16, style: 'font-family:var(--f-mono);letter-spacing:.12em', text: `V${i}` }));
        svg.appendChild(g);
        return g;
      });
      cam.appendChild(svg);

      st.count = ui.counter(cam, { x: 116, y: 520, size: 150 });
      st.countLbl = U.box(124, 690, 'mono', `TRANSISTORS · ${G.name}`);
      cam.appendChild(st.countLbl);
      st.stamp = ui.stamp(cam, { x: 600, y: 860, main: 'FIRST GPU', sub: G.date, rot: -7, color: C.ink });
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      // Vertices: back pops on 16ths
      st.verts.forEach((g, i) => {
        const v = V[i];
        const p = U.prog(lt, VT[i], VT[i] + 0.3);
        const sc = lt < VT[i] ? 0 : E.outBack(p, 2.6);
        const b = 1 + 0.08 * U.pulse(lt, T.SPB, 0.1);
        g.setAttribute('transform', `translate(${px(v[0])} ${py(v[1])}) scale(${(sc * b).toFixed(4)})`);
      });

      // Edges draw on b2
      st.edges.forEach((l, i) => {
        const a = V[i];
        const b = V[(i + 1) % 3];
        const p = E.outCubic(U.prog(lt, 0.5 + i * 0.04, 0.68 + i * 0.04));
        l.setAttribute('x1', px(a[0]));
        l.setAttribute('y1', py(a[1]));
        l.setAttribute('x2', U.lerp(px(a[0]), px(b[0]), p).toFixed(1));
        l.setAttribute('y2', U.lerp(py(a[1]), py(b[1]), p).toFixed(1));
        l.setAttribute('opacity', p > 0 ? 1 : 0);
      });

      // Scanline sweeps on b2
      const sp = U.prog(lt, FILL0, FILL1);
      const sy = py(R0 + sp * (R1 - R0 + 1));
      st.scan.setAttribute('y1', sy.toFixed(1));
      st.scan.setAttribute('y2', sy.toFixed(1));
      st.scan.setAttribute('opacity', sp > 0 && sp < 1 ? 1 : 0);

      // Fill → Gouraud shading (b3) → ink flood sweep before the match cut
      const shade = E.inOutCubic(U.prog(lt, 1.0, 1.4));
      const flood = U.prog(lt, 1.78, 1.98);
      st.cells.forEach((rc, i) => {
        const cl = CELLS[i];
        const fl = U.clamp(flood * 1.6 - (cl.c / PIX.cols) * 0.6) >= 0.5;
        if (fl) {
          rc.setAttribute('fill', C.ink);
          rc.setAttribute('stroke', 'none');
          return;
        }
        if (!cl.inside || lt < cl.t0) {
          rc.setAttribute('fill', 'none');
          rc.setAttribute('stroke', C.ink);
          rc.setAttribute('stroke-opacity', (0.16 * U.clamp((lt + 0.1) * 4)).toFixed(3));
          return;
        }
        const rgb = [0, 1, 2].map((ch) => {
          const lit = cl.w[0] * VRGB[0][ch] + cl.w[1] * VRGB[1][ch] + cl.w[2] * VRGB[2][ch];
          return Math.round(U.lerp(INK[ch], lit, shade));
        });
        rc.setAttribute('fill', `rgb(${rgb.join(',')})`);
        rc.setAttribute('stroke', 'none');
      });

      // 23M count-up on b3, stamp on b4
      const cp = E.outCubic(U.prog(lt, 1.0, 1.4));
      st.count.set(`${Math.round((G.transistors / 1e6) * cp)}M`);
      const ce = ui.enter(lt, 1.0, 0.4);
      st.count.el.style.opacity = st.countLbl.style.opacity = ce.o.toFixed(3);
      st.count.el.style.transform = `translate3d(0,${((1 - ce.e) * 40).toFixed(1)}px,0)`;
      st.stamp.update(lt, 1.5);
    },
  });
})((window.SX = window.SX || {}));
