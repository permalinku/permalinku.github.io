let rings = [];
let time = 0;
let shockwave = 0;

function setup() {
  createCanvas(1024, 768);
  angleMode(DEGREES);
  
  let maxR = min(width, height) * 0.45;
  let step = 18;

  for (let r = step; r < maxR; r += step) {
    rings.push(new IllusionRing(r));
  }
}

function draw() {
  background(10, 0, 20); // deep violet-black
  
  translate(width / 2, height / 2);

  time += 0.5;
  shockwave *= 0.92;

  for (let ring of rings) {
    ring.update();
    ring.display();
  }
}

function mousePressed() {
  shockwave = 20; // inject chaos
}

class IllusionRing {
  constructor(radius) {
    this.radius = radius;
    this.phase = random(360);
    this.segmentCount = int(map(radius, 0, width/2, 24, 120));
  }

  update() {
    // slow drifting phase
    this.phase += 0.2;
  }

  display() {
    let angleStep = 360 / this.segmentCount;

    for (let i = 0; i < this.segmentCount; i++) {
      let angle = i * angleStep;

      // --- mouse distortion ---
      let dx = mouseX - width/2;
      let dy = mouseY - height/2;
      let distMouse = sqrt(dx*dx + dy*dy);
      let distortion = map(distMouse, 0, width, 20, -20);

      // --- shockwave distortion ---
      let wave = sin(time * 3 + this.radius * 0.1) * shockwave;

      let finalAngle = angle + this.phase + distortion + wave;

      let x1 = cos(finalAngle) * this.radius;
      let y1 = sin(finalAngle) * this.radius;

      let x2 = cos(finalAngle) * (this.radius + 12);
      let y2 = sin(finalAngle) * (this.radius + 12);

      // --- Fraser-Wilcox luminance trick ---
      let t = sin(angle * 3 + this.phase + time);

      // violet-magenta palette
      let c1 = color(
        150 + 80 * t,
        20 + 40 * sin(time * 0.5),
        200 + 55 * cos(angle + time)
      );

      let c2 = color(
        255,
        120 + 80 * t,
        220
      );

      let c3 = color(
        40,
        0,
        80 + 50 * t
      );

      // alternating asymmetric segments (key illusion trick)
      let choice = i % 4;

      if (choice === 0) stroke(c1);
      else if (choice === 1) stroke(c2);
      else if (choice === 2) stroke(255);
      else stroke(c3);

      strokeWeight(3);

      line(x1, y1, x2, y2);
    }
  }
}