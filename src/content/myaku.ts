type Point = [number, number];

const red = "rgb(230, 0, 18)";
const blue = "rgb(0, 104, 183)";

export const mixAnchors = (
  x: number,
  y: number,
  r: number,
  speedRatio: number
) => {
  const a = 0.5522848;

  const speedAnchors = [
    x - r * 0.4,
    y - r,
    // 上→左
    x - r * 1.5,
    y - r,
    x - r * 3.0,
    y - r * 0.5,
    x - r * 3.0,
    y,
    // 左→下
    x - r * 3.0,
    y + r * 0.5,
    x - r * 1.5,
    y + r,
    x - r * 0.5,
    y + r,
    // 下→右
    x + r * 0.7,
    y + r,
    x + r,
    y + r * a,
    x + r,
    y,
    // 右→上
    x + r,
    y - r * a,
    x + r * 0.7,
    y - r,
    x - r * 0.4,
    y - r,
  ];

  const circleAnchors = [
    x,
    y - r,
    // 上→左
    x - r * a,
    y - r,
    x - r,
    y - r * a,
    x - r,
    y,
    // 左→下
    x - r,
    y + r * a,
    x - r * a,
    y + r,
    x,
    y + r,
    // 下→右
    x + r * a,
    y + r,
    x + r,
    y + r * a,
    x + r,
    y,
    // 右→上
    x + r,
    y - r * a,
    x + r * a,
    y - r,
    x,
    y - r,
  ];

  return circleAnchors.map(
    (anchor, index) =>
      anchor * (1.0 - speedRatio) + speedAnchors[index] * speedRatio
  );
};

const rotatePoint = (
  point: Point,
  origin: Point,
  angleInRadians: number
): Point => {
  const [x, y] = point;
  const [originX, originY] = origin;

  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);

  // 中心が原点(0,0)になるように座標を移動
  const translatedX = x - originX;
  const translatedY = y - originY;

  // 原点を中心に回転
  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;

  // 元の中心位置に戻す
  const finalX = rotatedX + originX;
  const finalY = rotatedY + originY;

  return [finalX, finalY];
};

export const getAnchors = (
  x: number,
  y: number,
  r: number,
  speedRatio: number,
  againAngle: number
) => {
  const anchors = mixAnchors(x, y, r, speedRatio);
  const newAnchors: number[] = [];
  for (let i = 0; i < anchors.length; i += 2) {
    const point: Point = [anchors[i], anchors[i + 1]];
    const rotatedPoint = rotatePoint(point, [x, y], againAngle);
    newAnchors.push(...rotatedPoint);
  }
  return newAnchors;
};

export const drawKomyaku = (
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    r: number;
    a: number;
    d: number;
    againAngle: number;
    eyeRatio: number;
    eyeScale: number;
    color: "red" | "blue";
  }
) => {
  const { x, y, r, a, d, againAngle, eyeRatio, eyeScale, color } = params;

  const speedRatio = Math.min(Math.max(a / 400, 0), 1);
  const anchors = getAnchors(x, y, r, speedRatio, againAngle);

  // 胴体の描画
  ctx.fillStyle = color === "red" ? red : blue;
  ctx.beginPath();
  ctx.moveTo(anchors[0], anchors[1]);
  ctx.bezierCurveTo(
    anchors[2],
    anchors[3],
    anchors[4],
    anchors[5],
    anchors[6],
    anchors[7]
  );
  ctx.bezierCurveTo(
    anchors[8],
    anchors[9],
    anchors[10],
    anchors[11],
    anchors[12],
    anchors[13]
  );
  ctx.bezierCurveTo(
    anchors[14],
    anchors[15],
    anchors[16],
    anchors[17],
    anchors[18],
    anchors[19]
  );
  ctx.bezierCurveTo(
    anchors[20],
    anchors[21],
    anchors[22],
    anchors[23],
    anchors[24],
    anchors[25]
  );
  ctx.closePath();
  ctx.fill();

  // 白目の描画
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    x + r * 0.42 * d * Math.cos(againAngle),
    y + r * 0.42 * d * Math.sin(againAngle),
    r * 0.45 * eyeScale,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();

  const t0 = eyeRatio - 1.0;
  const adjustedEyeRatio = (1.0 - t0 * t0) * 0.6 + 0.4;

  // 青目の描画
  ctx.fillStyle = blue;
  ctx.beginPath();
  ctx.ellipse(
    x + r * 0.55 * d * Math.cos(againAngle),
    y + r * 0.55 * d * Math.sin(againAngle),
    r * 0.2 * eyeScale,
    r * 0.2 * eyeScale * adjustedEyeRatio,
    againAngle + Math.PI / 2,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();
};
