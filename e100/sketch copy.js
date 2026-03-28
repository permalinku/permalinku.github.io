// 🌿 Fractal Tide Engine + Atmospheric Background

let seeds = [];
let t = 0;
let particles = [];

function setup() {
  createCanvas(1024, 768);
  colorMode(HSB, 360, 100, 100, 100);

  // background particles
  for (let i = 0; i < 80; i++) {
    particles.push(new AtmosParticle());
  }
}

function draw() {
  drawAtmosphere();

  translate(width / 2, height / 2);

  t += 0.01;

  for (let s of seeds) {
    s.update();
    s.display();
  }
}

function mousePressed() {
  seeds.push(new FractalSeed(
    mouseX - width / 2,
    mouseY - height / 2
  ));
}

//////////////////////////////////////////////////
// 🌊 ATMOSPHERIC BACKGROUND
//////////////////////////////////////////////////

function drawAtmosphere() {

  // deep gradient base
  for (let y = 0; y < height; y += 2) {
    let n = noise(y * 0.002, t * 0.1);
    let hue = map(n, 0, 1, 190, 210);
    let bright = map(y, 0, height, 8, 3);

    stroke(hue, 40, bright);
    line(0, y, width, y);
  }

  // slow fog layer
  noStroke();
  for (let i = 0; i < 6; i++) {
    let x = noise(i, t * 0.05) * width;
    let y = noise(i + 50, t * 0.05) * height;
    let size = noise(i + 100, t * 0.1) * 500 + 300;

    fill(170, 30, 20, 4);
    ellipse(x, y, size);
  }

  // drifting particles
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class AtmosParticle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.speed = random(0.1, 0.4);
    this.offset = random(1000);
    this.size = random(1, 3);
  }

  update() {
    this.pos.x += sin(t + this.offset) * this.speed;
    this.pos.y -= this.speed * 0.3;

    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    noStroke();
    fill(180, 40, 60, 20);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

//////////////////////////////////////////////////
// 🌿 FRACTAL SYSTEM
//////////////////////////////////////////////////

class FractalSeed {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.depth = int(random(6, 9));
    this.phase = random(1000);
    this.size = random(60, 120);
  }

  update() {
    this.phase += 0.02;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    this.branch(this.size, this.depth);
    pop();
  }

  branch(len, depth) {
    if (depth <= 0 || len < 2) return;

    let wave = sin(t + this.phase + depth * 0.4);

    let hue = map(wave, -1, 1, 160, 210);
    let brightness = map(depth, 0, 10, 40, 100);

    stroke(hue, 80, brightness, 80);
    strokeWeight(map(depth, 0, 10, 0.5, 3));

    line(0, 0, 0, -len);
    translate(0, -len);

    let angleOffset =
      map(noise(depth * 0.2, t * 0.3), 0, 1, -PI / 6, PI / 6);

    push();
    rotate(PI / 5 + angleOffset + wave * 0.2);
    this.branch(len * 0.72, depth - 1);
    pop();

    push();
    rotate(-PI / 5 - angleOffset - wave * 0.2);
    this.branch(len * 0.72, depth - 1);
    pop();

    if (depth % 2 === 0) {
      push();
      rotate(wave * 0.5);
      this.branch(len * 0.6, depth - 2);
      pop();
    }
  }
}