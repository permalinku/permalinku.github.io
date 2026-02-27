let cols = 80;
let rows = 60;
let cellW, cellH;
let time = 0;

let singularities = [];

let prevMouseX, prevMouseY;
let mouseVelocity = 0;

function setup() {
  createCanvas(1024, 768);
  cellW = width / cols;
  cellH = height / rows;
  rectMode(CENTER);
  noStroke();
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function draw() {
  background(10);
  translate(width / 2, height / 2);

  // --- Mouse dynamics ---
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  let dx = mouseX - prevMouseX;
  let dy = mouseY - prevMouseY;
  mouseVelocity = sqrt(dx * dx + dy * dy);
  prevMouseX = mouseX;
  prevMouseY = mouseY;

  // Smaller live vortex
  let liveVortexRadius = 100;
  let liveVortexStrength = 2.5 + mouseVelocity * 0.05;

  for (let y = -rows / 2; y < rows / 2; y++) {
    for (let x = -cols / 2; x < cols / 2; x++) {

      let px = x * cellW;
      let py = y * cellH;

      let r = sqrt(px * px + py * py);
      let a = atan2(py, px);

      // --- Base illusion field ---
      let angularWarp = sin(a * 6 + r * 0.01 + time) * 0.8;
      let radialWave = sin(r * 0.05 - time * 2);
      let drift = sin(a * 8 + radialWave * 2);

      let totalVortex = 0;

      // --- LIVE MOUSE VORTEX ---
      let distToMouse = dist(px, py, mx, my);

      if (distToMouse < liveVortexRadius) {
        let falloff = exp(-pow(distToMouse / liveVortexRadius, 2));
        let angleToMouse = atan2(py - my, px - mx);

        totalVortex += falloff * liveVortexStrength *
                       sin(angleToMouse * 4 + time * 2);

        // Tighter inversion core
        if (distToMouse < liveVortexRadius * 0.2) {
          drift *= -1;
        }
      }

      // --- PERMANENT SINGULARITIES ---
      for (let s of singularities) {

        let d = dist(px, py, s.x, s.y);

        if (d < s.radius) {

          let fall = exp(-pow(d / s.radius, 2));
          let ang = atan2(py - s.y, px - s.x);

          totalVortex += fall * s.strength *
                         sin(ang * 4 + time * s.spin);

          // Tighter inversion core
          if (d < s.radius * 0.2) {
            drift *= -1;
          }
        }
      }

      let phase = drift + angularWarp + totalVortex;

      let brightness = map(sin(phase * 3), -1, 1, 20, 255);

      // Asymmetric luminance for drift illusion
      let asym = (sin(a + time * 0.5) > 0) ? 1.2 : 0.8;
      brightness *= asym;

      fill(brightness);

      push();
      translate(px, py);
      rotate(a + totalVortex * 0.2);
      rect(0, 0, cellW * 0.9, cellH * 0.9);
      pop();
    }
  }

  time += 0.02;
}

function mousePressed() {
  singularities.push({
    x: mouseX - width / 2,
    y: mouseY - height / 2,
    radius: random(75, 130),   // Half-size range
    strength: random(2, 4),
    spin: random(1.5, 3.5)
  });
}