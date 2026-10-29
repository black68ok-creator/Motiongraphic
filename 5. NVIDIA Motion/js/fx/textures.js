/* Global textures: circuit lattice with travelling signal pulses (dark scenes), film grain,
   stamp ink mask. All seeded and driven by t — no timers, no Math.random. */
(function (SX) {
  'use strict';
  const { U, T } = SX;

  const PITCH = 48;
  // Lattice drift (px/s) per scene. Dark scenes only; others are covered by opaque backgrounds.
  const DRIFT = [[-30, 0], null, null, [0, -40], null, null, null, null, null, [-24, 0], null, [0, 18]];
  const N_PULSE = 26;

  let ctx = null;
  let grainEl = null;
  const pulses = [];

  function driftOffset(t) {
    let ox = 0;
    let oy = 0;
    T.SLOTS.forEach((slot, i) => {
      const v = DRIFT[i];
      if (!v) return;
      const dt = U.clamp(t, slot.start, slot.end) - slot.start;
      ox += v[0] * dt;
      oy += v[1] * dt;
    });
    return [ox, oy];
  }

  function noiseDataURL(size, seed, fn) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const img = g.createImageData(size, size);
    const r = U.rng(seed);
    for (let i = 0; i < size * size; i++) fn(img.data, i * 4, r);
    g.putImageData(img, 0, 0);
    return { canvas: c, g, url: () => c.toDataURL('image/png') };
  }

  SX.fx = {
    build(stage) {
      ctx = stage.querySelector('#bgfx').getContext('2d');
      const r = U.rng(1993);
      for (let i = 0; i < N_PULSE; i++) {
        pulses.push({
          horiz: r() < 0.6,
          lane: Math.floor(r() * 40),
          speed: 380 + r() * 520,
          phase: r() * 4000,
          len: 80 + r() * 200,
        });
      }

      // Film grain tile
      const grain = noiseDataURL(256, 1409, (d, o, rnd) => {
        const v = Math.floor(rnd() * 255);
        d[o] = d[o + 1] = d[o + 2] = v;
        d[o + 3] = 255;
      });
      grainEl = stage.querySelector('#grain');
      grainEl.style.backgroundImage = `url(${grain.url()})`;

      // Stamp ink mask: mostly opaque with speckle voids and a few worn patches
      const mask = noiseDataURL(220, 928, (d, o, rnd) => {
        const v = rnd();
        d[o] = d[o + 1] = d[o + 2] = 0;
        d[o + 3] = v < 0.07 ? 0 : v < 0.16 ? 150 : 255;
      });
      const mr = U.rng(77);
      mask.g.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 16; i++) {
        mask.g.fillStyle = `rgba(0,0,0,${0.25 + mr() * 0.45})`;
        mask.g.beginPath();
        mask.g.arc(mr() * 220, mr() * 220, 3 + mr() * 11, 0, Math.PI * 2);
        mask.g.fill();
      }
      document.documentElement.style.setProperty('--stamp-mask', `url(${mask.url()})`);
    },

    update(t) {
      const [ox, oy] = driftOffset(t);
      const fx = U.mod(ox, PITCH);
      const fy = U.mod(oy, PITCH);
      ctx.clearRect(0, 0, T.W, T.H);

      // Lattice dots
      ctx.fillStyle = SX.C.paper;
      ctx.globalAlpha = 0.16;
      for (let y = fy - PITCH; y < T.H + PITCH; y += PITCH) {
        for (let x = fx - PITCH; x < T.W + PITCH; x += PITCH) ctx.fillRect(x - 1, y - 1, 2, 2);
      }

      // Signal pulses running along lattice lanes (pure function of t)
      ctx.globalAlpha = 1;
      for (const p of pulses) {
        const span = (p.horiz ? T.W : T.H) + p.len * 2;
        const head = U.mod(p.phase + t * p.speed, span) - p.len;
        const grad = p.horiz
          ? ctx.createLinearGradient(head - p.len, 0, head, 0)
          : ctx.createLinearGradient(0, head - p.len, 0, head);
        grad.addColorStop(0, 'rgba(168,225,12,0)');
        grad.addColorStop(1, 'rgba(168,225,12,0.55)');
        ctx.fillStyle = grad;
        if (p.horiz) {
          const y = U.mod(p.lane * PITCH + fy, T.H + PITCH);
          ctx.fillRect(head - p.len, y - 1, p.len, 2);
        } else {
          const x = U.mod(p.lane * PITCH + fx, T.W + PITCH);
          ctx.fillRect(x - 1, head - p.len, 2, p.len);
        }
      }

      const f = Math.round(t * T.FPS);
      grainEl.style.backgroundPosition = `${Math.floor(U.hash(f, 3) * 256)}px ${Math.floor(U.hash(f, 9) * 256)}px`;
    },
  };
})((window.SX = window.SX || {}));
