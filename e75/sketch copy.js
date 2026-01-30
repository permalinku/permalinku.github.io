let t = 0;
let hexSize = 30;
let cols = 12;
let rows = 12;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  noiseDetail(3, 0.4);
}

function draw() {
  background(10);
  ambientLight(60);
  directionalLight(200, 200, 200, -0.4, -1, -0.3);

  rotateX(-PI / 3);
  rotateZ(t * 0.05);

  translate(-cols * hexSize * 0.75, 0, -rows * hexSize);

  for (let q = 0; q < cols; q++) {
    for (let r = 0; r < rows; r++) {
      let x = hexSize * (q * 1.5);
      let z = hexSize * (sqrt(3) * (r + 0.5 * (q % 2)));

      let n = noise(q * 0.2, r * 0.2, t);
      let h = map(n, 0, 1, 10, 140);
      let twist = map(n, 0, 1, -0.4, 0.4);

      push();
      translate(x, -h / 2, z);
      rotateY(twist + t * 0.2);
      fill(180 + n * 60, 120 + n * 80, 200);
      noStroke();
      hexPrism(hexSize * 0.9, h);
      pop();
    }
  }

  t += 0.01;
}

// -------- geometry --------

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

  // top face
  for (let i = 1; i < 5; i++) {
    vertex(top[0].x, top[0].y, top[0].z);
    vertex(top[i].x, top[i].y, top[i].z);
    vertex(top[i + 1].x, top[i + 1].y, top[i + 1].z);
  }

  // bottom face
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
