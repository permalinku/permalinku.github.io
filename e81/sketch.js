// --- configuration ---
let field;
let nextField;
let cols, rows;
let scaleFactor = 4;
let diffusion = 0.22;
let decay = 0.995;

let currentMode = 0;
let totalModes = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  cols = floor(width / scaleFactor);
  rows = floor(height / scaleFactor);

  field = new Float32Array(cols * rows);
  nextField = new Float32Array(cols * rows);

  noStroke();
}

function draw() {
  background(5, 5, 15);

  diffuseField();
  field = nextField.slice();

  renderField();
}

// --- gaussian diffusion ---
function diffuseField() {
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {

      let i = x + y * cols;

      let sum =
        field[i] * 4 +
        field[i - 1] * 2 +
        field[i + 1] * 2 +
        field[i - cols] * 2 +
        field[i + cols] * 2 +
        field[i - cols - 1] +
        field[i - cols + 1] +
        field[i + cols - 1] +
        field[i + cols + 1];

      nextField[i] = (sum / 16.0) * diffusion + field[i] * (1 - diffusion);
      nextField[i] *= decay;
    }
  }
}

// --- render field ---
function renderField() {
  loadPixels();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      let i = x + y * cols;
      let v = field[i];

      let px = x * scaleFactor;
      let py = y * scaleFactor;

      let r, g, b;

      // Mode 0 — original palette
      if (currentMode === 0) {
        r = 80 + v * 255;
        g = 30 + v * 180;
        b = 150 + sin(v * 3.14) * 100;
      }

      // Mode 1 — nebula violet
      else if (currentMode === 1) {
        r = 120 + v * 200;
        g = 20 + v * 80;
        b = 200 + v * 150;
      }

      // Mode 2 — toxic green
      else if (currentMode === 2) {
        r = 20 + v * 100;
        g = 150 + v * 255;
        b = 40 + v * 80;
      }

      // Mode 3 — lava
      else if (currentMode === 3) {
        r = 180 + v * 255;
        g = 60 + v * 120;
        b = 10 + v * 40;
      }

      // Mode 4 — ice
      else if (currentMode === 4) {
        r = 100 + v * 80;
        g = 200 + v * 200;
        b = 255;
      }

      // Mode 5 — silver monochrome
      else if (currentMode === 5) {
        let c = 100 + v * 200;
        r = g = b = c;
      }

      // Mode 6 — deep ocean
      else if (currentMode === 6) {
        r = 10 + v * 60;
        g = 40 + v * 140;
        b = 150 + v * 255;
      }

      // Mode 7 — alien coral
      else if (currentMode === 7) {
        r = 255;
        g = 80 + v * 180;
        b = 120 + sin(v * 6.28) * 120;
      }

      for (let dy = 0; dy < scaleFactor; dy++) {
        for (let dx = 0; dx < scaleFactor; dx++) {
          let index = 4 * ((px + dx) + (py + dy) * width);
          pixels[index] = r;
          pixels[index + 1] = g;
          pixels[index + 2] = b;
          pixels[index + 3] = 255;
        }
      }
    }
  }

  updatePixels();
}

// --- large gaussian brush ---
function mouseDragged() {

  let x = floor(mouseX / scaleFactor);
  let y = floor(mouseY / scaleFactor);

  let radius = 14;
  let strength = 1.0;

  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {

      let nx = x + i;
      let ny = y + j;

      if (nx > 0 && nx < cols && ny > 0 && ny < rows) {

        let index = nx + ny * cols;

        let d = sqrt(i * i + j * j);
        let influence = exp(-d * d * 0.04);

        field[index] += influence * strength;
      }
    }
  }
}

// --- keyboard changes color mode ---
function keyPressed() {
  currentMode = (currentMode + 1) % totalModes;
}

// --- resize ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  cols = floor(width / scaleFactor);
  rows = floor(height / scaleFactor);

  field = new Float32Array(cols * rows);
  nextField = new Float32Array(cols * rows);
}
