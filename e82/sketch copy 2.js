let cols = 32;
let rows = 32;
let tileSize = 20;

let heightMap = [];
let velocityMap = [];

let stiffness = 0.08;      // spring to rest
let damping = 0.92;        // energy loss
let neighborInfluence = 0.15; // how much neighbors pull each other
let impulseStrength = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let x = 0; x < cols; x++) {
    heightMap[x] = [];
    velocityMap[x] = [];
    for (let y = 0; y < rows; y++) {
      heightMap[x][y] = 0;
      velocityMap[x][y] = 0;
    }
  }
}

function draw() {
  background(15);

  let offsetX = width/2 - (cols * tileSize)/2;
  let offsetY = height/2 - (rows * tileSize)/2;

  // --- Mouse impulse ---
  if (mouseIsPressed) {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {

        let px = offsetX + x * tileSize + tileSize/2;
        let py = offsetY + y * tileSize + tileSize/2;

        let d = dist(mouseX, mouseY, px, py);

        if (d < tileSize * 3) {
          let influence = 1 - d / (tileSize * 3);
          velocityMap[x][y] -= impulseStrength * influence;
        }
      }
    }
  }

  // --- Physics update ---
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {

      let force = -heightMap[x][y] * stiffness;

      // Neighbor coupling
      let sum = 0;
      let count = 0;

      let neighbors = [
        [1,0], [-1,0], [0,1], [0,-1]
      ];

      for (let n of neighbors) {
        let nx = x + n[0];
        let ny = y + n[1];

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          sum += heightMap[nx][ny];
          count++;
        }
      }

      let average = sum / max(count,1);
      force += (average - heightMap[x][y]) * neighborInfluence;

      velocityMap[x][y] += force;
      velocityMap[x][y] *= damping;

      heightMap[x][y] += velocityMap[x][y];
    }
  }

  // --- Draw ---
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {

      let px = offsetX + x * tileSize;
      let py = offsetY + y * tileSize;

      drawTile(px, py, tileSize, heightMap[x][y]);
    }
  }
}

function drawTile(x, y, size, h) {

  let topY = y - h;

  // Side face
  fill(40);
  quad(
    x, y,
    x + size, y,
    x + size, topY,
    x, topY
  );

  // Top face
  let shade = map(h, -30, 30, 120, 255);
  fill(shade, 160, 255);
  rect(x, topY, size, size);
}
