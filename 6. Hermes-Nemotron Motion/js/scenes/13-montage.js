/* 13 MONTAGE — "막 시켜". Eight hard cuts on 8th notes, 5-color rotation: the playbook's use cases
   (auto-trading with its risk label, YouTube, Threads, a book), then the model, the price and the question.
   The last cut closes as an iris into the dark end card. */
(function (SX) {
  'use strict';
  const { U, E, T, ui } = SX;
  const D = SX.DATA;
  const M = D.model;

  const TK = D.tasks;
  const CUTS = [
    { bg: 'dark', big: TK[0].k, size: 280, top: 300, label: TK[0].label, risk: true },
    { bg: 'amber', big: TK[1].k, size: 300, top: 290, label: TK[1].label },
    { bg: 'sky', big: TK[2].k, size: 300, top: 290, label: TK[2].label },
    { bg: 'paper', big: TK[3].k, size: 300, top: 290, label: TK[3].label },
    { bg: 'rose', big: '막 시켜', size: 300, top: 290, label: 'ANYTHING · ONE MESSAGE ON TELEGRAM' },
    { bg: 'dark', big: `${M.totalB}B`, label: `${M.name} · ${M.activeB}B ACTIVE` },
    { bg: 'amber', big: '$0', label: `FREE ENDPOINT · ~${M.rpm} RPM (3RD-PARTY)` },
    { bg: 'sky', big: '경제적 자유?', size: 220, top: 330, label: 'WHAT WILL YOU AUTOMATE?' },
  ];
  const cutAt = (lt) => U.clamp(Math.floor(lt / T.E8), 0, CUTS.length - 1);

  SX.defineScene({
    id: 13,
    role: 'MONTAGE',
    bg: 'dark',
    bgAt: (lt) => CUTS[cutAt(lt)].bg,
    ruler: () => ({ from: 0, to: 8, mark: 8 }),

    build(cam) {
      const st = { cuts: [] };
      CUTS.forEach((c, k) => {
        const el = U.h('div', { class: `cut bg-${c.bg}` });
        cam.appendChild(el);
        el.appendChild(U.box(120, 172, 'mono cut-idx', `${U.pad(k + 1)} / 08`));
        const size = c.size || 400;
        const top = c.top ?? 236;
        const big = ui.counter(el, { x: 960, y: top, size, align: 'center' });
        big.set(c.big);
        const lbl = U.box(0, top + size * 1.1 + 26, 'mono cut-label', c.label);
        el.appendChild(lbl);
        if (c.risk) {
          const w = U.h('div', { class: 'badge', style: `left:${960 - 260}px;top:${top + size * 1.1 + 80}px;width:520px;text-align:center;box-sizing:border-box;background:var(--rose);color:var(--ink)`, text: 'RISK OF LOSS · PAPER-TRADE FIRST' });
          w.style.position = 'absolute';
          el.appendChild(w);
        }
        st.cuts.push({ el, big, lbl });
      });
      return st;
    },

    update(st, lt) {
      const k = cutAt(lt);
      st.cuts.forEach((o, i) => {
        o.el.style.display = i === k ? '' : 'none';
        if (i !== k) return;
        const c = lt - i * T.E8;
        const s = U.lerp(1.14, 1, E.outExpo(U.prog(c, 0, 0.2)));
        o.big.el.style.transform = `translate3d(${(-16 * (c / T.E8)).toFixed(1)}px,0,0) scale(${s.toFixed(4)})`;
        o.lbl.style.clipPath = `inset(0 ${((1 - E.outExpo(U.prog(c, 0.02, 0.15))) * 100).toFixed(1)}% 0 0)`;
      });
    },
  });
})((window.SX = window.SX || {}));
