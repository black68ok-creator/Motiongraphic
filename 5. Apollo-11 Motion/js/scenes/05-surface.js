/* 05 SURFACE — "21시간 36분을 / 머문 뒤,"
   A 24-hour dial sweeps to 21:36 over b1–b2 (hand + ring + HH:MM counter);
   EVA and sample chips pop on b3 / its 8th; b4 holds. The whole frame spins and
   collapses into the dial centre, leaving the dark end card (transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const S = D.surface;

  const CX = 1450;
  const CY = 560;
  const R = 290;
  const MIN = S.stay.h * 60 + S.stay.m;
  const FRAC = MIN / (24 * 60);
  const T_SWEEP = 1.0;
  SX.L.dialC = { x: CX, y: CY };

  SX.defineScene({
    id: 5,
    role: 'SURFACE',
    bg: 'gold',
    ruler: (lt) => {
      const m = D.landing.day + (S.liftoffDay - D.landing.day) * E.outCubic(U.prog(lt, 0, T_SWEEP));
      return { from: D.landing.day, to: m, mark: m };
    },

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'TRANQUILITY BASE / SURFACE STAY' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 130, lines: [`${S.stay.h}시간 ${S.stay.m}분을`, '머문 뒤,'] });

      const svg = U.svgFull();
      st.face = U.s('g');
      st.face.appendChild(U.s('circle', { cx: CX, cy: CY, r: R + 70, fill: C.paper, opacity: 0.35 }));
      for (let h = 0; h < 24; h++) {
        const a = (h / 24) * Math.PI * 2;
        const major = h % 6 === 0;
        const r0 = R + 26;
        const r1 = R + (major ? 58 : 42);
        st.face.appendChild(U.s('line', {
          x1: (CX + r0 * Math.sin(a)).toFixed(1), y1: (CY - r0 * Math.cos(a)).toFixed(1),
          x2: (CX + r1 * Math.sin(a)).toFixed(1), y2: (CY - r1 * Math.cos(a)).toFixed(1),
          stroke: C.ink, 'stroke-width': major ? 4 : 2,
        }));
      }
      svg.appendChild(st.face);
      st.ring = ui.ring(svg, { cx: CX, cy: CY, r: R, w: 34, color: C.ink, track: C.ink, trackOpacity: 0.12 });
      st.hand = U.s('line', { x1: CX, y1: CY, x2: CX, y2: CY - R + 40, stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round' });
      st.hub = U.s('circle', { cx: CX, cy: CY, r: 12, fill: C.red });
      svg.append(st.hand, st.hub);
      cam.appendChild(svg);

      st.lbls = [0, 6, 12, 18].map((h) => {
        const a = (h / 24) * Math.PI * 2;
        const el = U.box(CX + (R + 96) * Math.sin(a), CY - (R + 96) * Math.cos(a), 'dial-lbl', `${U.pad(h)}H`);
        cam.appendChild(el);
        return el;
      });
      st.num = ui.counter(cam, { x: CX, y: CY + 40, size: 120, align: 'center' });
      st.numLbl = U.h('div', { class: 'mono', style: `left:${CX - 200}px;top:${CY + 176}px;width:400px;text-align:center`, text: 'HH:MM ON THE SURFACE' });
      cam.appendChild(st.numLbl);

      st.chips = [
        ui.chip(cam, 124, 620, 'EVA', `${S.eva.h}:${U.pad(S.eva.m)}`),
        ui.chip(cam, 124, 712, 'SAMPLES', `${S.samplesKg} KG`),
      ];
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      const p = E.inOutCubic(U.prog(lt, 0, T_SWEEP));
      const f = lt >= T_SWEEP ? FRAC : FRAC * p;
      st.ring.set(f);
      const ang = 360 * f + (lt >= T_SWEEP ? 1.5 * Math.sin((lt - T_SWEEP) * 6) * Math.exp(-(lt - T_SWEEP) * 3) : 0);
      st.hand.setAttribute('transform', `rotate(${ang.toFixed(2)} ${CX} ${CY})`);
      const m = Math.round(MIN * (lt >= T_SWEEP ? 1 : p));
      st.num.set(`${U.pad(Math.floor(m / 60))}:${U.pad(m % 60)}`);

      const fe = ui.enter(lt, -T.LEAD, 0.5);
      st.face.setAttribute('transform', `translate(${CX} ${CY}) scale(${(0.6 + 0.4 * fe.e).toFixed(4)}) rotate(${(lt * 4).toFixed(2)}) translate(${-CX} ${-CY})`);
      st.num.el.style.opacity = st.numLbl.style.opacity = fe.o.toFixed(3);
      st.lbls.forEach((el) => (el.style.opacity = fe.o.toFixed(3)));

      st.chips.forEach((c, k) => {
        const t0 = T_SWEEP + k * T.E8;
        if (lt < t0) c.style.opacity = 0;
        else ui.pop(c, lt, t0, { from: 0.4, base: `translate3d(0,${(Math.sin(lt * 2 + k) * 2).toFixed(2)}px,0)` });
      });
    },
  });
})((window.SX = window.SX || {}));
