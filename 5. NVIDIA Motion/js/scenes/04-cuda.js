/* 04 CUDA — "2006년, CUDA로 / 그래픽 너머를 열자,"
   Same pixel grid as 03 (match cut), now dark: a code window types a kernel on b1, the launch
   on b2 lights a 16×8 block of 128 threads in parallel waves on 16th notes, the core counter
   lands on b3 and the G80 transistor label on b4. Exit: RGB aberration (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const K = D.cuda;
  const PIX = SX.L.pix;

  const BW = 16;
  const BH = K.cores / BW; // 8
  const BC0 = Math.round((PIX.cols - BW) / 2);
  const BR0 = 7;

  const CODE = [
    [['kw', '__global__'], ' void add(float *a, float *b) {'],
    ['  int i = ', ['kw', 'threadIdx'], '.x;'],
    ['  a[i] += b[i];'],
    ['}'],
    [['kw', 'add<<<1, ' + K.cores + '>>>'], '(a, b);'],
  ];
  const CODE_LEN = CODE.map((ln) => ln.reduce((n, p) => n + (typeof p === 'string' ? p.length : p[1].length), 0));
  const TYPE0 = 0.05;
  const CPS = 150; // characters per second
  const LAUNCH = 0.5;

  SX.defineScene({
    id: 4,
    role: 'CUDA',
    bg: 'dark',
    ruler: (lt) => ({ from: 2006, to: 2006, mark: 2006 }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, PIX.x0 + (PIX.cols * PIX.pitch) / 2, PIX.y0 + 330, C.volt, 0.14);

      const svg = U.svgFull();
      st.cells = [];
      for (let r = 0; r < PIX.rows; r++) {
        for (let c = 0; c < PIX.cols; c++) {
          const inBlock = c >= BC0 && c < BC0 + BW && r >= BR0 && r < BR0 + BH;
          const rc = U.s('rect', { x: PIX.x0 + c * PIX.pitch, y: PIX.y0 + r * PIX.pitch, width: PIX.cell, height: PIX.cell });
          svg.appendChild(rc);
          st.cells.push({ rc, c, r, inBlock, k: inBlock ? (r - BR0) * BW + (c - BC0) : -1 });
        }
      }
      st.blockFrame = U.s('rect', {
        x: PIX.x0 + BC0 * PIX.pitch - 8, y: PIX.y0 + BR0 * PIX.pitch - 8,
        width: BW * PIX.pitch + 12, height: BH * PIX.pitch + 12, fill: 'none', stroke: C.volt, 'stroke-width': 2,
      });
      st.blockLbl = U.s('text', {
        x: PIX.x0 + BC0 * PIX.pitch - 8, y: PIX.y0 + BR0 * PIX.pitch - 22, fill: C.volt, 'font-size': 16,
        style: 'font-family:var(--f-mono);letter-spacing:.14em', text: `BLOCK 0 · ${K.cores} THREADS`,
      });
      svg.append(st.blockFrame, st.blockLbl);
      cam.appendChild(svg);

      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${K.chip} · ${K.cores} CORES / CUDA` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 96, lines: ['2006년, CUDA로', '그래픽 너머를 열자,'] });

      // Code window mock-up
      st.lines = CODE.map(() => U.h('div'));
      st.cursor = U.h('span', { class: 'cur' });
      st.win = U.h('div', { class: 'codewin', style: 'left:120px;top:500px' },
        U.h('div', { class: 'codewin-bar' }, U.h('i'), U.h('i'), U.h('i'), U.h('span', { text: '~/cuda/add.cu' })),
        U.h('div', { class: 'codewin-body' }, st.lines));
      cam.appendChild(st.win);

      st.count = ui.counter(cam, { x: 1810, y: 836, size: 84, align: 'right' });
      st.countLbl = U.h('div', { class: 'mono', style: 'right:110px;top:934px;text-align:right', text: `PARALLEL CORES · ${K.card}` });
      st.trans = U.box(PIX.x0, 842, 'mono', `${ui.fmtCount(K.transistors)} TRANSISTORS`);
      st.trans.style.fontSize = '22px';
      cam.append(st.countLbl, st.trans);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.08);
      st.cap.update(lt, 0, 1.64);
      st.head.update(lt, 0.02, 1.64);

      // Typing
      let budget = Math.max(0, Math.floor((lt - TYPE0) * CPS));
      let curLine = -1;
      CODE.forEach((ln, i) => {
        const el = st.lines[i];
        const n = Math.min(budget, CODE_LEN[i]);
        budget -= n;
        const key = `${i}:${n}`;
        if (el._k !== key) {
          el._k = key;
          el.textContent = '';
          el.appendChild(U.h('span', { class: 'ln', text: String(i + 1) }));
          let left = n;
          ln.forEach((p) => {
            const [cls, txt] = typeof p === 'string' ? [null, p] : p;
            const part = txt.slice(0, Math.max(0, left));
            left -= txt.length;
            if (part) el.appendChild(cls ? U.h('span', { class: cls, text: part }) : document.createTextNode(part));
          });
        }
        if (n > 0 && n <= CODE_LEN[i]) curLine = i;
      });
      if (curLine >= 0) st.lines[curLine].appendChild(st.cursor);
      st.cursor.style.opacity = Math.floor(lt / T.E8) % 2 === 0 || lt < LAUNCH ? 1 : 0;
      const we = ui.enter(lt, -0.05, 0.4);
      const out = ui.exit(lt, 1.64, 0.22);
      st.win.style.opacity = (we.o * (1 - out)).toFixed(3);
      st.win.style.transform = `translate3d(${(-out * 120).toFixed(1)}px,${((1 - we.e) * 60).toFixed(1)}px,0)`;

      // Grid: dim cells; the block lights on the launch, waves sweep on 16ths
      const launch = U.prog(lt, LAUNCH, LAUNCH + 0.12);
      st.cells.forEach((o) => {
        if (!o.inBlock) {
          o.rc.setAttribute('fill', C.paper);
          o.rc.setAttribute('opacity', '0.07');
          return;
        }
        const lit = lt >= LAUNCH + o.k * 0.0008;
        const wave = U.pulse(lt - LAUNCH - ((o.c - BC0) + (o.r - BR0)) * 0.012, T.E16, 0.05);
        o.rc.setAttribute('fill', lit ? C.volt : C.paper);
        o.rc.setAttribute('opacity', lit ? (0.55 + 0.45 * wave).toFixed(3) : '0.07');
      });
      st.blockFrame.setAttribute('opacity', launch.toFixed(3));
      st.blockLbl.setAttribute('opacity', launch.toFixed(3));

      // 128 cores count on b3, transistor label on b4
      const cp = E.outCubic(U.prog(lt, 0.9, 1.2));
      st.count.set(String(Math.round(K.cores * cp)));
      const ce = ui.enter(lt, 0.9, 0.4);
      st.count.el.style.opacity = st.countLbl.style.opacity = ce.o.toFixed(3);
      st.count.el.style.transform = `translate3d(0,${((1 - ce.e) * 30).toFixed(1)}px,0)`;
      const tp = U.prog(lt, 1.5, 1.62);
      st.trans.style.clipPath = `inset(0 ${((1 - E.outExpo(tp)) * 100).toFixed(1)}% 0 0)`;
    },
  });
})((window.SX = window.SX || {}));
