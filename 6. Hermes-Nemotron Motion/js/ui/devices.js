/* Generic device mock-ups shared by several scenes: phone with chat, terminal / file window,
   typed lines. No product logos — names appear only as plain text in our own fonts. */
(function (SX) {
  'use strict';
  const { U, T } = SX;

  const dev = {};

  /** Portrait phone frame; returns { el, screen } — screen is a positioned box for chat content */
  dev.phone = (parent, o) => {
    const screen = U.h('div', { class: 'phone-screen' }, U.h('div', { class: 'phone-notch' }));
    const el = U.h('div', { class: 'phone', style: `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px` }, screen);
    parent.appendChild(el);
    return { el, screen, inner: { x: o.x + 19, y: o.y + 19, w: o.w - 38, h: o.h - 38 } };
  };

  /** Chat header inside a phone screen */
  dev.chatHead = (screen, name, sub) => {
    const el = U.h('div', { class: 'chat-head' }, U.h('i'), U.h('div', {}, name, U.h('small', { text: sub })));
    screen.appendChild(el);
    return el;
  };

  /** Chat bubble (side: 'me' | 'bot'); html parts as array of strings / nodes */
  dev.bubble = (screen, side, y, ...kids) => {
    const el = U.h('div', { class: `bubble ${side}`, style: `top:${y}px` }, ...kids);
    screen.appendChild(el);
    return el;
  };

  /** Bubble pop: spring scale from the tail corner */
  dev.popBubble = (el, lt, t0) => {
    const p = U.prog(lt, t0, t0 + 0.3);
    const s = lt < t0 ? 0 : SX.E.outBack(p, 2.2);
    el.style.opacity = lt < t0 ? 0 : U.clamp(p * 5).toFixed(3);
    el.style.transformOrigin = el.classList.contains('me') ? '100% 100%' : '0 100%';
    el.style.transform = `scale(${s.toFixed(4)})`;
  };

  /**
   * Terminal / file window. lines: array of arrays of [cls, text] parts (cls null = plain).
   * update(lt, t0, cps) types the lines in order; returns the index of the line being typed.
   */
  dev.term = (parent, o) => {
    const body = U.h('div', { class: 'term-body' });
    const el = U.h('div', { class: `term ${o.light ? 'light' : ''}`, style: `left:${o.x}px;top:${o.y}px;width:${o.w}px${o.h ? `;height:${o.h}px` : ''}` },
      U.h('div', { class: 'term-bar' }, U.h('i'), U.h('i'), U.h('i'), U.h('span', { text: o.title })),
      body);
    if (o.size) body.style.fontSize = `${o.size}px`;
    parent.appendChild(el);
    const lines = o.lines.map(() => {
      const ln = U.h('div');
      body.appendChild(ln);
      return ln;
    });
    const lens = o.lines.map((ln) => ln.reduce((n, p) => n + p[1].length, 0));
    const cursor = U.h('span', { class: 'cur' });
    return {
      el,
      /** starts[i] = time line i begins typing; cps = characters per second (Infinity = instant) */
      update(lt, starts, cps = 220) {
        let cur = -1;
        o.lines.forEach((parts, i) => {
          const n = lt < starts[i] ? 0 : cps === Infinity ? lens[i] : Math.min(lens[i], Math.floor((lt - starts[i]) * cps));
          const key = `${n}`;
          if (lines[i]._k !== key) {
            lines[i]._k = key;
            lines[i].textContent = '';
            let left = n;
            parts.forEach(([cls, txt]) => {
              const part = txt.slice(0, Math.max(0, left));
              left -= txt.length;
              if (part) lines[i].appendChild(cls ? U.h('span', { class: cls, text: part }) : document.createTextNode(part));
            });
            if (!n) lines[i].appendChild(document.createTextNode(' '));
          }
          if (lt >= starts[i]) cur = i;
        });
        if (cur >= 0) lines[cur].appendChild(cursor);
        cursor.style.opacity = Math.floor(lt / T.E8) % 2 === 0 ? 1 : 0;
        return cur;
      },
    };
  };

  SX.dev = dev;
})((window.SX = window.SX || {}));
