/* 07 MODEL — "550B 중 55B만 / 깨어 일한다."
   Mixture-of-experts (§1): 550 cells = 550B parameters; every 16th note a different seeded set of 55
   cells lights (55B active). The 1M-token context bar fills on b3, the release date pops on b4.
   Exit: shock-ring burst from the grid center (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.model;

  const COLS = 25;
  const ROWS = M.totalB / COLS; // 22
  const PITCH = 26;
  const CELL = 21;
  const GX = 1150;
  const GY = 236;
  SX.L.moeCenter = { x: GX + (COLS * PITCH) / 2, y: GY + (ROWS * PITCH) / 2 };

  /** Seeded choice of `k` distinct cells for step `s` */
  function activeSet(s) {
    const r = U.rng(5500 + s);
    const idx = Array.from({ length: M.totalB }, (_, i) => i);
    for (let i = 0; i < M.activeB; i++) {
      const j = i + Math.floor(r() * (idx.length - i));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return new Set(idx.slice(0, M.activeB));
  }
  const SETS = Array.from({ length: 17 }, (_, s) => activeSet(s));

  SX.defineScene({
    id: 7,
    role: 'MODEL',
    bg: 'rose',
    ruler: () => ({ from: 0, to: 3, mark: 3 }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${M.name} / MIXTURE OF EXPERTS` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: [`${M.totalB}B 중 ${M.activeB}B만`, '깨어 일한다.'] });

      const svg = U.svgFull();
      st.cells = [];
      for (let i = 0; i < M.totalB; i++) {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const rc = U.s('rect', { x: GX + c * PITCH, y: GY + r * PITCH, width: CELL, height: CELL, rx: 3 });
        svg.appendChild(rc);
        st.cells.push(rc);
      }
      st.gridLbl = U.s('text', { x: GX, y: GY + ROWS * PITCH + 34, fill: C.ink, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.14em', text: `1 CELL = 1B PARAMETERS · ${M.activeB} LIT = ACTIVE` });
      svg.appendChild(st.gridLbl);
      cam.appendChild(svg);

      st.count = ui.counter(cam, { x: 116, y: 520, size: 120 });
      st.countLbl = U.box(124, 650, 'mono', `ACTIVE OF ${M.totalB}B`);
      st.ctx = U.h('div', { style: 'position:absolute;left:120px;top:760px;width:900px;height:44px;border:3px solid var(--ink);box-sizing:border-box' });
      st.ctxFill = U.h('div', { style: 'position:absolute;inset:0;background:var(--ink);transform-origin:0 50%' });
      st.ctx.appendChild(st.ctxFill);
      st.ctxLbl = U.box(124, 716, 'mono', `CONTEXT WINDOW · ${M.contextM}M TOKENS`);
      st.date = ui.chip(cam, 124, 846, 'RELEASED', M.released);
      cam.append(st.countLbl, st.ctx, st.ctxLbl);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      const step = Math.max(0, Math.floor(lt / T.E16));
      const set = SETS[step % SETS.length];
      const lit = U.prog(lt, 0.0, 0.1);
      st.cells.forEach((rc, i) => {
        const e = U.prog(lt, -0.1 + (i % COLS) * 0.006, 0.15 + (i % COLS) * 0.006);
        const on = set.has(i) && lit > 0;
        rc.setAttribute('fill', on ? C.ink : 'none');
        rc.setAttribute('stroke', C.ink);
        rc.setAttribute('stroke-width', on ? 0 : 1.2);
        rc.setAttribute('opacity', (e * (on ? 1 : 0.3)).toFixed(3));
      });

      const cp = E.outCubic(U.prog(lt, 0.0, 0.45));
      st.count.set(`${Math.round(M.activeB * cp)}B`);
      st.count.el.style.opacity = st.countLbl.style.opacity = U.clamp(lt * 6 + 0.3).toFixed(3);

      const ce = ui.enter(lt, 0.9, 0.3);
      st.ctx.style.opacity = st.ctxLbl.style.opacity = ce.o.toFixed(3);
      st.ctxFill.style.transform = `scaleX(${E.inOutCubic(U.prog(lt, 1.0, 1.45)).toFixed(4)})`;
      ui.pop(st.date, lt, 1.5, { from: 0.5 });
    },
  });
})((window.SX = window.SX || {}));
