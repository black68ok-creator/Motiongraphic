/* 10 AUTOMATION — "말로 맡긴 일이 / 알아서 돈다."
   Scheduled tasks (§5): an EXAMPLE request bubble on b1, it compiles to a cron expression on b2 while
   the dial's hands sweep to 08:00, four feature tags pop on 16ths on b3, and the delivered notice lands on b4. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const R = D.cron;

  const DIAL = { cx: 1520, cy: 520, r: 270 };

  SX.defineScene({
    id: 10,
    role: 'AUTOMATION',
    bg: 'amber',
    ruler: (lt) => ({ from: 0, to: 6, mark: U.lerp(5, 6, E.outCubic(U.prog(lt, 0, 0.4))) }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'STEP 06 / SCHEDULED TASKS · CRON' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['말로 맡긴 일이', '알아서 돈다.'] });

      st.req = U.h('div', { class: 'bubble me', style: 'left:120px;right:auto;top:540px;max-width:640px;font-size:26px;transform-origin:0 100%' },
        R.exampleText, U.h('span', { class: 'tag', text: 'EXAMPLE REQUEST · TELEGRAM' }));
      st.arrow = U.box(130, 668, 'mono', '↓ COMPILES TO');
      st.expr = U.h('div', { class: 'tagchip', style: 'left:120px;top:704px;font-size:34px;padding:12px 22px;transform-origin:0 50%', text: R.exampleExpr });
      cam.append(st.req, st.arrow, st.expr);
      st.tags = R.features.map((f, i) => {
        const el = U.h('div', { class: 'chip', style: `left:${120 + (i % 2) * 430}px;top:${806 + Math.floor(i / 2) * 64}px;font-size:16px;padding:8px 12px 7px;transform-origin:0 50%`, text: f });
        cam.appendChild(el);
        return el;
      });

      const svg = U.svgFull();
      st.dial = U.s('g');
      st.dial.appendChild(U.s('circle', { cx: DIAL.cx, cy: DIAL.cy, r: DIAL.r, fill: C.paper, stroke: C.ink, 'stroke-width': 5 }));
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const big = i % 5 === 0;
        st.dial.appendChild(U.s('line', {
          x1: DIAL.cx + (DIAL.r - 14) * Math.sin(a), y1: DIAL.cy - (DIAL.r - 14) * Math.cos(a),
          x2: DIAL.cx + (DIAL.r - (big ? 40 : 24)) * Math.sin(a), y2: DIAL.cy - (DIAL.r - (big ? 40 : 24)) * Math.cos(a),
          stroke: C.ink, 'stroke-width': big ? 5 : 2,
        }));
      }
      st.hour = U.s('line', { x1: DIAL.cx, y1: DIAL.cy, x2: DIAL.cx, y2: DIAL.cy - DIAL.r * 0.5, stroke: C.ink, 'stroke-width': 14, 'stroke-linecap': 'round' });
      st.min = U.s('line', { x1: DIAL.cx, y1: DIAL.cy, x2: DIAL.cx, y2: DIAL.cy - DIAL.r * 0.78, stroke: C.rose, 'stroke-width': 7, 'stroke-linecap': 'round' });
      st.dial.append(st.hour, st.min, U.s('circle', { cx: DIAL.cx, cy: DIAL.cy, r: 16, fill: C.ink }));
      svg.appendChild(st.dial);
      cam.appendChild(svg);
      st.time = ui.counter(cam, { x: DIAL.cx, y: DIAL.cy + 92, size: 54, align: 'center' });

      st.done = U.h('div', { class: 'bubble bot', style: `left:${DIAL.cx - 250}px;top:${DIAL.cy + DIAL.r + 30}px;max-width:500px;font-size:22px;transform-origin:0 0`, text: '08:00 · 브리핑 전송 완료' });
      st.done.appendChild(U.h('span', { class: 'tag', text: 'EXAMPLE · DELIVERED TO TELEGRAM' }));
      cam.appendChild(st.done);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);
      SX.dev.popBubble(st.req, lt, 0.0);
      st.req.style.transformOrigin = '0 100%';
      st.arrow.style.opacity = U.clamp((lt - 0.45) * 6).toFixed(3);
      ui.pop(st.expr, lt, 0.5, { from: 0.4 });
      st.tags.forEach((el, i) => ui.pop(el, lt, 1.0 + i * T.E16, { from: 0.4 }));

      // Dial: 00:00 → 08:00 over b2, then the minute hand idles a little
      const de = ui.enter(lt, -0.1, 0.45);
      st.dial.setAttribute('opacity', de.o.toFixed(3));
      st.dial.setAttribute('transform', `translate(${DIAL.cx} ${DIAL.cy}) scale(${U.lerp(0.7, 1, de.e).toFixed(4)}) translate(${-DIAL.cx} ${-DIAL.cy})`);
      const h = 8 * E.inOutCubic(U.prog(lt, 0.5, 1.0));
      st.hour.setAttribute('transform', `rotate(${(h * 30).toFixed(2)} ${DIAL.cx} ${DIAL.cy})`);
      st.min.setAttribute('transform', `rotate(${(h * 360 + (lt > 1 ? (lt - 1) * 6 : 0)).toFixed(2)} ${DIAL.cx} ${DIAL.cy})`);
      st.time.set(`${U.pad(Math.floor(h))}:${U.pad(Math.floor((h % 1) * 60))}`);
      st.time.el.style.opacity = de.o.toFixed(3);

      const dp = U.prog(lt, 1.5, 1.8);
      st.done.style.opacity = lt < 1.5 ? 0 : U.clamp(dp * 5).toFixed(3);
      st.done.style.transform = `scale(${lt < 1.5 ? 0 : E.outBack(dp, 2).toFixed(4)})`;
    },
  });
})((window.SX = window.SX || {}));
