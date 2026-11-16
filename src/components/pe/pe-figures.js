/**
 * Draws the live figures of the positional-encoding post.
 *
 * Imported once by PeFigure.astro. Each block below builds one figure inside
 * the frame that component renders, and returns straight away if that figure
 * is not on the page.
 */
const NS = 'http://www.w3.org/2000/svg',
  TAU = Math.PI * 2;
const $ = (s, r = document) => r.querySelector(s);
const S = (tag, attrs, parent, text) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};
const H = (tag, cls, parent, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
};
const set = (e, a) => {
  for (const k in a) e.setAttribute(k, a[k]);
};
const sg = (v, n = 4) => {
  const z = Math.abs(v) < 0.5 * Math.pow(10, -n) ? 0 : v;
  return (z < 0 ? '−' : '+') + Math.abs(z).toFixed(n);
};
const commas = (v) => Math.round(v).toLocaleString('en-US');
const onWidth = (box, fn) => {
  let last = -1;
  const run = () => {
    const w = Math.round(box.clientWidth);
    if (w > 0 && w !== last) {
      last = w;
      fn(w);
    }
  };
  run();
  if ('ResizeObserver' in window) new ResizeObserver(run).observe(box);
  else addEventListener('resize', run);
};
const player = (btn, step) => {
  let raf = 0,
    last = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    btn.textContent = 'Play';
    btn.setAttribute('aria-pressed', 'false');
  };
  const frame = (ts) => {
    const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
    last = ts;
    if (step(dt) === false) {
      stop();
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  btn.addEventListener('click', () => {
    if (raf) stop();
    else {
      btn.textContent = 'Pause';
      btn.setAttribute('aria-pressed', 'true');
      raf = requestAnimationFrame(frame);
    }
  });
};
const showTip = (tip, box, x, y, text) => {
  tip.textContent = text;
  tip.hidden = false;
  const w = tip.offsetWidth,
    bw = box.clientWidth;
  tip.style.left = Math.max(0, Math.min(bw - w, x + 12)) + 'px';
  tip.style.top = Math.max(0, y - tip.offsetHeight - 10) + 'px';
};
const press = (group, btn) => {
  group
    .querySelectorAll('button')
    .forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
};
const flash = (el) => {
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
};

/* a maths dial: the hand starts at 3 o'clock and turns anticlockwise; returns a function that points it */
const mathDial = (svg, C, R, tipR) => {
  const cosL = S('line', { class: 'seg-cos' }, svg),
    sinL = S('line', { class: 'seg-sin' }, svg);
  const hand = S('line', { class: 'hand' }, svg),
    tip = S('circle', { r: tipR, class: 'tip' }, svg);
  return (th) => {
    const px = C + R * Math.cos(th),
      py = C - R * Math.sin(th);
    set(hand, { x1: C, y1: C, x2: px, y2: py });
    set(cosL, { x1: C, y1: C, x2: px, y2: C });
    set(sinL, { x1: px, y1: C, x2: px, y2: py });
    set(tip, { cx: px, cy: py });
  };
};

/* a wall clock: angles run clockwise from the 12 and are given in turns */
const cpt = (C, r, turn) => [C + r * Math.sin(turn * TAU), C - r * Math.cos(turn * TAU)];
const clockFace = (svg, C, R) => {
  S('circle', { cx: C, cy: C, r: R, class: 'clock-rim' }, svg);
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0,
      a = cpt(C, R - (big ? 13 : 8), i / 60),
      b = cpt(C, R - 4, i / 60);
    S(
      'line',
      {
        x1: a[0].toFixed(1),
        y1: a[1].toFixed(1),
        x2: b[0].toFixed(1),
        y2: b[1].toFixed(1),
        class: big ? 'clock-tick big' : 'clock-tick',
      },
      svg
    );
  }
  for (let h = 1; h <= 12; h++) {
    const p = cpt(C, R - 27, h / 12);
    S(
      'text',
      {
        x: p[0].toFixed(1),
        y: (p[1] + 5.5).toFixed(1),
        'text-anchor': 'middle',
        class: 'clock-num',
      },
      svg,
      h
    );
  }
};
const aim = (el, C, len, tail, turn) => {
  const a = cpt(C, len, turn),
    b = cpt(C, -tail, turn);
  set(el, {
    x1: b[0].toFixed(1),
    y1: b[1].toFixed(1),
    x2: a[0].toFixed(1),
    y2: a[1].toFixed(1),
  });
};

