let rings = [];
let vortices = [];
let t = 0;
let pulse = 0;

// Click system
let clickX = 0;
let clickY = 0;
let shockwave = 0;

// NEW: dynamic center
let centerX, centerY;
let targetCenterX, targetCenterY;

function setup() {
  createCanvas(1024, 768);
  angleMode(DEGREES);

  // Initial center
  centerX = width / 2;
  centerY = height / 2;
  targetCenterX = centerX;
  targetCenterY = centerY;

  // Rings
  for (let i = 0; i < 12; i++) {
    rings.push(new Ring(i * 30 + 50));
  }

  // Initial vortices
  for (let i = 0; i < 4; i++) {
    vortices.push({
      x: random(width),
      y: random(height),
      phase: random(360)
    });
  }
}

function draw() {
  background(5, 20, 30, 40);

  // Smooth center movement
  centerX = lerp(centerX, targetCenterX, 0.08);
  centerY = lerp(centerY, targetCenterY, 0.08);

  translate(centerX, centerY);

  drawWaveField();

  for (let r of rings) {
    r.update();
    r.display();
  }

  drawVortices();
  drawShockwave();

  t += 0.6;
  pulse *= 0.95;
  shockwave *= 0.92;
}

// =======================
// RINGS
// =======================
class Ring {
  constructor(radius) {
    this.baseRadius = radius;
    this.offset = random(360);
  }

  update() {
    this.radius =
      this.baseRadius +
      sin(t + this.offset) * 10 +
      pulse * 20;
  }

  display() {
    let segments = 60;
    let angleStep = 360 / segments;

    for (let i = 0; i < segments; i++) {
      let angle = i * angleStep;

      let distortion = getDistortion(
        cos(angle) * this.radius,
        sin(angle) * this.radius
      );

      let r = this.radius + distortion;

      let x1 = cos(angle) * r;
      let y1 = sin(angle) * r;

      let x2 = cos(angle + angleStep) * r;
      let y2 = sin(angle + angleStep) * r;

      let hueShift = map(sin(angle * 3 + t), -1, 1, 0, 100);

      stroke(0, 150 + hueShift, 200 + hueShift, 180);
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }
  }
}

// =======================
// WAVE FIELD
// =======================
function drawWaveField() {
  push();
  translate(-centerX, -centerY);

  for (let x = 0; x < width; x += 25) {
    for (let y = 0; y < height; y += 25) {

      let dx = x - mouseX;
      let dy = y - mouseY;
      let distMouse = sqrt(dx * dx + dy * dy);

      let wave =
        sin(x * 0.02 + t) +
        cos(y * 0.02 - t) +
        sin(distMouse * 0.05 - t * 2);

      let brightness = map(wave, -3, 3, 50, 255);

      stroke(0, brightness, brightness + 50, 120);
      point(x, y);
    }
  }

  pop();
}

// =======================
// VORTICES
// =======================
function drawVortices() {
  push();
  translate(-centerX, -centerY);

  noFill();

  for (let v of vortices) {
    v.phase += 1;

    let r = 30 + sin(v.phase + t) * 10;

    stroke(0, 200, 255, 120);
    ellipse(v.x, v.y, r * 2);

    for (let a = 0; a < 360; a += 45) {
      let x = v.x + cos(a + v.phase) * r;
      let y = v.y + sin(a + v.phase) * r;

      stroke(0, 255, 180, 150);
      line(v.x, v.y, x, y);
    }
  }

  pop();
}

// =======================
// DISTORTION
// =======================
function getDistortion(x, y) {
  let total = 0;

  for (let v of vortices) {
    let dx = x + centerX - v.x;
    let dy = y + centerY - v.y;
    let d = sqrt(dx * dx + dy * dy);

    total += sin(d * 0.05 - t + v.phase) * 5;
  }

  // Mouse gravity
  let mdx = x + centerX - mouseX;
  let mdy = y + centerY - mouseY;
  let md = sqrt(mdx * mdx + mdy * mdy);

  total += 50 / (md + 50);

  // Shockwave from click
  let dx = x + centerX - clickX;
  let dy = y + centerY - clickY;
  let d = sqrt(dx * dx + dy * dy);

  total += sin(d * 0.1 - t * 4) * 10 * shockwave;

  return total;
}

// =======================
// SHOCKWAVE
// =======================
function drawShockwave() {
  if (shockwave < 0.01) return;

  push();
  translate(-centerX, -centerY);

  noFill();
  stroke(0, 255, 200, 150 * shockwave);
  strokeWeight(3);

  let maxR = 600;
  let r = maxR * (1 - shockwave);

  ellipse(clickX, clickY, r * 2);

  pop();
}

// =======================
// INTERACTION
// =======================
function mousePressed() {
  clickX = mouseX;
  clickY = mouseY;

  // Move system center to click
  targetCenterX = mouseX;
  targetCenterY = mouseY;

  pulse = 20;
  shockwave = 1;

  // Spawn vortex at click
  vortices.push({
    x: mouseX,
    y: mouseY,
    phase: random(360)
  });

  // Limit vortices
  if (vortices.length > 10) {
    vortices.shift();
  }

  // Push existing vortices away
  for (let v of vortices) {
    let dx = v.x - mouseX;
    let dy = v.y - mouseY;
    let d = sqrt(dx * dx + dy * dy) + 0.01;

    v.x += (dx / d) * 50;
    v.y += (dy / d) * 50;
  }
}