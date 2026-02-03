let t = 0;
let impulses = [];

function setup() {
  createCanvas(800, 600);
  pixelDensity(window.devicePixelRatio || 1);
  noiseDetail(4, 0.5);
}

function draw() {
  background(10, 12, 18);

  translate(0, height * 0.1);

  // Update impulses
  for (let i = impulses.length - 1; i >= 0; i--) {
    impulses[i].life -= 0.01;
    if (impulses[i].life <= 0) {
      impulses.splice(i, 1);
    }
  }

  let ribbonCount = 40;
  let ribbonSpacing = height / ribbonCount;

  for (let i = 0; i < ribbonCount; i++) {
    let yBase = i * ribbonSpacing;
    drawRibbon(yBase, i);
  }

  t += 0.005;
}

function drawRibbon(yBase, index) {
  let pointsTop = [];
  let pointsBottom = [];

  let thicknessBase = map(
    noise(index * 0.2, t),
    0, 1,
    6, 20
  );

  for (let x = 0; x <= width; x += 10) {
    let nx = x * 0.003;
    let ny = yBase * 0.01;

    let flow = noise(nx, ny, t);
    let wave = sin(x * 0.01 + t * 2 + index);

    let offsetY =
      flow * 60 +
      wave * 12;

    // --- CLICK INFLUENCE ---
    let interactionOffset = 0;
    for (let imp of impulses) {
      let d = dist(x, yBase + offsetY, imp.x, imp.y);
      let influence = exp(-d * 0.02) * imp.life;
      interactionOffset += influence * 80;
    }

    offsetY += interactionOffset;

    let thickness =
      thicknessBase *
      map(noise(nx + 5, ny + t), 0, 1, 0.4, 1.2);

    pointsTop.push({
      x: x,
      y: yBase + offsetY - thickness
    });

    pointsBottom.push({
      x: x,
      y: yBase + offsetY + thickness
    });
  }

  let hueShift = map(noise(index * 0.1, t), 0, 1, 180, 240);
  stroke(200, 220, 255, 80);
  fill(40, 90 + hueShift * 0.2, 120 + hueShift * 0.1, 120);

  beginShape();
  for (let p of pointsTop) {
    vertex(p.x, p.y);
  }
  for (let i = pointsBottom.length - 1; i >= 0; i--) {
    vertex(pointsBottom[i].x, pointsBottom[i].y);
  }
  endShape(CLOSE);
}

function mousePressed() {
  impulses.push({
    x: mouseX,
    y: mouseY - height * 0.1,
    life: 1
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

