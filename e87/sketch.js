let detailU = 220;
let detailV = 40;

let baseRadius = 220;
let stripWidth = 90;

let t = 0;

// Store multiple pulses
let pulses = [];
let pulseSpeed = 0.02;

function setup() {
  createCanvas(1024, 768, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(RADIANS);
}

function draw() {
  background(220, 20, 8);

  rotateY(t * 0.2);
  rotateX(sin(t * 0.15) * 0.2);

  ambientLight(0, 0, 30);
  directionalLight(200, 30, 100, 0.3, 0.5, -1);
  directionalLight(280, 20, 100, -0.5, -0.3, -1);

  let twistFactor = map(mouseX, 0, width, 0.6, 2.0);
  let cameraDrift = map(mouseY, 0, height, -0.4, 0.4);
  rotateZ(cameraDrift);

  updatePulses();

  // ---- Surface ----
  noStroke();

  for (let i = 0; i < detailU; i++) {
    let u1 = map(i, 0, detailU, 0, TWO_PI);
    let u2 = map(i + 1, 0, detailU, 0, TWO_PI);

    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j <= detailV; j++) {
      let v = map(j, 0, detailV, -stripWidth, stripWidth);

      let p1 = mobius(u1, v, twistFactor);
      let p2 = mobius(u2, v, twistFactor);

      let hue = (u1 * 40 + v * 0.4 + t * 30) % 360;
      fill(hue, 40, 95, 85);

      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
    }
    endShape();
  }

  // ---- Filaments ----
  strokeWeight(1.2);
  noFill();

  for (let k = 0; k < 35; k++) {
    let offset = map(k, 0, 35, -stripWidth * 0.8, stripWidth * 0.8);
    let baseHue = (k * 8 + t * 40) % 360;

    beginShape();
    for (let i = 0; i <= detailU; i++) {
      let u = map(i, 0, detailU, 0, TWO_PI);

      let pulse = combinedPulse(u);

      let wave = sin(u * 6 + t * 2 + k) * (8 + pulse * 35);
      let p = mobius(u, offset + wave, twistFactor);

      stroke((baseHue + pulse * 160) % 360, 60, 100, 60 + pulse * 50);
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }

  t += 0.01;
}

// ------------------------------
// Möbius function
// ------------------------------
function mobius(u, v, twistFactor) {
  let halfTwist = twistFactor * 0.5;

  let pulse = combinedPulse(u);

  let localRadius = baseRadius + pulse * 70;
  let localV = v * (1 + pulse * 0.9);

  let x = (localRadius + localV * cos(u * halfTwist)) * cos(u);
  let y = (localRadius + localV * cos(u * halfTwist)) * sin(u);
  let z = localV * sin(u * halfTwist);

  return createVector(x, y, z);
}

// ------------------------------
// Pulse system
// ------------------------------
function mousePressed() {
  pulses.push({
    position: 0,
    strength: 1.4
  });
}

function updatePulses() {
  for (let i = pulses.length - 1; i >= 0; i--) {
    pulses[i].position += pulseSpeed;
    if (pulses[i].position > TWO_PI) {
      pulses[i].position -= TWO_PI;
    }

    pulses[i].strength *= 0.992;

    if (pulses[i].strength < 0.01) {
      pulses.splice(i, 1);
    }
  }
}

function combinedPulse(u) {
  let total = 0;

  for (let p of pulses) {
    let d = circularDistance(u, p.position);
    let influence = exp(-d * 2.0) * p.strength;
    total += influence;
  }

  return total;
}

function circularDistance(a, b) {
  let d = abs(a - b);
  return min(d, TWO_PI - d);
}