/* 2.2  one hand, two shadows */
(function figCircle() {
  if (!$('#c1-dial')) return;
  const dial = $('#c1-dial'),
    box = $('#c1-box'),
    wave = $('#c1-wave'),
    slider = $('#c1-theta');
  const C = 120,
    R = 90;
  S('line', { x1: 14, y1: C, x2: 226, y2: C, class: 'axis' }, dial);
  S('line', { x1: C, y1: 14, x2: C, y2: 226, class: 'axis' }, dial);
  S('circle', { cx: C, cy: C, r: R, class: 'rim' }, dial);
  const arc = S('path', { class: 'angle-arc' }, dial);
  const thLab = S('text', { class: 'lbl', 'text-anchor': 'middle' }, dial, 'θ');
  const point = mathDial(dial, C, R, 6);
  const one = S('text', { class: 'lbl', 'text-anchor': 'middle' }, dial, '1');
  const m = { l: 30, r: 10, t: 14, b: 40 },
    Hh = 230;
  let W = 0,
    sx,
    sy,
    cur,
    mS,
    mC;
  function build() {
    set(wave, { viewBox: `0 0 ${W} ${Hh}`, height: Hh });
    wave.replaceChildren();
    sx = (v) => m.l + (v / (2 * TAU)) * (W - m.l - m.r);
    sy = (v) => m.t + ((1 - v) / 2) * (Hh - m.t - m.b);
    [-1, 0, 1].forEach((v) => {
      S(
        'line',
        { x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), class: v === 0 ? 'axis' : 'gl' },
        wave
      );
      S(
        'text',
        { x: m.l - 6, y: sy(v) + 4, class: 'tick', 'text-anchor': 'end' },
        wave,
        v === 0 ? '0' : v > 0 ? '+1' : '−1'
      );
    });
    ['0', 'π', '2π', '3π', '4π'].forEach((t, i) => {
      const x = sx(i * Math.PI);
      S('line', { x1: x, x2: x, y1: sy(-1), y2: sy(-1) + 4, class: 'axis' }, wave);
      S(
        'text',
        {
          x,
          y: sy(-1) + 17,
          class: 'tick',
          'text-anchor': i === 0 ? 'start' : i === 4 ? 'end' : 'middle',
        },
        wave,
        t
      );
    });
    S(
      'text',
      { x: (m.l + W - m.r) / 2, y: Hh - 6, class: 'axis-title', 'text-anchor': 'middle' },
      wave,
      'angle θ in radians (2π = one full turn)'
    );
    const path = (f) => {
      let d = '';
      for (let i = 0; i <= 240; i++) {
        const th = (i / 240) * 2 * TAU;
        d += (i ? 'L' : 'M') + sx(th).toFixed(1) + ' ' + sy(f(th)).toFixed(1);
      }
      return d;
    };
    S('path', { d: path(Math.cos), class: 'ln ln-cos' }, wave);
    S('path', { d: path(Math.sin), class: 'ln ln-sin' }, wave);
    cur = S('line', { y1: m.t, y2: sy(-1), class: 'cursor' }, wave);
    mC = S('circle', { r: 5, class: 'mk mk-cos' }, wave);
    mS = S('circle', { r: 5, class: 'mk mk-sin' }, wave);
    update();
  }
  /* Play keeps its own time. The slider rounds to its step, so a small tick
     on a fast screen would be rounded back and the hand would never move. */
  let tNow = +slider.value;
  function update() {
    const th = tNow,
      s = Math.sin(th),
      c = Math.cos(th);
    point(th);
    const a = th % TAU;
    arc.setAttribute(
      'd',
      a < 0.02
        ? ''
        : `M ${C + 22} ${C} A 22 22 0 ${a > Math.PI ? 1 : 0} 0 ${(C + 22 * Math.cos(a)).toFixed(1)} ${(C - 22 * Math.sin(a)).toFixed(1)}`
    );
    set(thLab, { x: C + 36 * Math.cos(a / 2), y: C - 36 * Math.sin(a / 2) + 4 });
    set(one, { x: C + (R / 2) * c - 11 * s, y: C - (R / 2) * s - 11 * c + 4 });
    $('#c1-r-ang').textContent =
      `${th.toFixed(2)} rad = ${((th * 180) / Math.PI).toFixed(1)}°`;
    $('#c1-r-turn').textContent = `${(th / TAU).toFixed(2)} turns`;
    $('#c1-r-sin').textContent = sg(s);
    $('#c1-r-cos').textContent = sg(c);
    $('#c1-r-sq').textContent = `${(s * s).toFixed(4)} + ${(c * c).toFixed(4)} = 1`;
    if (cur) {
      set(cur, { x1: sx(th), x2: sx(th) });
      set(mS, { cx: sx(th), cy: sy(s) });
      set(mC, { cx: sx(th), cy: sy(c) });
    }
  }
  slider.addEventListener('input', () => {
    tNow = +slider.value;
    update();
  });
  player($('#c1-play'), (dt) => {
    tNow += dt * 1.1;
    if (tNow > 12.56) tNow = 0;
    slider.value = tNow;
    update();
  });
  update();
  onWidth(box, (w) => {
    W = w;
    build();
  });
})();

/* 2.4  the minute hand of a wall clock */
(function figMinute() {
  if (!$('#ck-svg')) return;
  const svg = $('#ck-svg'),
    slider = $('#ck-t'),
    out = $('#ck-out'),
    note = $('#ck-note');
  const C = 130,
    R = 120,
    RW = 46,
    w = TAU / 60;
  clockFace(svg, C, R);
  const lap = S(
    'circle',
    { cx: C, cy: C, r: RW, class: 'wedge-lap', visibility: 'hidden' },
    svg
  );
  const wedge = S('path', { class: 'wedge' }, svg);
  const hand = S('line', { class: 'clock-hand min' }, svg);
  S('circle', { cx: C, cy: C, r: 5.5, class: 'clock-cap' }, svg);
  const mins = (n) => `${n} minute${n === 1 ? '' : 's'}`;
  function update() {
    const t = +slider.value,
      turn = t / 60,
      frac = turn % 1,
      mark = t % 60;
    out.textContent = t;
    aim(hand, C, 78, 14, turn);
    lap.setAttribute('visibility', turn >= 1 ? 'visible' : 'hidden');
    if (frac < 1e-6) wedge.setAttribute('d', '');
    else {
      const e = cpt(C, RW, frac);
      wedge.setAttribute(
        'd',
        `M ${C} ${C} L ${C} ${C - RW} A ${RW} ${RW} 0 ${frac > 0.5 ? 1 : 0} 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)} Z`
      );
    }
    $('#ck-r-th').textContent = `${(w * t).toFixed(3)} rad = ${Math.round(turn * 360)}°`;
    $('#ck-r-turn').textContent = `${turn.toFixed(2)} turns`;
    const lo = Math.floor(mark / 5),
      where =
        mark % 5 === 0 ? `the ${lo || 12}` : `between the ${lo || 12} and the ${lo + 1}`;
    const again =
      t < 60
        ? ''
        : mark === 0
          ? ', the same place as at the start'
          : `, the same place as after ${mins(mark)}`;
    note.textContent = `After ${mins(t)} the hand points at ${where}${again}.`;
  }
  const go = (v) => {
    slider.value = v;
    update();
  };
  slider.addEventListener('input', update);
  document
    .querySelectorAll('[data-ck]')
    .forEach((b) => b.addEventListener('click', () => go(+b.dataset.ck)));
  let acc = 0;
  player($('#ck-play'), (dt) => {
    acc += dt;
    if (acc < 0.1) return;
    acc = 0;
    const v = +slider.value;
    go(v >= 120 ? 0 : v + 1);
  });
  update();
})();

