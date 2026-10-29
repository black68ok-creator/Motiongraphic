/* Scene-to-scene transitions. Index k = transition from scene k+1 to k+2.
   lead = seconds before the beat when the transition starts (3–5 frames).
   Transitions with lead 0 are match cuts handled inside the outgoing scene. */
(function (SX) {
  'use strict';
  const { U, E, T } = SX;
  const W = T.W;
  const H = T.H;
  let layer = null;
  let burstSvg = null;
  let burstRings = [];
  let blurK = null;

  const cut = { lead: 0 };

  // 05 → 06: six vertical strips open from the checklist column into thirds-of-sixths (strip shutter)
  const strips = {
    lead: T.LEAD,
    apply(p, out, inn) {
      const e = E.inOutCubic(p);
      const { xs, half } = SX.L.strips;
      const n = xs.length;
      const pts = [];
      xs.forEach((x, i) => {
        const l = U.lerp(x - half, (i * W) / n - 1, e).toFixed(1);
        const r = U.lerp(x + half, ((i + 1) * W) / n + 1, e).toFixed(1);
        pts.push(`${l}px ${H}px`, `${l}px 0px`, `${r}px 0px`, `${r}px ${H}px`);
      });
      inn.root.style.zIndex = 2;
      inn.root.style.clipPath = `polygon(${pts.join(',')})`;
    },
  };

  // 01 → 02: the phone screen opens until it is the whole frame
  const converge = {
    lead: 5 / T.FPS,
    apply(p, out, inn) {
      const g = SX.L.screen;
      const e = E.inCubic(p);
      const top = U.lerp(g.y, 0, e);
      const left = U.lerp(g.x, 0, e);
      const right = U.lerp(W - g.x - g.w, 0, e);
      const bottom = U.lerp(H - g.y - g.h, 0, e);
      inn.root.style.zIndex = 2;
      inn.root.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px)`;
    },
  };

  // 04 → 05: RGB chromatic aberration — channels of the terminal drift apart before the cut
  const rgb = {
    lead: 5 / T.FPS,
    apply(p, out, inn, ctx) {
      layer.textContent = '';
      out.root.style.visibility = 'hidden';
      layer.appendChild(U.h('div', { style: `position:absolute;inset:0;background:${SX.C.night}` }));
      const e = E.inQuad(p);
      [['ch-r', -1], ['ch-g', 0], ['ch-b', 1]].forEach(([id, side], i) => {
        const clone = out.root.cloneNode(true);
        clone.style.visibility = 'visible';
        clone.style.display = '';
        clone.style.filter = `url(#${id})`;
        clone.style.mixBlendMode = 'screen';
        const jit = (U.hash(ctx.frame * 3 + i, 17) - 0.5) * 30 * e;
        clone.style.transform = `translate3d(${(side * 70 * e + jit).toFixed(1)}px,${(side * 10 * e).toFixed(1)}px,0) scale(${(1 + 0.04 * e * (i + 1)).toFixed(4)})`;
        layer.appendChild(clone);
      });
    },
    idle() {
      if (layer && layer.firstChild) layer.textContent = '';
    },
  };

  // 02 → 03: whip pan — both scenes slide left under a horizontal motion blur
  const whip = {
    lead: 5 / T.FPS,
    apply(p, out, inn) {
      const e = E.inOutCubic(p);
      blurK.setAttribute('stdDeviation', `${(60 * Math.sin(Math.PI * p)).toFixed(1)} 0`);
      out.root.style.transform = `translate3d(${(-W * e).toFixed(1)}px,0,0)`;
      inn.root.style.transform = `translate3d(${(W * (1 - e)).toFixed(1)}px,0,0)`;
      out.root.style.filter = inn.root.style.filter = 'url(#mblur)';
      inn.root.style.zIndex = 2;
    },
  };

  // 09 → 10: iris opens from the NVIDIA API node onto the cron dial
  const irisOpen = {
    lead: T.LEAD,
    apply(p, out, inn) {
      const c = SX.L.apiNode;
      const r = U.lerp(0, 1800, E.inCubic(p));
      inn.root.style.zIndex = 2;
      inn.root.style.clipPath = `circle(${r.toFixed(1)}px at ${c.x}px ${c.y}px)`;
    },
  };

  // 06 → 07: horizontal slices of scene 06 tear off in alternating directions
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
      [SX.C.amber, SX.C.sky, SX.C.ink].forEach((col, i) => {
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

  // 07 → 08: shock rings burst from the expert grid, the chat scene inside them
  const burst = {
    lead: T.LEAD,
    apply(p, out, inn) {
      const c = SX.L.moeCenter;
      const r = 2100 * E.inOutCubic(p);
      inn.root.style.zIndex = 2;
      inn.root.style.background = SX.BG[inn.def.bg].bg; // dark scenes are transparent over the lattice canvas
      inn.root.style.clipPath = `circle(${r.toFixed(1)}px at ${c.x}px ${c.y}px)`;
      burstSvg.style.display = '';
      burstRings.forEach((ring, i) => {
        ring.setAttribute('cx', c.x);
        ring.setAttribute('cy', c.y);
        ring.setAttribute('r', Math.max(0, r * (i ? 0.8 : 1) + (i ? 0 : 8)).toFixed(1));
        ring.setAttribute('opacity', p >= 1 ? 0 : 1);
      });
    },
    idle() {
      if (burstSvg) burstSvg.style.display = 'none';
    },
  };

  // 03 → 04 and 11 → 12: the outgoing scene closes as an iris onto a point
  const irisTo = (at) => ({
    lead: T.LEAD,
    apply(p, out) {
      const c = at();
      const r = U.lerp(2000, 0, E.inCubic(p));
      out.root.style.zIndex = 2;
      out.root.style.clipPath = `circle(${r.toFixed(1)}px at ${c.x}px ${c.y}px)`;
    },
  });

  SX.transitions = {
    list: [
      converge, //  01 → 02 phone screen opens
      whip, //      02 → 03
      irisTo(() => SX.L.freeStamp), // 03 → 04 closes onto the FREE stamp
      rgb, //       04 → 05
      strips, //    05 → 06
      slice, //     06 → 07
      burst, //     07 → 08
      cut, //       08 → 09 hard cut
      irisOpen, //  09 → 10
      cut, //       10 → 11 hard cut into the montage
      irisTo(() => ({ x: 960, y: 540 })), // 11 → 12
    ],
    init(layerEl) {
      layer = layerEl;
      blurK = document.getElementById('mblur-k');
      burstSvg = U.svgFull();
      burstSvg.style.position = 'absolute';
      burstSvg.style.zIndex = 2;
      burstSvg.style.display = 'none';
      burstRings = [
        U.s('circle', { fill: 'none', stroke: SX.C.ink, 'stroke-width': 14 }),
        U.s('circle', { fill: 'none', stroke: SX.C.paper, 'stroke-width': 4 }),
      ];
      burstSvg.append(...burstRings);
      layer.parentNode.appendChild(burstSvg);
    },
  };
})((window.SX = window.SX || {}));
