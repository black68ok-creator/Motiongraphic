/* 02 IPO — "1999년, / $12에 상장했고,"
   A listing ticket mock-up, and one IPO share that multiplies at every split (§6) until
   480 cells fill the grid on b4. At the end the cells blow outward (→ converge into 03). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const I = D.ipo;

  const COLS = 24;
  const ROWS = 20;
  const PITCH = 30;
  const CELL = 24;
  const GX = 1104;
  const GY = 236;
  SX.L.ipoGrid = { x: GX, y: GY, w: COLS * PITCH, h: ROWS * PITCH };

  // Split events: b1 IPO, b2 three 2:1 splits on 16ths, b3 3:2 and 4:1 on 8ths, b4 10:1
  const AT = [0, 0.5, 0.625, 0.75, 1.0, 1.25, 1.5];
  const STEPS = [];
  let acc = 1;
  I.splits.forEach((s, i) => {
    acc *= s.k;
    STEPS.push({ ...s, t: AT[i], n: Math.round(acc), year: parseInt(s.date, 10) });
  });
  const stepAt = (lt) => {
    let k = 0;
    STEPS.forEach((s, i) => {
      if (lt >= s.t) k = i;
    });
    return k;
  };

  // Fill order: bottom-left first, row by row upward
  const CELLS = [];
  for (let r = ROWS - 1; r >= 0; r--) for (let c = 0; c < COLS; c++) CELLS.push({ c, r, x: GX + c * PITCH, y: GY + r * PITCH });
  CELLS.forEach((cl, i) => {
    let k = 0;
    while (STEPS[k].n <= i) k++;
    const s = STEPS[k];
    const prev = k ? STEPS[k - 1].n : 0;
    cl.t0 = s.t + ((i - prev) / Math.max(1, s.n - prev)) * Math.min(0.13, 0.03 * (s.n - prev));
  });

  SX.defineScene({
    id: 2,
    role: 'IPO',
    bg: 'paper',
    ruler: (lt) => ({ from: 1999, to: STEPS[stepAt(lt)].year, mark: STEPS[stepAt(lt)].year }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);

      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${I.exchange}: ${I.ticker} / ${I.date}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 136, lines: ['1999년,', `$${I.priceUsd}에 상장했고,`] });

      // Ticket mock-up
      const bars = U.h('div', { class: 'barcode' });
      const r = U.rng(1999);
      for (let i = 0; i < 26; i++) bars.appendChild(U.h('i', { style: `width:${1 + Math.floor(r() * 4)}px` }));
      st.ticket = U.h('div', { class: 'ticket', style: 'left:124px;top:600px' },
        U.h('div', { class: 'ticket-head' }, U.h('span', { text: `${I.exchange} · IPO` }), U.h('span', {}, U.h('i'), U.h('i'), U.h('i'))),
        U.h('div', { class: 'ticket-body' },
          U.h('div', { class: 'ticket-sym', text: I.ticker }),
          bars,
          U.h('div', { class: 'ticket-row' }, U.h('span', { text: 'OFFER PRICE' }), U.h('b', { text: `$${U.fmtFixed(I.priceUsd, 2)}` })),
          U.h('div', { class: 'ticket-row' }, U.h('span', { text: 'LISTED' }), U.h('span', { text: I.date }))));
      cam.appendChild(st.ticket);

      const svg = U.svgFull();
      st.frame = U.s('rect', { x: GX - 12, y: GY - 12, width: COLS * PITCH + 18, height: ROWS * PITCH + 18, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 6' });
      svg.appendChild(st.frame);
      st.cells = CELLS.map(() => {
        const rc = U.s('rect', { width: CELL, height: CELL, fill: C.ink });
        svg.appendChild(rc);
        return rc;
      });
      cam.appendChild(svg);

      st.count = ui.counter(cam, { x: GX - 6, y: 862, size: 96 });
      st.countLbl = U.box(GX, 970, 'mono', 'SHARES FROM 1 IPO SHARE');
      st.split = U.box(GX + 420, 884, 'chip', '');
      cam.append(st.countLbl, st.split);
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 10).toFixed(1)}px,${(lt * 6).toFixed(1)}px,0)`;
      st.cap.update(lt, 0, 1.62);
      st.head.update(lt, 0.02, 1.62);

      const te = ui.enter(lt, 0.05, 0.5);
      const out = ui.exit(lt, 1.62, 0.24);
      st.ticket.style.opacity = (te.o * (1 - out)).toFixed(3);
      st.ticket.style.transform = `translate3d(${(-out * 140).toFixed(1)}px,${((1 - te.e) * 80).toFixed(1)}px,0) rotate(${((1 - te.e) * -4).toFixed(2)}deg)`;

      const k = stepAt(lt);
      const s = STEPS[k];
      st.count.set(U.fmtInt(s.n));
      const pk = U.pulse(lt - s.t, 10, 0.12);
      st.count.el.style.transform = `scale(${(1 + 0.06 * pk).toFixed(4)})`;
      st.count.el.style.color = k === STEPS.length - 1 ? C.heat : '';
      st.split.textContent = `${s.date} · ${s.ratio}`;
      const se = ui.pop(st.split, lt - s.t, 0, { dur: 0.25, from: 0.6 });
      if (se >= 1) st.split.style.transform = 'scale(1)';
      [st.count.el, st.countLbl, st.split].forEach((el) => {
        el.style.opacity = (U.clamp((lt + 0.05) * 6) * (1 - out)).toFixed(3);
      });
      st.frame.setAttribute('opacity', (U.clamp(lt * 4) * (1 - out)).toFixed(3));

      // Cells pop in; at the end they explode outward from the grid center
      const cx = GX + (COLS * PITCH) / 2;
      const cy = GY + (ROWS * PITCH) / 2;
      const ex = E.inCubic(U.prog(lt, 1.7, 2.0));
      st.cells.forEach((rc, i) => {
        const cl = CELLS[i];
        if (lt < cl.t0) {
          rc.setAttribute('opacity', 0);
          return;
        }
        const p = U.prog(lt, cl.t0, cl.t0 + 0.18);
        const sc = U.lerp(0.2, 1, E.outBack(p, 2.4));
        const dx = (cl.x - cx) * ex * (1.6 + U.hash(i, 3));
        const dy = (cl.y - cy) * ex * (1.6 + U.hash(i, 4));
        const fresh = cl.t0 >= s.t && lt - s.t < 0.2 ? 1 : 0;
        rc.setAttribute('opacity', 1);
        rc.setAttribute('fill', fresh ? C.heat : C.ink);
        rc.setAttribute('x', (cl.x + dx + (CELL * (1 - sc)) / 2).toFixed(1));
        rc.setAttribute('y', (cl.y + dy + (CELL * (1 - sc)) / 2).toFixed(1));
        rc.setAttribute('width', (CELL * sc).toFixed(2));
        rc.setAttribute('height', (CELL * sc).toFixed(2));
      });
    },
  });
})((window.SX = window.SX || {}));