/* 2.5  three speeds */
(function figSpeeds() {
  if (!$('#c2-rows')) return;
  const host = $('#c2-rows'),
    slider = $('#c2-t'),
    out = $('#c2-out');
  /* Play keeps its own time; see figCircle for why it cannot live in the slider. */
  let tNow = +slider.value;
  const Hh = 88,
    m = { l: 4, r: 4, t: 6, b: 20 };
  const rows = [2, 1, 0.5].map((w) => {
    const row = H('div', 'speed-row', host);
    const dial = S('svg', {
      viewBox: '0 0 72 72',
      class: 'dial-sm',
      role: 'img',
      'aria-label': `A hand turning ${w} radians per step`,
    });
    row.appendChild(dial);
    S('line', { x1: 4, y1: 36, x2: 68, y2: 36, class: 'axis' }, dial);
    S('circle', { cx: 36, cy: 36, r: 28, class: 'rim' }, dial);
    const r = { w };
    r.seg = S('line', { class: 'seg-sin' }, dial);
    r.hand = S('line', { class: 'hand' }, dial);
    r.tip = S('circle', { r: 4.5, class: 'tip' }, dial);
    const main = H('div', 'speed-main', row);
    H(
      'p',
      'speed-label',
      main,
      `<b>ω = ${w}</b> rad per step · one turn every ${(TAU / w).toFixed(2)} steps`
    );
    const box = H('div', 'chartbox', main);
    const svg = S('svg', {
      class: 'chart',
      role: 'img',
      'aria-label': `Height of the hand over 20 steps at ${w} radians per step`,
    });
    box.appendChild(svg);
    onWidth(box, (W) => {
      set(svg, { viewBox: `0 0 ${W} ${Hh}`, height: Hh });
      svg.replaceChildren();
      r.sx = (t) => m.l + (t / 20) * (W - m.l - m.r);
      r.sy = (v) => m.t + ((1 - v) / 2) * (Hh - m.t - m.b);
      S(
        'rect',
        {
          x: r.sx(0),
          y: m.t,
          width: r.sx(TAU / w) - r.sx(0),
          height: Hh - m.t - m.b,
          class: 'band',
        },
        svg
      );
      S('line', { x1: m.l, x2: W - m.r, y1: r.sy(0), y2: r.sy(0), class: 'axis' }, svg);
      [0, 5, 10, 15, 20].forEach((t) =>
        S(
          'text',
          {
            x: r.sx(t),
            y: Hh - 5,
            class: 'tick',
            'text-anchor': t === 0 ? 'start' : t === 20 ? 'end' : 'middle',
          },
          svg,
          t
        )
      );
      let d = '';
      for (let i = 0; i <= 320; i++) {
        const t = i / 16;
        d +=
          (i ? 'L' : 'M') + r.sx(t).toFixed(1) + ' ' + r.sy(Math.sin(w * t)).toFixed(1);
      }
      S('path', { d, class: 'ln ln-sin' }, svg);
      r.cur = S('line', { y1: m.t, y2: Hh - m.b, class: 'cursor' }, svg);
      r.mk = S('circle', { r: 5, class: 'mk mk-sin' }, svg);
      upd(r);
    });
    return r;
  });
  function upd(r) {
    const t = tNow,
      th = r.w * t,
      px = 36 + 28 * Math.cos(th),
      py = 36 - 28 * Math.sin(th);
    set(r.seg, { x1: px, y1: 36, x2: px, y2: py });
    set(r.hand, { x1: 36, y1: 36, x2: px, y2: py });
    set(r.tip, { cx: px, cy: py });
    if (r.cur) {
      set(r.cur, { x1: r.sx(t), x2: r.sx(t) });
      set(r.mk, { cx: r.sx(t), cy: r.sy(Math.sin(th)) });
    }
  }
  const update = () => {
    out.textContent = tNow.toFixed(1);
    rows.forEach(upd);
  };
  slider.addEventListener('input', () => {
    tNow = +slider.value;
    update();
  });
  player($('#c2-play'), (dt) => {
    tNow += dt * 1.5;
    if (tNow > 20) tNow = 0;
    slider.value = tNow;
    update();
  });
  update();
})();

/* 3  three hands on one wall clock */
(function figThreeHands() {
  if (!$('#c3k-svg')) return;
  const svg = $('#c3k-svg'),
    slider = $('#c3k-t'),
    out = $('#c3k-out');
  const C = 130,
    R = 120;
  clockFace(svg, C, R);
  const hr = S('line', { class: 'clock-hand hr' }, svg),
    mn = S('line', { class: 'clock-hand min' }, svg),
    sc = S('line', { class: 'clock-hand sec' }, svg);
  S('circle', { cx: C, cy: C, r: 5.5, class: 'clock-cap' }, svg);
  const two = (n) => String(n).padStart(2, '0');
  let tt = +slider.value;
  function update() {
    const t = Math.floor(tt);
    out.textContent = commas(t);
    aim(hr, C, 50, 9, tt / 43200);
    aim(mn, C, 78, 14, tt / 3600);
    aim(sc, C, 82, 22, tt / 60);
    $('#c3k-time').textContent =
      `${t >= 3600 ? 1 : 12}:${two(Math.floor(t / 60) % 60)}:${two(t % 60)}`;
    $('#c3k-s').textContent = (tt / 60).toFixed(2);
    $('#c3k-m').textContent = (tt / 3600).toFixed(2);
    $('#c3k-h').textContent = (tt / 43200).toFixed(3);
  }
  slider.addEventListener('input', () => {
    tt = +slider.value;
    update();
  });
  player($('#c3k-play'), (dt) => {
    tt += dt * 30;
    if (tt > 3600) tt = 0;
    slider.value = Math.floor(tt);
    update();
  });
  update();
})();

/* 3  binary counter */
(function figBinary() {
  if (!$('#c3-svg')) return;
  const svg = $('#c3-svg'),
    L = 34,
    P = 18,
    top = 18;
  for (let n = 0; n < 16; n++)
    S(
      'text',
      { x: L + n * P + 8.5, y: 11, class: 'tick', 'text-anchor': 'middle' },
      svg,
      n
    );
  ['1s', '2s', '4s', '8s'].forEach((lab, b) => {
    S(
      'text',
      { x: L - 8, y: top + b * P + 12.5, class: 'lbl', 'text-anchor': 'end' },
      svg,
      lab
    );
    for (let n = 0; n < 16; n++)
      S(
        'rect',
        {
          x: L + n * P,
          y: top + b * P,
          width: 17,
          height: 17,
          rx: 2,
          class: (n >> b) & 1 ? 'bit on' : 'bit',
        },
        svg
      );
  });
})();

