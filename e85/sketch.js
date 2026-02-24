let system1 = {
  x: 0.01,
  y: 0,
  z: 0,
  a: 10,
  b: 28,
  c: 8.0 / 3.0,
  points: []
};

let system2 = {
  x: 0.02,
  y: 0.01,
  z: 0,
  a: 10.2,      // slightly different
  b: 28.5,
  c: 8.0 / 3.0 + 0.05,
  points: []
};

let dt = 0.005;
let maxPoints = 4000;

function setup() {
  createCanvas(1024, 768, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0);
  orbitControl();

  rotateY(frameCount * 0.002);
  rotateX(frameCount * 0.001);

  integrate(system1);
  integrate(system2);

  scale(6);

  ambientLight(40);
  directionalLight(255, 255, 255, 0.3, 0.5, -1);

  noStroke();

  drawRibbon(system1.points, 180, 300); // cool hues
  drawRibbon(system2.points, 0, 120);   // warm hues
}

function integrate(sys) {
  let dx = sys.a * (sys.y - sys.x) * dt;
  let dy = (sys.x * (sys.b - sys.z) - sys.y) * dt;
  let dz = (sys.x * sys.y - sys.c * sys.z) * dt;

  sys.x += dx;
  sys.y += dy;
  sys.z += dz;

  sys.points.push(createVector(sys.x, sys.y, sys.z));

  if (sys.points.length > maxPoints) {
    sys.points.shift();
  }
}

function drawRibbon(points, hueStart, hueEnd) {
  if (points.length < 2) return;

  for (let i = 1; i < points.length; i++) {
    let p0 = points[i - 1];
    let p1 = points[i];

    let dir = p5.Vector.sub(p1, p0);
    let normal = createVector(-dir.y, dir.x, 0);
    normal.normalize();
    normal.mult(0.3);

    let hue = map(i, 0, points.length, hueStart, hueEnd);

    fill(hue % 360, 80, 100, 80);

    beginShape(TRIANGLE_STRIP);
    vertex(p0.x + normal.x, p0.y + normal.y, p0.z);
    vertex(p0.x - normal.x, p0.y - normal.y, p0.z);
    vertex(p1.x + normal.x, p1.y + normal.y, p1.z);
    vertex(p1.x - normal.x, p1.y - normal.y, p1.z);
    endShape();
  }
}