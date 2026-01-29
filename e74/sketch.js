let t = 0;
let smoothFieldStrength = 0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(240, 30, 5, 100);
  translate(width / 2, height / 2);

  // mouse in polar space
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  let mDist = constrain(dist(0, 0, mx, my), 0, width / 2);
  let mAngle = atan2(my, mx);

  let layers = 22;
  let baseRadius = 40;
  let spacing = 14;

  // interaction strength
  let targetStrength = map(mDist, 0, width / 2, 24, 4);
  if (mouseIsPressed) targetStrength *= 1.6;

  smoothFieldStrength = lerp(
  smoothFieldStrength,
  targetStrength,
  0.08   // viscosity (lower = heavier, gooier)
  );


  for (let i = 0; i < layers; i++) {
    let r = baseRadius + i * spacing;

    let hue = map(i, 0, layers - 1, 280, 200);
    stroke(hue, 70, 95, 90);

    beginShape();
    let points = 240;

    for (let j = 0; j <= points; j++) {
      let a = map(j, 0, points, 0, TWO_PI);

      // mouse-driven angular bias
      let angleWarp = sin(a - mAngle) * 0.3;

      let wave1 = sin((a + angleWarp) * 3 + t);
      let wave2 = sin((a + angleWarp) * 5 - t * 0.6);
      let wave3 = sin((a + angleWarp) * 7 + i * 0.3);

      let distortion =
        wave1 * smoothFieldStrength +
        wave2 * (smoothFieldStrength * 0.6) +
        wave3 * (smoothFieldStrength * 0.4);

      let radius = r + distortion;

      let x = cos(a) * radius;
      let y = sin(a) * radius;

      curveVertex(x, y);
    }
    endShape(CLOSE);
  }

  t += 0.015;
}
