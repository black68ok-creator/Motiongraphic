/* 03 TERMUX — "Termux는 / 플레이스토어 말고,"
   Install sources (§2): the Play Store chip is struck out on b1, F-Droid and GitHub check in on b2,
   then the Termux session types the one-line Hermes installer (b3) and `hermes doctor` (b4).
   Exit: RGB aberration. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const X = D.termux;

  SX.defineScene({
    id: 3,
    role: 'TERMUX',
    bg: 'dark',
    ruler: (lt) => ({ from: 0, to: 2, mark: U.lerp(1, 2, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, 960, 760, C.amber, 0.1);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'STEP 02 / TERMUX · F-DROID OR GITHUB' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 120, lines: ['Termux는', '플레이스토어 말고,'] });

      st.term = SX.dev.term(cam, {
        x: 120, y: 540, w: 1680, title: 'termux · ~', size: 20,
        lines: [
          [['p', '~ $ '], [null, X.installer]],
          [['dim', '    # Termux detected → tested Android flow · extra [termux]']],
          [['p', '~ $ '], [null, X.doctor]],
          [['dim', '    # missing tools?  '], ['k', X.tools]],
        ],
      });

      st.srcs = X.sources.map((o, i) => {
        const el = ui.chip(cam, 1110, 196 + i * 70, o.name, o.ok ? '✓' : '✕');
        el.style.background = o.ok ? 'var(--amber)' : 'transparent';
        el.style.color = o.ok ? 'var(--ink)' : 'var(--rose)';
        el.appendChild(U.h('span', { style: 'margin-left:14px;font-size:13px;opacity:.8', text: o.note }));
        return el;
      });
      st.strike = U.h('div', { style: 'position:absolute;left:1100px;top:222px;height:4px;width:420px;background:var(--rose);transform-origin:0 50%' });
      st.noMix = U.box(1112, 410, 'mono', X.noMix);
      st.noMix.style.fontSize = '13px';
      cam.append(st.strike, st.noMix);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.05);
      st.cap.update(lt, 0, 1.66);
      st.head.update(lt, 0.02, 1.66);

      const te = ui.enter(lt, -0.05, 0.4);
      st.term.el.style.opacity = te.o.toFixed(3);
      st.term.el.style.transform = `translate3d(0,${((1 - te.e) * 80).toFixed(1)}px,0)`;
      st.term.update(lt, [1.0, 1.36, 1.5, 1.62], 320);

      st.srcs.forEach((el, i) => ui.pop(el, lt, i === 0 ? 0 : 0.5 + (i - 1) * T.E8, { from: 0.5 }));
      st.strike.style.transform = `scaleX(${E.outExpo(U.prog(lt, 0.2, 0.4)).toFixed(4)})`;
      st.noMix.style.opacity = (0.8 * U.clamp((lt - 0.8) * 5)).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
