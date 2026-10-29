/* 04 INSTALL — "헤르메스를 / 설치하고,"
   The [termux] extra (§2): six bundled features tick on 8th notes with a highlighter sweep,
   a progress bar fills to 6/6, and on b4 the [all] extra is struck out (Android-incompatible voice deps).
   Exit: six vertical strips open onto scene 06 (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const X = D.termux;

  const LIST = { x: 1100, y: 250 };
  const TICK = X.bundle.map((_, i) => 0.1 + i * T.E8 * 0.95); // last lands before b4
  SX.L.strips = { xs: [160, 480, 800, 1120, 1440, 1760], half: 0 };

  SX.defineScene({
    id: 4,
    role: 'INSTALL',
    bg: 'sky',
    ruler: (lt) => ({ from: 0, to: 3, mark: U.lerp(2, 3, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: "STEP 03 / HERMES AGENT · EXTRA [termux]" });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['헤르메스를', '설치하고,'] });

      st.items = X.bundle.map((name, i) => {
        const el = U.h('div', { class: 'check', style: `left:${LIST.x}px;top:${LIST.y + i * 92}px` }, U.h('i'), U.h('b', {}, U.h('span', { text: name })));
        cam.appendChild(el);
        return el;
      });

      st.pip = U.h('div', { class: 'tagchip', style: 'left:120px;top:560px;font-size:19px', text: `$ ${X.pip}` });
      cam.appendChild(st.pip);
      st.bar = U.h('div', { style: 'position:absolute;left:120px;top:660px;width:860px;height:18px;border:2px solid var(--paper);box-sizing:border-box' });
      st.barFill = U.h('div', { style: 'position:absolute;left:0;top:0;bottom:0;background:var(--amber);transform-origin:0 50%' });
      st.bar.appendChild(st.barFill);
      cam.appendChild(st.bar);
      st.count = ui.counter(cam, { x: 116, y: 700, size: 96 });
      st.countLbl = U.box(124, 812, 'mono', 'FEATURES IN THE TERMUX BUNDLE');
      st.all = U.h('div', { class: 'chip', style: 'left:600px;top:724px;transform-origin:0 50%' });
      st.all.append("[all]", U.h('b', { text: '✕' }));
      st.allLbl = U.box(604, 800, 'mono', 'ANDROID-INCOMPATIBLE VOICE DEPS');
      st.allLbl.style.fontSize = '14px';
      cam.append(st.countLbl, st.all, st.allLbl);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      let n = 0;
      st.items.forEach((el, i) => {
        const t0 = TICK[i];
        const e = ui.enter(lt, t0 - 0.15, 0.3);
        el.style.opacity = e.o.toFixed(3);
        el.style.transform = `translate3d(${((1 - e.e) * 60).toFixed(1)}px,0,0)`;
        const ck = lt < t0 ? 0 : E.outBack(U.prog(lt, t0, t0 + 0.18), 2.4);
        el.style.setProperty('--ck', ck.toFixed(3));
        el.style.setProperty('--hl', E.outExpo(U.prog(lt, t0 + 0.02, t0 + 0.2)).toFixed(3));
        if (lt >= t0) n++;
      });
      const pe = ui.enter(lt, -0.05, 0.35);
      st.pip.style.opacity = pe.o.toFixed(3);
      st.pip.style.clipPath = `inset(0 ${((1 - E.outExpo(U.prog(lt, 0, 0.3))) * 100).toFixed(1)}% 0 0)`;
      st.barFill.style.width = '100%';
      st.barFill.style.transform = `scaleX(${(n / X.bundle.length).toFixed(4)})`;
      st.count.set(`${n} / ${X.bundle.length}`);
      st.count.el.style.opacity = st.countLbl.style.opacity = pe.o.toFixed(3);

      ui.pop(st.all, lt, 1.5, { from: 1.6, s: 1.2 });
      st.allLbl.style.opacity = U.clamp((lt - 1.58) * 6).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
