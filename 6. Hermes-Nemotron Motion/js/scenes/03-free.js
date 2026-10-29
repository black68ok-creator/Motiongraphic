/* 03 REVEAL — "API로 부르면 / 0원이다."
   A browser mock-up of the model page (§1): window drops in on b1, FREE stamp + AVAILABLE badge on b2,
   the ~40 RPM gauge needle sweeps on b3, the endpoint types on b4.
   Exit: iris closes onto the stamp (transitions.js) into the terminal of scene 04. */
(function (SX) {
  'use strict';
  const { U, E, T, ui, C } = SX;
  const D = SX.DATA;
  const M = D.model;

  const WIN = { x: 1000, y: 230, w: 800, h: 560 };
  const G = { cx: 420, cy: 870, r: 200 };
  SX.L.freeStamp = { x: 1560, y: 640 };

  SX.defineScene({
    id: 3,
    role: 'FREE API',
    bg: 'amber',
    ruler: () => ({ from: 0, to: 0, mark: 0 }),

    build(cam) {
      const st = {};
      st.cap = ui.caption(cam, { x: 120, y: 172, text: 'BUILD.NVIDIA.COM / FREE ENDPOINT' });
      st.head = ui.headline(cam, { x: 120, y: 212, size: 132, lines: ['API로 부르면', '0원이다.'] });

      st.win = SX.dev.term(cam, {
        x: WIN.x, y: WIN.y, w: WIN.w, h: WIN.h, light: true, title: `build.nvidia.com/${M.id}`, size: 22,
        lines: [
          [[null, '']],
          [['k', 'MODEL      '], [null, M.name]],
          [['k', 'ID         '], [null, M.id.replace('nvidia/', '')]],
          [['k', 'PARAMS     '], [null, `${M.totalB}B TOTAL · ${M.activeB}B ACTIVE`]],
          [['k', 'CONTEXT    '], [null, `${M.contextM}M TOKENS`]],
          [['k', 'ENDPOINT   '], [null, M.endpoint]],
        ],
      });
      st.badge = U.h('div', { class: 'badge', style: `left:${WIN.x + 22}px;top:${WIN.y + 64}px;transform-origin:0 50%`, text: `FREE ENDPOINT · ${M.freeEndpoint}` });
      cam.appendChild(st.badge);
      st.stamp = ui.stamp(cam, { x: SX.L.freeStamp.x, y: SX.L.freeStamp.y, main: 'FREE', sub: 'API KEY · NO CHARGE', rot: 9, color: C.rose });

      // RPM gauge (half dial, 0–60)
      const svg = U.svgFull();
      const arc = (a0, a1, r) => {
        const p0 = [G.cx + r * Math.cos(a0), G.cy + r * Math.sin(a0)];
        const p1 = [G.cx + r * Math.cos(a1), G.cy + r * Math.sin(a1)];
        return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
      };
      st.gauge = U.s('g');
      st.gauge.appendChild(U.s('path', { d: arc(Math.PI, 2 * Math.PI, G.r), fill: 'none', stroke: C.ink, 'stroke-width': 4 }));
      for (let v = 0; v <= 60; v += 10) {
        const a = Math.PI + (v / 60) * Math.PI;
        st.gauge.append(
          U.s('line', { x1: G.cx + (G.r - 6) * Math.cos(a), y1: G.cy + (G.r - 6) * Math.sin(a), x2: G.cx + (G.r - 26) * Math.cos(a), y2: G.cy + (G.r - 26) * Math.sin(a), stroke: C.ink, 'stroke-width': 3 }),
          U.s('text', { x: G.cx + (G.r - 50) * Math.cos(a), y: G.cy + (G.r - 50) * Math.sin(a) + 5, 'text-anchor': 'middle', fill: C.ink, 'font-size': 14, style: 'font-family:var(--f-mono)', text: String(v) }));
      }
      st.fill = U.s('path', { fill: 'none', stroke: C.rose, 'stroke-width': 14 });
      st.needle = U.s('line', { x1: G.cx, y1: G.cy, x2: G.cx - G.r + 30, y2: G.cy, stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' });
      st.gauge.append(st.fill, st.needle, U.s('circle', { cx: G.cx, cy: G.cy, r: 12, fill: C.ink }));
      svg.appendChild(st.gauge);
      cam.appendChild(svg);
      st.arc = arc;
      st.rpm = ui.counter(cam, { x: G.cx + G.r + 40, y: G.cy - 120, size: 96 });
      st.rpmLbl = U.box(G.cx + G.r + 46, G.cy - 10, 'mono', 'RPM · FREE TIER · 3RD-PARTY');
      cam.appendChild(st.rpmLbl);
      return st;
    },

    update(st, lt) {
      st.cap.update(lt, 0);
      st.head.update(lt, 0.02);

      const we = ui.enter(lt, -0.05, 0.45);
      st.win.el.style.opacity = we.o.toFixed(3);
      st.win.el.style.transform = `translate3d(0,${((1 - we.e) * -120).toFixed(1)}px,0) rotate(${((1 - we.e) * -3).toFixed(2)}deg)`;
      st.win.update(lt, [0, 0.1, 0.18, 0.26, 0.34, 1.5], 140);
      ui.pop(st.badge, lt, 0.5, { from: 0.4 });
      st.stamp.update(lt, 0.5);

      // b3: needle sweeps to ~40
      const v = M.rpm * E.outBack(U.prog(lt, 1.0, 1.35), 1.4);
      const a = Math.PI + (U.clamp(v, 0, 60) / 60) * Math.PI;
      st.needle.setAttribute('x2', (G.cx + (G.r - 30) * Math.cos(a)).toFixed(1));
      st.needle.setAttribute('y2', (G.cy + (G.r - 30) * Math.sin(a)).toFixed(1));
      st.fill.setAttribute('d', v > 0.2 ? st.arc(Math.PI, a, G.r) : '');
      st.rpm.set(`~${Math.max(0, Math.round(v))}`);
      const ge = ui.enter(lt, 0.9, 0.4);
      st.gauge.setAttribute('opacity', ge.o.toFixed(3));
      st.rpm.el.style.opacity = st.rpmLbl.style.opacity = ge.o.toFixed(3);
    },
  });
})((window.SX = window.SX || {}));
