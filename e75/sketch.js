let t = 0;

let hexSize = 30;
let cols = 12;
let rows = 12;

let grid = [];
let mouseForce = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  noiseDetail(3, 0.4);

  // initialize hex state
  for (let q = 0; q < cols; q++) {
    grid[q] = [];
    for (let r = 0; r < rows; r++) {
      grid[q][r] = {
        h: 20,
        v: 0
      };
    }
  }
}

function draw() {
  background(10);

  ambientLight(60);
  directionalLight(220, 220, 220, -0.4, -1, -0.3);

  rotateX(-PI / 3);
  rotateZ(t * 0.05);

  translate(-cols * hexSize * 0.75, 0, -rows * hexSize);

  // smooth mouse press force
  if (mouseIsPressed) {
    mouseForce = lerp(mouseForce, 1, 0.1);
  } else {
    mouseForce = lerp(mouseForce, 0, 0.1);
  }

  for (let q = 0; q < cols; q++) {
    for (let r = 0; r < rows; r++) {

      // hex grid positioning
      let x = hexSize * (q * 1.5);
      let z = hexSize * (sqrt(3) * (r + 0.5 * (q % 2)));

      // noise field
      let n = noise(q * 0.2, r * 0.2, t);
      let targetH = map(n, 0, 1, 20, 140);

      // physics parameters
      let g = 0.6;
      let k = 0.08;
      let damping = 0.85;

      let cell = grid[q][r];

      // mouse in grid space
      let mx = map(mouseX, 0, width, 0, cols);
      let my = map(mouseY, 0, height, 0, rows);

      // distance from mouse
      let d = dist(q, r, mx, my);

      // smooth influence falloff
      let influence = exp(-d * 0.6);

      // gravity with mouse well
      cell.v -= g * (1 + influence * 4 * mouseForce);

      // spring toward noise height
      cell.v += (targetH - cell.h) * k;

      // damping
      cell.v *= damping;

      // integrate
      cell.h += cell.v;

      // ground plane
      if (cell.h < 8) {
        cell.h = 8;
        cell.v *= -0.3;
      }

      // ---- VISUAL: bright click response ----
      let heat = influence * mouseForce;

      let rCol = 180 + n * 60;
      let gCol = 130 + n * 80;
      let bCol = 210;

      let boost = heat * 140;

      emissiveMaterial(
        heat * 160,
        heat * 160,
        heat * 190
      );

      fill(
        rCol + boost,
        gCol + boost,
        bCol + boost
      );

      // draw hex
      push();
      translate(x, -cell.h / 2, z);
      rotateY(map(n, 0, 1, -0.4, 0.4) + t * 0.2);
      hexPrism(hexSize * 0.9, cell.h);
      pop();
    }
  }

  t += 0.01;
}

// ----------------- geometry -----------------

function hexPrism(radius, height) {
  let top = [];
  let bottom = [];

  for (let i = 0; i < 6; i++) {
    let a = TWO_PI / 6 * i;
    let x = cos(a) * radius;
    let z = sin(a) * radius;
    top.push(createVector(x, -height / 2, z));
    bottom.push(createVector(x, height / 2, z));
  }

  beginShape(TRIANGLES);

  // sides
  for (let i = 0; i < 6; i++) {
    let j = (i + 1) % 6;

    vertex(top[i].x, top[i].y, top[i].z);
    vertex(bottom[i].x, bottom[i].y, bottom[i].z);
    vertex(bottom[j].x, bottom[j].y, bottom[j].z);

    vertex(top[i].x, top[i].y, top[i].z);
    vertex(bottom[j].x, bottom[j].y, bottom[j].z);
    vertex(top[j].x, top[j].y, top[j].z);
  }

  // top
  for (let i = 1; i < 5; i++) {
    vertex(top[0].x, top[0].y, top[0].z);
    vertex(top[i].x, top[i].y, top[i].z);
    vertex(top[i + 1].x, top[i + 1].y, top[i + 1].z);
  }

  // bottom
  for (let i = 1; i < 5; i++) {
    vertex(bottom[0].x, bottom[0].y, bottom[0].z);
    vertex(bottom[i + 1].x, bottom[i + 1].y, bottom[i + 1].z);
    vertex(bottom[i].x, bottom[i].y, bottom[i].z);
  }

  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
