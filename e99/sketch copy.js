let seeds = [];
let maxDepth = 5;
let symmetry = 8;
let t = 0;

function setup() {
  createCanvas(1024, 768);
  angleMode(RADIANS);
  noStroke();
  
  // initial seed in center
  seeds.push({ x: width / 2, y: height / 2 });
}

function draw() {
  background(10, 10, 20, 40);
  
  translate(width / 2, height / 2);

  let rot = map(mouseX, 0, width, -PI, PI);
  let dynamicSym = int(map(mouseY, 0, height, 4, 12));
  
  t += 0.01;

  for (let s of seeds) {
    let dx = s.x - width / 2;
    let dy = s.y - height / 2;

    for (let i = 0; i < dynamicSym; i++) {
      push();
      rotate((TWO_PI / dynamicSym) * i + rot);
      
      // mirror for kaleidoscope effect
      if (i % 2 === 0) scale(1, -1);
      
      drawSierpinski(dx, dy, 220, maxDepth);
      pop();
    }
  }
}

// Recursive triangle
function drawSierpinski(x, y, size, depth) {
  let pulse = sin(t + size * 0.01);

  let c1 = color(255, 140 + pulse * 80, 0, 120); // orange
  let c2 = color(0, 150 + pulse * 100, 255, 120); // blue
  
  fill(lerpColor(c1, c2, (depth % 2) * 0.5 + 0.5 * pulse));

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
}

// Add new seed EXACTLY where you click
function mousePressed() {
  seeds.push({ x: mouseX, y: mouseY });

  // limit seeds for performance
  if (seeds.length > 6) {
    seeds.splice(0, 1);
  }
}