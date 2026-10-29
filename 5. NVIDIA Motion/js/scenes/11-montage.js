/* 11 MONTAGE — numbers only. Eight hard cuts on 8th notes, 5-color rotation.
   Repeated data changes form: 480 (grid → "×480"), 336B (mosaic → big number + step row),
   $215.9B (headline → big number), 75.0% (chip → split bar), $89.0B (chip → big number).
   The last cut closes as an iris into the dark end card. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const F = D.fy2026;
  const K = D.q2fy27;

  const CUTS = [
    { bg: 'dark', big: `$${U.fmtFixed(F.netIncome, 1)}B`, size: 290, label: 'FY2026 NET INCOME · GAAP', yr: [2025, 2026] },
    { bg: 'volt', big: `×${D.ipo.sharesNow}`, size: 400, top: 236, label: `ONE IPO SHARE · ${D.ipo.splits.length - 1} SPLITS SINCE ${D.ipo.date.slice(0, 4)}`, yr: [1999, 2024] },
    { bg: 'tensor', big: `${D.cuda.developersM}M`, size: 400, top: 236, label: `CUDA DEVELOPERS · ${D.cuda.years} YEARS OF CUDA`, yr: [2006, 2026] },
    { bg: 'paper', big: `${U.fmtFixed(K.grossMarginPct, 1)}%`, size: 290, label: 'GROSS MARGIN · Q2 FY2027', kind: 'margin', yr: [2026, 2026] },
    { bg: 'heat', big: `$${U.fmtFixed(K.dataCenter, 1)}B`, size: 290, label: `DATA CENTER · Q2 FY2027 · +${K.dataCenterYoyPct}% YOY`, yr: [2026, 2026] },
    { bg: 'dark', big: ui.fmtCount(D.rubin.transistors), size: 290, label: `TRANSISTORS · ${D.rubin.name.split(' ').pop()} · ${D.rubin.process}`, kind: 'steps', yr: [1999, 2026] },
    { bg: 'volt', big: `$${U.fmtFixed(F.revenue, 1)}B`, size: 290, label: `FY2026 REVENUE · +${F.growthPct}% YOY`, yr: [2000, 2026] },
    { bg: 'tensor', big: `$${D.marketCap.milestones[4].t}T`, size: 400, top: 236, label: `FIRST COMPANY · ${D.marketCap.firstFiveT}`, yr: [2023, 2025] },
  ];
  const cutAt = (lt) => U.clamp(Math.floor(lt / T.E8), 0, CUTS.length - 1);

  function segBar(parent, x, y, w, segs, labels) {
    const bar = U.h('div', { class: 'segbar abs', style: `left:${x}px;top:${y}px;width:${w}px;transform-origin:0 50%` });
    segs.forEach(([frac, color]) => bar.appendChild(U.h('i', { style: `width:${(frac * 100).toFixed(2)}%;background:${color}` })));
    const lbl = U.h('div', { class: 'seglabels mono abs', style: `left:${x}px;top:${y + 44}px;width:${w}px` });
    labels.forEach((t) => lbl.appendChild(U.h('span', { text: t })));
    parent.append(bar, lbl);
    return { bar, lbl };
  }

  SX.defineScene({
    id: 11,
    role: 'MONTAGE',
    bg: 'dark',
    bgAt: (lt) => CUTS[cutAt(lt)].bg,
    ruler: (lt) => {
      const c = CUTS[cutAt(lt)];
      return { from: c.yr[0], to: c.yr[1], mark: c.yr[1] };
    },

    build(cam) {
      const st = { cuts: [] };
      CUTS.forEach((c, k) => {
        const el = U.h('div', { class: `cut bg-${c.bg}` });
        cam.appendChild(el);
        const o = { el, c };
        el.appendChild(U.box(120, 172, 'mono cut-idx', `${U.pad(k + 1)} / 08`));
        o.big = ui.counter(el, { x: 960, y: c.top ?? 300, size: c.size, align: 'center' });
        o.big.set(c.big);
        const ly = (c.top ?? 300) + c.size * 1.1 + 26;
        o.lbl = U.box(0, ly, 'mono cut-label', c.label);
        el.appendChild(o.lbl);
        if (c.kind === 'margin') {
          o.bars = segBar(el, 560, ly + 70, 800, [[K.grossMarginPct / 100, C.ink], [1 - K.grossMarginPct / 100, C.heat]],
            [`GROSS PROFIT ${U.fmtFixed(K.grossMarginPct, 1)}%`, `COST ${U.fmtFixed(100 - K.grossMarginPct, 1)}%`]);
        }
        if (c.kind === 'steps') {
          const row = U.svgFull();
          const S = D.transistors;
          const x0 = 960 - ((S.length - 1) * 120) / 2;
          o.ticks = S.map((s, i) => {
            const r = 6 + 22 * ((Math.log10(s.v) - 7) / 5);
            const g = U.s('g', { transform: `translate(${x0 + i * 120} ${ly + 110})` },
              U.s('circle', { r: r.toFixed(1), fill: i === S.length - 1 ? C.volt : 'none', stroke: i === S.length - 1 ? C.volt : C.paper, 'stroke-width': 2 }),
              U.s('text', { y: 54, 'text-anchor': 'middle', fill: C.paper, 'font-size': 13, style: 'font-family:var(--f-mono);letter-spacing:.08em', text: String(s.year) }));
            row.appendChild(g);
            return g;
          });
          el.appendChild(row);
        }
        st.cuts.push(o);
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
        const dx = -16 * (c / T.E8);
        o.big.el.style.transform = `translate3d(${dx.toFixed(1)}px,0,0) scale(${s.toFixed(4)})`;
        const wipe = E.outExpo(U.prog(c, 0.02, 0.15));
        o.lbl.style.clipPath = `inset(0 ${((1 - wipe) * 100).toFixed(1)}% 0 0)`;
        if (o.bars) {
          const g = E.outExpo(U.prog(c, 0.03, 0.18));
          o.bars.bar.style.transform = `scaleX(${g.toFixed(4)})`;
          o.bars.lbl.style.clipPath = `inset(0 ${((1 - wipe) * 100).toFixed(1)}% 0 0)`;
        }
        if (o.ticks) o.ticks.forEach((g, j) => g.setAttribute('opacity', c >= j * 0.012 ? 1 : 0));
      });
    },
  });
})((window.SX = window.SX || {}));
