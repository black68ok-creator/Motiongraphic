/* 01 HOOK — "1993년, / 세 사람이"
   A pill cycles the chip lineage (§5) on 16th notes up to RUBIN while the headline year follows,
   then an RGB rewind glitch snaps everything back to 1993 (b2 end). On b3 three founder pixels
   drop in on a stagger; at the end they stretch into full-height strips that open scene 02. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;

  const CHIPS = D.transistors;
  const CYCLE_END = CHIPS.length * T.E16; // 0.875
  const SNAP = 1.0;
  const SQ = 120;
  const SQ_TOP = 720;
  const FX = [1110, 1350, 1590]; // founder square centers
  SX.L.founderX = FX;
  SX.L.founderBox = { top: SQ_TOP, size: SQ };
  SX.L.stretchAt = 1.66;

  function yearAt(lt) {
    if (lt < CYCLE_END) return CHIPS[Math.min(CHIPS.length - 1, Math.floor(Math.max(0, lt) / T.E16))].year;
    if (lt < SNAP) return Math.round(U.lerp(2026, 1993, E.inOutCubic(U.prog(lt, CYCLE_END, SNAP))));
    return 1993;
  }

  SX.defineScene({
    id: 1,
    role: 'HOOK',
    bg: 'dark',
    ruler: (lt) => {
      const y = yearAt(lt);
      return { from: 1993, to: y, mark: y };
    },

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, 1350, 560, C.volt, 0.12);

      st.cap = ui.caption(cam, { x: 120, y: 250, text: `EST. ${D.company.founded} / ${D.company.founders.length} FOUNDERS` });
      st.year = U.h('span', { text: '1999' });
      st.head = ui.headline(cam, {
        x: 120, y: 296, size: 176,
        lines: [[st.year, '년,'], '세 사람이'],
        lineDelay: [null, SNAP],
      });

      st.pillName = U.h('span', { class: 'pill-name' });
      st.pillIdx = U.h('span', { class: 'pill-idx' });
      st.pillDot = U.h('span', { class: 'pill-dot' });
      st.pill = U.h('div', { class: 'pill', style: 'left:1040px;top:330px;transform-origin:0 50%' }, st.pillDot, st.pillName, st.pillIdx);
      st.pillLbl = U.box(1044, 448, 'mono', 'GPU LINEAGE · 1999 → 2026');
      cam.append(st.pill, st.pillLbl);

      st.sq = FX.map((x, i) => {
        const el = U.h('div', { class: 'founder', style: `left:${x - SQ / 2}px;top:${SQ_TOP}px` });
        const lbl = U.box(x - 60, SQ_TOP + SQ + 22, 'mono founder-lbl', D.company.founders[i]);
        cam.append(el, lbl);
        return { el, lbl };
      });
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.06);
      st.cap.update(lt, 0, 1.6);

      // Headline year + glitch (RGB split + jitter) during the rewind
      U.setText(st.year, String(yearAt(lt)));
      const glitch = lt >= CYCLE_END && lt < SNAP;
      const step = Math.floor(lt / T.E32);
      const jx = glitch ? (U.hash(step, 11) - 0.5) * 34 : 0;
      const rgb = glitch ? `${(-6 - U.hash(step, 5) * 12).toFixed(1)}px 0 ${C.heat}, ${(6 + U.hash(step, 6) * 12).toFixed(1)}px 0 ${C.tensor}` : 'none';
      st.year.style.textShadow = rgb;
      st.head.update(lt, 0, 1.62);
      st.year.style.transform += ` translateX(${jx.toFixed(1)}px)`;

      // Pill: chip names on 16ths, then rewinds to the founding
      const k = Math.min(CHIPS.length - 1, Math.floor(Math.max(0, lt) / T.E16));
      if (lt < CYCLE_END) {
        U.setText(st.pillName, CHIPS[k].chip);
        U.setText(st.pillIdx, `${U.pad(k + 1)} / ${U.pad(CHIPS.length)}`);
      } else if (lt < SNAP) {
        U.setText(st.pillName, CHIPS[Math.floor(U.hash(step, 21) * CHIPS.length)].chip);
        U.setText(st.pillIdx, `${U.pad(Math.floor(U.hash(step, 22) * 7) + 1)} / ${U.pad(CHIPS.length)}`);
      } else {
        U.setText(st.pillName, 'FOUNDED');
        U.setText(st.pillIdx, `00 / ${U.pad(CHIPS.length)}`);
      }
      st.pillName.style.textShadow = rgb;
      const tick = lt < CYCLE_END ? U.pulse(lt, T.E16, 0.04) : 0;
      st.pillDot.style.background = lt >= SNAP ? 'transparent' : C.volt;
      st.pillDot.style.border = `2px solid ${C.volt}`;
      st.pillDot.style.transform = `scale(${(1 + 0.5 * tick).toFixed(3)})`;
      const pe = ui.enter(lt, -0.05, 0.4);
      const pOut = ui.exit(lt, 1.6, 0.22);
      st.pill.style.opacity = (pe.o * (1 - pOut)).toFixed(3);
      st.pill.style.transform = `translate3d(${(jx + pOut * 120).toFixed(1)}px,0,0) scale(${U.lerp(0.85, 1, pe.e).toFixed(4)})`;
      st.pillLbl.style.opacity = st.pill.style.opacity;

      // Founder pixels: drop on b3 (16th stagger), breathe on b4, stretch into strips at the end
      const s0 = SX.L.stretchAt;
      const sp = E.inOutCubic(U.prog(lt, s0, 1.88));
      st.sq.forEach((o, i) => {
        const t0 = SNAP + i * T.E16;
        if (lt < t0) {
          o.el.style.opacity = 0;
          o.lbl.style.opacity = 0;
          return;
        }
        const p = U.prog(lt, t0, t0 + 0.4);
        const y = (1 - E.spring(p, 7, 1.4)) * -360;
        const b = 1 + 0.06 * U.pulse(lt - 1.5, T.SPB, 0.12) * (lt >= 1.5 ? 1 : 0);
        const top = U.lerp(SQ_TOP + y, 0, sp);
        const h = U.lerp(SQ, T.H, sp);
        o.el.style.opacity = U.clamp(p * 6).toFixed(3);
        o.el.style.top = `${top.toFixed(1)}px`;
        o.el.style.height = `${h.toFixed(1)}px`;
        o.el.style.transform = sp > 0 ? 'none' : `scale(${b.toFixed(4)})`;
        o.el.style.background = ui.mix(C.volt, C.paper, sp);
        const lp = U.prog(lt, t0 + 0.1, t0 + 0.35);
        o.lbl.style.opacity = (U.clamp(lp * 3) * (1 - ui.exit(lt, s0, 0.15))).toFixed(3);
        o.lbl.style.transform = `translate3d(0,${((1 - E.outCubic(lp)) * 20).toFixed(1)}px,0)`;
      });
    },
  });
})((window.SX = window.SX || {}));
