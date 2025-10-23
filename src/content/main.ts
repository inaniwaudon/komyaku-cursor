import "./main.css";
import { drawKomyaku } from "./myaku";

const DEBUG = true;
const DENSE_DISTANCE = 100;
const RADIUS = 30;

interface Target {
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

let targets: Target[] = [];

const draw = () => {
  targets = [];

  const toRemoveElements = document.querySelectorAll(".clickable-highlight");
  for (const element of toRemoveElements) {
    element.remove();
  }

  const selectors = [
    "a[href]",
    "button",
    'input[type="button"]',
    'input[type="submit"]',
    '[role="button"]',
    "[onclick]",
  ];

  const clickableElements = document.querySelectorAll(selectors.join(","));

  for (const element of clickableElements) {
    if (!(element instanceof HTMLElement) || !element.checkVisibility()) {
      continue;
    }
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      continue;
    }

    // ターゲットを追加
    const newTarget: Target = {
      element,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
    targets.push(newTarget);

    // div を描画
    if (DEBUG) {
      const highlight = document.createElement("div");
      highlight.className = "clickable-highlight";
      Object.assign(highlight.style, {
        left: `${rect.left + window.scrollX}px`,
        top: `${rect.top + window.scrollY}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      document.body.appendChild(highlight);
    }
  }
};

draw();
window.addEventListener("scroll", () => {
  draw();
});
window.addEventListener("resize", () => {
  draw();
});

// ポインタを追従する cavas の生成
const canvas = document.createElement("canvas");
canvas.className = "cursor";
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
document.body.appendChild(canvas);

// 状態
let prevPointer: { x: number; y: number; t: number } | null = null;
let currentPointer: { x: number; y: number; t: number } | null = null;
// ポインタが押下された時の情報．空配列でない場合は押下中とする．
let pointerDowns: {
  x: number;
  y: number;
  t: number;
  r: number;
  target?: Target;
}[] = [];

// 最も近接したターゲット
let nearestTarget: Target | null = null;
// 選択状態のターゲット
let selectedTargets: Target[] = [];
// 密集状態におけるターゲット．空配列でない場合は密集状態とする．
let denseTargets: Target[] = [];

// 目の状態
let eyeRatio = 1.0;
let eyeMovement: "minus" | "plus" | null = null;

window.addEventListener("pointermove", (e) => {
  prevPointer = currentPointer;
  currentPointer = {
    x: e.clientX,
    y: e.clientY,
    t: performance.now(),
  };
});

window.addEventListener("pointerdown", (e) => {
  pointerDowns = [
    {
      x: e.clientX,
      y: e.clientY,
      r: RADIUS * 1.2,
      t: performance.now(),
      target: nearestTarget ?? undefined,
    },
  ];
  if (nearestTarget) {
    selectedTargets.push(nearestTarget);
  }
  eyeMovement = "minus";
});

window.addEventListener("pointerup", () => {
  pointerDowns = [];
  denseTargets = [];

  // 選択処理
  selectedTargets.at(-1!)?.element.click();
  for (const target of selectedTargets) {
    target.element.classList.add("selected");
  }
  selectedTargets = [];
});

window.addEventListener("keydown", (e) => {
  // Escape キーで密集状態を解除
  if ((e as KeyboardEvent).key === "Escape") {
    denseTargets = [];
  }
});

const loop = () => {
  if (!currentPointer) {
    requestAnimationFrame(loop);
    return;
  }

  if (eyeMovement === "minus") {
    eyeRatio -= 0.2;
    if (eyeRatio <= 0) {
      eyeRatio = 0;
      eyeMovement = "plus";
    }
  } else if (eyeMovement === "plus") {
    eyeRatio += 0.2;
    if (eyeRatio >= 1.0) {
      eyeRatio = 1.0;
      eyeMovement = null;
    }
  }

  // canvas の初期化
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 密集状態
  if (denseTargets.length > 0) {
    // denseTarget を x順にソート
    const sortedDenseTargets = [...denseTargets].sort((a, b) => a.x - b.x);

    // 平均 x 座標を算出
    let averageX = 0;
    for (const target of sortedDenseTargets) {
      averageX += target.x + target.width / 2;
    }
    averageX /= sortedDenseTargets.length;

    const selectionWidth = 400;
    const left = averageX - selectionWidth / 2;
    const regionWidth = selectionWidth / sortedDenseTargets.length;

    // 現在のポインタがどの領域にあるかを算出
    const index = Math.floor((currentPointer.x - left) / regionWidth);
    if (index < -1 || index > sortedDenseTargets.length) {
      denseTargets = [];
      requestAnimationFrame(loop);
      return;
    }
    const ajustedIndex = Math.max(
      0,
      Math.min(index, sortedDenseTargets.length - 1)
    );

    nearestTarget = sortedDenseTargets[ajustedIndex];
    sortedDenseTargets.splice(ajustedIndex, 1);
    sortedDenseTargets.push(nearestTarget);

    for (const target of sortedDenseTargets) {
      const x = target.x + target.width / 2;
      const y = target.y + target.height / 2;

      // 各ポインタから最も近いターゲットまでの角度を算出
      let angle = 0;
      if (nearestTarget) {
        angle = Math.atan2(
          y - (nearestTarget.y + nearestTarget.height / 2),
          x - (nearestTarget.x + nearestTarget.width / 2)
        );
      }
      const againAngle = angle + Math.PI;
      const d = target === nearestTarget ? 0 : 1;
      const color = target === nearestTarget ? "blue" : "red";
      drawKomyaku(ctx, {
        x: x * 2,
        y: y * 2,
        r: RADIUS,
        a: 0,
        d: d,
        againAngle: againAngle,
        eyeRatio: 1.0,
        eyeScale: 1,
        color: color,
      });
    }
  }

  // 密集していない状態
  else {
    // 最も近いターゲットを計算
    let tempTargets: Target | null = null;
    let nearestDistance = Infinity;
    for (const target of targets) {
      const distance = Math.hypot(
        currentPointer.x - (target.x + target.width / 2),
        currentPointer.y - (target.y + target.height / 2)
      );
      if (distance < nearestDistance) {
        tempTargets = target;
        nearestDistance = distance;
      }
    }
    if (tempTargets) {
      nearestTarget = tempTargets;
      if (pointerDowns.length > 0) {
        if (!selectedTargets.includes(tempTargets)) {
          selectedTargets.push(tempTargets);
        }
      }
    }

    // ミャクミャク（連なっている姿）を描画
    if (pointerDowns.length > 0) {
      const beforeX = pointerDowns.at(-1)!.x;
      const beforeY = pointerDowns.at(-1)!.y;
      const distance = Math.hypot(
        currentPointer.x - beforeX,
        currentPointer.y - beforeY
      );

      // 追加
      if (distance > RADIUS) {
        const existsTarget =
          nearestTarget &&
          !pointerDowns.map((p) => p.target).includes(nearestTarget);
        pointerDowns.push({
          x: currentPointer.x,
          y: currentPointer.y,
          r: existsTarget ? distance * 1.2 : distance * 1.0,
          t: performance.now(),
          target: existsTarget ? nearestTarget! : undefined,
        });
      }

      if (pointerDowns.length > 1) {
        // 目玉付きか否かで分別
        const eyeTargets = pointerDowns.filter((p) => p.target);
        const noEyeTargets = pointerDowns.filter((p) => !p.target);

        // ポインタから最も近いターゲットまでの角度を計算
        for (const pointerDown of [...noEyeTargets, ...eyeTargets]) {
          let angle = 0;
          if (pointerDown.target) {
            angle = Math.atan2(
              pointerDown.y -
                (pointerDown.target.y + pointerDown.target.height / 2),
              pointerDown.x -
                (pointerDown.target.x + pointerDown.target.width / 2)
            );
          }

          const a =
            0.2 *
            Math.sin((2 * Math.PI * (performance.now() - pointerDown.t)) / 800);
          const againAngle = angle + Math.PI + a;

          drawKomyaku(ctx, {
            x: pointerDown.x * 2.0,
            y: pointerDown.y * 2.0,
            r: pointerDown.r * 1.2,
            a: 0,
            d: 1,
            againAngle,
            eyeRatio: 1,
            eyeScale: pointerDown.target ? 1 : 0,
            color: "red",
          });
        }
      }
    }

    // ポインタから最も近いターゲットまでの角度を計算
    let angle = 0;
    if (tempTargets) {
      angle = Math.atan2(
        currentPointer.y - (tempTargets.y + tempTargets.height / 2),
        currentPointer.x - (tempTargets.x + tempTargets.width / 2)
      );
    }
    const againAngle = angle + Math.PI;

    // ポインタの加速度を取得
    let a = 0;
    if (prevPointer) {
      const currTime = performance.now();
      const dt = (currTime - prevPointer.t) / 1000;
      const dx = currentPointer.x - prevPointer.x;
      const dy = currentPointer.y - prevPointer.y;
      a = Math.hypot(dx, dy) / dt;
    }
    drawKomyaku(ctx, {
      x: currentPointer.x * 2.0,
      y: currentPointer.y * 2.0,
      r: RADIUS,
      a: a,
      d: 1,
      againAngle: againAngle,
      eyeRatio: eyeRatio,
      eyeScale: 1,
      color: "red",
    });

    if (a < 50) {
      const tempDenseTargets = [];
      for (const target of targets) {
        const distance = Math.hypot(
          currentPointer.x - (target.x + target.width / 2),
          currentPointer.y - (target.y + target.height / 2)
        );
        if (distance < DENSE_DISTANCE) {
          tempDenseTargets.push(target);
        }
      }

      // 密集状態にする
      if (tempDenseTargets.length > 4) {
        denseTargets = tempDenseTargets;

        for (const denseTarget of denseTargets) {
          for (const target of targets) {
            if (!denseTargets.includes(target)) {
              const distance = Math.hypot(
                denseTarget.x - (target.x + target.width / 2),
                denseTarget.y - (target.y + target.height / 2)
              );
              if (distance < DENSE_DISTANCE) {
                denseTargets.push(target);
              }
            }
          }
        }
      }
    }
  }
  requestAnimationFrame(loop);
};

loop();
