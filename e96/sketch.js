let particles = [];
let field = [];
let cols, rows;
let scale = 20;

let t = 0;
let shockwaves = [];

function setup() {
  createCanvas(1024, 768);
  colorMode(HSL, 360, 100, 100, 1);
  
  cols = floor(width / scale);
  rows = floor(height / scale);
  
  for (let i = 0; i < 6000; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // deeper fade for smoother trails
  noStroke();
  fill(120, 60, 4, 0.06);
  rect(0, 0, width, height);

  updateField();

  // shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].update();
    shockwaves[i].display();
    if (shockwaves[i].life <= 0) {
      shockwaves.splice(i, 1);
    }
  }

  // particles
  for (let p of particles) {
    p.follow(field);
    p.update();
    p.edges();
    p.display();
  }

  t += 0.003;
}

function updateField() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {

      let px = x * scale;
      let py = y * scale;

      let dx = px - width / 2;
      let dy = py - height / 2;
      let d = sqrt(dx * dx + dy * dy);

      let edgeFactor = constrain(map(d, 0, width * 0.6, 0, 1), 0, 1);

      // base flow
      let angle = noise(xoff, yoff, t) * TWO_PI * 2;

      // peripheral distortion
      angle += edgeFactor * sin(d * 0.01 + t * 2);

      // mouse lensing
      let md = dist(px, py, mouseX, mouseY);
      if (md < 200) {
        angle += map(md, 0, 200, PI, 0) * 0.5;
      }

      // shockwave + inversion
      for (let s of shockwaves) {
        let sd = dist(px, py, s.x, s.y);

        if (abs(sd - s.r) < 50) {
          angle += sin(sd * 0.1 - s.r * 0.2) * 1.5;
        }

        // inversion core (new)
        if (sd < s.r * 0.5) {
          angle += PI; // flip direction
        }
      }

      let v = p5.Vector.fromAngle(angle);
      field[x + y * cols] = v;

      xoff += 0.1;
    }
    yoff += 0.1;
  }
}

function mousePressed() {
  shockwaves.push(new Shockwave(mouseX, mouseY));
}

// ---------------- PARTICLE ----------------

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1, 2);
  }

  follow(field) {
    let x = floor(this.pos.x / scale);
    let y = floor(this.pos.y / scale);
    let index = x + y * cols;
    let force = field[index];
    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    // central suppression (stronger void)
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    if (d < 150) {
      this.vel.mult(0.92);
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    let edgeFactor = constrain(map(d, 0, width * 0.6, 0, 1), 0, 1);

    // nonlinear glow (stronger edges)
    let hue = 120 + edgeFactor * 20;
    let sat = 60 + edgeFactor * 40;
    let light = 10 + pow(edgeFactor, 2) * 70;

    // micro jitter only at edges
    let jitterX = 0;
    let jitterY = 0;
    if (edgeFactor > 0.6) {
      jitterX = random(-0.3, 0.3);
      jitterY = random(-0.3, 0.3);
    }

    stroke(hue, sat, light, 0.4);
    strokeWeight(1);
    point(this.pos.x + jitterX, this.pos.y + jitterY);
  }
}

// ---------------- SHOCKWAVE ----------------

class Shockwave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.speed = 4;
    this.life = 255;
  }

  update() {
    this.r += this.speed;
    this.life -= 3;
  }

  display() {
    noFill();
    stroke(140, 80, 60, this.life / 255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r * 2);
  }
}