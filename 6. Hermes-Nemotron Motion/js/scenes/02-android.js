/* 02 ANDROID — "먼저 안드로이드. / 아이폰은 저리가."
   Two generic phones: the Android one lights up and gets an amber check on b2 (Termux runs there, §2),
   the iPhone-style one is stamped NO TERMUX on b3 and slides out on b4.
   Exit: whip pan (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;

  const A = { x: 1040, y: 230, w: 300, h: 600 };
  const I = { x: 1470, y: 230, w: 300, h: 600 };

  SX.defineScene({
    id: 2,
    role: 'ANDROID',
    bg: 'paper',
    ruler: (lt) => ({ from: 0, to: 1, mark: U.lerp(0, 1, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'STEP 01 / ANDROID ONLY' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['먼저 안드로이드.', '아이폰은 저리가.'] });

      st.and = SX.dev.phone(cam, A);
      st.and.el.style.color = C.ink;
      st.andGlow = U.h('div', { style: 'position:absolute;inset:0;background:radial-gradient(circle at 50% 45%, rgba(255,178,36,.55), rgba(255,178,36,0) 70%)' });
      st.andTxt = U.h('div', { class: 'mono', style: 'position:absolute;left:0;right:0;top:220px;text-align:center;color:var(--amber);font-size:22px', text: '$ termux ▌' });
      st.and.screen.append(st.andGlow, st.andTxt);
      st.andLbl = U.box(A.x, A.y + A.h + 24, 'mono', 'ANDROID · TERMUX ✓');

      st.ios = SX.dev.phone(cam, I);
      st.ios.el.style.color = C.ink;
      st.ios.screen.style.background = '#2A2930';
      st.iosLbl = U.box(I.x, I.y + I.h + 24, 'mono', 'IPHONE · NO TERMUX');
      cam.append(st.andLbl, st.iosLbl);
      st.stamp = ui.stamp(cam, { x: I.x + I.w / 2, y: I.y + I.h / 2, main: 'NO', sub: 'TERMUX IS ANDROID-ONLY', rot: -12, color: C.rose });
      st.check = ui.chip(cam, 120, 560, 'NEED', 'ANDROID PHONE');
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 10).toFixed(1)}px,${(lt * 5).toFixed(1)}px,0)`;
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      [[st.and, st.andLbl, 0], [st.ios, st.iosLbl, 0.12]].forEach(([p, lbl, d]) => {
        const e = ui.enter(lt, -0.05 + d, 0.45);
        p.el.style.opacity = lbl.style.opacity = e.o.toFixed(3);
        p.el.style.transform = `translate3d(0,${((1 - e.e) * 120).toFixed(1)}px,0)`;
      });
      const on = U.prog(lt, 0.5, 0.65);
      st.andGlow.style.opacity = (on * (0.75 + 0.25 * U.pulse(lt, T.SPB, 0.2))).toFixed(3);
      st.andTxt.style.opacity = on.toFixed(3);
      ui.pop(st.check, lt, 0.5, { from: 0.5 });

      st.stamp.update(lt, 1.0);
      const out = E.inExpo(U.prog(lt, 1.5, 1.85));
      st.ios.el.style.transform = `translate3d(${(out * 700).toFixed(1)}px,0,0) rotate(${(out * 25).toFixed(2)}deg)`;
      st.iosLbl.style.opacity = (1 - out).toFixed(3);
      st.stamp.el.style.transform += ` translate(${(out * 700).toFixed(1)}px,0)`;
      st.stamp.el.style.opacity = (parseFloat(st.stamp.el.style.opacity || 0) * (1 - out)).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
