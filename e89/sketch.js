let points = [];
let maxPoints = 7000;

let x, y, z;
let dt;

let rotX = 0;
let rotY = 0;

function setup() {
  createCanvas(1024, 768, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  resetSystem();
  noFill();
}

function resetSystem() {
  x = random(-1, 1);
  y = random(-1, 1);
  z = random(-1, 1);
  dt = 0.008;
  points = [];
}

function draw() {
  background(0, 0, 0, 20);

  // Subtle breathing of time step
  dt = 0.006 + sin(frameCount * 0.01) * 0.002;

  // Autonomous drift
  rotateY(frameCount * 0.0005);

  // Mouse-controlled camera tilt
  rotY += (mouseX - width/2) * 0.000002;
  rotX += (mouseY - height/2) * 0.000002;

  rotateX(rotX);
  rotateY(rotY);

  scale(6);

  // Energy injection from mouse distance
  let energy = map(
    dist(mouseX, mouseY, width/2, height/2),
    0, width/2,
    1.6, 0.3
  );

  // Hybrid chaotic system
  let a = 10 * energy;
  let b = 28;
  let c = 8/3;

  let dx = a * (y - x) + sin(z * 0.5);
  let dy = x * (b - z) - y;
  let dz = x * y - c * z + cos(x * 0.3);

  x += dx * dt;
  y += dy * dt;
  z += dz * dt;

  let speed = sqrt(dx*dx + dy*dy + dz*dz);

  points.push({
    pos: createVector(x, y, z),
    speed: speed
  });

  if (points.length > maxPoints) {
    points.shift();
  }

  drawRibbon();
  drawGhostStructure();
}

function drawRibbon() {
  for (let i = 2; i < points.length - 2; i++) {

    let p = points[i].pos;
    let prev = points[i - 1].pos;
    let next = points[i + 1].pos;

    let dir = p5.Vector.sub(next, prev).normalize();

    // curvature-based normal
    let normal = createVector(-dir.y, dir.x, dir.z * 0.2).normalize();

    let thickness = points[i].speed * 0.02;

    let v1 = p5.Vector.add(p, p5.Vector.mult(normal, thickness));
    let v2 = p5.Vector.sub(p, p5.Vector.mult(normal, thickness));

    let hue = (frameCount * 0.6 + i * 0.3) % 360;
    let alpha = map(i, 0, points.length, 10, 90);

    stroke(hue, 80, 100, alpha);
    line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
  }
}

function drawGhostStructure() {
  stroke(200, 30, 100, 8);
  strokeWeight(2);

  for (let i = 0; i < points.length; i += 50) {
    let p = points[i].pos;
    point(p.x, p.y, p.z);
  }

  strokeWeight(1);
}

// Shear distortion in phase space
function mouseDragged() {
  let shear = (mouseX - width/2) * 0.00005;
  x += shear * y;
  y -= shear * x;
}

// Energy shock instead of reset
function mousePressed() {
  x *= random(1.5, 2.5);
  y *= random(1.5, 2.5);
  z *= random(1.5, 2.5);
}

function keyPressed() {
  if (key === 's' || key === 'S') {

    // Draw one solid black frame
    push();
    resetMatrix();
    background(0, 0, 0);   // solid black, no alpha
    pop();

    // Redraw ribbon once without transparency background
    drawRibbon();
    drawGhostStructure();

    saveCanvas('phase_space_artifact', 'png');
  }
}