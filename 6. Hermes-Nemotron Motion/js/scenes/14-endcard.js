/* 14 END CARD — "뭘로 경제적 자유를 / 만들지 고민해." (6 beats)
   b1 the phone slides in · b2 an EXAMPLE request · b3 typing dots → reply · b4 the risk line ·
   b5 title + data date with the final hit · b6 micro-motion only. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.model;

  const PH = { x: 1300, y: 110, w: 440, h: 860 };

  SX.defineScene({
    id: 14,
    role: 'END CARD',
    bg: 'dark',
    ruler: (lt) => ({ from: 0, to: U.lerp(0, 8, E.outCubic(U.prog(lt, 0, 2.0))), mark: U.lerp(0, 8, E.outCubic(U.prog(lt, 0, 2.0))) }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, PH.x + PH.w / 2, PH.y + PH.h / 2, C.amber, 0.16);
      st.phone = SX.dev.phone(cam, PH);
      SX.dev.chatHead(st.phone.screen, 'MY HERMES BOT', `${M.name} · VIA NVIDIA BUILD`);
      const s = st.phone.screen;
      st.req = SX.dev.bubble(s, 'me', 150, '자동 매매 봇 만들어줘', U.h('span', { class: 'tag', text: 'EXAMPLE' }));
      st.dots = SX.dev.bubble(s, 'bot', 270, U.h('span', { class: 'm', text: '•••' }));
      st.reply = SX.dev.bubble(s, 'bot', 270, '좋아요. 실전 전에 모의투자로 먼저 검증할게요.', U.h('span', { class: 'tag', text: 'EXAMPLE · PAPER TRADING FIRST' }));

      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'NOW / YOUR MOVE' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 112, lines: ['뭘로 경제적 자유를', '만들지 고민해.'] });
      st.sub = ui.headline(cam, { x: 122, y: 560, size: 32, stagger: 0.012, lines: [D.disclaimer] });
      st.sub.el.classList.add('subcopy');
      st.title = ui.headline(cam, { x: 116, y: 680, size: 96, stagger: 0.028, lines: ['HERMES × NEMOTRON'] });
      st.title.el.classList.add('title');
      st.title2 = U.box(122, 800, 'mono', 'ANDROID · TERMUX · HERMES · TELEGRAM · NVIDIA BUILD (FREE)');
      st.title2.style.fontSize = '20px';
      cam.appendChild(st.title2);
      st.date = ui.caption(cam, { x: 122, y: 880, text: `DATA AS OF ${D.asOf}` });
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.05);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      st.sub.update(lt, 1.5);
      st.title.update(lt, 2.0);
      st.title2.style.opacity = U.clamp((lt - 2.1) * 6).toFixed(3);
      st.date.update(lt, 2.12);

      const pe = ui.enter(lt, -0.05, 0.5);
      st.phone.el.style.opacity = pe.o.toFixed(3);
      st.phone.el.style.transform = `translate3d(0,${((1 - pe.e) * 200).toFixed(1)}px,0) rotate(${((1 - pe.e) * 8 + 0.8 * Math.sin(lt * 1.4)).toFixed(2)}deg)`;
      SX.dev.popBubble(st.req, lt, 0.5);
      SX.dev.popBubble(st.dots, lt, 1.0);
      if (lt >= 1.35) st.dots.style.opacity = 0;
      else st.dots.firstChild.style.opacity = (0.4 + 0.6 * U.pulse(lt, T.E16, 0.06)).toFixed(3);
      SX.dev.popBubble(st.reply, lt, 1.35);
    },
  });
})((window.SX = window.SX || {}));
