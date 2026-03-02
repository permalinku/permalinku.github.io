let t = 0;

let layers = [];
let gridDensity = 45;
let baseRotation = 0;

let shockwaves = [];

function setup() {
  createCanvas(1024, 768);
  pixelDensity(1);
  smooth();
  
  for (let i = 0; i < 3; i++) {
    layers.push({
      angleOffset: random(TWO_PI),
      scale: 1 + i * 0.1,
      alpha: 40 + i * 30
    });
  }
}

function draw() {
  background(5);
  translate(width / 2, height / 2);

  let mouseForce = dist(mouseX, mouseY, width/2, height/2) / 500;
  let vortexStrength = map(mouseX, 0, width, -2.0, 2.0);
  let wavePhase = t * 0.03;

  baseRotation += map(mouseY, 0, height, -0.0004, 0.0004);

  // Update shockwaves
  for (let s of shockwaves) {
    s.radius += 12;
    s.strength *= 0.96;
  }

  shockwaves = shockwaves.filter(s => s.strength > 0.02);

  for (let l of layers) {
    push();
    rotate(baseRotation + l.angleOffset);
    scale(l.scale);

    stroke(255, l.alpha);
    strokeWeight(1);
    noFill();

    drawFastGrid(
      gridDensity,
      vortexStrength,
      mouseForce,
      wavePhase
    );

    pop();
  }

  t++;
}

function drawFastGrid(density, vortex, force, phase) {
  let spacingX = width / density;

  for (let x = -width; x <= width; x += spacingX) {
    beginShape();
    for (let y = -height; y <= height; y += 14) {

      let dx = x;
      let dy = y;

      let d2 = dx*dx + dy*dy;
      let radius = sqrt(d2);
      let angle = atan2(dy, dx);

      // Base vortex distortion
      angle += vortex * force / (1 + d2 * 0.000002);

      let vx = cos(angle) * radius;
      let vy = sin(angle) * radius;

      // Shockwave influence
      let shockInfluence = 0;

      for (let s of shockwaves) {
        let dxs = vx - s.x;
        let dys = vy - s.y;
        let distToWave = sqrt(dxs*dxs + dys*dys);

        let edge = abs(distToWave - s.radius);
        if (edge < 40) {
          shockInfluence += (1 - edge/40) * s.strength * 2.0;
        }
      }

      angle += shockInfluence;

      vx = cos(angle) * radius;
      vy = sin(angle) * radius;

      // Wave field
      vx += sin(vx * 0.02 + phase) * 15;
      vy += cos(vy * 0.02 + phase * 1.2) * 15;

      vertex(vx, vy);
    }
    endShape();
  }
}

function mousePressed() {
  shockwaves.push({
    x: mouseX - width/2,
    y: mouseY - height/2,
    radius: 0,
    strength: 1
  });
}