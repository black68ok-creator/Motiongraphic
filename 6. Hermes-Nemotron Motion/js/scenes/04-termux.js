/* 04 TERMUX — "휴대폰에 / Termux를 열고,"
   A Termux session (§2): the one-line installer types on b1, the Termux-detect note prints on b2,
   `hermes doctor` on b3 and `pkg install ripgrep nodejs` on b4. Exit: RGB aberration. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const X = D.termux;

  SX.defineScene({
    id: 4,
    role: 'TERMUX',
    bg: 'dark',
    ruler: (lt) => ({ from: 0, to: 1, mark: U.lerp(0, 1, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, 960, 760, C.amber, 0.1);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'STEP 01 / TERMUX · ONE-LINE INSTALL' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['휴대폰에', 'Termux를 열고,'] });

      st.term = SX.dev.term(cam, {
        x: 120, y: 540, w: 1680, title: 'termux · ~', size: 20,
        lines: [
          [['p', '~ $ '], [null, X.installer]],
          [['dim', '    # Termux detected → tested Android flow · extra [termux]']],
          [['p', '~ $ '], [null, X.doctor]],
          [['p', '~ $ '], [null, X.tools]],
          [['dim', '    # if jiter / maturin fails:  '], ['k', X.apiLevel]],
        ],
      });

      st.mini = SX.dev.phone(cam, { x: 1540, y: 150, w: 190, h: 350 });
      st.miniTxt = U.h('div', { class: 'mono', style: 'position:absolute;left:18px;top:60px;color:var(--amber);font-size:15px;letter-spacing:.08em' });
      st.mini.screen.appendChild(st.miniTxt);
      st.chip = ui.chip(cam, 1100, 300, 'APP', 'TERMUX');
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.05);
      st.cap.update(lt, 0, 1.66);
      st.head.update(lt, 0.02, 1.66);

      const te = ui.enter(lt, -0.05, 0.4);
      st.term.el.style.opacity = te.o.toFixed(3);
      st.term.el.style.transform = `translate3d(0,${((1 - te.e) * 80).toFixed(1)}px,0)`;
      st.term.update(lt, [0.02, 0.5, 1.0, 1.5, 1.62], 300);

      const pe = ui.enter(lt, 0.05, 0.45);
      st.mini.el.style.opacity = pe.o.toFixed(3);
      st.mini.el.style.transform = `translate3d(0,${((1 - pe.e) * 60).toFixed(1)}px,0) rotate(${(6 * (1 - pe.e) + 1.5 * Math.sin(lt * 2)).toFixed(2)}deg)`;
      U.setText(st.miniTxt, `$ ${Math.floor(lt / T.E8) % 2 ? '▌' : ' '}`);
      ui.pop(st.chip, lt, 0.1, { from: 0.5 });
    },
  });
})((window.SX = window.SX || {}));
