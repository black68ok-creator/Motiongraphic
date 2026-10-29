/* 01 HOOK — "550B짜리 AI를 / 내 휴대폰에서,"
   A pill cycles the six parts of the setup on 16th notes and lands on NEMOTRON 3 ULTRA;
   on b3 the phone screen lights up and 550B counts up inside it, 55B ACTIVE on b4.
   Exit: the phone screen opens to fill the frame (converge, transitions.js). */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.model;

  const PARTS = D.parts;
  const LAND = PARTS.indexOf(M.name);
  const CYCLE_END = PARTS.length * T.E16; // 0.75
  const PH = { x: 1300, y: 140, w: 420, h: 800 };

  SX.defineScene({
    id: 1,
    role: 'HOOK',
    bg: 'dark',
    ruler: () => ({ from: 0, to: 0, mark: 0 }),

    build(cam) {
      const st = {};
      st.glow = ui.glow(cam, PH.x + PH.w / 2, PH.y + PH.h / 2, C.amber, 0.14);
      st.cap = ui.caption(cam, { x: 120, y: 172, text: `${M.name} / ON ANDROID · TERMUX` });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 140, lines: ['550B짜리 AI를', '내 휴대폰에서,'] });

      st.pillName = U.h('span', { class: 'pill-name', style: 'min-width:470px' });
      st.pillIdx = U.h('span', { class: 'pill-idx' });
      st.pillDot = U.h('span', { class: 'pill-dot' });
      st.pill = U.h('div', { class: 'pill', style: 'left:120px;top:590px;transform-origin:0 50%' }, st.pillDot, st.pillName, st.pillIdx);
      st.pillLbl = U.box(124, 706, 'mono', 'TERMUX · HERMES · NVIDIA BUILD · TELEGRAM');
      cam.append(st.pill, st.pillLbl);

      st.phone = SX.dev.phone(cam, PH);
      SX.L.screen = st.phone.inner;
      st.screenGlow = U.h('div', { style: 'position:absolute;inset:0;background:radial-gradient(circle at 50% 45%, rgba(255,178,36,.28), rgba(255,178,36,0) 65%)' });
      st.phone.screen.appendChild(st.screenGlow);
      st.count = ui.counter(st.phone.screen, { x: st.phone.inner.w / 2, y: 290, size: 128, align: 'center' });
      st.count.el.style.color = C.amber;
      st.count.el.style.position = 'absolute'; // inside the phone screen, not a direct child of the camera
      st.countLbl = U.h('div', { class: 'mono', style: `position:absolute;left:0;width:${st.phone.inner.w}px;top:440px;text-align:center`, text: 'PARAMETERS' });
      st.active = U.h('div', { class: 'badge', style: `position:absolute;left:${st.phone.inner.w / 2 - 140}px;top:490px;width:280px;text-align:center;box-sizing:border-box;white-space:nowrap`, text: `${M.activeB}B ACTIVE · MOE` });
      st.phone.screen.append(st.countLbl, st.active);
      return st;
    },

    update(st, lt) {
      ui.breathe(st.glow, lt, 0.06);
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      // Pill: parts on 16ths, then lands on the model
      const k = lt < CYCLE_END ? Math.min(PARTS.length - 1, Math.floor(Math.max(0, lt) / T.E16)) : LAND;
      U.setText(st.pillName, PARTS[k]);
      U.setText(st.pillIdx, `${U.pad(k + 1)} / ${U.pad(PARTS.length)}`);
      const tick = lt < CYCLE_END ? U.pulse(lt, T.E16, 0.04) : U.pulse(lt - CYCLE_END, 10, 0.12);
      st.pillDot.style.transform = `scale(${(1 + 0.6 * tick).toFixed(3)})`;
      st.pillName.style.color = lt >= CYCLE_END ? C.amber : '';
      const pe = ui.enter(lt, -0.05, 0.4);
      st.pill.style.opacity = pe.o.toFixed(3);
      st.pill.style.transform = `scale(${U.lerp(0.85, 1, pe.e).toFixed(4)})`;
      st.pillLbl.style.opacity = (pe.o * 0.8).toFixed(3);

      // Phone rises in; screen lights on b3 with the count-up
      const ph = ui.enter(lt, 0, 0.5);
      st.phone.el.style.opacity = ph.o.toFixed(3);
      st.phone.el.style.transform = `translate3d(0,${((1 - ph.e) * 120).toFixed(1)}px,0) rotate(${((1 - ph.e) * 6).toFixed(2)}deg)`;
      const on = U.prog(lt, 1.0, 1.15);
      st.screenGlow.style.opacity = (on * (0.8 + 0.2 * U.pulse(lt, T.SPB, 0.2))).toFixed(3);
      const cp = E.outCubic(U.prog(lt, 1.0, 1.4));
      st.count.set(`${Math.round(M.totalB * cp)}B`);
      st.count.el.style.opacity = st.countLbl.style.opacity = on.toFixed(3);
      ui.pop(st.active, lt, 1.5, { from: 0.5 });
    },
  });
})((window.SX = window.SX || {}));
