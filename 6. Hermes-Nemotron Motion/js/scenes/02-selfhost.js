/* 02 PROBLEM — "직접 돌리면 / B200 네 장이 필요하지만,"
   Self-hosting minimum (§1, 3rd-party): four B200-class boards slam in on b1 (16ths),
   eight H100 boards on b2 (16ths), the MIN. SPEC stamp lands on b3, the phone waits on b4. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const H = D.model.selfHost;

  const BIG = { w: 300, h: 150, y: 560, x0: 120, gap: 28 };
  const SMALL = { w: 140, h: 74, y: 800, x0: 120, gap: 18 };

  function board(w, h, label) {
    const g = U.s('g');
    g.append(
      U.s('rect', { x: 0, y: 0, width: w, height: h, rx: 8, fill: C.ink }),
      U.s('rect', { x: w * 0.36, y: h * 0.2, width: w * 0.28, height: h * 0.6, fill: C.amber }),
      ...Array.from({ length: Math.floor(w / 26) }, (_, k) => U.s('rect', { x: 10 + k * 26, y: h + 4, width: 14, height: 8, fill: C.ink })),
      U.s('text', { x: 14, y: 26, fill: C.paper, 'font-size': w > 200 ? 16 : 12, style: 'font-family:var(--f-mono);letter-spacing:.12em', text: label }));
    return g;
  }

  SX.defineScene({
    id: 2,
    role: 'PROBLEM',
    bg: 'paper',
    ruler: () => ({ from: 0, to: 0, mark: 0 }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'SELF-HOST MINIMUM / REPORTED · 3RD-PARTY' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 108, lines: ['직접 돌리면', `B200 네 장이 필요하지만,`] });

      const svg = U.svgFull();
      st.big = Array.from({ length: H.b200 }, (_, i) => {
        const g = board(BIG.w, BIG.h, `B200 · ${U.pad(i + 1)}`);
        g.dataset.x = BIG.x0 + i * (BIG.w + BIG.gap);
        g.dataset.y = BIG.y;
        svg.appendChild(g);
        return g;
      });
      st.small = Array.from({ length: H.h100 }, (_, i) => {
        const g = board(SMALL.w, SMALL.h, `H100 · ${U.pad(i + 1)}`);
        g.dataset.x = SMALL.x0 + i * (SMALL.w + SMALL.gap);
        g.dataset.y = SMALL.y;
        svg.appendChild(g);
        return g;
      });
      st.orLbl = U.s('text', { x: SMALL.x0, y: SMALL.y - 22, fill: C.ink, 'font-size': 16, style: 'font-family:var(--f-mono);letter-spacing:.16em', text: `OR H100 × ${H.h100}` });
      st.bigLbl = U.s('text', { x: BIG.x0, y: BIG.y - 22, fill: C.ink, 'font-size': 16, style: 'font-family:var(--f-mono);letter-spacing:.16em', text: `B200-CLASS × ${H.b200}` });
      svg.append(st.orLbl, st.bigLbl);
      cam.appendChild(svg);

      st.phone = SX.dev.phone(cam, { x: 1600, y: 600, w: 170, h: 320 });
      st.phone.el.style.color = C.ink;
      st.phoneLbl = U.box(1600, 940, 'mono', 'YOUR PHONE');
      cam.appendChild(st.phoneLbl);
      st.stamp = ui.stamp(cam, { x: 1680, y: 400, main: 'MIN. SPEC', sub: 'REPORTED · 3RD-PARTY', rot: -8 });
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 10).toFixed(1)}px,${(lt * 5).toFixed(1)}px,0)`;
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      const slam = (g, t0) => {
        const p = U.prog(lt, t0 - T.LEAD, t0);
        const q = U.prog(lt, t0, t0 + 0.16);
        const sq = lt >= t0 ? 1 - 0.1 * Math.sin(q * Math.PI) : 1;
        const y = U.lerp(+g.dataset.y - 260, +g.dataset.y, E.inCubic(p));
        g.setAttribute('opacity', lt < t0 - T.LEAD ? 0 : 1);
        g.setAttribute('transform', `translate(${g.dataset.x} ${y.toFixed(1)}) scale(1 ${sq.toFixed(4)})`);
      };
      st.big.forEach((g, i) => slam(g, i * T.E16));
      st.small.forEach((g, i) => slam(g, 0.5 + i * T.E32 * 1.6));
      st.bigLbl.setAttribute('opacity', U.clamp(lt * 6).toFixed(3));
      st.orLbl.setAttribute('opacity', U.clamp((lt - 0.5) * 6).toFixed(3));

      st.stamp.update(lt, 1.0);
      const pe = ui.enter(lt, 1.5, 0.4);
      const wob = lt >= 1.5 ? Math.sin((lt - 1.5) * 14) * 3 * (1 - U.prog(lt, 1.5, 2)) : 0;
      st.phone.el.style.opacity = st.phoneLbl.style.opacity = pe.o.toFixed(3);
      st.phone.el.style.transform = `translate3d(0,${((1 - pe.e) * 60).toFixed(1)}px,0) rotate(${wob.toFixed(2)}deg)`;
    },
  });
})((window.SX = window.SX || {}));
