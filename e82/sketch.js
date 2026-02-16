let radius = 12;           // bigger hex cluster
let tileSize = 18;

let hexes = [];

// Jelly tuning (slow + soft)
let stiffness = 0.05;
let damping = 0.88;
let neighborInfluence = 0.12;
let impulseStrength = 10;

let rotationAngle = 0;
let rotationSpeed = 0.002;

// --- HEX TILE CLASS ---
class Hex {
  constructor(q, r) {
    this.q = q;   // axial coordinates
    this.r = r;
    this.height = 0;
    this.velocity = 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Generate hexagon-shaped grid
  for (let q = -radius; q <= radius; q++) {
    let r1 = max(-radius, -q - radius);
    let r2 = min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      hexes.push(new Hex(q, r));
    }
  }
}

function draw() {
  background(15);
  rotationAngle += rotationSpeed;

  let centerX = width / 2;
  let centerY = height / 2;

  // --- Mouse impulse (corrected for rotation) ---
  if (mouseIsPressed) {

    let mx = mouseX - centerX;
    let my = mouseY - centerY;

    let cosA = cos(-rotationAngle);
    let sinA = sin(-rotationAngle);

    let rotatedMX = mx * cosA - my * sinA;
    let rotatedMY = mx * sinA + my * cosA;

    for (let h of hexes) {

      let pos = hexToPixel(h.q, h.r);
      let d = dist(rotatedMX, rotatedMY, pos.x, pos.y);

      if (d < tileSize * 2) {
        let influence = 1 - d / (tileSize * 2);
        h.velocity -= impulseStrength * influence;
      }
    }
  }

  // --- Physics update ---
  for (let h of hexes) {

    let force = -h.height * stiffness;

    let neighbors = getNeighbors(h.q, h.r);

    let sum = 0;
    let count = 0;

    for (let n of neighbors) {
      let neighborHex = findHex(n.q, n.r);
      if (neighborHex) {
        sum += neighborHex.height;
        count++;
      }
    }

    if (count > 0) {
      let average = sum / count;
      force += (average - h.height) * neighborInfluence;
    }

    h.velocity += force;
    h.velocity *= damping;
    h.height += h.velocity;
  }

  // --- Draw ---
  push();
  translate(centerX, centerY);
  rotate(rotationAngle);
  noStroke();

  for (let h of hexes) {
    let pos = hexToPixel(h.q, h.r);
    drawHex(pos.x, pos.y, tileSize, h.height);
  }

  pop();
}

// --- Convert axial hex to pixel ---
function hexToPixel(q, r) {
  let x = tileSize * sqrt(3) * (q + r/2);
  let y = tileSize * 3/2 * r;
  return createVector(x, y);
}

// --- Get axial neighbors ---
function getNeighbors(q, r) {
  return [
    {q: q+1, r: r},
    {q: q-1, r: r},
    {q: q, r: r+1},
    {q: q, r: r-1},
    {q: q+1, r: r-1},
    {q: q-1, r: r+1}
  ];
}

// --- Find hex in array ---
function findHex(q, r) {
  for (let h of hexes) {
    if (h.q === q && h.r === r) return h;
  }
  return null;
}

// --- Draw hex tile ---
function drawHex(x, y, size, h) {

  let topY = y - h;

  // Bottom/base face (depth)
  fill(30, 60, 90);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = PI / 6 + TWO_PI / 6 * i;
    let vx = x + size * cos(angle);
    let vy = y + size * sin(angle);
    vertex(vx, vy);
  }
  endShape(CLOSE);

  // Top face (light blue jelly)
  let blueShift = map(h, -30, 30, 200, 255);
  let greenShift = map(h, -30, 30, 170, 210);

  fill(140, greenShift, blueShift);

  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = PI / 6 + TWO_PI / 6 * i;
    let vx = x + size * cos(angle);
    let vy = topY + size * sin(angle);
    vertex(vx, vy);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
