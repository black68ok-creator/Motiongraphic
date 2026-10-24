/* Scene-to-scene transitions. Index k = transition from scene k+1 to k+2.
   lead = seconds before the beat when the transition starts (3–5 frames).
   Each one is different and anchored to an object of the outgoing scene (SX.L). */
(function (SX) {
  'use strict';
  const { U, E, T } = SX;
  const W = T.W;
  const H = T.H;
  let layer = null;
  let burstSvg = null;
  let burstRings = [];

  // 01 → 02: the countdown ring bursts outward, red inside it
  const burst = {
    lead: T.LEAD,
    apply(p, out, inn) {
      const c = SX.L.countC;
      const r = c.r + (2000 - c.r) * E.inOutCubic(p);
      inn.root.style.zIndex = 2;
      inn.root.style.clipPath = `circle(${r.toFixed(1)}px at ${c.x}px ${c.y}px)`;
      burstSvg.style.display = '';
      burstRings.forEach((ring, i) => {
        ring.setAttribute('cx', c.x);
        ring.setAttribute('cy', c.y);
        ring.setAttribute('r', Math.max(0, r * (i ? 0.82 : 1) + (i ? 0 : 8)).toFixed(1));
        ring.setAttribute('opacity', p >= 1 ? 0 : 1);
      });
    },
    idle() {
      if (burstSvg) burstSvg.style.display = 'none';
    },
  };

  // 02 → 03: the plume column under the rocket widens into a full-frame strip
  const strip = {
    lead: T.LEAD,
    apply(p, out, inn) {
      const x = SX.L.rocketX;
      const e = E.inCubic(p);
      const l = U.lerp(x - 30, 0, e);
      const r = U.lerp(x + 30, W, e);
      inn.root.style.zIndex = 2;
      inn.root.style.clipPath = `inset(0px ${(W - r).toFixed(1)}px 0px ${l.toFixed(1)}px)`;
    },
  };

  // 03 → 04: the Moon expands as an iris and becomes the paper ground of the landing
  const iris = {
    lead: 5 / T.FPS,
    apply(p, out, inn) {
      const m = SX.L.moon;
      const r = m.r + (2300 - m.r) * E.inCubic(p);
      inn.root.style.zIndex = 2;
      inn.root.style.clipPath = `circle(${r.toFixed(1)}px at ${m.x}px ${m.y}px)`;
    },
  };

  // 04 → 05: horizontal slices of scene 04 tear off in alternating directions
  const slice = {
    lead: T.LEAD,
    apply(p, out, inn, ctx) {
      layer.textContent = '';
      out.root.style.visibility = 'hidden';
      const K = 12;
      const bh = H / K;
      for (let k = 0; k < K; k++) {
        const clone = out.root.cloneNode(true);
        clone.style.visibility = 'visible';
        clone.style.display = '';
        clone.style.clipPath = `inset(${(k * bh).toFixed(1)}px 0px ${(H - (k + 1) * bh).toFixed(1)}px 0px)`;
        const dir = k % 2 ? 1 : -1;
        const delay = U.hash(k, 31) * 0.4;
        const q = E.inCubic(U.prog(p, delay, 1));
        const jit = (U.hash(ctx.frame * 16 + k, 7) - 0.5) * 70 * (1 - q);
        clone.style.transform = `translate3d(${(dir * W * 1.05 * q + jit).toFixed(1)}px,0,0)`;
        layer.appendChild(clone);
      }
      [SX.C.red, SX.C.teal, SX.C.ink].forEach((col, i) => {
        const y = U.hash(ctx.frame * 3 + i, 41) * H;
        const bar = U.h('div', { style: `position:absolute;left:0;width:${W}px;top:${y.toFixed(0)}px;height:${(4 + U.hash(ctx.frame, i) * 12).toFixed(0)}px;background:${col}` });
        bar.style.transform = `translateX(${((U.hash(ctx.frame + i, 43) - 0.5) * 400).toFixed(0)}px)`;
        layer.appendChild(bar);
      });
    },
    idle() {
      if (layer && layer.firstChild) layer.textContent = '';
    },
  };

  // 05 → 06: the whole frame spins 180° around the dial hub and collapses into it
  const spin = {
    lead: 5 / T.FPS,
    apply(p, out) {
      const c = SX.L.dialC;
      const e = E.inQuad(p);
      out.root.style.zIndex = 2;
      out.root.style.transformOrigin = `${c.x}px ${c.y}px`;
      out.root.style.transform = `rotate(${(180 * e).toFixed(2)}deg) scale(${(1 - e).toFixed(4)})`;
    },
  };

  SX.transitions = {
    list: [
      burst, // 01 → 02
      strip, // 02 → 03
      iris, //  03 → 04
      slice, // 04 → 05
      spin, //  05 → 06
    ],
    init(layerEl) {
      layer = layerEl;
      burstSvg = U.svgFull();
      burstSvg.style.position = 'absolute';
      burstSvg.style.zIndex = 2;
      burstSvg.style.display = 'none';
      burstRings = [
        U.s('circle', { fill: 'none', stroke: SX.C.gold, 'stroke-width': 14 }),
        U.s('circle', { fill: 'none', stroke: SX.C.paper, 'stroke-width': 4 }),
      ];
      burstSvg.append(...burstRings);
      layer.parentNode.appendChild(burstSvg);
    },
  };
})((window.SX = window.SX || {}));
