let particles = [];
let density;

let a = 1.4;
let b = 0.3;
let targetA = 1.4;
let targetB = 0.3;

let shock = 0;
let scatter = 0;

const NUM_PARTICLES = 25000;
const ITER_PER_FRAME = 3;

const XMIN = -1.5;
const XMAX = 1.5;
const YMIN = -0.6;
const YMAX = 0.6;

let smoothedMaxD = 1;

function setup() {
  //createCanvas(1024, 768);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  density = new Float32Array(width * height);

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: random(-0.5, 0.5),
      y: random(-0.5, 0.5)
    });
  }

  background(0);
}

function draw() {
  fadeDensity();
  updateParameters();
  iterateHenon();
  renderDensity();
}

function updateParameters() {
  targetA = map(mouseX, 0, width, 1.1, 1.6);
  targetB = map(mouseY, 0, height, 0.15, 0.35);

  a += (targetA - a) * 0.05;
  b += (targetB - b) * 0.05;

  shock *= 0.92;
  scatter *= 0.95;
}

function iterateHenon() {
  for (let k = 0; k < ITER_PER_FRAME; k++) {
    for (let p of particles) {

      let nx = 1 - a * p.x * p.x + p.y;
      let ny = b * p.x;

      nx += random(-scatter, scatter);
      ny += random(-scatter, scatter);

      p.x = nx;
      p.y = ny;

      if (p.x < XMIN || p.x > XMAX || p.y < YMIN || p.y > YMAX) {
        p.x = random(-0.5, 0.5);
        p.y = random(-0.5, 0.5);
      }

      // --- SUBPIXEL JITTER (fixes rectangle artifact) ---
      let px = map(p.x, XMIN, XMAX, 0, width);
      let py = map(p.y, YMIN, YMAX, height, 0);

      px += random(-0.5, 0.5);
      py += random(-0.5, 0.5);

      let sx = floor(px);
      let sy = floor(py);

      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        let index = sx + sy * width;
        density[index] += 1 + shock * 5;
      }
    }
  }
}

function fadeDensity() {
  for (let i = 0; i < density.length; i++) {
    density[i] *= 0.975;
  }
}

function renderDensity() {
  loadPixels();

  // find max density
  let maxD = 0;
  for (let i = 0; i < density.length; i++) {
    if (density[i] > maxD) maxD = density[i];
  }

  // smooth exposure
  smoothedMaxD += (maxD - smoothedMaxD) * 0.1;
  smoothedMaxD = max(smoothedMaxD, 0.0001);

  let exposure = 1.8;
  let scale = 255 / sqrt(smoothedMaxD);

  // slow color breathing
  let t = millis() * 0.00005;

  let baseR = 0.5 + 0.5 * sin(t);
  let baseG = 0.5 + 0.5 * sin(t + TWO_PI / 3);
  let baseB = 0.5 + 0.5 * sin(t + 2 * TWO_PI / 3);

  // clear background explicitly
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i]     = 0;
    pixels[i + 1] = 0;
    pixels[i + 2] = 0;
    pixels[i + 3] = 255;
  }

  for (let i = 0; i < density.length; i++) {

    let d = sqrt(density[i]) * scale * exposure;

    if (d > 0.5) {
      pixels[i * 4 + 0] = constrain(d * baseR, 0, 255);
      pixels[i * 4 + 1] = constrain(d * baseG, 0, 255);
      pixels[i * 4 + 2] = constrain(d * baseB, 0, 255);
    }
  }

  updatePixels();
}

function mousePressed() {
  shock = 3;
  scatter = 0.05;

  for (let p of particles) {
    p.x += random(-0.5, 0.5);
    p.y += random(-0.5, 0.5);
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
}