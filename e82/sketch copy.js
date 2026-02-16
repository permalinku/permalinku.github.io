let cols = 32;
let rows = 32;
let tileSize = 20;

let heights = [];
let maxLift = 60;
let influenceRadius = 3;

let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let x = 0; x < cols; x++) {
    heights[x] = [];
    for (let y = 0; y < rows; y++) {
      heights[x][y] = 0;
    }
  }
}

function draw() {
  background(15);

  time += 0.03;

  let offsetX = width/2 - (cols * tileSize)/2;
  let offsetY = height/2 - (rows * tileSize)/2;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {

      let px = offsetX + x * tileSize;
      let py = offsetY + y * tileSize;

      // --- Continuous ripple ---
      let wave =
        sin(x * 0.5 + time) +
        cos(y * 0.5 + time * 1.2);

      wave *= 5; // subtle amplitude

      // --- Mouse influence ---
      let d = dist(mouseX, mouseY, px + tileSize/2, py + tileSize/2);

      let mouseLift = 0;
      if (mouseIsPressed && d < tileSize * influenceRadius) {
        let tileDist = d / tileSize;
        let influence = pow(max(0, 1 - tileDist / influenceRadius), 2);
        mouseLift = maxLift * influence;
      }

      let target = mouseLift + wave;

      heights[x][y] = lerp(heights[x][y], target, 0.15);

      drawTile(px, py, tileSize, heights[x][y]);
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
  let shade = map(h, -10, maxLift, 100, 255);
  fill(shade, 160, 255);
  rect(x, topY, size, size);
}
