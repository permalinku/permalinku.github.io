let cols, rows;
let scale = 6;

let current = [];
let previous = [];
let obstacles = [];

let damping = 0.995;
let levels = 5;

// noise scale controls shape complexity
let noiseScale = 0.08;

function setup() {
  createCanvas(800, 500);

  cols = floor(width / scale);
  rows = floor(height / scale);

  for (let i = 0; i < cols; i++) {
    current[i] = [];
    previous[i] = [];
    obstacles[i] = [];
    for (let j = 0; j < rows; j++) {
      current[i][j] = 0;
      previous[i][j] = 0;
      obstacles[i][j] = 0;
    }
  }

  generateOrganicObstacles();
}

function draw() {
  background(10, 20, 30);

  // --- Wave simulation ---
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {

      if (obstacles[i][j]) {
        current[i][j] = 0;
        continue;
      }

      current[i][j] = (
        previous[i-1][j] +
        previous[i+1][j] +
        previous[i][j-1] +
        previous[i][j+1]
      ) / 2 - current[i][j];

      current[i][j] *= damping;
    }
  }

  // --- Render (ink compression) ---
  noStroke();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      let x = i * scale;
      let y = j * scale;

      if (obstacles[i][j]) {
        fill(20, 20, 30);
      } else {
        let h = current[i][j];

        let t = map(h, -50, 50, 0, 1);
        t = constrain(t, 0, 1);

        let q = floor(t * levels) / (levels - 1);
        q = pow(q, 1.2);

        let r = 15 + 60 * q;
        let g = 50 + 120 * q;
        let b = 100 + 180 * q;

        fill(r, g, b);
      }

      rect(x, y, scale, scale);
    }
  }

  // swap buffers
  let temp = previous;
  previous = current;
  current = temp;
}

// --- Organic obstacle generation ---
function generateOrganicObstacles() {
  let offsetX = random(1000);
  let offsetY = random(1000);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      let n = noise(i * noiseScale + offsetX, j * noiseScale + offsetY);

      // threshold → creates blobs
      if (n > 0.55 && n < 0.7) {
        obstacles[i][j] = 1;
      } else {
        obstacles[i][j] = 0;
      }
    }
  }
}

// interaction
function mouseDragged() {
  let i = floor(mouseX / scale);
  let j = floor(mouseY / scale);

  if (i > 1 && i < cols - 1 && j > 1 && j < rows - 1) {
    previous[i][j] = 200;
  }
}
