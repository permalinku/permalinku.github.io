let N = 90;
let scale;
let dens, velX, velY;

let baseRadius = 1;
let clickRadius = 4;

function setup() {
  createCanvas(720, 400);
  scale = width / N;

  dens = new Array(N * N).fill(0);
  velX = new Array(N * N).fill(0);
  velY = new Array(N * N).fill(0);

  noStroke();
}

function draw() {
  background(8, 20);

  let mx = floor(mouseX / scale);
  let my = floor(mouseY / scale);

  let r = mouseIsPressed ? clickRadius : baseRadius;

  // --- smoke injection ---
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      let ix = mx + x;
      let iy = my + y;

      if (ix > 1 && ix < N - 2 && iy > 1 && iy < N - 2) {
        let i = ix + iy * N;

        let falloff = 1 - (abs(x) + abs(y)) / (r * 2);
        let p = 8 * falloff;

        dens[i] += p;
        velY[i] -= p * 0.15;
        velX[i] += random(-0.2, 0.2) * p * 0.05;
      }
    }
  }

  advectVelocity();
  advectDensity();
  diffuseDensity();

  renderDensity();
}

// ---------------- simulation ----------------

function advectVelocity() {
  for (let y = 1; y < N - 1; y++) {
    for (let x = 1; x < N - 1; x++) {
      let i = x + y * N;

      velX[i] *= 0.995;
      velY[i] *= 0.995;

      let a =
        noise(x * 0.05, y * 0.05, frameCount * 0.01) *
        TWO_PI *
        2;

      velX[i] += cos(a) * 0.02;
      velY[i] += sin(a) * 0.02;
    }
  }
}

function advectDensity() {
  let next = new Array(N * N).fill(0);

  for (let y = 1; y < N - 1; y++) {
    for (let x = 1; x < N - 1; x++) {
      let i = x + y * N;

      let px = x - velX[i];
      let py = y - velY[i];

      let ix = floor(constrain(px, 0, N - 1));
      let iy = floor(constrain(py, 0, N - 1));

      next[i] = dens[ix + iy * N] * 0.998;
    }
  }

  dens = next;
}

function diffuseDensity() {
  for (let k = 0; k < 1; k++) {
    for (let y = 1; y < N - 1; y++) {
      for (let x = 1; x < N - 1; x++) {
        let i = x + y * N;
        dens[i] =
          (dens[i] +
            dens[i - 1] +
            dens[i + 1] +
            dens[i - N] +
            dens[i + N]) /
          5;
      }
    }
  }
}

// ---------------- rendering ----------------

function renderDensity() {
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let d = dens[x + y * N];
      if (d > 0.01) {
        let a = constrain(d * 28, 0, 200);

        let r = constrain(180 + d * 40, 180, 255);
        let g = constrain(30 + d * 10, 20, 80);
        let b = 20;

        fill(r, g, b, a);
        rect(x * scale, y * scale, scale, scale);
      }
    }
  }
}
