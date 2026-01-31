let cols = 60;
let rows = 60;
let spacing = 12;

let heightMap = [];
let velocityMap = [];

let stiffness = 0.025;
let damping = 0.92;
let spread = 0.25;

// flow direction (current)
let flowX = 0.35;
let flowY = 0.0;

function setup() {
  createCanvas(700, 700, WEBGL);
  noStroke();

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
  background(5);

  orbitControl();
  rotateX(PI / 3);
  translate(-cols * spacing / 2, -rows * spacing / 2, 0);

  setupLights();

  updateSurface();
  advectSurface();   // ← flowing motion
  drawSurface();
}

function setupLights() {
  ambientLight(40, 60, 80);

  directionalLight(
    180, 220, 255,
    -0.5, 0.8, -1
  );

  directionalLight(
    120, 150, 200,
    0.5, -0.3, -0.5
  );

  specularMaterial(160, 200, 240);
  shininess(120);
}

function updateSurface() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let force = -heightMap[x][y] * stiffness;
      velocityMap[x][y] += force;
      velocityMap[x][y] *= damping;
    }
  }

  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let avg =
        (heightMap[x - 1][y] +
         heightMap[x + 1][y] +
         heightMap[x][y - 1] +
         heightMap[x][y + 1]) * 0.25;

      velocityMap[x][y] += (avg - heightMap[x][y]) * spread;
    }
  }

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      heightMap[x][y] += velocityMap[x][y];
    }
  }

  // interaction
  if (mouseIsPressed) {
    let mx = floor(map(mouseX, 0, width, 0, cols));
    let my = floor(map(mouseY, 0, height, 0, rows));

    if (mx > 1 && mx < cols - 2 && my > 1 && my < rows - 2) {
      heightMap[mx][my] -= 50;
    }
  }
}

function advectSurface() {
  let newHeight = [];
  let newVelocity = [];

  for (let x = 0; x < cols; x++) {
    newHeight[x] = [];
    newVelocity[x] = [];
    for (let y = 0; y < rows; y++) {
      newHeight[x][y] = heightMap[x][y];
      newVelocity[x][y] = velocityMap[x][y];
    }
  }

  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let px = x - flowX;
      let py = y - flowY;

      let ix = floor(px);
      let iy = floor(py);

      if (ix >= 0 && ix < cols - 1 && iy >= 0 && iy < rows - 1) {
        let fx = px - ix;
        let fy = py - iy;

        let h =
          lerp(
            lerp(heightMap[ix][iy], heightMap[ix + 1][iy], fx),
            lerp(heightMap[ix][iy + 1], heightMap[ix + 1][iy + 1], fx),
            fy
          );

        newHeight[x][y] = h;
        newVelocity[x][y] = velocityMap[ix][iy];
      }
    }
  }

  heightMap = newHeight;
  velocityMap = newVelocity;
}

function drawSurface() {
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      let z1 = heightMap[x][y];
      let z2 = heightMap[x][y + 1];

      let n1 = computeNormal(x, y);
      let n2 = computeNormal(x, y + 1);

      normal(n1.x, n1.y, n1.z);
      vertex(x * spacing, y * spacing, z1);

      normal(n2.x, n2.y, n2.z);
      vertex(x * spacing, (y + 1) * spacing, z2);
    }
    endShape();
  }
}

function computeNormal(x, y) {
  let left  = heightMap[max(x - 1, 0)][y];
  let right = heightMap[min(x + 1, cols - 1)][y];
  let up    = heightMap[x][max(y - 1, 0)];
  let down  = heightMap[x][min(y + 1, rows - 1)];

  let dx = left - right;
  let dy = up - down;
  let dz = 2;

  let n = createVector(dx, dy, dz);
  n.normalize();
  return n;
}
