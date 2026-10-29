/* 05 TELEGRAM — "텔레그램을 / 연동하고,"
   A generic chat mock-up (§4): /newbot on b1, the bot token comes back on b2, the numeric user ID on b3,
   and the two .env variables with the deny-by-default allowlist land on b4 (8th-note bubbles). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const G = D.telegram;

  const PH = { x: 1260, y: 120, w: 450, h: 840 };

  SX.defineScene({
    id: 5,
    role: 'TELEGRAM',
    bg: 'paper',
    ruler: (lt) => ({ from: 0, to: 4, mark: U.lerp(3, 4, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `STEP 04 / TELEGRAM · ${G.botFather}` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['텔레그램을', '연동하고,'] });

      st.phone = SX.dev.phone(cam, PH);
      st.phone.el.style.color = C.ink;
      SX.L.burstAt = { x: PH.x + PH.w / 2, y: PH.y + PH.h / 2 };
      SX.dev.chatHead(st.phone.screen, G.botFather, 'bot');
      const B = SX.dev.bubble;
      const s = st.phone.screen;
      st.bubbles = [
        { t: 0.0, el: B(s, 'me', 150, U.h('span', { class: 'm', text: G.newbot })) },
        { t: 0.25, el: B(s, 'bot', 214, '이름과 ', U.h('span', { class: 'm', text: 'bot' }), '으로 끝나는 사용자명을 정하세요') },
        { t: 0.5, el: B(s, 'bot', 336, '토큰: ', U.h('span', { class: 'm', text: '123456:ABC-•••' }), U.h('span', { class: 'tag', text: 'BOT TOKEN · KEEP SECRET' })) },
        { t: 1.0, el: B(s, 'me', 470, U.h('span', { class: 'm', text: G.idBot })) },
        { t: 1.25, el: B(s, 'bot', 534, 'Id: ', U.h('span', { class: 'm', text: '••••••••' }), U.h('span', { class: 'tag', text: 'NUMERIC USER ID' })) },
      ];

      st.vars = [
        ui.chip(cam, 120, 560, G.tokenVar, '✓'),
        ui.chip(cam, 120, 640, G.allowVar, '✓'),
      ];
      st.lock = U.h('div', { class: 'badge', style: 'left:120px;top:740px;font-size:18px;transform-origin:0 50%', text: 'NO ALLOWLIST → DENY ALL (DEFAULT)' });
      st.revoke = U.box(124, 800, 'mono', `TOKEN LEAKED?  ${G.revoke} IN ${G.botFather}`);
      cam.append(st.lock, st.revoke);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      const pe = ui.enter(lt, -0.1, 0.45);
      st.phone.el.style.opacity = pe.o.toFixed(3);
      st.phone.el.style.transform = `translate3d(${((1 - pe.e) * 160).toFixed(1)}px,0,0) rotate(${(1.2 * Math.sin(lt * 1.6)).toFixed(2)}deg)`;
      st.bubbles.forEach((b) => SX.dev.popBubble(b.el, lt, b.t));

      st.vars.forEach((el, i) => {
        const t0 = 1.5 + i * T.E16;
        const p = U.prog(lt, t0, t0 + 0.25);
        el.style.opacity = lt < t0 ? 0 : U.clamp(p * 5).toFixed(3);
        el.style.transform = `translate3d(${((1 - E.outBack(p, 2)) * -60).toFixed(1)}px,0,0)`;
      });
      ui.pop(st.lock, lt, 1.62, { from: 0.6 });
      st.revoke.style.opacity = (0.8 * U.clamp((lt - 1.7) * 6)).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
