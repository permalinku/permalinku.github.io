let particles = [];
let numParticles = 6000;

let a = 0.9;
let b = -0.6013;
let c = 2.0;
let d = 0.50;

let chaosEnergy = 0;
let drift = 0;

function setup() {
  createCanvas(1024, 768);
  background(0);

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(-1, 1),
      y: random(-1, 1),
      life: random(1000)
    });
  }
}

function draw() {

  // subtle fade instead of clearing
  noStroke();
  fill(0, 15);
  rect(0, 0, width, height);

  drift += 0.003;

  // slow parameter mutation
  let A = a + 0.2 * sin(drift * 0.8) + chaosEnergy;
  let B = b + 0.15 * cos(drift * 0.6);
  let C = c + 0.2 * sin(drift * 0.4);
  let D = d + 0.15 * cos(drift * 0.9);

  chaosEnergy *= 0.96;

  let mx = map(mouseX, 0, width, -1, 1);
  let my = map(mouseY, 0, height, -1, 1);

  for (let p of particles) {

    for (let k = 0; k < 2; k++) { // iterate twice for density

      let x = p.x;
      let y = p.y;

      // Tinkerbell equations
      let xn = x * x - y * y + A * x + B * y;
      let yn = 2 * x * y + C * x + D * y;

      // mouse gravity distortion
      let dx = x - mx;
      let dy = y - my;
      let dist = sqrt(dx * dx + dy * dy) + 0.001;

      xn += (dx / dist) * 0.003;
      yn += (dy / dist) * 0.003;

      p.x = xn;
      p.y = yn;

      // map to screen
      let sx = width/2 + xn * 160;
      let sy = height/2 + yn * 160;

      if (sx > 0 && sx < width && sy > 0 && sy < height) {

        let hue = map(p.life % 400, 0, 400, 150, 255);

        stroke(
          hue + 50*sin(drift*3 + xn*5),
          120 + 80*sin(yn*4),
          255,
          40
        );

        point(sx, sy);
      }
    }

    p.life++;

    // reset runaway particles
    if (abs(p.x) > 4 || abs(p.y) > 4) {
      p.x = random(-1, 1);
      p.y = random(-1, 1);
    }
  }
}

function mousePressed(){

  // chaos burst
  chaosEnergy += random(-0.4, 0.4);

  // inject new particles
  for (let i = 0; i < 400; i++) {
    particles.push({
      x: random(-1,1),
      y: random(-1,1),
      life:0
    });
  }

  // keep particle count stable
  if (particles.length > numParticles) {
    particles.splice(0, 400);
  }
}