/* 4.1  one PE hand: d_model = 4, hand 1 */
(function figHandOne() {
  if (!$('#p1-svg')) return;
  const svg = $('#p1-svg'),
    slider = $('#p1-pos'),
    out = $('#p1-out'),
    vec = $('#p1-vec');
  const C = 120,
    R = 90,
    w = 0.01;
  S('line', { x1: 14, y1: C, x2: 226, y2: C, class: 'axis' }, svg);
  S('line', { x1: C, y1: 14, x2: C, y2: 226, class: 'axis' }, svg);
  S('circle', { cx: C, cy: C, r: R, class: 'rim' }, svg);
  const point = mathDial(svg, C, R, 6);
  let pp = +slider.value;
  function update() {
    const p = Math.round(pp),
      th = w * p;
    out.textContent = p;
    point(th);
    $('#p1-r-th').textContent =
      `${th.toFixed(2)} rad = ${((th * 180) / Math.PI).toFixed(1)}°`;
    $('#p1-r-turn').textContent = `${(th / TAU).toFixed(2)} turns`;
    vec.textContent = `pe[${p}, 2:4] = [ ${sg(Math.sin(th))}, ${sg(Math.cos(th))} ]`;
  }
  const go = (v) => {
    pp = v;
    slider.value = v;
    update();
  };
  slider.addEventListener('input', () => {
    pp = +slider.value;
    update();
  });
  document
    .querySelectorAll('[data-p1]')
    .forEach((b) => b.addEventListener('click', () => go(+b.dataset.p1)));
  player($('#p1-play'), (dt) => {
    pp += dt * 40;
    if (pp > 700) pp = 0;
    slider.value = Math.round(pp);
    update();
  });
  update();
})();

/* 4.4  four hands, d_model = 8 */
(function figDials() {
  if (!$('#c4-dials')) return;
  const host = $('#c4-dials'),
    slider = $('#c4-pos'),
    out = $('#c4-out'),
    vec = $('#c4-vec');
  const hands = [0, 1, 2, 3].map((i) => {
    const w = Math.pow(10, -i),
      card = H('div', 'dial-card', host);
    const svg = S('svg', {
      viewBox: '0 0 120 120',
      class: 'dial-md',
      role: 'img',
      'aria-label': `Hand ${i}, turning ${w} radians per position`,
    });
    card.appendChild(svg);
    S('line', { x1: 8, y1: 60, x2: 112, y2: 60, class: 'axis' }, svg);
    S('line', { x1: 60, y1: 8, x2: 60, y2: 112, class: 'axis' }, svg);
    S('circle', { cx: 60, cy: 60, r: 46, class: 'rim' }, svg);
    const h = { w, point: mathDial(svg, 60, 46, 5) };
    H('p', 'dial-name', card, `Hand ${i}<span>ω = ${w}</span>`);
    h.ang = H('p', 'dial-ang', card);
    const cells = H('div', 'strip-cells', card);
    h.sv = H(
      'div',
      'strip-cell',
      cells,
      `<span class="strip-col">column ${2 * i}</span><b></b><span class="strip-kind"><i class="sw sw-sin"></i>sin</span>`
    ).children[1];
    h.cv = H(
      'div',
      'strip-cell',
      cells,
      `<span class="strip-col">column ${2 * i + 1}</span><b></b><span class="strip-kind"><i class="sw sw-cos"></i>cos</span>`
    ).children[1];
    return h;
  });
  function update() {
    const p = +slider.value,
      row = [];
    out.textContent = p;
    hands.forEach((h) => {
      const th = h.w * p,
        s = Math.sin(th),
        c = Math.cos(th);
      h.point(th);
      h.ang.innerHTML = `${th.toFixed(3)} rad<br>${(th / TAU).toFixed(2)} turns`;
      h.sv.textContent = sg(s);
      h.cv.textContent = sg(c);
      row.push(sg(s), sg(c));
    });
    vec.textContent = `PE(${p}) = [ ${row.join(', ')} ]`;
  }
  const go = (p) => {
    slider.value = Math.max(0, Math.min(100, p));
    update();
  };
  slider.addEventListener('input', update);
  $('#c4-dec').addEventListener('click', () => go(+slider.value - 1));
  $('#c4-inc').addEventListener('click', () => go(+slider.value + 1));
  document
    .querySelectorAll('[data-jump]')
    .forEach((b) => b.addEventListener('click', () => go(+b.dataset.jump)));
  let acc = 0;
  player($('#c4-play'), (dt) => {
    acc += dt;
    if (acc < 0.3) return;
    acc = 0;
    if (+slider.value >= 100) return false;
    go(+slider.value + 1);
  });
  update();
})();

