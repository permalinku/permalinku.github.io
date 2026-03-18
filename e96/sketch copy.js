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
  
  for (let i = 0; i < 5000; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // subtle fading trail
  noStroke();
  fill(120, 60, 5, 0.08);
  rect(0, 0, width, height);

  updateField();

  // update shockwaves
  for (let s of shockwaves) {
    s.update();
    s.display();
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

      // distance from center (peripheral emphasis)
      let dx = px - width / 2;
      let dy = py - height / 2;
      let d = sqrt(dx * dx + dy * dy);

      let edgeFactor = constrain(map(d, 0, width * 0.6, 0, 1), 0, 1);

      // base noise flow
      let angle = noise(xoff, yoff, t) * TWO_PI * 2;

      // peripheral drift distortion
      angle += edgeFactor * sin(d * 0.01 + t * 2);

      // mouse influence (field bending)
      let mdx = mouseX - px;
      let mdy = mouseY - py;
      let md = sqrt(mdx * mdx + mdy * mdy);
      if (md < 200) {
        angle += map(md, 0, 200, PI, 0) * 0.5;
      }

      // shockwave influence
      for (let s of shockwaves) {
        let sd = dist(px, py, s.x, s.y);
        if (abs(sd - s.r) < 50) {
          angle += sin(sd * 0.1 - s.r * 0.2) * 1.5;
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
    // greener toward edges
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    let edgeFactor = constrain(map(d, 0, width * 0.6, 0, 1), 0, 1);

    let hue = 120 + edgeFactor * 20;
    let sat = 60 + edgeFactor * 40;
    let light = 20 + edgeFactor * 40;

    stroke(hue, sat, light, 0.4);
    strokeWeight(1);
    point(this.pos.x, this.pos.y);
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
    this.life -= 2;
  }

  display() {
    noFill();
    stroke(140, 80, 60, this.life / 255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r * 2);
  }
}