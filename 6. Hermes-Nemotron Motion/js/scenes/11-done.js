/* 11 DONE — "이제 너만의 / 에이전트 완성."
   The whole setup ticks off on 16th notes (b1–b2), the DONE stamp lands on b3, the phone pulses on b4.
   Exit: whip pan (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const STEPS = ['ANDROID PHONE', 'TERMUX · F-DROID / GITHUB', 'HERMES AGENT', 'TELEGRAM GATEWAY', 'BACKGROUND RUN', 'NVIDIA BUILD API KEY', `${D.model.name} · 550B`];

  SX.defineScene({
    id: 11,
    role: 'DONE',
    bg: 'dark',
    ruler: () => ({ from: 0, to: 8, mark: 8 }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, 1400, 540, C.amber, 0.12);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'YOUR OWN AGENT / READY' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['이제 너만의', '에이전트 완성.'] });
      st.items = STEPS.map((name, i) => {
        const el = U.h('div', { class: 'check', style: `left:1060px;top:${220 + i * 86}px;font-size:21px` }, U.h('i'), U.h('b', {}, U.h('span', { text: name })));
        el.querySelector('b').style.color = 'var(--paper)';
        cam.appendChild(el);
        return el;
      });
      st.stamp = ui.stamp(cam, { x: 520, y: 700, main: 'READY', sub: 'TALK TO IT ON TELEGRAM', rot: -6, color: C.amber });
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.06);
      st.cap.update(lt, 0, 1.66);
      st.head.update(lt, 0.02, 1.66);
      st.items.forEach((el, i) => {
        const t0 = i * T.E16;
        const e = ui.enter(lt, t0 - 0.12, 0.25);
        el.style.opacity = e.o.toFixed(3);
        el.style.transform = `translate3d(${((1 - e.e) * 60).toFixed(1)}px,0,0)`;
        el.style.setProperty('--ck', (lt < t0 ? 0 : E.outBack(U.prog(lt, t0, t0 + 0.16), 2.4)).toFixed(3));
        el.querySelector('b').style.setProperty('--hl', '0');
      });
      st.stamp.update(lt, 1.0);
    },
  });
})((window.SX = window.SX || {}));