/* 5.3  wavelengths */
(function figWavelengths() {
  if (!$('#c5-box')) return;
  const box = $('#c5-box'),
    svg = $('#c5-svg'),
    tip = $('#c5-tip'),
    note = $('#c5-note');
  const Hh = 320,
    m = { l: 46, r: 14, t: 20, b: 42 };
  let d = 8,
    log = true,
    W = 0,
    geo = null,
    hov = null;
  const lam = (i) => TAU * Math.pow(10000, (2 * i) / d);
  function build() {
    if (!W) return;
    const n = d / 2;
    set(svg, { viewBox: `0 0 ${W} ${Hh}`, height: Hh });
    svg.replaceChildren();
    const x0 = m.l + 14,
      x1 = W - m.r - 14,
      ph = Hh - m.t - m.b;
    const sx = (i) => x0 + (i / (n - 1)) * (x1 - x0);
    const sy = log
      ? (v) => m.t + (1 - Math.log10(v) / 5) * ph
      : (v) => m.t + (1 - v / 70000) * ph;
    const ticks = log
      ? [
          [1, '1'],
          [10, '10'],
          [100, '100'],
          [1000, '1K'],
          [10000, '10K'],
          [100000, '100K'],
        ]
      : [
          [0, '0'],
          [20000, '20K'],
          [40000, '40K'],
          [60000, '60K'],
        ];
    ticks.forEach(([v, t], k) => {
      S(
        'line',
        { x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), class: k === 0 ? 'axis' : 'gl' },
        svg
      );
      S(
        'text',
        { x: m.l - 6, y: sy(v) + 4, class: 'tick', 'text-anchor': 'end' },
        svg,
        t
      );
    });
    [
      [TAU, '2π ≈ 6.28'],
      [10000 * TAU, '10000 · 2π ≈ 62,832'],
    ].forEach(([v, t]) => {
      S('line', { x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), class: 'ref' }, svg);
      S(
        'text',
        { x: W - m.r - 2, y: sy(v) - 5, class: 'lbl', 'text-anchor': 'end' },
        svg,
        t
      );
    });
    const xt = n === 4 ? [0, 1, 2, 3] : [0, n / 4, n / 2, (3 * n) / 4, n - 1];
    xt.forEach((i) => {
      S(
        'line',
        { x1: sx(i), x2: sx(i), y1: Hh - m.b, y2: Hh - m.b + 4, class: 'axis' },
        svg
      );
      S(
        'text',
        { x: sx(i), y: Hh - m.b + 17, class: 'tick', 'text-anchor': 'middle' },
        svg,
        i
      );
    });
    S(
      'text',
      { x: (m.l + W - m.r) / 2, y: Hh - 6, class: 'axis-title', 'text-anchor': 'middle' },
      svg,
      'hand number i (0 is the fastest)'
    );
    let p = '';
    for (let i = 0; i < n; i++)
      p += (i ? 'L' : 'M') + sx(i).toFixed(1) + ' ' + sy(lam(i)).toFixed(1);
    S('path', { d: p, class: n > 32 ? 'ln ln-strong' : 'ln ln-ink' }, svg);
    if (n <= 32)
      for (let i = 0; i < n; i++)
        S(
          'circle',
          { cx: sx(i), cy: sy(lam(i)), r: n === 4 ? 5 : 4, class: 'mk mk-ink' },
          svg
        );
    hov = S('circle', { r: 6, class: 'mk-hover', visibility: 'hidden' }, svg);
    geo = { sx, sy, n, x0, x1 };
    const ratio = Math.pow(10000, 2 / d);
    note.textContent = `d_model = ${d} gives ${n} hands. Each is ${ratio >= 9.99 ? ratio.toFixed(0) : ratio.toFixed(ratio < 1.1 ? 3 : 2)} times slower than the one before. The slowest needs ${commas(lam(n - 1))} positions per turn.`;
  }
  $('#c5-d').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    d = +b.dataset.d;
    press($('#c5-d'), b);
    build();
  });
  $('#c5-scale').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    log = b.dataset.scale === 'log';
    press($('#c5-scale'), b);
    build();
  });
  box.addEventListener('pointermove', (e) => {
    if (!geo) return;
    const x = e.clientX - box.getBoundingClientRect().left;
    const i = Math.max(
        0,
        Math.min(geo.n - 1, Math.round(((x - geo.x0) / (geo.x1 - geo.x0)) * (geo.n - 1)))
      ),
      L = lam(i);
    set(hov, { cx: geo.sx(i), cy: geo.sy(L), visibility: 'visible' });
    showTip(
      tip,
      box,
      geo.sx(i),
      geo.sy(L),
      `hand ${i} · columns ${2 * i}, ${2 * i + 1} · one turn per ${L < 1000 ? L.toFixed(2) : commas(L)} positions`
    );
  });
  box.addEventListener('pointerleave', () => {
    tip.hidden = true;
    if (hov) hov.setAttribute('visibility', 'hidden');
  });
  onWidth(box, (w) => {
    W = w;
    build();
  });
})();

/* 7  the table */
(function figHeat() {
  if (!$('#c7-box')) return;
  const box = $('#c7-box'),
    cv = $('#c7-canvas'),
    tip = $('#c7-tip'),
    note = $('#c7-note'),
    seg = $('#c7-n');
  const D = 64,
    N = 100,
    m = { l: 44, r: 4, t: 4, b: 36 },
    Hh = m.t + m.b + D * 5;
  const om = Array.from({ length: D / 2 }, (_, i) => Math.pow(10000, (-2 * i) / D));
  let W = 0,
    stride = 1;
  const val = (p, j) => {
    const a = p * stride * om[j >> 1];
    return j % 2 ? Math.cos(a) : Math.sin(a);
  };
  /* The colour tokens are light-dark() values, so each is resolved through the canvas element itself. */
  const tok = (n) => {
    cv.style.color = `var(${n})`;
    return getComputedStyle(cv).color;
  };
  const rgb = (c) =>
    c
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number);
  function draw() {
    if (!W) return;
    const neg = rgb(tok('--neg')),
      mid = rgb(tok('--mid')),
      pos = rgb(tok('--pos'));
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(Hh * dpr);
    cv.style.height = Hh + 'px';
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, Hh);
    const cw = (W - m.l - m.r) / N,
      ch = (Hh - m.t - m.b) / D;
    for (let j = 0; j < D; j++)
      for (let p = 0; p < N; p++) {
        const v = val(p, j),
          a = Math.abs(v),
          e = v < 0 ? neg : pos;
        ctx.fillStyle = `rgb(${mid.map((c, k) => Math.round(c + (e[k] - c) * a)).join(',')})`;
        ctx.fillRect(m.l + p * cw, m.t + j * ch, cw + 0.6, ch + 0.6);
      }
    ctx.font = `11px ${getComputedStyle(cv).fontFamily}`;
    ctx.fillStyle = tok('--muted');
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    [0, 16, 32, 48, 63].forEach((j) =>
      ctx.fillText(String(j), m.l - 6, m.t + (j + 0.5) * ch)
    );
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    [0, 20, 40, 60, 80].forEach((p) =>
      ctx.fillText(commas(p * stride), m.l + (p + 0.5) * cw, Hh - m.b + 6)
    );
    ctx.fillStyle = tok('--ink-2');
    ctx.fillText('position pos', m.l + (W - m.l - m.r) / 2, Hh - 15);
    ctx.save();
    ctx.translate(9, m.t + (Hh - m.t - m.b) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textBaseline = 'middle';
    ctx.fillText('column of pe (0 and 1 = fastest hand)', 0, 0);
    ctx.restore();
  }
  function describe() {
    const last = (N - 1) * stride,
      n = om.filter((w) => w * last >= 1).length;
    note.textContent =
      stride === 1
        ? `Every position from 0 to 99. By the right edge, hands 0 to ${n - 1} have turned at least 1 radian. The other ${D / 2 - n} have turned less.`
        : `Every ${stride}th position from 0 to ${commas(last)}. By the right edge, ${n === D / 2 ? 'all 32 hands have' : `hands 0 to ${n - 1} have`} turned at least 1 radian. The top rows now look like static, because those hands go round more than once between two cells.`;
  }
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    stride = +b.dataset.s;
    press(seg, b);
    describe();
    draw();
  });
  box.addEventListener('pointermove', (e) => {
    const r = cv.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    const cw = (W - m.l - m.r) / N,
      ch = (Hh - m.t - m.b) / D;
    const p = Math.floor((x - m.l) / cw),
      j = Math.floor((y - m.t) / ch);
    if (p < 0 || p >= N || j < 0 || j >= D) {
      tip.hidden = true;
      return;
    }
    showTip(
      tip,
      box,
      x,
      y,
      `pos ${commas(p * stride)} · column ${j} (${j % 2 ? 'cos' : 'sin'} of hand ${j >> 1}) · ${sg(val(p, j), 3)}`
    );
  });
  box.addEventListener('pointerleave', () => {
    tip.hidden = true;
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  describe();
  onWidth(box, (w) => {
    W = w;
    draw();
  });
})();

