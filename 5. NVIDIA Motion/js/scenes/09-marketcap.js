/* 09 VALUE — "세계 최초 / 시총 5조 달러,"
   Market-cap milestones (§7) as $1T blocks slamming onto a tower on 8th notes ($1T…$4T over b1–b2),
   $5T lands on b3 with the WORLD FIRST stamp, the 29-month bracket and today's ~$5.2T line draw on b4.
   Exit: ring burst from the top block (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.marketCap;

  const TX = 1110;
  const TW = 380;
  const BH = 116;
  const GAP = 8;
  const BASE = 900;
  const AT = [0, 0.25, 0.5, 0.75, 1.0];
  const yTop = (k) => BASE - (k + 1) * (BH + GAP) + GAP; // top edge of block k
  SX.L.topBlock = { x: TX + TW / 2, y: yTop(4) + BH / 2 };

  SX.defineScene({
    id: 9,
    role: 'VALUE',
    bg: 'volt',
    ruler: (lt) => {
      let k = 0;
      AT.forEach((a, i) => {
        if (lt >= a) k = i;
      });
      return { from: M.milestones[0].year, to: M.milestones[k].year, mark: M.milestones[k].year, label: M.milestones[k].date };
    },

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'MARKET CAP / MILESTONES' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: ['세계 최초', '시총 5조 달러,'] });

      const svg = U.svgFull();
      svg.appendChild(U.s('line', { x1: TX - 60, y1: BASE + 10, x2: TX + TW + 60, y2: BASE + 10, stroke: C.ink, 'stroke-width': 3 }));
      st.blocks = M.milestones.map((m, k) => {
        const last = k === M.milestones.length - 1;
        const g = U.s('g', {},
          U.s('rect', { x: 0, y: 0, width: TW, height: BH, fill: last ? C.tensor : C.ink }),
          U.s('text', { x: 24, y: BH / 2 + 26, fill: last ? C.paper : C.volt, 'font-size': 72, style: 'font-family:var(--f-display);font-weight:900;letter-spacing:-.02em', text: `$${m.t}T` }),
          U.s('text', { x: TW - 22, y: BH / 2 + 7, 'text-anchor': 'end', fill: C.paper, 'font-size': 20, style: 'font-family:var(--f-mono);letter-spacing:.14em', text: m.date }));
        svg.appendChild(g);
        return g;
      });
      // 29-month bracket
      const bx = TX + TW + 34;
      const y0 = yTop(0) + BH / 2;
      const y1 = yTop(4) + BH / 2;
      st.bracket = U.s('path', { d: `M${bx - 14} ${y0} H${bx} V${y1} H${bx - 14}`, fill: 'none', stroke: C.ink, 'stroke-width': 3 });
      st.bLen = 28 + (y0 - y1);
      st.bracket.setAttribute('stroke-dasharray', `${st.bLen} ${st.bLen}`);
      st.bLbl = U.s('text', { x: bx + 18, y: (y0 + y1) / 2 + 12, fill: C.ink, 'font-size': 38, style: 'font-family:var(--f-display);font-weight:900', text: `${M.months1to5} MONTHS` });
      st.bSub = U.s('text', { x: bx + 20, y: (y0 + y1) / 2 + 44, fill: C.ink, 'font-size': 14, style: 'font-family:var(--f-mono);letter-spacing:.14em', text: `$1T → $5T` });
      // today's line
      const ny = BASE - M.nowT * (BH + GAP) + GAP;
      st.now = U.s('g', {},
        U.s('line', { x1: TX - 60, y1: ny, x2: TX + TW + 20, y2: ny, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 6' }),
        U.s('text', { x: TX - 60, y: ny - 12, fill: C.ink, 'font-size': 15, style: 'font-family:var(--f-mono);letter-spacing:.14em', text: `NOW ${M.nowApprox ? '~' : ''}$${M.nowT}T · ${M.nowDate}` }));
      svg.append(st.bracket, st.bLbl, st.bSub, st.now);
      cam.appendChild(svg);

      st.stamp = ui.stamp(cam, { x: 1620, y: 250, main: 'WORLD FIRST', sub: `$5T · ${M.firstFiveT}`, rot: 7, color: C.ink });
      st.note = U.box(126, 540, 'mono', `FIRST TO $4T · ${M.milestones[3].date}`);
      st.note2 = U.box(126, 578, 'mono', `FIRST TO $5T · ${M.firstFiveT}`);
      cam.append(st.note, st.note2);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      st.blocks.forEach((g, k) => {
        const t0 = AT[k] - T.LEAD;
        const fall = E.inCubic(U.prog(lt, t0, AT[k]));
        const land = lt >= AT[k] ? U.prog(lt, AT[k], AT[k] + 0.18) : 0;
        const squash = lt >= AT[k] ? 1 - 0.12 * Math.sin(land * Math.PI) : 1;
        const y = U.lerp(-200, yTop(k), fall);
        const shake = lt >= AT[k] && lt < AT[k] + 0.08 ? (U.hash(Math.floor(lt * 120), k) - 0.5) * 8 : 0;
        g.setAttribute('opacity', lt < t0 ? 0 : 1);
        g.setAttribute('transform', `translate(${(TX + shake).toFixed(1)} ${y.toFixed(1)}) translate(${TW / 2} ${BH}) scale(${(1 + (1 - squash) * 0.5).toFixed(4)} ${squash.toFixed(4)}) translate(${-TW / 2} ${-BH})`);
      });

      st.stamp.update(lt, 1.0);
      const bp = E.outCubic(U.prog(lt, 1.5, 1.75));
      st.bracket.setAttribute('stroke-dashoffset', ((1 - bp) * st.bLen).toFixed(1));
      const lp = U.prog(lt, 1.58, 1.8);
      st.bLbl.setAttribute('opacity', U.clamp(lp * 4).toFixed(3));
      st.bSub.setAttribute('opacity', U.clamp(lp * 4).toFixed(3));
      const np = U.prog(lt, 1.5, 1.68);
      st.now.setAttribute('opacity', U.clamp(np * 4).toFixed(3));
      st.now.style.clipPath = `inset(0 ${((1 - E.outExpo(np)) * 100).toFixed(1)}% 0 0)`;

      [st.note, st.note2].forEach((el, i) => {
        const p = U.prog(lt, 0.75 + i * 0.25, 0.95 + i * 0.25);
        el.style.clipPath = `inset(0 ${((1 - E.outExpo(p)) * 100).toFixed(1)}% 0 0)`;
      });
    },
  });
})((window.SX = window.SX || {}));
