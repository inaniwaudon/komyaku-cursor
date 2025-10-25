const R = "rgb(230, 0, 18)", I = "rgb(0, 104, 183)", C = (t, n, e, l) => {
  const i = 0.5522848, d = [
    t - e * 0.4,
    n - e,
    // 上→左
    t - e * 1.5,
    n - e,
    t - e * 3,
    n - e * 0.5,
    t - e * 3,
    n,
    // 左→下
    t - e * 3,
    n + e * 0.5,
    t - e * 1.5,
    n + e,
    t - e * 0.5,
    n + e,
    // 下→右
    t + e * 0.7,
    n + e,
    t + e,
    n + e * i,
    t + e,
    n,
    // 右→上
    t + e,
    n - e * i,
    t + e * 0.7,
    n - e,
    t - e * 0.4,
    n - e
  ];
  return [
    t,
    n - e,
    // 上→左
    t - e * i,
    n - e,
    t - e,
    n - e * i,
    t - e,
    n,
    // 左→下
    t - e,
    n + e * i,
    t - e * i,
    n + e,
    t,
    n + e,
    // 下→右
    t + e * i,
    n + e,
    t + e,
    n + e * i,
    t + e,
    n,
    // 右→上
    t + e,
    n - e * i,
    t + e * i,
    n - e,
    t,
    n - e
  ].map(
    (o, s) => o * (1 - l) + d[s] * l
  );
}, k = (t, n, e) => {
  const [l, i] = t, [d, c] = n, o = Math.cos(e), s = Math.sin(e), h = l - d, u = i - c, r = h * o - u * s, a = h * s + u * o, w = r + d, y = a + c;
  return [w, y];
}, L = (t, n, e, l, i) => {
  const d = C(t, n, e, l), c = [];
  for (let o = 0; o < d.length; o += 2) {
    const s = [d[o], d[o + 1]], h = k(s, [t, n], i);
    c.push(...h);
  }
  return c;
}, P = (t, n) => {
  const { x: e, y: l, r: i, a: d, d: c, againAngle: o, eyeRatio: s, eyeScale: h, color: u } = n, r = Math.min(Math.max(d / 400, 0), 1), a = L(e, l, i, r, o);
  t.fillStyle = u === "red" ? R : I, t.beginPath(), t.moveTo(a[0], a[1]), t.bezierCurveTo(
    a[2],
    a[3],
    a[4],
    a[5],
    a[6],
    a[7]
  ), t.bezierCurveTo(
    a[8],
    a[9],
    a[10],
    a[11],
    a[12],
    a[13]
  ), t.bezierCurveTo(
    a[14],
    a[15],
    a[16],
    a[17],
    a[18],
    a[19]
  ), t.bezierCurveTo(
    a[20],
    a[21],
    a[22],
    a[23],
    a[24],
    a[25]
  ), t.closePath(), t.fill(), t.fillStyle = "white", t.beginPath(), t.arc(
    e + i * 0.42 * c * Math.cos(o),
    l + i * 0.42 * c * Math.sin(o),
    i * 0.45 * h,
    0,
    2 * Math.PI
  ), t.closePath(), t.fill();
  const w = s - 1, y = (1 - w * w) * 0.6 + 0.4;
  t.fillStyle = I, t.beginPath(), t.ellipse(
    e + i * 0.55 * c * Math.cos(o),
    l + i * 0.55 * c * Math.sin(o),
    i * 0.2 * h,
    i * 0.2 * h * y,
    o + Math.PI / 2,
    0,
    2 * Math.PI
  ), t.closePath(), t.fill();
};
let v = [];
const D = () => {
  v = [];
  const t = document.querySelectorAll(".clickable-highlight");
  for (const l of t)
    l.remove();
  const n = [
    "a[href]",
    "button",
    'input[type="button"]',
    'input[type="submit"]',
    '[role="button"]',
    "[onclick]"
  ], e = document.querySelectorAll(n.join(","));
  for (const l of e) {
    if (!(l instanceof HTMLElement) || !l.checkVisibility())
      continue;
    const i = l.getBoundingClientRect();
    if (i.width === 0 || i.height === 0)
      continue;
    const d = {
      element: l,
      x: i.left,
      y: i.top,
      width: i.width,
      height: i.height
    };
    v.push(d);
  }
};
D();
window.addEventListener("scroll", () => {
  D();
});
window.addEventListener("resize", () => {
  D();
});
const A = document.createElement("canvas");
A.className = "cursor";
A.width = window.innerWidth * 2;
A.height = window.innerHeight * 2;
document.body.appendChild(A);
let T = null, g = null, m = [], f = null, E = [], p = [], M = 1, b = null;
window.addEventListener("pointermove", (t) => {
  T = g, g = {
    x: t.clientX,
    y: t.clientY,
    t: performance.now()
  };
});
window.addEventListener("pointerdown", (t) => {
  m = [
    {
      x: t.clientX,
      y: t.clientY,
      r: 30 * 1.2,
      t: performance.now(),
      target: f ?? void 0
    }
  ], f && E.push(f), b = "minus";
});
window.addEventListener("pointerup", () => {
  m = [], p = [], E.at(-1)?.element.click();
  for (const t of E)
    t.element.classList.add("selected");
  E = [];
});
window.addEventListener("keydown", (t) => {
  t.key === "Escape" && (p = []);
});
const S = () => {
  if (!g) {
    requestAnimationFrame(S);
    return;
  }
  b === "minus" ? (M -= 0.2, M <= 0 && (M = 0, b = "plus")) : b === "plus" && (M += 0.2, M >= 1 && (M = 1, b = null));
  const t = A.getContext("2d");
  if (t.clearRect(0, 0, A.width, A.height), p.length > 0) {
    const n = [...p].sort((s, h) => s.x - h.x);
    let e = 0;
    for (const s of n)
      e += s.x + s.width / 2;
    e /= n.length;
    const l = 400, i = e - l / 2, d = l / n.length, c = Math.floor((g.x - i) / d);
    if (c < -1 || c > n.length) {
      p = [], requestAnimationFrame(S);
      return;
    }
    const o = Math.max(
      Math.min(c, n.length - 1),
      0
    );
    f = n[o], n.splice(o, 1), n.push(f);
    for (const s of n) {
      const h = s.x + s.width / 2, u = s.y + s.height / 2;
      let r = 0;
      f && (r = Math.atan2(
        u - (f.y + f.height / 2),
        h - (f.x + f.width / 2)
      ));
      const a = r + Math.PI, w = s === f ? 0 : 1, y = s === f ? "blue" : "red";
      P(t, {
        x: h * 2,
        y: u * 2,
        r: 30,
        a: 0,
        d: w,
        againAngle: a,
        eyeRatio: 1,
        eyeScale: 1,
        color: y
      });
    }
  } else {
    let n = null, e = 1 / 0;
    for (const c of v) {
      const o = Math.hypot(
        g.x - (c.x + c.width / 2),
        g.y - (c.y + c.height / 2)
      );
      o < e && (n = c, e = o);
    }
    if (n && (f = n, m.length > 0 && (E.includes(n) || E.push(n))), m.length > 0) {
      const c = m.at(-1).x, o = m.at(-1).y, s = Math.hypot(
        g.x - c,
        g.y - o
      );
      if (s > 30) {
        const h = f && !m.map((u) => u.target).includes(f);
        m.push({
          x: g.x,
          y: g.y,
          r: h ? s * 1.2 : s * 1,
          t: performance.now(),
          target: h ? f : void 0
        });
      }
      if (m.length > 1) {
        const h = m.filter((r) => r.target), u = m.filter((r) => !r.target);
        for (const r of [...u, ...h]) {
          let a = 0;
          r.target && (a = Math.atan2(
            r.y - (r.target.y + r.target.height / 2),
            r.x - (r.target.x + r.target.width / 2)
          ));
          const w = 0.2 * Math.sin(2 * Math.PI * (performance.now() - r.t) / 800), y = a + Math.PI + w;
          P(t, {
            x: r.x * 2,
            y: r.y * 2,
            r: r.r * 1.2,
            a: 0,
            d: 1,
            againAngle: y,
            eyeRatio: 1,
            eyeScale: r.target ? 1 : 0,
            color: "red"
          });
        }
      }
    }
    let l = 0;
    n && (l = Math.atan2(
      g.y - (n.y + n.height / 2),
      g.x - (n.x + n.width / 2)
    ));
    const i = l + Math.PI;
    let d = 0;
    if (T) {
      const o = (performance.now() - T.t) / 1e3, s = g.x - T.x, h = g.y - T.y;
      d = Math.hypot(s, h) / o;
    }
    if (P(t, {
      x: g.x * 2,
      y: g.y * 2,
      r: 30,
      a: d,
      d: 1,
      againAngle: i,
      eyeRatio: M,
      eyeScale: 1,
      color: "red"
    }), d < 50) {
      const c = [];
      for (const o of v)
        Math.hypot(
          g.x - (o.x + o.width / 2),
          g.y - (o.y + o.height / 2)
        ) < 100 && c.push(o);
      if (c.length > 4) {
        p = c;
        for (const o of p)
          for (const s of v)
            p.includes(s) || Math.hypot(
              o.x - (s.x + s.width / 2),
              o.y - (s.y + s.height / 2)
            ) < 100 && p.push(s);
      }
    }
  }
  requestAnimationFrame(S);
};
S();