/* 8.4  the shift is a turn */
(function figRotate() {
  if (!$('#c8-svg')) return;
  const svg = $('#c8-svg'),
    sp = $('#c8-pos'),
    sk = $('#c8-k'),
    note = $('#c8-note');
  const C = 150,
    R = 100;
  let w = 1;
  S('line', { x1: 22, y1: C, x2: 278, y2: C, class: 'axis' }, svg);
  S('line', { x1: C, y1: 22, x2: C, y2: 278, class: 'axis' }, svg);
  S('circle', { cx: C, cy: C, r: R, class: 'rim' }, svg);
  const arc = S('path', { class: 'ln ln-shift' }, svg),
    head = S('polygon', { class: 'arrow-shift' }, svg);
  const hQ = S('line', { class: 'hand hand-shift' }, svg),
    hP = S('line', { class: 'hand' }, svg);
  const tQ = S('circle', { r: 6.5, class: 'mk mk-shift' }, svg),
    tP = S('circle', { r: 6, class: 'tip-open' }, svg);
  const M = $('#c8-M'),
    V = $('#c8-V'),
    Rv = $('#c8-R');
  function update(src) {
    const p = +sp.value,
      k = +sk.value,
      a = w * p,
      b = w * k,
      q = a + b;
    $('#c8-pos-out').textContent = p;
    $('#c8-k-out').textContent = (k > 0 ? '+' : k < 0 ? '−' : '') + Math.abs(k);
    const pt = (th, r) => [C + r * Math.cos(th), C - r * Math.sin(th)];
    const P = pt(a, R),
      Q = pt(q, R);
    set(hP, { x1: C, y1: C, x2: P[0], y2: P[1] });
    set(tP, { cx: P[0], cy: P[1] });
    set(hQ, { x1: C, y1: C, x2: Q[0], y2: Q[1] });
    set(tQ, { cx: Q[0], cy: Q[1] });
    if (k === 0) {
      arc.setAttribute('d', '');
      head.setAttribute('points', '');
    } else {
      const n = Math.max(2, Math.ceil(Math.abs(b) / 0.04)),
        rr = (t) => R + 13 + (5 * Math.abs(b * t)) / TAU;
      let d = '';
      for (let i = 0; i <= n; i++) {
        const t = i / n,
          e = pt(a + b * t, rr(t));
        d += (i ? 'L' : 'M') + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
      }
      arc.setAttribute('d', d);
      const E = pt(q, rr(1)),
        s = Math.sign(b),
        tx = -Math.sin(q) * s,
        ty = -Math.cos(q) * s,
        nx = Math.cos(q),
        ny = -Math.sin(q);
      head.setAttribute(
        'points',
        `${(E[0] + 9 * tx).toFixed(1)},${(E[1] + 9 * ty).toFixed(1)} ${(E[0] + 5 * nx).toFixed(1)},${(E[1] + 5 * ny).toFixed(1)} ${(E[0] - 5 * nx).toFixed(1)},${(E[1] - 5 * ny).toFixed(1)}`
      );
    }
    const c = Math.cos(b),
      s = Math.sin(b),
      s0 = Math.sin(a),
      c0 = Math.cos(a);
    $('#c8-m11').textContent = sg(c);
    $('#c8-m12').textContent = sg(s);
    $('#c8-m21').textContent = sg(-s);
    $('#c8-m22').textContent = sg(c);
    $('#c8-v1').textContent = sg(s0);
    $('#c8-v2').textContent = sg(c0);
    $('#c8-r1').textContent = sg(c * s0 + s * c0);
    $('#c8-r2').textContent = sg(-s * s0 + c * c0);
    $('#c8-a').textContent = `${a.toFixed(2)} rad`;
    $('#c8-b').textContent = `${sg(b, 2)} rad = ${sg((b * 180) / Math.PI, 1)}°`;
    $('#c8-chk').textContent = `${sg(Math.sin(q))}, ${sg(Math.cos(q))}`;
    if (src === 'pos') {
      flash(V);
      flash(Rv);
      note.textContent =
        'You moved pos. The old pair and the new pair changed. The shift matrix did not.';
    }
    if (src === 'k') {
      flash(M);
      flash(Rv);
      note.textContent =
        'You moved k. The shift matrix changed, because the extra turn ω · k changed.';
    }
    if (src === 'w') {
      flash(M);
      flash(V);
      flash(Rv);
      note.textContent =
        'You switched hands. A different ω gives a different extra turn for the same k, so a different matrix.';
    }
  }
  sp.addEventListener('input', () => update('pos'));
  sk.addEventListener('input', () => update('k'));
  $('#c8-w').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    w = +b.dataset.w;
    press($('#c8-w'), b);
    update('w');
  });
  update();
})();

