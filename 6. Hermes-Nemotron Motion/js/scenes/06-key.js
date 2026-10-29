/* 06 KEY — "NVIDIA 키 하나로 / 네모트론을 연결하면,"
   Two file mock-ups (§3): a key card slides into ~/.hermes/.env on b1 (masked key types),
   config.yaml fills provider + model on b2–b3, and on b4 a wire runs to the OpenAI-compatible endpoint.
   Exit: slice glitch (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.model;
  const K = D.connect;

  const ENV = { x: 120, y: 540, w: 760 };
  const CFG = { x: 940, y: 540, w: 860 };

  SX.defineScene({
    id: 6,
    role: 'CONNECT',
    bg: 'paper',
    ruler: (lt) => ({ from: 0, to: 3, mark: U.lerp(2, 3, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.grid = U.h('div', { class: 'blueprint' });
      cam.appendChild(st.grid);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `STEP 03 / ${M.keyPage.toUpperCase()}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 112, lines: ['NVIDIA 키 하나로', '네모트론을 연결하면,'] });

      st.env = SX.dev.term(cam, {
        x: ENV.x, y: ENV.y, w: ENV.w, light: true, title: '~/.hermes/.env', size: 21,
        lines: [[['k', K.envKey], [null, '='], [null, `${K.keyPrefix}••••••••••••`]], [['dim', '# free key · build.nvidia.com']]],
      });
      st.cfg = SX.dev.term(cam, {
        x: CFG.x, y: CFG.y, w: CFG.w, light: true, title: '~/.hermes/config.yaml', size: 21,
        lines: [[['k', 'provider: '], [null, `"${K.provider}"`]], [['k', 'model: '], [null, `"${M.id}"`]]],
      });

      // key card
      st.key = U.h('div', { class: 'tagchip', style: `left:${ENV.x}px;top:${ENV.y - 90}px`, text: `KEY ▸ ${K.keyPrefix}…` });
      cam.appendChild(st.key);

      const svg = U.svgFull();
      st.wire = U.s('path', { d: `M${CFG.x + CFG.w / 2} ${CFG.y + 150} V860 H${960}`, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '6 8' });
      st.wireLen = 140 + 410;
      svg.appendChild(st.wire);
      cam.appendChild(svg);
      st.ep = U.h('div', { class: 'badge', style: 'left:520px;top:838px;font-size:19px;transform-origin:50% 50%', text: `→ ${M.endpoint} · OPENAI-COMPATIBLE` });
      cam.appendChild(st.ep);
      return st;
    },

    update(st, lt) {
      st.grid.style.transform = `translate3d(${(-lt * 10).toFixed(1)}px,${(lt * 5).toFixed(1)}px,0)`;
      st.cap.update(lt, 0, 1.64);
      st.head.update(lt, 0.02, 1.64);

      const ee = ui.enter(lt, -0.05, 0.4);
      const ce = ui.enter(lt, 0.4, 0.4);
      st.env.el.style.opacity = ee.o.toFixed(3);
      st.env.el.style.transform = `translate3d(0,${((1 - ee.e) * 60).toFixed(1)}px,0)`;
      st.cfg.el.style.opacity = ce.o.toFixed(3);
      st.cfg.el.style.transform = `translate3d(0,${((1 - ce.e) * 60).toFixed(1)}px,0)`;
      st.env.update(lt, [0.3, 0.42], 120);
      st.cfg.update(lt, [0.6, 1.0], 120);

      // key card drops into the .env line
      const kp = E.inOutCubic(U.prog(lt, 0.05, 0.3));
      const kOut = U.prog(lt, 0.3, 0.4);
      st.key.style.opacity = (U.clamp(lt * 8) * (1 - kOut)).toFixed(3);
      st.key.style.transform = `translate3d(${(kp * 40).toFixed(1)}px,${(kp * 140).toFixed(1)}px,0) rotate(${((1 - kp) * -12).toFixed(2)}deg)`;

      const wp = E.outCubic(U.prog(lt, 1.5, 1.7));
      st.wire.setAttribute('stroke-dashoffset', (-lt * 40).toFixed(1));
      st.wire.style.clipPath = `inset(0 0 ${((1 - wp) * 100).toFixed(1)}% 0)`;
      st.wire.setAttribute('opacity', wp > 0 ? 1 : 0);
      ui.pop(st.ep, lt, 1.62, { from: 0.6 });
    },
  });
})((window.SX = window.SX || {}));
