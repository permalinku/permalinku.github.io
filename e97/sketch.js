let rings = [];
let time = 0;
let shockwave = 0;

// 🩸 background grid motion
let gridOffsetX = 0;
let gridOffsetY = 0;

function setup() {
  createCanvas(1024, 768);
  angleMode(DEGREES);
  strokeCap(ROUND);

  let maxR = sqrt(width * width + height * height) * 0.7;
  let step = 12;

  for (let r = step; r < maxR; r += step) {
    rings.push(new IllusionRing(r));
  }
}

function draw() {
  background(8, 0, 18);

  drawBackgroundGrid();

  // 🌀 optional drifting center (keep it subtle)
  let offsetX = sin(time * 0.3) * 20;
  let offsetY = cos(time * 0.2) * 15;

  translate(width / 2 + offsetX, height / 2 + offsetY);

  time += 0.6;
  shockwave *= 0.9;

  for (let ring of rings) {
    ring.update();
    ring.display();
  }

  drawVignette();
}

function mousePressed() {
  shockwave = 30;

  // phase inversion
  for (let i = 0; i < rings.length; i++) {
    if (i % 2 === 0) rings[i].phase += 180;
  }

  // reverse grid
  gridOffsetX *= -1;
  gridOffsetY *= -1;
}

// 🩸 BACKGROUND GRID
function drawBackgroundGrid() {
  push();

  gridOffsetX += 0.05;
  gridOffsetY += 0.025;

  let spacing = 200;

  stroke(90, 0, 25, 50);
  strokeWeight(1.2);

  for (let x = -spacing; x < width + spacing; x += spacing) {
    let xPos = (x + gridOffsetX) % spacing;
    line(xPos, 0, xPos, height);
  }

  for (let y = -spacing; y < height + spacing; y += spacing) {
    let yPos = (y + gridOffsetY) % spacing;
    line(0, yPos, width, yPos);
  }

  pop();
}

// 🌫️ VIGNETTE
function drawVignette() {
  push();
  noFill();

  for (let i = 0; i < 60; i++) {
    stroke(8, 0, 18, 12);
    ellipse(width / 2, height / 2, width + i * 12, height + i * 12);
  }

  pop();
}

class IllusionRing {
  constructor(radius) {
    this.radius = radius;
    this.phase = random(360);

    // ⚡ optimized segment scaling
    this.segmentCount = int(map(radius, 0, width, 60, 80));
  }

  update() {
    this.phase += 0.25;
  }

  display() {
    // 🧹 skip ultra-small rings (free performance)
    if (this.radius < 20) return;

    let angleStep = 360 / this.segmentCount;

    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let distMouse = sqrt(dx * dx + dy * dy);
    let distortion = map(distMouse, 0, width, 25, -25);

    for (let i = 0; i < this.segmentCount; i++) {
      let angle = i * angleStep;

      let drift = map(sin(time + this.radius * 0.05), -1, 1, -3, 3);

      // ⚡ reduced shockwave cost
      let wave = sin(time * 3 + this.radius * 0.12 + i) * shockwave * 0.5;

      let jitter = sin(this.radius * 0.25 + i * 2 + time) * 2;

      let a1 = angle + this.phase + distortion + drift + wave + jitter;
      let a2 = a1 + angleStep * 0.65;

      // 🧠 cache trig (faster)
      let cosA1 = cos(a1);
      let sinA1 = sin(a1);
      let cosA2 = cos(a2);
      let sinA2 = sin(a2);

      let x1 = cosA1 * this.radius;
      let y1 = sinA1 * this.radius;
      let x2 = cosA2 * this.radius;
      let y2 = sinA2 * this.radius;

      let t = sin(angle * 3 + this.phase + time);

      let cMidBright = color(
        160 + 80 * t,
        40,
        220 + 35 * sin(time)
      );

      let cMidDark = color(
        60,
        0,
        120 + 40 * t
      );

      let choice = i % 4;

      if (choice === 0) stroke(255);
      else if (choice === 1) stroke(cMidBright);
      else if (choice === 2) stroke(50);
      else stroke(cMidDark);

      strokeWeight(3);

      // ⚡ FAST line instead of arc
      line(x1, y1, x2, y2);
    }
  }
}