/* 8.6  all hands at once: old stamp along the top, new stamp down the right */
(function figBlock() {
  if (!$('#bm-grid')) return;
  const grid = $('#bm-grid'),
    sk = $('#bm-k'),
    out = $('#bm-k-out'),
    note = $('#bm-note'),
    tb = $('#bm-hands');
  const P = 34,
    Wd = [1, 0.1, 0.01, 0.001],
    f3 = (v) => sg(v, 3);
  const old = [];
  Wd.forEach((w) => old.push(Math.sin(w * P), Math.cos(w * P)));
  H('span', 'bm-h bm-first', grid);
  for (let c = 0; c < 8; c++) H('span', 'bm-h', grid, `col ${c}`);
  H('span', 'bm-h', grid);
  H('span', 'bm-h', grid);
  H('span', 'bm-h bm-side bm-first', grid, `old stamp, PE(${P})`);
  const oc = old.map((v) => H('span', 'bm-o', grid, f3(v)));
  H('span', 'bm-h', grid);
  const head = H('span', 'bm-h', grid);
  const rows = [];
  for (let r = 0; r < 8; r++) {
    const btn = H(
      'button',
      'bm-rl bm-first',
      grid,
      `<span><i class="sw ${r % 2 ? 'sw-cos' : 'sw-sin'}"></i>new col ${r}</span>`
    );
    btn.type = 'button';
    btn.dataset.r = r;
    const cells = [];
    for (let c = 0; c < 8; c++) {
      const e = H('span', r >> 1 === c >> 1 ? 'bm-b' : 'bm-z', grid, '0');
      e.dataset.r = r;
      cells.push(e);
    }
    H('span', 'bm-h', grid, '=');
    const res = H('span', 'bm-n', grid);
    res.dataset.r = r;
    rows.push({ btn, cells, res });
  }
  const hands = Wd.map((w, i) => {
    const tr = H(
      'tr',
      '',
      tb,
      `<td>${i}</td><td class="num">${w}</td><td class="num"></td><td class="num"></td><td class="num"></td>`
    );
    return [tr.children[2], tr.children[3], tr.children[4]];
  });
  let sel = 2;
  function update() {
    const k = +sk.value,
      nw = [],
      i = sel >> 1;
    out.textContent = (k > 0 ? '+' : k < 0 ? '−' : '') + Math.abs(k);
    head.textContent = `PE(${P + k})`;
    Wd.forEach((w, h) => {
      const c = Math.cos(w * k),
        s = Math.sin(w * k),
        a = old[2 * h],
        b = old[2 * h + 1];
      const top = rows[2 * h].cells,
        bot = rows[2 * h + 1].cells;
      top[2 * h].textContent = f3(c);
      top[2 * h + 1].textContent = f3(s);
      bot[2 * h].textContent = f3(-s);
      bot[2 * h + 1].textContent = f3(c);
      nw.push(c * a + s * b, -s * a + c * b);
      hands[h][0].textContent = `${f3(w * k)} rad`;
      hands[h][1].textContent = f3(c);
      hands[h][2].textContent = f3(s);
    });
    rows.forEach((r, j) => {
      const on = j === sel;
      r.res.textContent = f3(nw[j]);
      r.btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      r.res.classList.toggle('on', on);
      r.cells.forEach((e, c) => e.classList.toggle('on', on && c >> 1 === i));
    });
    oc.forEach((e, c) => e.classList.toggle('on', c >> 1 === i));
    const m1 = rows[sel].cells[2 * i].textContent,
      m2 = rows[sel].cells[2 * i + 1].textContent,
      fn = sel % 2 ? 'cos' : 'sin';
    const direct = sel % 2 ? Math.cos(Wd[i] * (P + k)) : Math.sin(Wd[i] * (P + k));
    note.textContent = `The row for new col ${sel}: (${m1} × ${f3(old[2 * i])}) + (${m2} × ${f3(old[2 * i + 1])}) = ${f3(nw[sel])}. Direct check: ${fn}(${Wd[i]} × ${P + k}) = ${f3(direct)}.`;
  }
  const pick = (e) => {
    const el = e.target.closest('[data-r]');
    if (el && +el.dataset.r !== sel) {
      sel = +el.dataset.r;
      update();
    }
  };
  grid.addEventListener('click', pick);
  grid.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'mouse') pick(e);
  });
  sk.addEventListener('input', update);
  update();
})();

/* 9  dot product */
(function figDot() {
  if (!$('#c9-box')) return;
  const box = $('#c9-box'),
    svg = $('#c9-svg'),
    tip = $('#c9-tip'),
    sp = $('#c9-p'),
    out = $('#c9-out');
  const D = 512,
    g = [],
    Hh = 300,
    m = { l: 40, r: 14, t: 26, b: 42 };
  for (let k = 0; k <= 100; k++) {
    let t = 0;
    for (let i = 0; i < D / 2; i++) t += Math.cos(k * Math.pow(10000, (-2 * i) / D));
    g.push(t);
  }
  let W = 0,
    geo = null,
    line,
    pk,
    pkLab,
    cur,
    dot;
  function build() {
    if (!W) return;
    set(svg, { viewBox: `0 0 ${W} ${Hh}`, height: Hh });
    svg.replaceChildren();
    const sx = (q) => m.l + (q / 100) * (W - m.l - m.r),
      sy = (v) => m.t + (1 - v / 256) * (Hh - m.t - m.b);
    [0, 64, 128, 192, 256].forEach((v, k) => {
      S(
        'line',
        { x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), class: k === 0 ? 'axis' : 'gl' },
        svg
      );
      S(
        'text',
        { x: m.l - 6, y: sy(v) + 4, class: 'tick', 'text-anchor': 'end' },
        svg,
        v
      );
    });
    [0, 20, 40, 60, 80, 100].forEach((q) => {
      S('line', { x1: sx(q), x2: sx(q), y1: sy(0), y2: sy(0) + 4, class: 'axis' }, svg);
      S(
        'text',
        {
          x: sx(q),
          y: sy(0) + 17,
          class: 'tick',
          'text-anchor': q === 100 ? 'end' : 'middle',
        },
        svg,
        q
      );
    });
    S(
      'text',
      { x: (m.l + W - m.r) / 2, y: Hh - 6, class: 'axis-title', 'text-anchor': 'middle' },
      svg,
      'position q'
    );
    cur = S('line', { y1: m.t, y2: sy(0), class: 'cursor', visibility: 'hidden' }, svg);
    line = S('path', { class: 'ln ln-shift' }, svg);
    pk = S('circle', { r: 5, class: 'mk mk-shift' }, svg);
    pkLab = S('text', { class: 'lbl' }, svg, 'q = p, score 256');
    dot = S('circle', { r: 5.5, class: 'mk-hover', visibility: 'hidden' }, svg);
    geo = { sx, sy };
    update();
  }
  function update() {
    const p = +sp.value;
    out.textContent = p;
    if (!geo) return;
    let d = '';
    for (let q = 0; q <= 100; q++)
      d +=
        (q ? 'L' : 'M') +
        geo.sx(q).toFixed(1) +
        ' ' +
        geo.sy(g[Math.abs(q - p)]).toFixed(1);
    line.setAttribute('d', d);
    set(pk, { cx: geo.sx(p), cy: geo.sy(256) });
    const right = p > 55;
    set(pkLab, {
      x: geo.sx(p) + (right ? -9 : 9),
      y: geo.sy(256) - 8,
      'text-anchor': right ? 'end' : 'start',
    });
  }
  sp.addEventListener('input', update);
  box.addEventListener('pointermove', (e) => {
    if (!geo) return;
    const x = e.clientX - box.getBoundingClientRect().left,
      p = +sp.value;
    const q = Math.max(0, Math.min(100, Math.round(((x - m.l) / (W - m.l - m.r)) * 100))),
      v = g[Math.abs(q - p)];
    set(cur, { x1: geo.sx(q), x2: geo.sx(q), visibility: 'visible' });
    set(dot, { cx: geo.sx(q), cy: geo.sy(v), visibility: 'visible' });
    showTip(
      tip,
      box,
      geo.sx(q),
      geo.sy(v),
      `q = ${q} · ${Math.abs(q - p)} away from p · score ${v.toFixed(1)}`
    );
  });
  box.addEventListener('pointerleave', () => {
    tip.hidden = true;
    if (cur) {
      cur.setAttribute('visibility', 'hidden');
      dot.setAttribute('visibility', 'hidden');
    }
  });
  onWidth(box, (w) => {
    W = w;
    build();
  });
})();

