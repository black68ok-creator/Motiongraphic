/* 12 SKILLS — "깃허브에서 스킬을 / 잔뜩 배우게 해."
   Skill cards (procedural memory, §5) stream from a repo window into the agent on 16th notes over b1–b3;
   the trust caveat lands on b4. Card names are generic categories, not real repositories. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const CARDS = ['RESEARCH', 'TRADING', 'YOUTUBE', 'THREADS', 'WRITING', 'CODING', 'SCHEDULING', 'SUMMARY', 'TRANSLATION', 'DATA', 'DESIGN', 'MARKETING'];
  const REPO = { x: 120, y: 540, w: 640, h: 360 };
  const AGENT = { cx: 1500, cy: 560, r: 170 };

  SX.defineScene({
    id: 12,
    role: 'SKILLS',
    bg: 'sky',
    ruler: () => ({ from: 0, to: 8, mark: 8 }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'SKILLS = PROCEDURAL MEMORY / FROM GITHUB' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 116, lines: ['깃허브에서 스킬을', '잔뜩 배우게 해.'] });

      st.repo = SX.dev.term(cam, { x: REPO.x, y: REPO.y, w: REPO.w, h: REPO.h, title: 'github.com / … / skills', size: 20, lines: [[['k', '▸ '], [null, 'skills/']], [['dim', '    SKILL.md × many']]] });

      const svg = U.svgFull();
      st.core = U.s('g', {},
        U.s('circle', { cx: AGENT.cx, cy: AGENT.cy, r: AGENT.r, fill: C.night, stroke: C.paper, 'stroke-width': 4 }),
        U.s('text', { x: AGENT.cx, y: AGENT.cy - 6, 'text-anchor': 'middle', fill: C.paper, 'font-size': 40, style: 'font-family:var(--f-display);font-weight:900', text: 'HERMES' }),
        U.s('text', { x: AGENT.cx, y: AGENT.cy + 32, 'text-anchor': 'middle', fill: C.amber, 'font-size': 16, style: 'font-family:var(--f-mono);letter-spacing:.16em', text: 'YOUR AGENT' }));
      st.ring = U.s('circle', { cx: AGENT.cx, cy: AGENT.cy, r: AGENT.r + 20, fill: 'none', stroke: C.amber, 'stroke-width': 3, 'stroke-dasharray': '3 9' });
      svg.append(st.ring, st.core);
      cam.appendChild(svg);

      st.cards = CARDS.map((name, i) => {
        const el = U.h('div', { class: 'tagchip', style: 'left:0;top:0;font-size:16px', text: name });
        cam.appendChild(el);
        return { el, i, t0: i * T.E16, sx: REPO.x + 40 + (i % 3) * 200, sy: REPO.y + 130 + Math.floor(i / 3) * 52 };
      });
      st.orbit = U.h('div', { style: 'position:absolute;left:0;top:0' });
      st.caveat = ui.chip(cam, 120, 920, 'CAUTION', D.skills.caveat);
      st.caveat.style.fontSize = '15px';
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      const re = ui.enter(lt, -0.05, 0.4);
      st.repo.el.style.opacity = re.o.toFixed(3);
      st.repo.update(lt, [0, 0.1], Infinity);
      st.ring.setAttribute('stroke-dashoffset', (-lt * 40).toFixed(1));
      const n = st.cards.filter((c) => lt >= c.t0 + 0.3).length;
      const sc = 1 + 0.03 * n + 0.04 * U.pulse(lt, T.E16, 0.06) * (lt < 1.6 ? 1 : 0);
      st.core.setAttribute('transform', `translate(${AGENT.cx} ${AGENT.cy}) scale(${sc.toFixed(4)}) translate(${-AGENT.cx} ${-AGENT.cy})`);

      st.cards.forEach((c) => {
        const appear = U.prog(lt, c.t0 - 0.1, c.t0);
        const fly = E.inOutCubic(U.prog(lt, c.t0, c.t0 + 0.3));
        // landed cards orbit the agent
        const ang = (c.i / CARDS.length) * Math.PI * 2 + lt * 0.8;
        const ox = AGENT.cx + Math.cos(ang) * (AGENT.r + 110) - 60;
        const oy = AGENT.cy + Math.sin(ang) * (AGENT.r + 90) - 18;
        const x = U.lerp(c.sx, ox, fly);
        const y = U.lerp(c.sy, oy, fly) - Math.sin(fly * Math.PI) * 120;
        c.el.style.opacity = appear.toFixed(3);
        c.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${U.lerp(1, 0.85, fly).toFixed(3)})`;
      });
      ui.pop(st.caveat, lt, 1.5, { from: 0.6 });
    },
  });
})((window.SX = window.SX || {}));
