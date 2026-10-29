/* 07 BACKGROUND — "백그라운드로 / 계속 돌려."
   `termux-wake-lock` (3rd-party tip) and `hermes gateway` type on b1; a message packet travels
   Telegram → phone (b1) → model API (b2), comes back (b3) and the reply lands in Telegram (b4)
   while the screen-off phone keeps the gateway alive. Exit: iris opens from the API node. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const G = D.telegram;
  const M = D.model;

  const NY = 560;
  const NODES = [
    { x: 120, k: 'TELEGRAM', v: '내 봇' },
    { x: 780, k: 'PHONE · TERMUX', v: 'Hermes Agent' },
    { x: 1440, k: 'LLM API', v: 'AI 모델' },
  ];
  const NW = 360;
  const NH = 170;
  const cx = (i) => NODES[i].x + NW / 2;
  SX.L.apiNode = { x: cx(2), y: NY + NH / 2 };
  const HOPS = [
    { a: 0, b: 1, t: 0.0, lbl: 'MESSAGE' },
    { a: 1, b: 2, t: 0.5, lbl: 'PROMPT' },
    { a: 2, b: 1, t: 1.0, lbl: 'COMPLETION' },
    { a: 1, b: 0, t: 1.5, lbl: 'REPLY' },
  ];

  SX.defineScene({
    id: 7,
    role: 'BACKGROUND',
    bg: 'dark',
    ruler: (lt) => ({ from: 0, to: 5, mark: U.lerp(4, 5, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, 960, NY + 80, C.amber, 0.1);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'STEP 05 / BACKGROUND · MESSAGING GATEWAY' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['백그라운드로', '계속 돌려.'] });
      st.cmd = SX.dev.term(cam, { x: 1180, y: 230, w: 620, title: 'termux', size: 26, lines: [[['p', '~ $ '], [null, D.termux.wakeLock]], [['p', '~ $ '], [null, G.run]]] });

      const svg = U.svgFull();
      st.links = [0, 1].map((i) => {
        const l = U.s('line', { x1: NODES[i].x + NW, y1: NY + NH / 2, x2: NODES[i + 1].x, y2: NY + NH / 2, stroke: C.paper, 'stroke-width': 2, 'stroke-dasharray': '4 8', opacity: 0.6 });
        svg.appendChild(l);
        return l;
      });
      st.packet = U.s('g', {},
        U.s('rect', { x: -14, y: -14, width: 28, height: 28, rx: 6, fill: C.amber }),
        U.s('text', { y: -26, 'text-anchor': 'middle', fill: C.amber, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.14em' }));
      cam.appendChild(svg);

      st.nodes = NODES.map((n) => {
        const el = U.h('div', { class: 'node', style: `left:${n.x}px;top:${NY}px` }, U.h('div', { class: 'k', text: n.k }), U.h('div', { class: 'v', text: n.v }));
        cam.appendChild(el);
        return el;
      });
      const top = U.svgFull();
      top.appendChild(st.packet);
      cam.appendChild(top);
      st.sub = U.box(NODES[1].x, NY + NH + 18, 'mono', 'SCREEN OFF · STILL RUNNING');
      st.sub.style.fontSize = '13px';
      st.wake = ui.chip(cam, 120, 852, `KEEP AWAKE · ${D.termux.wakeLock}`, '3RD-PARTY TIP');
      st.note = U.box(124, 930, 'mono', 'ANDROID MAY SUSPEND BACKGROUND JOBS · BEST-EFFORT');
      st.note.style.fontSize = '14px';
      cam.append(st.sub, st.note);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.05);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      const ce = ui.enter(lt, -0.05, 0.35);
      st.cmd.el.style.opacity = ce.o.toFixed(3);
      st.cmd.update(lt, [0.0, 0.3], 70);

      st.nodes.forEach((el, i) => {
        const e = ui.enter(lt, -0.1 + i * 0.06, 0.4);
        const hit = HOPS.some((h) => h.b === i && lt >= h.t + 0.4 && lt < h.t + 0.55);
        el.style.opacity = e.o.toFixed(3);
        el.style.borderColor = hit ? C.amber : '';
        el.style.transform = `translate3d(0,${((1 - e.e) * 50).toFixed(1)}px,0) scale(${(1 + (hit ? 0.04 : 0)).toFixed(3)})`;
      });
      st.links.forEach((l) => l.setAttribute('stroke-dashoffset', (-lt * 60).toFixed(1)));

      // packet hops on each beat
      let hop = HOPS[0];
      HOPS.forEach((h) => {
        if (lt >= h.t) hop = h;
      });
      const p = E.inOutCubic(U.prog(lt, hop.t + 0.05, hop.t + 0.42));
      const x = U.lerp(cx(hop.a), cx(hop.b), p);
      const y = NY + NH / 2 - Math.sin(p * Math.PI) * 60;
      st.packet.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      st.packet.lastChild.textContent = hop.lbl;
      st.packet.setAttribute('opacity', lt < 0.05 ? 0 : 1);

      st.sub.style.opacity = U.clamp((lt - 0.4) * 5).toFixed(3);
      ui.pop(st.wake, lt, 1.5, { from: 0.6 });
      st.note.style.opacity = (0.8 * U.clamp((lt - 1.6) * 6)).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
