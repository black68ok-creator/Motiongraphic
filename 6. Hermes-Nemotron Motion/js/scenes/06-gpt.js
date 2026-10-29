/* 06 HELPER — "막히면 GPT한테, / 시키면 다 해줘."
   A chat window with any AI chatbot (the playbook tip, §6): the request bubble on b1, typing dots on b2,
   an answer with the exact commands from the docs on b3, a DONE tick on b4. Exit: slice glitch. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const PH = { x: 1180, y: 110, w: 600, h: 860 };

  SX.defineScene({
    id: 6,
    role: 'HELPER',
    bg: 'amber',
    ruler: () => ({ from: 0, to: 4, mark: 4 }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'TIP / ASK ANY AI CHATBOT · GPT ETC.' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 120, lines: ['막히면 GPT한테,', '시키면 다 해줘.'] });

      st.phone = SX.dev.phone(cam, PH);
      st.phone.el.style.color = C.ink;
      SX.dev.chatHead(st.phone.screen, 'AI CHATBOT', 'GPT · ANY ASSISTANT');
      const s = st.phone.screen;
      st.req = SX.dev.bubble(s, 'me', 150, D.helper.ask);
      st.req.style.maxWidth = '420px';
      st.dots = SX.dev.bubble(s, 'bot', 250, U.h('span', { class: 'm', text: '•••' }));
      const code = (t) => U.h('div', { class: 'm', style: 'margin-top:6px;color:var(--amber);font-size:15px;white-space:normal;word-break:break-all', text: t });
      st.ans = SX.dev.bubble(s, 'bot', 250, '이렇게 하세요:',
        code(`1) curl -fsSL …/hermes-agent/…/install.sh | bash`),
        code(`2) ${D.telegram.setup}  → Telegram`),
        code(`3) ${D.telegram.run}`),
        U.h('span', { class: 'tag', text: 'COMMANDS FROM HERMES DOCS' }));
      st.ans.style.maxWidth = '470px';
      st.done = ui.chip(cam, 120, 560, 'COPY · PASTE', 'DONE');
      st.note = U.box(124, 650, 'mono', '명령어는 실행 전에 한 번 읽어 보기');
      st.note.style.fontFamily = 'var(--f-display)';
      st.note.style.fontSize = '24px';
      st.note.style.letterSpacing = '0';
      cam.appendChild(st.note);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0, 1.66);
      st.head.update(lt, 0.02, 1.66);
      const pe = ui.enter(lt, -0.1, 0.45);
      st.phone.el.style.opacity = pe.o.toFixed(3);
      st.phone.el.style.transform = `translate3d(${((1 - pe.e) * 160).toFixed(1)}px,0,0)`;
      SX.dev.popBubble(st.req, lt, 0.0);
      SX.dev.popBubble(st.dots, lt, 0.5);
      if (lt >= 1.0) st.dots.style.opacity = 0;
      else st.dots.firstChild.style.opacity = (0.4 + 0.6 * U.pulse(lt, T.E16, 0.06)).toFixed(3);
      SX.dev.popBubble(st.ans, lt, 1.0);
      ui.pop(st.done, lt, 1.5, { from: 0.5 });
      st.note.style.opacity = (0.85 * U.clamp((lt - 1.6) * 6)).toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
