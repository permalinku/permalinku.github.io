let seeds = [];
let t = 0;

function setup() {
  createCanvas(1024, 768);
  angleMode(RADIANS);
  noStroke();

  // initial seed
  seeds.push({
    x: width / 2,
    y: height / 2,
    rotOffset: random(TWO_PI),
    depth: 5,
    drift: 0.005
  });
}

function draw() {
  background(5, 5, 15, 40);

  translate(width / 2, height / 2);

  let rot = map(mouseX, 0, width, -PI, PI);
  let dynamicSym = int(map(mouseY, 0, height, 4, 12));

  t += 0.01;

  for (let s of seeds) {
    s.rotOffset += s.drift;

    let dx = s.x - width / 2;
    let dy = s.y - height / 2;

    // illusion field offset
    let offset = illusionOffset(dx, dy);

    for (let i = 0; i < dynamicSym; i++) {
      push();

      let phase = sin(t + i * 0.5 + s.rotOffset) * 0.2;

      rotate((TWO_PI / dynamicSym) * i + rot + phase + s.rotOffset);

      if (i % 2 === 0) scale(1, -1);

      translate(offset.x, offset.y);

      drawSierpinski(dx, dy, 220, s.depth);

      pop();
    }
  }
}

// 🔮 Illusion field (mouse-based distortion)
function illusionOffset(x, y) {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  let d = dist(mx, my, x, y);

  let force = map(d, 0, width, 6, 0);

  let angle = atan2(y - my, x - mx);

  let offsetX = cos(angle + t * 2) * force;
  let offsetY = sin(angle - t * 2) * force;

  return { x: offsetX, y: offsetY };
}

// 🔺 Recursive Sierpinski
function drawSierpinski(x, y, size, depth) {
  let pulse = sin(t + size * 0.01);

  let c1 = color(255, 140 + pulse * 80, 0, 120);   // orange
  let c2 = color(0, 150 + pulse * 100, 255, 120);  // blue

  fill(lerpColor(c1, c2, (depth % 2) * 0.5 + 0.5 * pulse));

  push();
  // micro internal rotation (illusion enhancer)
  rotate(sin(t + x * 0.01 + y * 0.01) * 0.05);

  if (depth === 0) {
    triangle(
      x, y - size / 2,
      x - size / 2, y + size / 2,
      x + size / 2, y + size / 2
    );
  } else {
    let newSize = size / 2;

    drawSierpinski(x, y - newSize / 2, newSize, depth - 1);
    drawSierpinski(x - newSize / 2, y + newSize / 2, newSize, depth - 1);
    drawSierpinski(x + newSize / 2, y + newSize / 2, newSize, depth - 1);
  }

  pop();
}

// 🖱️ Click = new fractal organism
function mousePressed() {
  seeds.push({
    x: mouseX,
    y: mouseY,
    rotOffset: random(TWO_PI),
    depth: int(random(4, 7)),
    drift: random(0.002, 0.01)
  });

  // limit population
  if (seeds.length > 6) {
    seeds.splice(0, 1);
  }
}