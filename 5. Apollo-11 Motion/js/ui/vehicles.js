/* Simplified generic silhouettes (no official marks). Units = metres, origin at the base centre, +y down.
   saturnV(): 110.6 m stack with five engine bells and a flickering plume.
   lander(): two-stage lunar lander on four legs with a descent-engine plume. */
(function (SX) {
  'use strict';
  const { U } = SX;

  const poly = (pts, attrs) => U.s('polygon', { points: pts.map((p) => p.join(',')).join(' '), ...attrs });

  SX.vehicles = {
    saturnV(body, ink, flame) {
      const g = U.s('g');
      const sw = { stroke: ink, 'stroke-width': 0.35, 'stroke-linejoin': 'round' };
      const plume = U.s('path', { fill: flame, opacity: 0.95 });
      const core = U.s('path', { fill: body, opacity: 0.9 });
      g.append(plume, core);
      // Engine bells (5 × F-1: four outboard + centre)
      [-3.6, -1.8, 0, 1.8, 3.6].forEach((x) => g.appendChild(poly([[x - 0.7, 0], [x + 0.7, 0], [x + 1.0, 3.2], [x - 1.0, 3.2]], { fill: ink })));
      // Fins
      g.append(
        poly([[-5, -6], [-5, 0], [-8, 1.2], [-8, -1.5]], { fill: ink }),
        poly([[5, -6], [5, 0], [8, 1.2], [8, -1.5]], { fill: ink })
      );
      // S-IC, S-II, S-IVB, adapter, CSM, escape tower
      g.append(
        U.s('rect', { x: -5, y: -42, width: 10, height: 42, fill: body, ...sw }),
        U.s('rect', { x: -5, y: -36, width: 10, height: 6, fill: ink }),
        U.s('rect', { x: -5, y: -12, width: 5, height: 12, fill: ink }),
        U.s('rect', { x: -5, y: -67, width: 10, height: 25, fill: body, ...sw }),
        U.s('rect', { x: -5, y: -46, width: 10, height: 3, fill: ink }),
        poly([[-5, -67], [5, -67], [3.3, -72], [-3.3, -72]], { fill: body, ...sw }),
        U.s('rect', { x: -3.3, y: -90, width: 6.6, height: 18, fill: body, ...sw }),
        U.s('rect', { x: -3.3, y: -80, width: 3.3, height: 6, fill: ink }),
        poly([[-3.3, -90], [3.3, -90], [2, -98], [-2, -98]], { fill: body, ...sw }),
        U.s('rect', { x: -2, y: -103, width: 4, height: 5, fill: body, ...sw }),
        poly([[-2, -103], [2, -103], [0.5, -106.4], [-0.5, -106.4]], { fill: ink }),
        U.s('line', { x1: 0, y1: -106.4, x2: 0, y2: -110.6, stroke: ink, 'stroke-width': 0.6 })
      );
      return {
        g,
        /** length in metres below the bells, 0 = off */
        setPlume(len, wide = 9) {
          if (len <= 0) {
            plume.setAttribute('d', '');
            core.setAttribute('d', '');
            return;
          }
          const y0 = 2.8;
          plume.setAttribute('d', `M${-wide / 2} ${y0} Q${-wide * 0.7} ${y0 + len * 0.5} 0 ${y0 + len} Q${wide * 0.7} ${y0 + len * 0.5} ${wide / 2} ${y0} Z`);
          core.setAttribute('d', `M${-wide / 4} ${y0} Q${-wide * 0.3} ${y0 + len * 0.3} 0 ${y0 + len * 0.55} Q${wide * 0.3} ${y0 + len * 0.3} ${wide / 4} ${y0} Z`);
        },
      };
    },

    lander(body, ink, foil) {
      const g = U.s('g');
      const sw = { stroke: ink, 'stroke-width': 0.18, 'stroke-linejoin': 'round' };
      const plume = U.s('path', { fill: ink, opacity: 0.18 });
      g.appendChild(plume);
      // Legs + footpads
      [[-1, 1], [1, 1]].forEach(([s]) => {
        g.append(
          U.s('line', { x1: s * 2.1, y1: -3.4, x2: s * 4.3, y2: -0.25, stroke: ink, 'stroke-width': 0.28 }),
          U.s('line', { x1: s * 2.1, y1: -2.1, x2: s * 3.9, y2: -0.6, stroke: ink, 'stroke-width': 0.18 }),
          U.s('ellipse', { cx: s * 4.3, cy: -0.15, rx: 0.65, ry: 0.15, fill: ink })
        );
      });
      g.append(
        // Descent stage (foil box) + engine bell
        poly([[-2.4, -4.6], [2.4, -4.6], [2.4, -2.2], [-2.4, -2.2]], { fill: foil, ...sw }),
        U.s('line', { x1: -0.8, y1: -4.6, x2: -0.8, y2: -2.2, stroke: ink, 'stroke-width': 0.12, opacity: 0.6 }),
        U.s('line', { x1: 0.8, y1: -4.6, x2: 0.8, y2: -2.2, stroke: ink, 'stroke-width': 0.12, opacity: 0.6 }),
        poly([[-0.5, -2.2], [0.5, -2.2], [0.8, -1.3], [-0.8, -1.3]], { fill: ink }),
        // Ascent stage
        poly([[-2.0, -4.6], [2.2, -4.6], [2.2, -6.3], [1.2, -7.4], [-1.0, -7.4], [-2.0, -6.4]], { fill: body, ...sw }),
        poly([[-1.6, -6.2], [-0.8, -6.2], [-0.8, -5.4], [-1.6, -5.6]], { fill: ink }),
        U.s('rect', { x: 0.2, y: -7.9, width: 1.0, height: 0.5, fill: ink }),
        U.s('line', { x1: 1.6, y1: -7.4, x2: 2.2, y2: -8.6, stroke: ink, 'stroke-width': 0.14 })
      );
      return {
        g,
        setPlume(len) {
          plume.setAttribute('d', len <= 0 ? '' : `M-0.8 -1.3 L0.8 -1.3 L${1.6} ${-1.3 + len} L-1.6 ${-1.3 + len} Z`);
        },
      };
    },
  };
})((window.SX = window.SX || {}));
