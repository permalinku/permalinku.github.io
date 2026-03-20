let rings = [];
let time = 0;
let shockwave = 0;

function setup() {
  createCanvas(1024, 768);
  angleMode(DEGREES);
  strokeCap(ROUND);

  let maxR = min(width, height) * 0.45;
  let step = 16;

  for (let r = step; r < maxR; r += step) {
    rings.push(new IllusionRing(r));
  }
}

function draw() {
  background(8, 0, 18);

  translate(width / 2, height / 2);

  time += 0.6;
  shockwave *= 0.9;

  for (let ring of rings) {
    ring.update();
    ring.display();
  }
}

function mousePressed() {
  shockwave = 30;

  // Phase inversion = perceptual flip
  for (let i = 0; i < rings.length; i++) {
    if (i % 2 === 0) {
      rings[i].phase += 180;
    }
  }
}

class IllusionRing {
  constructor(radius) {
    this.radius = radius;
    this.phase = random(360);
    this.segmentCount = int(map(radius, 0, width/2, 32, 140));
  }

  update() {
    this.phase += 0.25;
  }

  display() {
    let angleStep = 360 / this.segmentCount;

    // mouse influence (field bending)
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let distMouse = sqrt(dx * dx + dy * dy);
    let distortion = map(distMouse, 0, width, 25, -25);

    for (let i = 0; i < this.segmentCount; i++) {
      let angle = i * angleStep;

      // 🌊 directional drift (illusion driver)
      let drift = map(sin(time + this.radius * 0.05), -1, 1, -3, 3);

      // ⚡ shockwave ripple
      let wave = sin(time * 3 + this.radius * 0.12 + i) * shockwave;

      // ✴️ micro angular jitter (breaks perfection)
      let jitter = sin(this.radius * 0.25 + i * 2 + time) * 2;

      let finalAngle = angle + this.phase + distortion + drift + wave + jitter;

      // 🎨 Fraser-Wilcox luminance driver
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

      // ⚡ enforced luminance hierarchy (CRITICAL)
      let choice = i % 4;

      if (choice === 0) stroke(255);          // brightest
      else if (choice === 1) stroke(cMidBright);
      else if (choice === 2) stroke(50);      // darkest
      else stroke(cMidDark);

      strokeWeight(3);

      // 🌙 curved segments instead of straight lines
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