/* 10.3  a rule that looks three words back */
(function figLook() {
  if (!$('#lb-box')) return;
  const box = $('#lb-box'),
    svg = $('#lb-svg'),
    tip = $('#lb-tip'),
    st = $('#lb-t'),
    out = $('#lb-out'),
    note = $('#lb-note'),
    seg = $('#lb-d');
  const N = 40,
    K = 3,
    Hh = 270,
    m = { l: 40, r: 10, t: 14, b: 42 };
  let d = 64,
    W = 0,
    geo = null,
    bars = [];
  const score = (dist) => {
    let v = 0;
    for (let i = 0; i < d / 2; i++) v += Math.cos(dist * Math.pow(10000, (-2 * i) / d));
    return v;
  };
  const fmt = (v) => v.toFixed(d > 8 ? 1 : 2);
  function build() {
    if (!W) return;
    set(svg, { viewBox: `0 0 ${W} ${Hh}`, height: Hh });
    svg.replaceChildren();
    const top = d / 2,
      slot = (W - m.l - m.r) / (N + 1),
      bw = Math.min(24, Math.max(2, slot - 2));
    const sx = (s) => m.l + (s + 0.5) * slot,
      sy = (v) => m.t + (1 - v / top) * (Hh - m.t - m.b);
    for (let q = 0; q <= 4; q++) {
      const v = (top * q) / 4;
      if (q) S('line', { x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), class: 'gl' }, svg);
      S(
        'text',
        { x: m.l - 6, y: sy(v) + 4, class: 'tick', 'text-anchor': 'end' },
        svg,
        v
      );
    }
    bars = [];
    for (let s = 0; s <= N; s++) bars.push(S('path', { class: 'bar' }, svg));
    S('line', { x1: m.l, x2: W - m.r, y1: sy(0), y2: sy(0), class: 'axis' }, svg);
    [0, 10, 20, 30, 40].forEach((s) =>
      S(
        'text',
        { x: sx(s), y: sy(0) + 17, class: 'tick', 'text-anchor': 'middle' },
        svg,
        s
      )
    );
    S(
      'text',
      { x: (m.l + W - m.r) / 2, y: Hh - 6, class: 'axis-title', 'text-anchor': 'middle' },
      svg,
      'position s of the word being looked at'
    );
    geo = { sx, sy, bw, slot };
    update();
  }
  function update() {
    const t = +st.value;
    out.textContent = t;
    if (!geo) return;
    const y0 = geo.sy(0);
    let best = -1,
      bestV = -Infinity;
    bars.forEach((b, s) => {
      const v = Math.max(0, score(t - K - s)),
        x = geo.sx(s) - geo.bw / 2,
        x2 = x + geo.bw,
        y = geo.sy(v),
        r = Math.max(0, Math.min(4, geo.bw / 2, y0 - y));
      b.setAttribute(
        'd',
        `M${x.toFixed(1)} ${y0.toFixed(1)}V${(y + r).toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${(x + r).toFixed(1)} ${y.toFixed(1)}H${(x2 - r).toFixed(1)}Q${x2.toFixed(1)} ${y.toFixed(1)} ${x2.toFixed(1)} ${(y + r).toFixed(1)}V${y0.toFixed(1)}Z`
      );
      b.setAttribute(
        'class',
        s === t - K ? 'bar bar-peak' : s === t ? 'bar bar-self' : 'bar'
      );
      if (s !== t - K && v > bestV + 1e-9) {
        bestV = v;
        best = s;
      }
    });
    note.textContent = `The word at t = ${t} is looking. Highest score: position ${t - K}, three back, with ${fmt(d / 2)}. Next best: position ${best}, with ${fmt(bestV)}.`;
  }
  st.addEventListener('input', update);
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    d = +b.dataset.d;
    press(seg, b);
    build();
  });
  box.addEventListener('pointermove', (e) => {
    if (!geo) return;
    const x = e.clientX - box.getBoundingClientRect().left,
      t = +st.value;
    const s = Math.max(0, Math.min(N, Math.floor((x - m.l) / geo.slot))),
      v = score(t - K - s);
    const rel =
      s === t
        ? 'the word doing the looking'
        : s < t
          ? `${t - s} back from t`
          : `${s - t} ahead of t`;
    showTip(
      tip,
      box,
      geo.sx(s),
      geo.sy(Math.max(0, v)),
      `position ${s} · ${rel} · score ${fmt(v)}`
    );
  });
  box.addEventListener('pointerleave', () => {
    tip.hidden = true;
  });
  onWidth(box, (w) => {
    W = w;
    build();
  });
})();
