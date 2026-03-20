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

  // 🔥 expanded beyond screen
  let maxR = sqrt(width * width + height * height) * 0.7;
  let step = 12; // more rings

  for (let r = step; r < maxR; r += step) {
    rings.push(new IllusionRing(r));
  }
}

function draw() {
  background(8, 0, 18);

  // 🩸 background grid
  drawBackgroundGrid();

  translate(width / 2, height / 2);

  time += 0.6;
  shockwave *= 0.9;

  for (let ring of rings) {
    ring.update();
    ring.display();
  }

  // 🌫️ vignette (removes hard edges)
  drawVignette();
}

function mousePressed() {
  shockwave = 30;

  // phase inversion
  for (let i = 0; i < rings.length; i++) {
    if (i % 2 === 0) {
      rings[i].phase += 180;
    }
  }

  // reverse grid direction
  gridOffsetX *= -1;
  gridOffsetY *= -1;
}

// 🩸 BACKGROUND GRID (large + slow)
function drawBackgroundGrid() {
  push();

  gridOffsetX += 0.05;
  gridOffsetY += 0.025;

  let spacing = 200;

  stroke(90, 0, 25, 50);
  strokeWeight(1.2);

  // vertical
  for (let x = -spacing; x < width + spacing; x += spacing) {
    let xPos = (x + gridOffsetX) % spacing;
    line(xPos, 0, xPos, height);
  }

  // horizontal
  for (let y = -spacing; y < height + spacing; y += spacing) {
    let yPos = (y + gridOffsetY) % spacing;
    line(0, yPos, width, yPos);
  }

  pop();
}

// 🌫️ EDGE FADE
function drawVignette() {
  push();
  noFill();

  for (let i = 0; i < 80; i++) {
    stroke(8, 0, 18, 10);
    ellipse(width / 2, height / 2, width + i * 10, height + i * 10);
  }

  pop();
}

class IllusionRing {
  constructor(radius) {
    this.radius = radius;
    this.phase = random(360);

    // balanced performance
    this.segmentCount = int(map(radius, 0, width, 40, 120));
  }

  update() {
    this.phase += 0.25;
  }

  display() {
    let angleStep = 360 / this.segmentCount;

    // mouse distortion
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let distMouse = sqrt(dx * dx + dy * dy);
    let distortion = map(distMouse, 0, width, 25, -25);

    for (let i = 0; i < this.segmentCount; i++) {
      let angle = i * angleStep;

      // 🌊 drift
      let drift = map(sin(time + this.radius * 0.05), -1, 1, -3, 3);

      // ⚡ shockwave
      let wave = sin(time * 3 + this.radius * 0.12 + i) * shockwave;

      // ✴️ jitter
      let jitter = sin(this.radius * 0.25 + i * 2 + time) * 2;

      let finalAngle =
        angle + this.phase + distortion + drift + wave + jitter;

      // 🎨 luminance driver
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

      // ⚡ luminance hierarchy
      let choice = i % 4;

      if (choice === 0) stroke(255);
      else if (choice === 1) stroke(cMidBright);
      else if (choice === 2) stroke(50);
      else stroke(cMidDark);

      strokeWeight(3);

      noFill();
      arc(
        0,
        0,
        this.radius * 2,
        this.radius * 2,
        finalAngle,
        finalAngle + angleStep * 0.65
      );
    }
  }
}