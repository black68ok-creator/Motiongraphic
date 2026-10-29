/* 11 MONTAGE — numbers only. Eight hard cuts on 8th notes, 5-color rotation.
   Repeated data changes form: 550B (phone counter → big), 55B (lit grid → big), 1M (bar → big),
   ~40 RPM (gauge → big), 6 (checklist → big), 4× B200 (boards → big).
   The last cut closes as an iris into the dark end card. */
(function (SX) {
  'use strict';
  const { U, E, T, ui } = SX;
  const D = SX.DATA;
  const M = D.model;

  const CUTS = [
    { bg: 'dark', big: `${M.totalB}B`, label: `TOTAL PARAMETERS · ${M.name}` },
    { bg: 'amber', big: `${M.activeB}B`, label: 'ACTIVE · MIXTURE OF EXPERTS' },
    { bg: 'sky', big: `${M.contextM}M`, label: 'TOKENS OF CONTEXT' },
    { bg: 'paper', big: `~${M.rpm}`, label: 'REQUESTS / MIN · FREE TIER · 3RD-PARTY' },
    { bg: 'rose', big: String(D.termux.bundle.length), label: 'FEATURES IN THE [termux] BUNDLE' },
    { bg: 'dark', big: `${M.selfHost.b200}× B200`, size: 260, label: 'TO SELF-HOST · REPORTED · 3RD-PARTY' },
    { bg: 'amber', big: '$0', label: `API KEY · ${M.keyPage.toUpperCase()}` },
    { bg: 'sky', big: M.released, size: 220, top: 330, label: `${M.name} RELEASED` },
  ];
  const cutAt = (lt) => U.clamp(Math.floor(lt / T.E8), 0, CUTS.length - 1);
  const STEP_OF = [0, 0, 0, 0, 2, 0, 3, 0];

  SX.defineScene({
    id: 11,
    role: 'MONTAGE',
    bg: 'dark',
    bgAt: (lt) => CUTS[cutAt(lt)].bg,
    ruler: (lt) => ({ from: 0, to: 6, mark: STEP_OF[cutAt(lt)] }),

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
